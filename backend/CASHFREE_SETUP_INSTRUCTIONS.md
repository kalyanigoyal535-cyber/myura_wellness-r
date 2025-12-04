# 🔧 Cashfree Setup Instructions

## ✅ Your Cashfree Credentials

Here are your **SANDBOX (TEST)** credentials:

- **App ID:** `YOUR_CASHFREE_APP_ID`
- **Secret Key:** `YOUR_CASHFREE_SECRET_KEY`

✅ **Note:** Your secret key starts with `cfsk_ma_test_` which indicates these are **SANDBOX/TEST** keys - perfect for testing!

---

## 📝 Step 1: Create/Update `.env` File

Create a `.env` file in the `backend/` folder (if it doesn't exist) and add:

```env
# Cashfree Payment Gateway Settings (SANDBOX/TEST)
CASHFREE_APP_ID=YOUR_CASHFREE_APP_ID
CASHFREE_SECRET_KEY=YOUR_CASHFREE_SECRET_KEY

# Sandbox API URL (for testing)
CASHFREE_API_URL=https://sandbox.cashfree.com/pg

# For Production (when ready to go live):
# CASHFREE_API_URL=https://api.cashfree.com/pg
# Use production keys from Cashfree dashboard

# Callback URLs (update for production)
CASHFREE_REDIRECT_URL=http://localhost:3000/payment/callback
CASHFREE_CALLBACK_URL=http://127.0.0.1:8000/api/payments/cashfree/callback

# For Production, update these URLs:
# CASHFREE_REDIRECT_URL=https://yourdomain.com/payment/callback
# CASHFREE_CALLBACK_URL=https://yourdomain.com/api/payments/cashfree/callback
```

---

## ⚠️ Important Notes

### Sandbox (Test) Mode

You have **sandbox/test keys** - perfect for testing! 

- ✅ **No real money** - safe for testing
- ✅ **Test payment flows** without risk
- ✅ **Use sandbox URL** as shown above

When ready for production:
1. Go to Cashfree Dashboard → Switch to Production mode
2. Generate production API keys
3. Update `.env` with production keys and URL

---

## 🔗 Step 2: Configure Webhook URLs in Cashfree Dashboard

1. Log in to **Cashfree Merchant Dashboard**: https://merchant.cashfree.com
2. Go to **Settings → Webhooks** or **Developers → Webhooks**
3. Add these webhook URLs:

   **For Testing:**
   - Callback URL: `http://127.0.0.1:8000/api/payments/cashfree/callback`
   - Redirect URL: `http://localhost:3000/payment/callback`

   **For Production:**
   - Callback URL: `https://yourdomain.com/api/payments/cashfree/callback`
   - Redirect URL: `https://yourdomain.com/payment/callback`

---

## 🧪 Step 3: Test the Integration

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
   - Select payment method (Card/UPI)
   - Fill address details
   - Click "Place Order"
   - Should redirect to Cashfree payment page
   - Complete test payment
   - Should redirect back to your callback page

---

## 🔄 Step 4: Switch to Cashfree in Checkout

In `src/pages/Checkout.tsx`, around line 309, change:

```typescript
// Change from 'phonepe' to 'cashfree'
const paymentGateway = 'cashfree';
```

---

## ✅ Checklist

- [ ] Created `.env` file in `backend/` folder
- [ ] Added Cashfree App ID
- [ ] Added Cashfree Secret Key
- [ ] Set correct API URL (production or sandbox)
- [ ] Configured webhook URLs in Cashfree dashboard
- [ ] Updated checkout to use Cashfree (optional)
- [ ] Tested payment flow

---

## 🚨 Security Reminders

1. **Never commit `.env` file** to Git
2. **Keep Secret Key secure** - never expose in frontend
3. **Use HTTPS** in production
4. **Test with sandbox** before going live
5. **Monitor transactions** in Cashfree dashboard

---

## 📚 Need Help?

- Cashfree Docs: https://docs.cashfree.com/
- Cashfree Dashboard: https://merchant.cashfree.com/
- API Reference: https://docs.cashfree.com/docs/api-reference/payments

---

**Status:** ✅ Ready to configure  
**Last Updated:** Today

