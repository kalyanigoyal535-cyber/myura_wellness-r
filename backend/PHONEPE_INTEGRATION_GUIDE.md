# 💳 PhonePe Payment Gateway Integration Guide

## Overview
This guide provides optimized and clean steps to integrate PhonePe payment gateway into the Myura Wellness e-commerce platform.

---

## 📋 Prerequisites

### 1. PhonePe Merchant Account Setup
- [ ] Create a PhonePe merchant account at https://merchant.phonepe.com
- [ ] Complete business verification (KYC)
- [ ] Get your **Merchant Credentials**:
  - **Merchant ID** (e.g., `MERCHANTUAT` for testing, `YOUR_MERCHANT_ID` for production)
  - **Salt Key** (Secret key for signature generation)
  - **Salt Index** (Usually `1` for most merchants)
- [ ] Note: Use **Sandbox/Test Mode** credentials for development, **Production** credentials for live

### 2. Environment Variables
Add these to your `.env` files:

**Backend (.env or settings.py):**
```env
PHONEPE_MERCHANT_ID=YOUR_MERCHANT_ID
PHONEPE_SALT_KEY=your_salt_key_here
PHONEPE_SALT_INDEX=1
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox  # For testing
# PHONEPE_API_URL=https://api.phonepe.com/apis/pg-sandbox  # For production
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/callback  # Frontend callback URL
PHONEPE_CALLBACK_URL=http://127.0.0.1:8000/api/payments/phonepe/callback  # Backend callback URL
```

**Frontend (.env):**
```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
REACT_APP_PHONEPE_REDIRECT_URL=http://localhost:3000/payment/callback
```

---

## 🔧 Implementation Steps

### Step 1: Install Required Packages

**Backend:**
```bash
cd backend
pip install cryptography requests
```

**Frontend:**
No additional packages needed (uses standard fetch/axios)

---

### Step 2: Backend Implementation

#### 2.1 Create PhonePe Payment Service (`backend/api/phonepe_payment.py`)

```python
import base64
import json
import hashlib
import hmac
from django.conf import settings
from decimal import Decimal

class PhonePePayment:
    """
    PhonePe Payment Gateway Integration
    """
    
    def __init__(self):
        self.merchant_id = settings.PHONEPE_MERCHANT_ID
        self.salt_key = settings.PHONEPE_SALT_KEY
        self.salt_index = settings.PHONEPE_SALT_INDEX
        self.api_url = settings.PHONEPE_API_URL
        self.redirect_url = settings.PHONEPE_REDIRECT_URL
        self.callback_url = settings.PHONEPE_CALLBACK_URL
    
    def generate_x_verify_header(self, payload_string):
        """
        Generate X-VERIFY header for PhonePe API
        """
        sha256_hash = hashlib.sha256(payload_string.encode()).hexdigest()
        string_to_hash = f"{sha256_hash}/pg/v1/pay{self.salt_key}"
        sha256_hash_final = hashlib.sha256(string_to_hash.encode()).hexdigest()
        return f"{sha256_hash_final}###{self.salt_index}"
    
    def verify_callback_signature(self, payload, x_verify_header):
        """
        Verify PhonePe callback signature
        """
        try:
            sha256_hash = hashlib.sha256(payload.encode()).hexdigest()
            string_to_hash = f"{sha256_hash}/pg/v1/status/{self.merchant_id}{self.salt_key}"
            sha256_hash_final = hashlib.sha256(string_to_hash.encode()).hexdigest()
            expected_header = f"{sha256_hash_final}###{self.salt_index}"
            return expected_header == x_verify_header
        except Exception:
            return False
    
    def create_payment_request(self, transaction_id, amount, user_id, order_id):
        """
        Create PhonePe payment request
        
        Args:
            transaction_id: Unique transaction ID
            amount: Amount in paise (e.g., 10000 for ₹100.00)
            user_id: User ID
            order_id: Order ID
        
        Returns:
            dict: Payment request response with redirect URL
        """
        # Convert amount to paise if in rupees
        if isinstance(amount, Decimal):
            amount = int(amount * 100)
        elif isinstance(amount, float):
            amount = int(amount * 100)
        else:
            amount = int(amount)
        
        # Prepare payload
        payload = {
            "merchantId": self.merchant_id,
            "merchantTransactionId": transaction_id,
            "merchantUserId": str(user_id),
            "amount": amount,
            "redirectUrl": self.redirect_url,
            "redirectMode": "REDIRECT",
            "callbackUrl": self.callback_url,
            "mobileNumber": "",  # Optional
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }
        
        # Encode payload
        payload_string = json.dumps(payload)
        base64_payload = base64.b64encode(payload_string.encode()).decode()
        
        # Generate X-VERIFY header
        x_verify = self.generate_x_verify_header(base64_payload)
        
        # Make API request
        import requests
        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": x_verify,
            "Accept": "application/json"
        }
        
        data = {
            "request": base64_payload
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/pay",
                json=data,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            result = response.json()
            
            if result.get("success") and result.get("data"):
                payment_url = result["data"]["instrumentResponse"]["redirectInfo"]["url"]
                return {
                    "success": True,
                    "payment_url": payment_url,
                    "transaction_id": transaction_id
                }
            else:
                return {
                    "success": False,
                    "error": result.get("message", "Payment request failed")
                }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"API request failed: {str(e)}"
            }
    
    def check_payment_status(self, transaction_id):
        """
        Check payment status using PhonePe status API
        """
        import requests
        
        # Prepare status check payload
        path = f"/pg/v1/status/{self.merchant_id}/{transaction_id}"
        sha256_hash = hashlib.sha256(path.encode()).hexdigest()
        string_to_hash = f"{sha256_hash}{self.salt_key}"
        sha256_hash_final = hashlib.sha256(string_to_hash.encode()).hexdigest()
        x_verify = f"{sha256_hash_final}###{self.salt_index}"
        
        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": x_verify,
            "X-MERCHANT-ID": self.merchant_id,
            "Accept": "application/json"
        }
        
        try:
            response = requests.get(
                f"{self.api_url}/status/{self.merchant_id}/{transaction_id}",
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Status check failed: {str(e)}"
            }

# Initialize PhonePe client
phonepe_client = PhonePePayment()
```

