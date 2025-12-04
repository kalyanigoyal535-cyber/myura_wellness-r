# Cart Debugging Guide

## Issue: Items Not Adding to Cart

### Common Causes & Solutions

#### 1. **Missing await on addItem()**
**Problem**: `addItem` is async but not awaited, causing silent failures.

**Solution**: Always use `await` when calling `addItem`:
```typescript
// ❌ Wrong
addItem({ id: '1', name: 'Product', price: 100 }, 1);

// ✅ Correct
await addItem({ id: '1', name: 'Product', price: 100 }, 1);
```

#### 2. **Product ID Mismatch**
**Problem**: Product ID from frontend doesn't match database ID.

**Check**:
- Product IDs in database are numeric (1, 2, 3...)
- Frontend might be using slugs (e.g., "dia-care")
- CartContext tries to resolve this, but may fail

**Solution**: Ensure product IDs match or use category lookup.

#### 3. **API Connection Issues**
**Problem**: Backend not running or CORS issues.

**Check**:
- Backend server running on `http://127.0.0.1:8000`
- CORS configured correctly
- Network tab shows API calls

**Solution**: 
- Start backend: `cd backend && python manage.py runserver`
- Check browser console for errors
- Verify API base URL in `src/services/api.ts`

#### 4. **Session/Cookie Issues**
**Problem**: Guest cart requires session cookies.

**Check**:
- `withCredentials: true` in API client
- Cookies are being sent (check Network tab)
- Session middleware enabled in Django

**Solution**: 
- Verify `CORS_ALLOW_CREDENTIALS = True` in Django settings
- Check browser allows cookies

#### 5. **Error Handling Missing**
**Problem**: Errors are thrown but not caught, appearing as silent failures.

**Solution**: Always wrap `addItem` in try-catch:
```typescript
try {
  await addItem({ id, name, price, image }, qty);
} catch (error) {
  console.error('Failed to add to cart:', error);
  // Show error to user
}
```

---

## Debugging Steps

### Step 1: Check Browser Console
Open browser DevTools → Console tab
- Look for error messages
- Check for failed API calls
- Verify network requests

### Step 2: Check Network Tab
Open browser DevTools → Network tab
- Filter by "cart" or "api"
- Click "Add to Cart"
- Check if request is sent
- Verify response status (200 = success, 400/500 = error)

### Step 3: Check Backend Logs
In backend terminal:
- Look for incoming requests
- Check for error messages
- Verify cart creation/updates

### Step 4: Verify Product in Database
```bash
cd backend
python manage.py shell
>>> from api.models import Product
>>> Product.objects.all().values('id', 'name')
```

### Step 5: Test API Directly
```bash
# Test add to cart
curl -X POST http://localhost:8000/api/cart/items/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}' \
  -c cookies.txt

# Check cart
curl http://localhost:8000/api/cart/ -b cookies.txt
```

---

## Fixed Issues

### ✅ ThemedProductPage.tsx
- **Fixed**: Added `await` to `addItem()` call
- **Fixed**: Added try-catch error handling
- **Fixed**: Proper error messages to user

### ✅ Home.tsx
- **Already fixed**: Has proper error handling
- **Already fixed**: Shows error toast

---

## Testing Checklist

- [ ] Backend server is running
- [ ] No console errors in browser
- [ ] Network requests show 200 status
- [ ] Product exists in database
- [ ] Product ID matches between frontend and backend
- [ ] Session cookies are being sent
- [ ] `addItem` is awaited
- [ ] Errors are caught and displayed

---

## Quick Fix Commands

```bash
# Check if backend is running
curl http://localhost:8000/api/products/

# Test adding to cart
curl -X POST http://localhost:8000/api/cart/items/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}' \
  -c cookies.txt

# Verify cart
curl http://localhost:8000/api/cart/ -b cookies.txt
```

---

## Common Error Messages

### "Product not found in database"
- **Cause**: Product ID doesn't exist
- **Fix**: Check product exists, use correct ID

### "Cannot add to cart: Product X not found"
- **Cause**: Product lookup failed (slug/ID mismatch)
- **Fix**: Verify product in database, check ID format

### "Network Error" or CORS errors
- **Cause**: Backend not running or CORS misconfigured
- **Fix**: Start backend, check CORS settings

### Silent failure (no error, no item added)
- **Cause**: Missing await, uncaught error
- **Fix**: Add await, add try-catch











