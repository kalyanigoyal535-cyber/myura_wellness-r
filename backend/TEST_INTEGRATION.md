# Testing Frontend-Backend Integration

## 🚀 Quick Start

### Step 1: Start Backend Server

```bash
cd backend
python manage.py runserver
```

**Expected:** Server running at `http://127.0.0.1:8000`

### Step 2: Start Frontend Server

```bash
# In a new terminal
npm start
```

**Expected:** React app running at `http://localhost:3000`

---

## 🧪 Testing Checklist

### ✅ 1. Test Authentication

#### Test Registration

1. **Go to:** http://localhost:3000/signup
2. **Fill the form:**
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Username: testuser
   - Password: testpass123
   - Confirm Password: testpass123
3. **Click Register**
4. **Check:**
   - ✅ Should redirect to home page
   - ✅ Open DevTools (F12) → Application → Local Storage
   - ✅ Should see: `access_token`, `refresh_token`, `user`
   - ✅ Check Network tab for POST to `/api/auth/register/`

#### Test Login

1. **Go to:** http://localhost:3000/login
2. **Fill the form:**
   - Email: test@example.com
   - Password: testpass123
3. **Click Login**
4. **Check:**
   - ✅ Should redirect to home page
   - ✅ Tokens stored in Local Storage
   - ✅ Check Network tab for POST to `/api/auth/login/`

#### Test Logout

1. **While logged in**, click logout (if available)
2. **Check:**
   - ✅ Tokens removed from Local Storage
   - ✅ User redirected

---

### ✅ 2. Test Products API

#### Test Product Listing

1. **Open Browser Console (F12)**
2. **Paste this code:**

```javascript
fetch('http://127.0.0.1:8000/api/products/')
  .then(res => res.json())
  .then(data => console.log('Products:', data))
  .catch(err => console.error('Error:', err));
```

3. **Check:**
   - ✅ Should see products list in console
   - ✅ Response has `count`, `next`, `previous`, `results`

#### Test Product Search

1. **Go to:** http://localhost:3000/product
2. **Open DevTools → Network tab**
3. **Type in search box**
4. **Check:**
   - ✅ Network tab shows GET request to `/api/products/?search=...`
   - ✅ Results update based on search

#### Test Product Filters

```javascript
// Test category filter
fetch('http://127.0.0.1:8000/api/products/?category=dia-care')
  .then(res => res.json())
  .then(data => console.log('Filtered:', data));

// Test price range
fetch('http://127.0.0.1:8000/api/products/?min_price=500&max_price=1500')
  .then(res => res.json())
  .then(data => console.log('Price Filter:', data));
```

---

### ✅ 3. Test Cart Integration

#### Test Add to Cart (Guest)

1. **Go to:** http://localhost:3000/product
2. **Open DevTools → Network tab**
3. **Click "Add to Cart" on any product**
4. **Check:**
   - ✅ Network tab shows POST to `/api/cart/items/`
   - ✅ Request body: `{product_id: X, quantity: 1}`
   - ✅ Response shows updated cart
   - ✅ Cart icon updates (if visible)

#### Test View Cart

1. **Go to:** http://localhost:3000/cart
2. **Open DevTools → Network tab**
3. **Check:**
   - ✅ Network tab shows GET to `/api/cart/`
   - ✅ Cart items display correctly
   - ✅ Prices and quantities show

#### Test Update Cart Item

1. **In cart page**, change quantity
2. **Check Network tab:**
   - ✅ Shows PUT to `/api/cart/items/{id}/`
   - ✅ Request body: `{quantity: X}`
   - ✅ Cart updates correctly

#### Test Remove from Cart

1. **In cart page**, click remove/delete
2. **Check Network tab:**
   - ✅ Shows DELETE to `/api/cart/items/{id}/`
   - ✅ Item removed from cart

#### Test Cart Persistence

1. **Add items to cart**
2. **Refresh page (F5)**
3. **Check:**
   - ✅ Cart items still there
   - ✅ Cart synced from backend

---

### ✅ 4. Test Contact Form

1. **Go to:** http://localhost:3000/contact
2. **Fill the form:**
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Subject: Test Subject
   - Message: This is a test message
3. **Open DevTools → Network tab**
4. **Click Submit**
5. **Check:**
   - ✅ Network tab shows POST to `/api/contact/`
   - ✅ Success message appears
   - ✅ Form clears after submission
6. **Verify in Django Admin:**
   - Go to http://127.0.0.1:8000/admin/
   - Navigate to "Contact Submissions"
   - Verify new submission exists

---

### ✅ 5. Test Cart Sync After Login

1. **As Guest:**
   - Add items to cart
   - Note the items

2. **Login:**
   - Go to login page
   - Login with credentials

3. **Check:**
   - ✅ Cart items still present
   - ✅ Network tab shows POST to `/api/cart/merge/`
   - ✅ Guest cart merged with user cart

