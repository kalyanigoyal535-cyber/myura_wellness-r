# 📋 PhonePe Integration - Setup Steps

## ✅ Updated to OAuth-based API

The integration now uses PhonePe's **OAuth authentication** with the Standard Checkout API.

---

## 🔑 Step 1: Get Your Credentials from PhonePe Dashboard

In your PhonePe merchant dashboard, find these credentials:

### Required Credentials:
1. **Client ID** - Found in: Settings → API Configuration → Client Credentials
2. **Client Secret** - Found in: Settings → API Configuration → Client Credentials  
3. **Merchant ID** - Your merchant identifier

### Where to Find:
- **Dashboard → Settings → API Configuration**
- **Developer Tools → Credentials**
- **Integration → API Keys**

---

## ⚙️ Step 2: Configure Backend Environment

Create or update `.env` file in `backend/` folder:

```env
# PhonePe OAuth Credentials
PHONEPE_CLIENT_ID=your_client_id_here
PHONEPE_CLIENT_SECRET=your_client_secret_here
PHONEPE_MERCHANT_ID=your_merchant_id_here

# API URLs
PHONEPE_API_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# Callback URLs (for testing)
PHONEPE_REDIRECT_URL=http://localhost:3000/payment/callback
PHONEPE_CALLBACK_URL=http://127.0.0.1:8000/api/payments/phonepe/callback
```

### For Production:
```env
PHONEPE_API_URL=https://api.phonepe.com/apis/pg-sandbox
PHONEPE_REDIRECT_URL=https://yourdomain.com/payment/callback
PHONEPE_CALLBACK_URL=https://yourdomain.com/api/payments/phonepe/callback
```

---

## 🔗 Step 3: Configure Callback URLs in PhonePe Dashboard

1. Go to **PhonePe Merchant Dashboard**
2. Navigate to **Settings → Webhooks/Callbacks** or **Integration Settings**
3. Add/Whitelist these URLs:

   **For Testing:**
   - Redirect URL: `http://localhost:3000/payment/callback`
   - Callback URL: `http://127.0.0.1:8000/api/payments/phonepe/callback`

   **For Production:**
   - Redirect URL: `https://yourdomain.com/payment/callback`
   - Callback URL: `https://yourdomain.com/api/payments/phonepe/callback`

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
   - Go to `http://localhost:3000`
   - Add items to cart
   - Go to checkout
   - Select "Cards / NetBanking" or "UPI Apps"
   - Fill address details
   - Click "Place Order"
   - Should redirect to PhonePe payment page
   - Complete test payment
   - Should redirect back to your callback page

---

## 📝 API Endpoints Used

The integration uses these PhonePe API endpoints:

1. **OAuth Token:** `POST /v1/oauth/token`
   - Gets access token using Client ID and Secret

2. **Create Payment:** `POST /checkout/v2/pay`
   - Initiates payment with OAuth token

3. **Order Status:** `GET /checkout/v2/order/{merchantOrderId}/status`
   - Checks payment status

4. **Callback:** `POST /api/payments/phonepe/callback/`
   - Receives payment status from PhonePe

---

## 🔄 Key Changes from Previous Version

- ✅ **OAuth Authentication** instead of Salt Key
- ✅ **Standard Checkout API** (`/checkout/v2/pay`)
- ✅ **Automatic Token Refresh** (tokens cached and refreshed automatically)
- ✅ **Simplified Callback Handling**

---

## ⚠️ Important Notes

1. **Client Secret**: Keep it secure, never expose in frontend
2. **Token Caching**: Access tokens are automatically cached and refreshed
3. **HTTPS Required**: Use HTTPS in production
4. **Callback URLs**: Must be whitelisted in PhonePe dashboard
5. **Testing**: Use sandbox credentials for testing

---

## 🐛 Troubleshooting

### "Failed to get access token"
- Check `PHONEPE_CLIENT_ID` and `PHONEPE_CLIENT_SECRET` are correct
- Verify credentials in PhonePe dashboard

### "Payment request failed"
- Check OAuth token is being generated
- Verify API URL is correct (sandbox vs production)
- Check callback URLs are whitelisted

### "Order not found" in callback
- Verify transaction ID is stored correctly
- Check order exists in database

---

## ✅ Checklist

- [ ] Got Client ID from PhonePe dashboard
- [ ] Got Client Secret from PhonePe dashboard
- [ ] Got Merchant ID from PhonePe dashboard
- [ ] Created/updated `.env` file with credentials
- [ ] Configured callback URLs in PhonePe dashboard
- [ ] Started backend server
- [ ] Started frontend server
- [ ] Tested payment flow

---

**Status:** ✅ Ready to use with OAuth  
**Last Updated:** Today







