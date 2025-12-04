# 🚀 PhonePe Integration - Quick Start Guide

## ✅ Implementation Complete!

All files have been created and integrated. Follow these steps to activate PhonePe payments:

---

## 📝 Step 1: Get PhonePe Credentials

1. **Sign up** at https://merchant.phonepe.com
2. **Complete KYC** verification
3. **Get your credentials**:
   - Merchant ID
   - Salt Key
   - Salt Index (usually `1`)

---

## 🔧 Step 2: Configure Environment Variables

### Backend Configuration

Create or update `.env` file in `backend/` directory:

```env
PHONEPE_MERCHANT_ID=YOUR_MERCHANT_ID
PHONEPE_SALT_KEY=your_salt_key_here
PHONEPE_SALT_INDEX=1
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/callback
PHONEPE_CALLBACK_URL=http://127.0.0.1:8000/api/payments/phonepe/callback
```

**For Production:**
```env
PHONEPE_API_URL=https://api.phonepe.com/apis/pg-sandbox
PHONEPE_REDIRECT_URL=https://yourdomain.com/payment/callback
PHONEPE_CALLBACK_URL=https://yourdomain.com/api/payments/phonepe/callback
```

---

## 📦 Step 3: Install Dependencies (if needed)

The `requests` library is already in `requirements.txt`. If you need to install:

```bash
cd backend
pip install -r requirements.txt
```

---

## 🧪 Step 4: Test the Integration

1. **Start Backend:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   npm start
   ```

3. **Test Flow:**
   - Add items to cart
   - Go to checkout
   - Select "Cards / NetBanking" or "UPI Apps"
   - Fill in address details
   - Click "Place Order"
   - Should redirect to PhonePe payment page
   - Complete test payment
   - Should redirect back to callback page
   - Verify payment status

---

## 📁 Files Created/Modified

### Backend:
- ✅ `backend/api/phonepe_payment.py` - PhonePe payment service
- ✅ `backend/api/views.py` - Added 3 payment endpoints
- ✅ `backend/api/urls.py` - Added payment routes
- ✅ `backend/myura_backend/settings.py` - Added PhonePe settings

### Frontend:
- ✅ `src/services/payment.ts` - PhonePe API service
- ✅ `src/pages/PaymentCallback.tsx` - Payment callback handler
- ✅ `src/pages/Checkout.tsx` - Updated with PhonePe integration
- ✅ `src/router/routes.tsx` - Added callback route

---

## 🔗 API Endpoints

### Create Payment Request
```
POST /api/payments/phonepe/create/
Headers: Authorization: Bearer <token>
Body: {
  "amount": 10000,  // Amount in paise
  "order_id": 123
}
```

### Payment Callback (PhonePe calls this)
```
POST /api/payments/phonepe/callback/
Headers: X-VERIFY: <signature>
Body: <PhonePe callback payload>
```

### Verify Payment
```
POST /api/payments/phonepe/verify/
Headers: Authorization: Bearer <token>
Body: {
  "transaction_id": "TXN123456",
  "order_id": 123
}
```

---

## ⚠️ Important Notes

1. **Callback URL**: Make sure your callback URL is whitelisted in PhonePe dashboard
2. **HTTPS**: Use HTTPS in production (PhonePe requires it)
3. **Testing**: Use sandbox credentials for testing
4. **Signature Verification**: Always verify signatures on callbacks
5. **Error Handling**: Payment failures are handled gracefully

---

## 🐛 Troubleshooting

### Payment redirect not working?
- Check `PHONEPE_REDIRECT_URL` matches your frontend URL
- Verify PhonePe dashboard has correct redirect URL whitelisted

### Callback not receiving?
- Check `PHONEPE_CALLBACK_URL` is accessible
- Verify CORS settings allow PhonePe to call your backend
- Check backend logs for callback requests

### Signature verification failing?
- Double-check `PHONEPE_SALT_KEY` and `PHONEPE_SALT_INDEX`
- Ensure signature generation matches PhonePe documentation

---

## 📚 Next Steps

1. ✅ Get PhonePe credentials
2. ✅ Set environment variables
3. ✅ Test in sandbox mode
4. ✅ Switch to production credentials
5. ✅ Monitor payment logs
6. ✅ Set up webhooks (optional)

---

## 📖 Full Documentation

See `PHONEPE_INTEGRATION_GUIDE.md` for complete documentation.

---

**Status:** ✅ Ready to use  
**Last Updated:** Today