#### 2.2 Create Payment Endpoints (`backend/api/views.py`)

Add these imports at the top:
```python
import uuid
from .phonepe_payment import phonepe_client
```

Add these views to `backend/api/views.py`:

```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_phonepe_payment(request):
    """
    Create PhonePe payment request
    POST /api/payments/phonepe/create/
    Body: {
        "amount": 10000,  // Amount in paise
        "order_id": 123   // Your order ID
    }
    """
    try:
        amount = request.data.get('amount')
        order_id = request.data.get('order_id')
        
        if not amount or amount <= 0:
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not order_id:
            return Response(
                {'error': 'Order ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify order belongs to user
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Generate unique transaction ID
        transaction_id = f"TXN{order.order_number}{uuid.uuid4().hex[:8].upper()}"
        
        # Create payment request
        payment_response = phonepe_client.create_payment_request(
            transaction_id=transaction_id,
            amount=amount,
            user_id=request.user.id,
            order_id=order_id
        )
        
        if payment_response.get("success"):
            # Store transaction ID in order (temporarily)
            order.payment_id = transaction_id
            order.save()
            
            return Response({
                'payment_url': payment_response['payment_url'],
                'transaction_id': transaction_id,
                'order_id': order_id
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': payment_response.get('error', 'Payment request failed')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])  # PhonePe will call this
def phonepe_callback(request):
    """
    Handle PhonePe payment callback
    POST /api/payments/phonepe/callback/
    """
    try:
        # Get X-VERIFY header
        x_verify = request.headers.get('X-VERIFY', '')
        
        # Get payload
        payload = request.body.decode('utf-8')
        
        # Verify signature
        if not phonepe_client.verify_callback_signature(payload, x_verify):
            return Response(
                {'error': 'Invalid signature'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse callback data
        callback_data = json.loads(payload)
        
        # Extract transaction details
        code = callback_data.get('code')
        message = callback_data.get('message')
        transaction_id = callback_data.get('data', {}).get('merchantTransactionId', '')
        phonepe_transaction_id = callback_data.get('data', {}).get('transactionId', '')
        payment_state = callback_data.get('data', {}).get('state', '')
        
        # Find order by transaction ID (stored in payment_id)
        try:
            order = Order.objects.get(payment_id=transaction_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Update order based on payment status
        if payment_state == 'COMPLETED' and code == 'PAYMENT_SUCCESS':
            order.payment_status = 'paid'
            order.payment_id = phonepe_transaction_id  # Store PhonePe transaction ID
            order.status = 'processing'
            order.save()
            
            return Response({
                'success': True,
                'message': 'Payment successful',
                'order_id': order.id
            }, status=status.HTTP_200_OK)
        else:
            order.payment_status = 'failed'
            order.save()
            
            return Response({
                'success': False,
                'message': message or 'Payment failed',
                'order_id': order.id
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_phonepe_payment(request):
    """
    Verify payment status from frontend
    POST /api/payments/phonepe/verify/
    Body: {
        "transaction_id": "TXN123456",
        "order_id": 123
    }
    """
    try:
        transaction_id = request.data.get('transaction_id')
        order_id = request.data.get('order_id')
        
        if not transaction_id or not order_id:
            return Response(
                {'error': 'Transaction ID and Order ID are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify order belongs to user
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check payment status
        status_response = phonepe_client.check_payment_status(transaction_id)
        
        if status_response.get('success') and status_response.get('data'):
            payment_data = status_response['data']
            payment_state = payment_data.get('state', '')
            
            if payment_state == 'COMPLETED':
                order.payment_status = 'paid'
                order.status = 'processing'
                if payment_data.get('transactionId'):
                    order.payment_id = payment_data['transactionId']
                order.save()
                
                return Response({
                    'success': True,
                    'payment_status': 'paid',
                    'order': OrderSerializer(order).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'payment_status': 'pending',
                    'message': 'Payment is still processing'
                }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Failed to verify payment status'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

#### 2.3 Add URL Routes (`backend/api/urls.py`)

Add these imports:
```python
from .views import (
    # ... existing imports ...
    create_phonepe_payment,
    phonepe_callback,
    verify_phonepe_payment,
)
```

Add these URL patterns:
```python
urlpatterns = [
    # ... existing patterns ...
    
    # PhonePe Payment endpoints
    path('payments/phonepe/create/', create_phonepe_payment, name='create_phonepe_payment'),
    path('payments/phonepe/callback/', phonepe_callback, name='phonepe_callback'),
    path('payments/phonepe/verify/', verify_phonepe_payment, name='verify_phonepe_payment'),
]
```

#### 2.4 Update Settings (`backend/myura_backend/settings.py`)

Add PhonePe settings:
```python
# PhonePe Payment Gateway Settings
PHONEPE_MERCHANT_ID = os.getenv('PHONEPE_MERCHANT_ID', '')
PHONEPE_SALT_KEY = os.getenv('PHONEPE_SALT_KEY', '')
PHONEPE_SALT_INDEX = os.getenv('PHONEPE_SALT_INDEX', '1')
PHONEPE_API_URL = os.getenv('PHONEPE_API_URL', 'https://api-preprod.phonepe.com/apis/pg-sandbox')
PHONEPE_REDIRECT_URL = os.getenv('PHONEPE_REDIRECT_URL', 'http://localhost:3000/payment/callback')
PHONEPE_CALLBACK_URL = os.getenv('PHONEPE_CALLBACK_URL', 'http://127.0.0.1:8000/api/payments/phonepe/callback')
```

---

### Step 3: Frontend Implementation

#### 3.1 Create Payment Service (`src/services/payment.ts`)

Add PhonePe methods to your existing payment service or create new file:

```typescript
import apiClient, { getErrorMessage } from './api';

