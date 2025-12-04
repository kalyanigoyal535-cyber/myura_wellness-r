# 💳 Razorpay Payment Gateway Integration Guide

## Overview
This guide explains what's needed to integrate Razorpay payment gateway into the Myura Wellness e-commerce platform.

---

## 📋 Prerequisites

### 1. Razorpay Account Setup
- [ ] Create a Razorpay account at https://razorpay.com
- [ ] Complete business verification (KYC)
- [ ] Get your **API Keys**:
  - **Key ID** (Public Key)
  - **Key Secret** (Private Key)
- [ ] Note: Use **Test Mode** keys for development, **Live Mode** keys for production

### 2. Environment Variables
Add these to your `.env` files:

**Frontend (.env):**
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
```

**Backend (.env or settings.py):**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

---

## 🔧 Implementation Steps

### Step 1: Install Razorpay SDK

**Frontend:**
```bash
npm install razorpay
```

**Backend:**
```bash
pip install razorpay
```

---

### Step 2: Backend Implementation

#### 2.1 Create Payment Service (`backend/api/payment.py`)

```python
import razorpay
from django.conf import settings

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

def create_razorpay_order(amount, currency='INR', receipt=None):
    """
    Create a Razorpay order
    amount: Amount in paise (e.g., 10000 for ₹100.00)
    """
    data = {
        'amount': amount,  # Amount in paise
        'currency': currency,
        'receipt': receipt or f'receipt_{uuid.uuid4().hex[:8]}',
        'payment_capture': 1  # Auto capture payment
    }
    
    order = razorpay_client.order.create(data=data)
    return order

def verify_payment_signature(order_id, payment_id, signature):
    """
    Verify payment signature to ensure payment is legitimate
    """
    try:
        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        razorpay_client.utility.verify_payment_signature(params_dict)
        return True
    except razorpay.errors.SignatureVerificationError:
        return False
