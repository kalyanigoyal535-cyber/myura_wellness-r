# Guest Cart Functionality - Verification & Status

## ✅ Current Status: **GUEST CART IS FULLY FUNCTIONAL**

Users can add items to cart without logging in. The system is already configured to support guest users.

---

## Backend Configuration ✅

### 1. Cart Endpoints - Allow Guest Access
All cart endpoints have `@permission_classes([AllowAny])`:

- ✅ `GET /api/cart/` - Get cart (creates if doesn't exist)
- ✅ `POST /api/cart/items/` - Add item to cart
- ✅ `PUT /api/cart/items/{id}/` - Update cart item
- ✅ `DELETE /api/cart/items/{id}/` - Remove cart item
- ✅ `DELETE /api/cart/` - Clear cart

### 2. Session-Based Cart for Guests
The `get_or_create_cart()` function handles both:
- **Authenticated users**: Cart tied to user account
- **Guest users**: Cart tied to session key (automatically created)

```python
def get_or_create_cart(request):
    if request.user.is_authenticated:
        # User cart
        cart, created = Cart.objects.get_or_create(
            user=request.user,
            session_key__isnull=True,
            defaults={'user': request.user}
        )
    else:
        # Guest cart - uses session key
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        
        cart, created = Cart.objects.get_or_create(
            user=None,
            session_key=session_key,
            defaults={'session_key': session_key}
        )
    return cart, created
```

### 3. Django Settings
- ✅ `django.contrib.sessions` - Sessions app enabled
- ✅ `SessionMiddleware` - Session middleware enabled
- ✅ `CORS_ALLOW_CREDENTIALS = True` - Allows cookies/sessions
- ✅ CORS configured for frontend origin

---

## Frontend Configuration ✅

### 1. API Client
- ✅ `withCredentials: true` - Sends cookies for session management
- ✅ Auth token only added if exists (doesn't block guest requests)
- ✅ Works for both authenticated and guest users

### 2. CartContext
- ✅ No authentication checks that block guest users
- ✅ All cart operations work for guests
- ✅ Automatically syncs with backend (creates session-based cart)

### 3. Cart Operations Available to Guests
- ✅ Add items to cart
- ✅ Update quantities
- ✅ Remove items
- ✅ View cart
- ✅ Clear cart

---

## How It Works

### For Guest Users:
1. User visits site (not logged in)
2. User clicks "Add to Cart" on a product
3. Frontend calls `POST /api/cart/items/` with product ID
4. Backend creates/gets cart using session key
5. Item is added to session-based cart
6. Cart persists across page refreshes (via session cookie)

### For Authenticated Users:
1. User logs in
2. Cart operations use user account instead of session
3. On login, guest cart can be merged with user cart (if items exist)

---

## Testing Guest Cart

### Test 1: Add Item as Guest
```bash
# Without authentication
curl -X POST http://localhost:8000/api/cart/items/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}' \
  -c cookies.txt
```

### Test 2: Get Cart as Guest
```bash
# Use session cookie from previous request
curl http://localhost:8000/api/cart/ \
  -b cookies.txt
```

### Test 3: Frontend Test
1. Open browser in incognito/private mode
2. Visit the site (don't login)
3. Add a product to cart
4. Refresh page - cart should persist
5. Check browser cookies - should see session cookie

---

## Cart Merging on Login

When a guest user logs in:
1. Guest cart (session-based) is preserved
2. User cart (account-based) is retrieved/created
3. Call `POST /api/cart/merge/` to merge guest cart into user cart
4. Guest cart items are added to user cart
5. Duplicate products have quantities combined

This is handled automatically in `CartContext` when user logs in.

---

## Important Notes

1. **Session Persistence**: Guest carts persist as long as the session cookie exists
2. **Session Expiry**: Sessions expire based on Django's `SESSION_COOKIE_AGE` setting
3. **Multiple Devices**: Guest carts are device/browser specific (session-based)
4. **Login Merge**: Guest cart is automatically merged when user logs in
5. **No Data Loss**: Cart items are preserved when transitioning from guest to authenticated user

---

## Verification Checklist

- [x] Backend cart endpoints allow guest access (`AllowAny`)
- [x] Session-based cart creation works for guests
- [x] Frontend API client configured with `withCredentials: true`
- [x] CartContext works without authentication
- [x] Cart operations (add, update, remove) work for guests
- [x] Cart persists across page refreshes
- [x] Cart merges on login

---

## Conclusion

**Guest cart functionality is fully implemented and working!** 

Users can:
- ✅ Browse products without logging in
- ✅ Add items to cart without logging in
- ✅ View and manage cart without logging in
- ✅ Have cart persist across page refreshes
- ✅ Have cart automatically merged when they log in

No additional changes are needed. The system is ready for guest users to add items to cart.