export interface CreatePhonePePaymentRequest {
  amount: number; // Amount in paise
  order_id: number;
}

export interface CreatePhonePePaymentResponse {
  payment_url: string;
  transaction_id: string;
  order_id: number;
}

export interface VerifyPhonePePaymentRequest {
  transaction_id: string;
  order_id: number;
}

export const phonepeApi = {
  // Create PhonePe payment request
  createPayment: async (data: CreatePhonePePaymentRequest): Promise<CreatePhonePePaymentResponse> => {
    try {
      const response = await apiClient.post<CreatePhonePePaymentResponse>(
        '/payments/phonepe/create/',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Verify payment status
  verifyPayment: async (data: VerifyPhonePePaymentRequest): Promise<{ success: boolean; payment_status: string; order?: any }> => {
    try {
      const response = await apiClient.post<{ success: boolean; payment_status: string; order?: any }>(
        '/payments/phonepe/verify/',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
```

#### 3.2 Create Payment Callback Page (`src/pages/PaymentCallback.tsx`)

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { phonepeApi } from '../services/payment';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying payment...');
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get('transactionId');
        const orderIdParam = searchParams.get('orderId');
        const code = searchParams.get('code');

        if (!transactionId || !orderIdParam) {
          setStatus('failed');
          setMessage('Missing payment information');
          return;
        }

        const orderIdNum = parseInt(orderIdParam, 10);
        setOrderId(orderIdNum);

        // Verify payment status
        const result = await phonepeApi.verifyPayment({
          transaction_id: transactionId,
          order_id: orderIdNum,
        });

        if (result.success && result.payment_status === 'paid') {
          setStatus('success');
          setMessage('Payment successful! Redirecting to order details...');
          
          // Redirect to order details after 2 seconds
          setTimeout(() => {
            navigate(`/order-details/${orderIdNum}`, {
              state: { orderId: orderIdNum, success: true },
            });
          }, 2000);
        } else {
          setStatus('failed');
          setMessage('Payment verification failed or payment is still pending');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage(error instanceof Error ? error.message : 'Payment verification failed');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-blue-500 mb-4 animate-spin" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Verifying Payment</h1>
            <p className="text-slate-500">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-500 mb-6">{message}</p>
            {orderId && (
              <button
                onClick={() => navigate(`/order-details/${orderId}`)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                View Order Details
              </button>
            )}
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Payment Failed</h1>
            <p className="text-slate-500 mb-6">{message}</p>
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              Back to Cart
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default PaymentCallback;
```

#### 3.3 Update Checkout Page (`src/pages/Checkout.tsx`)

Update the `handlePlaceOrder` function to integrate PhonePe:

```typescript
import { phonepeApi } from '../services/payment';

// In handlePlaceOrder function, replace the payment processing section:
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
      payment_method: 'phonepe',
      payment_status: 'pending' as 'pending' | 'paid' | 'failed',
      payment_id: '',
    };

    // Create order in database
    const order = await ordersApi.createOrder(orderData);

    // Convert amount to paise (multiply by 100)
    const amountInPaise = Math.round(total * 100);

    // Create PhonePe payment request
    const paymentResponse = await phonepeApi.createPayment({
      amount: amountInPaise,
      order_id: order.id,
    });

    // Redirect to PhonePe payment page
    window.location.href = `${paymentResponse.payment_url}&orderId=${order.id}`;

  } catch (error) {
    console.error('Failed to create order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
    setOrderError(errorMessage);
    setPlacingOrder(false);
  }
};
```

#### 3.4 Add Route for Payment Callback (`src/router/routes.tsx`)

Add the payment callback route:
```typescript
import PaymentCallback from '../pages/PaymentCallback';

// In your routes array:
{
  path: '/payment/callback',
  element: <PaymentCallback />,
}
```

#### 3.5 Update Payment Method Mapping

In `Checkout.tsx`, update the payment method mapping:
```typescript
const paymentMethodMap: Record<string, string> = {
  cod: 'cod',
  card: 'phonepe',  // Changed from 'razorpay'
  upi: 'phonepe',   // Changed from 'razorpay'
};
```

---

## 📝 Configuration Checklist

- [ ] PhonePe merchant account created and verified
- [ ] API credentials obtained (Merchant ID, Salt Key, Salt Index)
- [ ] Environment variables set in backend
- [ ] Backend payment service created (`phonepe_payment.py`)
- [ ] Backend payment endpoints created
- [ ] Frontend payment service created
- [ ] Payment callback page created
- [ ] Checkout page updated with PhonePe flow
- [ ] Routes configured for payment callback
- [ ] Test payment flow in sandbox mode
- [ ] Switch to production credentials for live

---

## 🧪 Testing

### Test Mode (Sandbox)
1. Use PhonePe sandbox credentials
2. Test payment flow:
   - Create order
   - Redirect to PhonePe payment page
   - Use test payment methods
   - Verify callback handling
   - Check order status update

### Test Flow
1. Add items to cart
2. Go to checkout
3. Select Card/UPI payment
4. Fill address details
5. Click "Place Order"
6. Should redirect to PhonePe payment page
7. Complete test payment
8. Should redirect back to callback page
9. Payment should be verified
10. Order should be updated with payment status

---

## 🔒 Security Notes

1. **Never expose Salt Key** in frontend code
2. **Always verify callback signature** on backend
3. **Use HTTPS** in production
4. **Validate amounts** on backend before creating payment request
5. **Store transaction IDs** in database for reference
6. **Handle webhooks** for payment status updates (optional but recommended)
7. **Verify order ownership** before processing payments

---

## 📚 Additional Resources

- PhonePe Developer Documentation: https://developer.phonepe.com/
- PhonePe Merchant Dashboard: https://merchant.phonepe.com/
- PhonePe API Reference: https://developer.phonepe.com/v1/reference

---

## 🚀 Next Steps

1. Set up PhonePe merchant account
2. Get API credentials
3. Install required packages
4. Implement backend payment service
5. Create payment endpoints
6. Update frontend checkout flow
7. Test in sandbox mode
8. Deploy to production with live credentials

---

**Status:** Ready for implementation  
**Estimated Time:** 4-6 hours for complete integration

---

## 🔄 Key Differences from Razorpay

1. **Redirect-based flow**: PhonePe uses redirect instead of popup
2. **Signature verification**: Different signature generation method
3. **Callback handling**: Requires dedicated callback endpoint
4. **Status checking**: Separate status API for verification
5. **Transaction ID**: Uses merchant transaction ID pattern

---

## ⚠️ Important Notes

- PhonePe requires proper callback URL configuration
- Ensure redirect URLs are whitelisted in PhonePe dashboard
- Test thoroughly in sandbox before going live
- Monitor callback logs for debugging
- Handle payment failures gracefully