```

#### 2.2 Create Payment Endpoints (`backend/api/views.py`)

Add these views:

```python
from .payment import create_razorpay_order, verify_payment_signature
from decimal import Decimal

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    """
    Create Razorpay order before payment
    POST /api/payments/create/
    Body: {
        "amount": 10000,  // Amount in paise
        "order_id": 123  // Your order ID
    }
    """
    try:
        amount = int(request.data.get('amount', 0))
        order_id = request.data.get('order_id')
        
        if amount <= 0:
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create Razorpay order
        razorpay_order = create_razorpay_order(
            amount=amount,
            receipt=f'order_{order_id}'
        )
        
        return Response({
            'razorpay_order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency'],
            'key': settings.RAZORPAY_KEY_ID
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verify payment after Razorpay callback
    POST /api/payments/verify/
    Body: {
        "razorpay_order_id": "order_xxx",
        "razorpay_payment_id": "pay_xxx",
        "razorpay_signature": "signature_xxx",
        "order_id": 123  // Your order ID
    }
    """
    try:
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        order_id = request.data.get('order_id')
        
        # Verify payment signature
        is_valid = verify_payment_signature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )
        
        if not is_valid:
            return Response(
                {'error': 'Invalid payment signature'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update order payment status
        try:
            order = Order.objects.get(id=order_id, user=request.user)
            order.payment_status = 'paid'
            order.payment_id = razorpay_payment_id
            order.save()
            
            return Response({
                'message': 'Payment verified successfully',
                'order': OrderSerializer(order).data
            }, status=status.HTTP_200_OK)
            
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

#### 2.3 Add URL Routes (`backend/api/urls.py`)

```python
path('payments/create/', create_payment_order, name='create_payment'),
path('payments/verify/', verify_payment, name='verify_payment'),
```

---

### Step 3: Frontend Implementation

#### 3.1 Create Payment Service (`src/services/payment.ts`)

```typescript
import apiClient, { getErrorMessage } from './api';

export interface CreatePaymentOrderRequest {
  amount: number; // Amount in paise
  order_id: number;
}

export interface CreatePaymentOrderResponse {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: number;
}

export const paymentApi = {
  // Create Razorpay order
  createPaymentOrder: async (data: CreatePaymentOrderRequest): Promise<CreatePaymentOrderResponse> => {
    try {
      const response = await apiClient.post<CreatePaymentOrderResponse>('/payments/create/', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Verify payment
  verifyPayment: async (data: VerifyPaymentRequest): Promise<{ message: string; order: any }> => {
    try {
      const response = await apiClient.post<{ message: string; order: any }>('/payments/verify/', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
```

#### 3.2 Update Checkout Page (`src/pages/Checkout.tsx`)

Add Razorpay integration to the `handlePlaceOrder` function:

```typescript
import Razorpay from 'razorpay';

// In handlePlaceOrder function, before creating order:
const handlePlaceOrder = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!isFormValid || placingOrder) return;

  if (!isAuthenticated) {
    setOrderError('Please log in to place an order.');
    navigate('/my-account', { state: { redirectTo: '/checkout' } });
    return;
  }

  if (items.length === 0) {
    setOrderError('Your cart is empty. Please add items before checkout.');
    return;
  }

  setPlacingOrder(true);
  setOrderError(null);

  try {
    await syncCart();

    const shippingAddress = {
      full_name: form.name.trim(),
      phone_number: `+91${form.phone.trim()}`,
      address_line_1: form.address.trim(),
      address_line_2: '',
      city: form.city.trim(),
      state: form.state.trim(),
      postal_code: form.postalCode.trim(),
      country: 'India',
    };

    // For COD, create order directly
    if (form.paymentMethod === 'cod') {
      const orderData = {
        shipping_address: shippingAddress,
        payment_method: 'cod',
        payment_status: 'pending' as 'pending' | 'paid' | 'failed',
        payment_id: '',
      };

      const order = await ordersApi.createOrder(orderData);
      await clear();
      navigate(`/order-details/${order.id}`, { 
        state: { orderId: order.id, orderNumber: order.order_number, success: true } 
      });
      return;
    }

    // For Card/UPI, create order first, then process payment
    const orderData = {
      shipping_address: shippingAddress,
      payment_method: 'razorpay',
      payment_status: 'pending' as 'pending' | 'paid' | 'failed',
      payment_id: '',
    };

    // Create order in database
    const order = await ordersApi.createOrder(orderData);

    // Convert amount to paise (multiply by 100)
    const amountInPaise = Math.round(total * 100);

    // Create Razorpay order
    const paymentOrder = await paymentApi.createPaymentOrder({
      amount: amountInPaise,
      order_id: order.id,
    });

    // Initialize Razorpay checkout
    const options = {
      key: paymentOrder.key,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: 'Myura Wellness',
      description: `Order ${order.order_number}`,
      order_id: paymentOrder.razorpay_order_id,
      handler: async (response: any) => {
        try {
          // Verify payment
          await paymentApi.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id: order.id,
          });

          // Payment successful
          await clear();
          navigate(`/order-details/${order.id}`, { 
            state: { orderId: order.id, orderNumber: order.order_number, success: true } 
          });
        } catch (error) {
          console.error('Payment verification failed:', error);
          setOrderError('Payment verification failed. Please contact support.');
          setPlacingOrder(false);
        }
      },
      prefill: {
        name: form.name,
        email: form.email || user?.email || '',
        contact: form.phone,
      },
      theme: {
        color: '#1C2638',
      },
      modal: {
        ondismiss: () => {
          setPlacingOrder(false);
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Failed to create order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
    setOrderError(errorMessage);
    setPlacingOrder(false);
  }
};
```

#### 3.3 Add Razorpay Script to HTML (`public/index.html`)

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## 📝 Configuration Checklist

- [ ] Razorpay account created and verified
- [ ] API keys obtained (Test and Live)
- [ ] Environment variables set in frontend and backend
- [ ] Razorpay SDK installed (frontend and backend)
- [ ] Backend payment endpoints created
- [ ] Frontend payment service created
- [ ] Checkout page updated with payment flow
- [ ] Razorpay script added to HTML
- [ ] Test payment flow in test mode
- [ ] Switch to live keys for production

---

## 🧪 Testing

### Test Mode
1. Use Razorpay test keys
2. Use test card numbers:
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`
   - CVV: Any 3 digits
   - Expiry: Any future date

### Test Flow
1. Add items to cart
2. Go to checkout
3. Select Card/UPI payment
4. Fill address details
5. Click "Place Order"
6. Razorpay popup should open
7. Use test card details
8. Payment should be verified
9. Order should be updated with payment status

---

## 🔒 Security Notes

1. **Never expose Key Secret** in frontend code
2. **Always verify payment signature** on backend
3. **Use HTTPS** in production
4. **Validate amounts** on backend before creating Razorpay order
5. **Store payment_id** in database for reference
6. **Handle webhooks** for payment status updates (optional but recommended)

---

## 📚 Additional Resources

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Dashboard: https://dashboard.razorpay.com/
- Test Cards: https://razorpay.com/docs/payments/test-cards/
- Webhooks Guide: https://razorpay.com/docs/webhooks/

---

## 🚀 Next Steps

1. Set up Razorpay account
2. Get API keys
3. Install SDKs
4. Implement backend endpoints
5. Update frontend checkout
6. Test in test mode
7. Deploy to production with live keys

---

**Status:** Ready for implementation
**Estimated Time:** 4-6 hours for complete integration