---

## 🔍 Browser DevTools Testing

### Check Network Requests

1. **Open DevTools (F12)**
2. **Go to Network tab**
3. **Filter by "Fetch/XHR"**
4. **Perform actions** (login, add to cart, etc.)
5. **Verify:**
   - ✅ All API calls show 200 status (green)
   - ✅ Request URLs are correct
   - ✅ Request/Response data is correct

### Check Local Storage

1. **Open DevTools (F12)**
2. **Go to Application tab (Chrome) or Storage tab (Firefox)**
3. **Click "Local Storage" → http://localhost:3000**
4. **Verify:**
   - ✅ `access_token` exists (after login)
   - ✅ `refresh_token` exists (after login)
   - ✅ `user` exists (after login)

### Check Console for Errors

1. **Open DevTools (F12)**
2. **Go to Console tab**
3. **Look for:**
   - ❌ Red errors (should be none)
   - ⚠️ Yellow warnings (check if critical)
   - ✅ API call logs

---

## 🧪 Quick Test Script

Paste this in browser console (F12) to test all endpoints:

```javascript
const API_BASE = 'http://127.0.0.1:8000/api';

// Test 1: Products
fetch(`${API_BASE}/products/`)
  .then(res => res.json())
  .then(data => console.log('✅ Products:', data.count, 'items'))
  .catch(err => console.error('❌ Products Error:', err));

// Test 2: Categories
fetch(`${API_BASE}/categories/`)
  .then(res => res.json())
  .then(data => console.log('✅ Categories:', data.length, 'categories'))
  .catch(err => console.error('❌ Categories Error:', err));

// Test 3: Cart (Guest)
fetch(`${API_BASE}/cart/`, { credentials: 'include' })
  .then(res => res.json())
  .then(data => console.log('✅ Cart:', data.total_items, 'items'))
  .catch(err => console.error('❌ Cart Error:', err));

// Test 4: Contact Form
fetch(`${API_BASE}/contact/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test',
    message: 'Test message'
  })
})
  .then(res => res.json())
  .then(data => console.log('✅ Contact:', data.message))
  .catch(err => console.error('❌ Contact Error:', err));

// Test 5: Login (if you have credentials)
const testLogin = () => {
  fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'testpass123'
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        console.log('✅ Login successful!');
      }
    })
    .catch(err => console.error('❌ Login Error:', err));
};

// Uncomment to test login:
// testLogin();
```

---

## ✅ Success Criteria

### Authentication
- [ ] User can register
- [ ] User can login
- [ ] Tokens stored in Local Storage
- [ ] User can logout
- [ ] Protected routes work

### Products
- [ ] Products load from API
- [ ] Search works
- [ ] Filters work (if implemented in UI)
- [ ] Product details load

### Cart
- [ ] Add to cart works (guest & authenticated)
- [ ] Cart syncs with backend
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Cart persists across page refreshes
- [ ] Cart merges on login

### Contact Form
- [ ] Form submits successfully
- [ ] Success message displays
- [ ] Error handling works
- [ ] Submission saved in backend

---

## 🐛 Common Issues & Fixes

### Issue: CORS Error

**Error:** `Access to fetch at 'http://127.0.0.1:8000/api/...' has been blocked by CORS policy`

**Fix:**
1. Check `backend/myura_backend/settings.py`
2. Verify CORS settings:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
   ]
   ```
3. Restart Django server

### Issue: 401 Unauthorized

**Error:** `401 Unauthorized`

**Fix:**
1. Check if token exists in Local Storage
2. Try re-login to get new token
3. Check token expiration

### Issue: Cart Not Syncing

**Symptoms:** Cart items not appearing

**Fix:**
1. Check Network tab for errors
2. Verify session cookies enabled
3. Check `withCredentials: true` in API calls
4. Try clearing browser cache

### Issue: Products Not Loading

**Symptoms:** Empty product list

**Fix:**
1. Check if backend has products in database
2. Check Network tab for API errors
3. Verify API endpoint URL is correct
4. Check browser console for errors

---

## 📊 Testing Checklist Summary

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Registration works
- [ ] Login works
- [ ] Products load from API
- [ ] Search works
- [ ] Add to cart works
- [ ] Cart syncs with backend
- [ ] Update cart works
- [ ] Remove from cart works
- [ ] Contact form works
- [ ] Cart persists after refresh
- [ ] Cart merges on login
- [ ] No console errors
- [ ] All API calls return 200 status

---

## 🎯 Quick Test Commands

**Test Backend Directly:**
```bash
# Test products endpoint
curl http://127.0.0.1:8000/api/products/

# Test login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"testpass123\"}"
```

**Test Frontend:**
1. Open http://localhost:3000
2. Open DevTools (F12)
3. Check Network tab
4. Perform actions
5. Verify API calls

---

**Happy Testing! 🚀**













