# 📮 Postman Collection Setup Guide - Payment Gateways

This guide will help you set up and use the Postman collection for testing all payment gateway APIs in the Myura Wellness platform.

## 📦 Files Included

1. **Postman_Myura_Payment_Gateways.postman_collection.json** - Complete API collection
2. **Postman_Myura_Development.postman_environment.json** - Development environment variables
3. **Postman_Myura_Production.postman_environment.json** - Production environment variables

---

## 🚀 Quick Setup

### Step 1: Import Collection and Environment

1. **Open Postman**
2. **Import Collection:**
   - Click `Import` button (top left)
   - Select `Postman_Myura_Payment_Gateways.postman_collection.json`
   - Click `Import`

3. **Import Environment:**
   - Click `Import` button again
   - Select `Postman_Myura_Development.postman_environment.json`
   - Click `Import`
   - Repeat for `Postman_Myura_Production.postman_environment.json` if needed

### Step 2: Select Environment

1. Click the environment dropdown (top right, next to eye icon)
2. Select **"Myura - Development"** (or "Myura - Production")
3. You should see environment variables listed when you click the eye icon

### Step 3: Set Authentication Token

**Option A: Get Token from Login**
1. First, make sure you have a login endpoint or use your existing auth setup
2. Login to get your JWT token
3. Copy the access token from the response

**Option B: Set Token Manually**
1. Click the environment dropdown → Click **"View"** (eye icon) or click **"Manage Environments"**
2. Click on **"Myura - Development"**
3. Find `auth_token` variable
4. Paste your JWT token in the **Current Value** field
5. Click **Save**

---

## 📝 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | Your API base URL | `http://127.0.0.1:8000/api` |
| `auth_token` | JWT Bearer token for authentication | `eyJ0eXAiOiJKV1QiLCJhbGc...` |
| `test_order_id` | Test order ID to use | `1` |
| `test_amount_rupees` | Test amount in rupees (for Cashfree) | `100` |
| `test_amount_paise` | Test amount in paise (for PhonePe/Razorpay) | `10000` |
| `test_customer_name` | Test customer name | `John Doe` |
| `test_customer_email` | Test customer email | `john.doe@example.com` |
| `test_customer_phone` | Test customer phone | `+919876543210` |

### Auto-Generated Variables (Set by Tests)

These are automatically set when you run requests:
- `phonepe_transaction_id` - Set after creating PhonePe payment
- `phonepe_payment_url` - Set after creating PhonePe payment
- `cashfree_payment_url` - Set after creating Cashfree payment
- `cashfree_payment_session_id` - Set after creating Cashfree payment
- `cashfree_order_id` - Set after creating Cashfree payment
- `razorpay_order_id` - Set after creating Razorpay order

---

## 🔌 API Endpoints Included

### PhonePe Payment (3 endpoints)

1. **Create PhonePe Payment**
   - `POST /api/payments/phonepe/create/`
   - Requires: `amount` (in paise), `order_id`
   - Auto-saves: `phonepe_transaction_id`, `phonepe_payment_url`

2. **Verify PhonePe Payment**
   - `POST /api/payments/phonepe/verify/`
   - Requires: `transaction_id`, `order_id`
   - Checks payment status

3. **PhonePe Callback (Webhook)**
   - `POST /api/payments/phonepe/callback/`
   - Simulates PhonePe webhook callback
   - Note: Usually called by PhonePe, but included for testing

### Cashfree Payment (3 endpoints)

1. **Create Cashfree Payment**
   - `POST /api/payments/cashfree/create/`
   - Requires: `amount` (in rupees), `order_id`, customer details
   - Auto-saves: `cashfree_payment_url`, `cashfree_payment_session_id`, `cashfree_order_id`

2. **Verify Cashfree Payment**
   - `POST /api/payments/cashfree/verify/`
   - Requires: `order_id` (Cashfree order ID), `order_db_id`
   - Checks payment status

3. **Cashfree Callback (Webhook)**
   - `POST /api/payments/cashfree/callback/`
   - Simulates Cashfree webhook callback
   - Note: Usually called by Cashfree, but included for testing

### Razorpay Payment (2 endpoints)

1. **Create Razorpay Order**
   - `POST /api/payments/create/`
   - Requires: `amount` (in paise), `order_id`
   - Auto-saves: `razorpay_order_id`

2. **Verify Razorpay Payment**
   - `POST /api/payments/verify/`
   - Requires: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `order_id`
   - Verifies payment signature

**Note:** Razorpay endpoints are based on the integration guide. If these endpoints don't exist yet, you may need to implement them.

---

## 🧪 Testing Workflow

### PhonePe Payment Flow

1. **Create Order First** (if not using existing)
   - Use your order creation endpoint or create one manually
   - Note the `order_id` and update `test_order_id` in environment

2. **Create PhonePe Payment**
   - Run: `Create PhonePe Payment`
   - This will save `phonepe_transaction_id` and `phonepe_payment_url` automatically
   - Copy the `payment_url` and open it in a browser to test payment

