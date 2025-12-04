# Cart Troubleshooting Guide

## Issue: Items Not Adding to Cart (No Console Errors)

### Step 1: Check Browser Console
Open DevTools (F12) → Console tab
- Look for messages starting with `[Cart]` or `[Cart API]`
- These are detailed logs I just added
- Check for any errors or warnings

### Step 2: Check Network Tab
Open DevTools (F12) → Network tab
1. Filter by "cart" or "api"
2. Click "Add to Cart" button
3. Look for:
   - `POST /api/cart/items/` request
   - Check request status (200 = success, 400/500 = error)
   - Check request payload (should have `product_id` and `quantity`)
   - Check response (should return cart with items)

### Step 3: Verify Backend is Running
```bash
# Check if backend is accessible
curl http://127.0.0.1:8000/api/products/

# Should return product list
```

### Step 4: Test Cart API Directly
Open `test_cart_api.html` in browser:
1. Click "1. Get Cart" - should return empty cart or existing cart
2. Click "2. Add Product 1 to Cart" - should add item
3. Click "3. Get Cart Again" - should show item in cart

### Step 5: Check Product ID Format
The issue might be product ID format mismatch:
- Frontend might use slugs: `"dia-care"`, `"pro-omega-3-softgel-capsules"`
- Backend expects numeric IDs: `1`, `2`, `3`

**Check in console:**
- Look for `[Cart] Adding item to cart:` log
- Check what `item.id` value is
- If it's a slug, the lookup should convert it to numeric ID

### Step 6: Verify Product Exists in Database
```bash
cd backend
python manage.py shell
>>> from api.models import Product
>>> Product.objects.all().values('id', 'name')
```

### Step 7: Check Session/Cookies
- Open DevTools → Application tab → Cookies
- Look for `sessionid` cookie
- Should be set when making API calls
- If missing, session-based cart won't work

### Step 8: Common Issues

#### Issue A: Product ID is String Slug
**Symptom**: Console shows `[Cart] Looking up product by slug/category`
**Solution**: The code should handle this automatically, but check:
- Category exists in database
- Product exists in that category
- Search is finding the product

#### Issue B: API Call Fails Silently
**Symptom**: No network request appears
**Solution**: 
- Check API base URL in `src/services/api.ts`
- Verify backend is running
- Check CORS settings

#### Issue C: Cart Sync Fails
**Symptom**: Item added but doesn't appear in UI
**Solution**:
- Check `[Cart] Syncing cart from backend...` log
- Verify `syncCart()` completes successfully
- Check Redux store is being updated

#### Issue D: Redux Store Not Updating
**Symptom**: Backend has item but UI doesn't show it
**Solution**:
- Check `[Cart] Adding item to Redux:` logs
- Verify Redux store is connected
- Check if `CartProvider` wraps the app

---

## Debugging Commands

### Test Backend API
```bash
# Get cart
curl http://127.0.0.1:8000/api/cart/ -c cookies.txt

# Add to cart
curl -X POST http://127.0.0.1:8000/api/cart/items/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}' \
  -b cookies.txt \
  -c cookies.txt

# Get cart again
curl http://127.0.0.1:8000/api/cart/ -b cookies.txt
```

### Check Frontend Logs
1. Open browser console
2. Click "Add to Cart"
3. Look for these logs in order:
   - `[Cart] Adding item to cart:`
   - `[Cart] Using numeric ID:` OR `[Cart] Looking up product by slug/category:`
   - `[Cart API] Adding to cart:`
   - `[Cart API] Add to cart response:`
   - `[Cart] Syncing cart from backend...`
   - `[Cart] Cart synced successfully`

---

## What I Just Fixed

1. ✅ Added comprehensive logging throughout cart flow
2. ✅ Added await to addItem calls in ThemedProductPage
3. ✅ Added error handling with try-catch
4. ✅ Added detailed logs for:
   - Product ID resolution
   - API calls
   - Cart syncing
   - Redux store updates

---

## Next Steps

1. **Open browser console** and click "Add to Cart"
2. **Check the logs** - you should see detailed `[Cart]` messages
3. **Share the console output** - this will help identify the exact issue
4. **Check Network tab** - verify API calls are being made
5. **Test with test_cart_api.html** - verify backend is working

---

## Expected Console Output (Success)

```
[Cart] Adding item to cart: {item: {...}, qty: 1}
[Cart] Looking up product by slug/category: dia-care
[Cart] Category lookup result: {...}
[Cart] Found product in category: 1
[Cart] Calling API to add product: {productId: 1, qty: 1}
[Cart API] Adding to cart: {productId: 1, quantity: 1}
[Cart API] Add to cart response: {id: 1, items: [...]}
[Cart] Syncing cart from backend...
[Cart API] Fetching cart...
[Cart API] Get cart response: {id: 1, items: [...]}
[Cart] Backend cart response: {id: 1, items: [...]}
[Cart] Converted frontend items: [...]
[Cart] Cleared Redux cart
[Cart] Adding item to Redux: {...}
[Cart] Cart sync complete. Items count: 1
```

If you see errors or the flow stops at any point, that's where the issue is!











