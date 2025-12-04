# Session Persistence Fix - Cart Issue

## Problem Identified

From the console logs:
1. ✅ Item successfully added to cart ID **116** (with 1 item)
2. ❌ But when syncing, it fetches cart ID **117** (empty - 0 items)

**Root Cause**: Session is not persisting between API requests, causing a new cart to be created on each request.

---

## Fixes Applied

### 1. Session Configuration (settings.py)
Added session settings to ensure sessions persist:
```python
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_NAME = 'sessionid'
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_SAVE_EVERY_REQUEST = True  # Save session on every request
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
```

### 2. Session Save in get_or_create_cart()
Modified to explicitly save session after creating it:
```python
if not request.session.session_key:
    request.session.create()
session_key = request.session.session_key

# Mark session as modified to ensure it's saved
request.session.modified = True

# Explicitly save session to ensure cookie is set
request.session.save()
```

### 3. Session Save in All Cart Endpoints
Added session save before returning responses in:
- ✅ `cart_view()` - GET and DELETE
- ✅ `add_to_cart_view()` - POST
- ✅ `cart_item_view()` - PUT and DELETE

---

## Testing

### Step 1: Restart Backend Server
```bash
cd backend
python manage.py runserver
```

### Step 2: Clear Browser Data
- Clear cookies for localhost:3000
- Or use incognito/private window

### Step 3: Test Add to Cart
1. Open browser console (F12)
2. Click "Add to Cart" on any product
3. Check console logs - should see:
   - `[Cart] Adding item to cart:`
   - `[Cart API] Add to cart response:` (cart ID, e.g., 116)
   - `[Cart] Syncing cart from backend...`
   - `[Cart API] Get cart response:` (should be SAME cart ID, e.g., 116)
   - `[Cart] Cart sync complete. Items count: 1` ✅

### Step 4: Verify Session Cookie
- Open DevTools → Application → Cookies
- Should see `sessionid` cookie
- Cookie should persist across requests

---

## Expected Behavior After Fix

**Before Fix:**
```
POST /api/cart/items/ → Creates cart 116, adds item ✅
GET /api/cart/ → Creates NEW cart 117 (empty) ❌
```

**After Fix:**
```
POST /api/cart/items/ → Creates cart 116, adds item ✅
GET /api/cart/ → Returns SAME cart 116 (with item) ✅
```

---

## If Still Not Working

### Check 1: Session Cookie
- Open DevTools → Application → Cookies
- Verify `sessionid` cookie exists
- Check cookie domain and path are correct

### Check 2: CORS Credentials
- Verify `CORS_ALLOW_CREDENTIALS = True` in settings.py
- Verify `withCredentials: true` in frontend API client

### Check 3: Network Tab
- Check if `sessionid` cookie is being sent in requests
- Look for `Cookie: sessionid=...` in request headers

### Check 4: Backend Logs
- Check Django console for session creation
- Verify session key is consistent

---

## Additional Debugging

Add this to see session info:
```python
# In get_or_create_cart()
print(f"Session key: {request.session.session_key}")
print(f"Session modified: {request.session.modified}")
```

---

**Status**: ✅ Session persistence fixes applied
**Next**: Restart backend and test again