3. **Verify Payment**
   - After payment is complete, run: `Verify PhonePe Payment`
   - Uses the saved `phonepe_transaction_id` automatically

4. **Test Callback** (Optional)
   - Run: `PhonePe Callback (Webhook)` to simulate webhook
   - Adjust payload as needed for your test scenario

### Cashfree Payment Flow

1. **Create Order First** (if not using existing)
   - Use your order creation endpoint or create one manually
   - Note the `order_id` and update `test_order_id` in environment

2. **Create Cashfree Payment**
   - Run: `Create Cashfree Payment`
   - This will save `cashfree_payment_url`, `cashfree_payment_session_id`, and `cashfree_order_id`
   - Copy the `payment_url` and open it in a browser to test payment

3. **Verify Payment**
   - After payment is complete, run: `Verify Cashfree Payment`
   - Uses the saved `cashfree_order_id` automatically

4. **Test Callback** (Optional)
   - Run: `Cashfree Callback (Webhook)` to simulate webhook
   - Adjust payload as needed for your test scenario

### Razorpay Payment Flow

1. **Create Order First** (if not using existing)
   - Use your order creation endpoint or create one manually
   - Note the `order_id` and update `test_order_id` in environment

2. **Create Razorpay Order**
   - Run: `Create Razorpay Order`
   - This will save `razorpay_order_id` automatically

3. **Verify Payment**
   - After payment is complete (using Razorpay checkout), run: `Verify Razorpay Payment`
   - You'll need to provide `razorpay_payment_id` and `razorpay_signature` from the payment response

---

## 🔧 Customizing Variables

### Update Base URL

1. Click environment dropdown → **Manage Environments**
2. Select your environment
3. Edit `base_url` value
4. Click **Save**

### Update Test Data

You can update test data in the environment:
- `test_order_id` - Your actual order ID
- `test_amount_rupees` - Amount for Cashfree (e.g., `500` for ₹500)
- `test_amount_paise` - Amount for PhonePe/Razorpay (e.g., `50000` for ₹500)
- `test_customer_name`, `test_customer_email`, `test_customer_phone` - Customer details

### Update Amounts

**Important:** 
- **PhonePe & Razorpay** use **paise** (multiply rupees by 100)
  - ₹100 = 10000 paise
  - ₹500 = 50000 paise

- **Cashfree** uses **rupees** (not paise)
  - ₹100 = 100
  - ₹500 = 500

---

## 🔐 Authentication

All endpoints (except callbacks) require JWT Bearer token authentication.

**To update your token:**
1. Click environment dropdown → **Manage Environments**
2. Select your environment
3. Edit `auth_token` value
4. Paste your JWT token
5. Click **Save**

**Token format:** The collection automatically uses `{{auth_token}}` in the Authorization header as `Bearer {{auth_token}}`

---

## 📋 Pre-request Scripts

The collection includes pre-request scripts that automatically:
- Set authentication headers using `{{auth_token}}`
- Use environment variables for dynamic values

## ✅ Test Scripts

The collection includes test scripts that automatically:
- Save response values to environment variables (transaction IDs, payment URLs, etc.)
- Validate response status codes

---

## 🐛 Troubleshooting

### Issue: "401 Unauthorized"
**Solution:** 
- Check if `auth_token` is set correctly in your environment
- Verify your token is still valid (not expired)
- Make sure you've selected the correct environment

### Issue: "404 Not Found"
**Solution:**
- Verify `base_url` is correct (should end with `/api`)
- Check if the endpoint exists in your backend
- Ensure your Django server is running

### Issue: "400 Bad Request"
**Solution:**
- Check the request body matches the expected format
- Verify `order_id` exists in your database
- Ensure `amount` is in correct format (paise for PhonePe/Razorpay, rupees for Cashfree)

### Issue: Variables not updating
**Solution:**
- Make sure you've selected the correct environment
- Run the request that sets the variable first (e.g., Create Payment)
- Check the test script executed successfully (in Postman console)

---

## 💡 Tips

1. **Use Collection Runner** to test entire payment flows automatically
2. **Save examples** for successful responses to document expected formats
3. **Use Postman Variables** at collection level for shared values
4. **Set up separate environments** for Development, Staging, and Production
5. **Export your environment** regularly to backup your configuration

---

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/)
- [JWT Token Authentication](https://learning.postman.com/docs/sending-requests/authorization/#bearer-token)
- [Environment Variables](https://learning.postman.com/docs/sending-requests/managing-environments/)

---

## ✅ Checklist

- [ ] Collection imported to Postman
- [ ] Environment imported and selected
- [ ] `base_url` updated to match your backend
- [ ] `auth_token` set with valid JWT token
- [ ] `test_order_id` updated with a valid order ID
- [ ] Test amounts set correctly (paise for PhonePe/Razorpay, rupees for Cashfree)
- [ ] Created a test order in your database
- [ ] Tested at least one payment gateway endpoint successfully

---

**Happy Testing! 🚀**







