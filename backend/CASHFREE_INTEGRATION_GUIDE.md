# 💳 Cashfree Payment Gateway Integration Guide

## Overview
This guide explains how to integrate Cashfree payment gateway into the Myura Wellness e-commerce platform alongside PhonePe.

---

## 📋 Prerequisites

### 1. Cashfree Account Setup
- [ ] Create a Cashfree account at https://www.cashfree.com
- [ ] Complete business verification (KYC)
- [ ] Get your **API Credentials**:
  - **App ID** (Client ID)
  - **Secret Key** (Client Secret)
- [ ] Note: Use **Sandbox** credentials for development, **Production** credentials for live

### 2. Environment Variables
Add these to your backend `.env` file:

```env
# Cashfree Payment Gateway Settings
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
CASHFREE_API_URL=https://sandbox.cashfree.com/pg
CASHFREE_REDIRECT_URL=http://localhost:3000/payment/callback
CASHFREE_CALLBACK_URL=http://127.0.0.1:8000/api/payments/cashfree/callback
```

**For Production:**
```env
CASHFREE_API_URL=https://api.cashfree.com/pg
CASHFREE_REDIRECT_URL=https://yourdomain.com/payment/callback
CASHFREE_CALLBACK_URL=https://yourdomain.com/api/payments/cashfree/callback
```

---

## 🔧 Implementation Details

### Backend Files Created:
- ✅ `backend/api/cashfree_payment.py` - Cashfree payment service
- ✅ `backend/api/views.py` - Added 3 Cashfree endpoints
- ✅ `backend/api/urls.py` - Added Cashfree routes
- ✅ `backend/myura_backend/settings.py` - Added Cashfree settings

### Frontend Files Updated:
- ✅ `src/services/payment.ts` - Added Cashfree API service
- ✅ `src/pages/Checkout.tsx` - Updated to support Cashfree
- ✅ `src/pages/PaymentCallback.tsx` - Updated to handle Cashfree callbacks

---

## 📝 API Endpoints

### Create Payment Session
```
POST /api/payments/cashfree/create/
Headers: Authorization: Bearer <token>
Body: {
  "amount": 1000,  // Amount in rupees
  "order_id": 123,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+919876543210"
}
```

### Payment Callback (Cashfree calls this)
```
POST /api/payments/cashfree/callback/
Body: <Cashfree webhook payload>
```

### Verify Payment
```
POST /api/payments/cashfree/verify/
Headers: Authorization: Bearer <token>
Body: {
  "order_id": "ORDER_123456",
  "order_db_id": 123
}
```

---

## 🔄 How to Switch Between Payment Gateways

In `src/pages/Checkout.tsx`, you can switch between PhonePe and Cashfree:

```typescript
// Change this line to switch gateways:
const paymentGateway = 'phonepe'; // or 'cashfree'
```

Or make it dynamic based on user selection.

---

## 🧪 Testing

### Test Mode (Sandbox)
1. Use Cashfree sandbox credentials
2. Test payment flow:
   - Create order
   - Redirect to Cashfree payment page
   - Use test payment methods
   - Verify callback handling
   - Check order status update

### Test Flow
1. Add items to cart
2. Go to checkout
3. Select Card/UPI payment
4. Fill address details
5. Click "Place Order"
6. Should redirect to Cashfree payment page
7. Complete test payment
8. Should redirect back to callback page
9. Payment should be verified
10. Order should be updated with payment status

---

## 🔒 Security Notes

1. **Never expose Secret Key** in frontend code
2. **Always verify webhook signatures** on backend (implemented)
3. **Use HTTPS** in production
4. **Validate amounts** on backend before creating payment session
5. **Store payment_session_id** in database for reference
6. **Handle webhooks** for payment status updates

---

## 📚 Additional Resources

- Cashfree Documentation: https://docs.cashfree.com/
- Cashfree Dashboard: https://merchant.cashfree.com/
- API Reference: https://docs.cashfree.com/docs/api-reference/payments

---

## ✅ Checklist

- [ ] Cashfree account created and verified
- [ ] API credentials obtained (App ID, Secret Key)
- [ ] Environment variables set in backend
- [ ] Backend payment endpoints created
- [ ] Frontend payment service created
- [ ] Checkout page updated with Cashfree flow
- [ ] Payment callback page updated
- [ ] Test payment flow in sandbox mode
- [ ] Switch to production credentials for live

---

**Status:** ✅ Ready for implementation  
**Last Updated:** Today







