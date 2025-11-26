# 🛒 Cart API Documentation

## Base URL
```
http://127.0.0.1:8000/api/cart/
```

## ⚡ Quick Start: Add Item to Cart

**Want to add items?** Check out **[HOW_TO_ADD_TO_CART.md](./HOW_TO_ADD_TO_CART.md)** for step-by-step guide!

**Quick example:**
```typescript
fetch('http://127.0.0.1:8000/api/cart/items/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ product_id: 1, quantity: 2 })
})
.then(r => r.json())
.then(cart => console.log('Cart:', cart));
```

---

## 🎯 Cart Features

✅ **Guest Cart Support** - Works without login (uses session)  
✅ **User Cart Support** - Persists cart for logged-in users  
✅ **Cart Merging** - Merges guest cart with user cart after login  
✅ **Real-time Updates** - Cart syncs with backend  

---

## 📝 Cart Endpoints

### 1. Get Cart

**Endpoint:** `GET /api/cart/`

**Description:** Get current user's cart (creates if doesn't exist)

**How It Works:**

When you call `GET /api/cart/`, the backend automatically:

1. **Checks if user is logged in:**
   - ✅ **Authenticated:** Looks for cart linked to `user`
   - ❌ **Guest:** Looks for cart linked to `session_key`

2. **If cart exists:** Returns it immediately

3. **If cart doesn't exist:** 
   - ✅ **Automatically creates** a new empty cart
   - ✅ **Links it** to the user (or session for guests)
   - ✅ **Returns** the empty cart with `items: []`

**Technical Implementation:**
```python
# Backend uses Django's get_or_create() method
cart, created = Cart.objects.get_or_create(
    user=request.user,  # For authenticated users
    session_key=session_key,  # For guest users
    defaults={...}  # Values used when creating new cart
)
```

**You never get a 404 error!** The cart is always returned (empty if new).

**Headers:**
- **Authenticated:** `Authorization: Bearer {access_token}` (optional)
- **Guest:** No headers needed (uses session)

**Response (200 OK):**
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "DIA CARE",
        "price": "1190.00",
        "originalPrice": "1499.00",
        "image_url": "...",
        ...
      },
      "quantity": 2,
      "subtotal": "2380.00"
    }
  ],
  "total_items": 2,
  "total_amount": "2380.00",
  "created_at": "2025-01-27T...",
  "updated_at": "2025-01-27T..."
}
```

**Empty Cart Response (Auto-Created):**
```json
{
  "id": 1,
  "items": [],
  "total_items": 0,
  "total_amount": "0.00",
  "created_at": "2025-01-27T...",
  "updated_at": "2025-01-27T..."
}
```

**Step-by-Step Flow:**

**Scenario 1: First-time Guest User**
```
1. Guest visits site → No cart exists yet
2. Frontend calls: GET /api/cart/
3. Backend checks: No cart for this session_key
4. Backend creates: New empty cart automatically
5. Backend returns: Empty cart (id: 1, items: [])
```

**Scenario 2: Returning Guest User**
```
1. Guest adds items → Cart exists (id: 1)
2. Guest refreshes page → Frontend calls: GET /api/cart/
3. Backend checks: Cart exists for this session_key
4. Backend returns: Existing cart with items
```

**Scenario 3: User Logs In**
```
1. Guest has cart → Cart linked to session_key
2. User logs in → Gets access token
3. Frontend calls: GET /api/cart/ (with token)
4. Backend checks: No cart for this user yet
5. Backend creates: New empty cart for user
6. Frontend should call: POST /api/cart/merge/ to merge guest cart
```

**Scenario 4: Returning Authenticated User**
```
1. User logged in → Has cart (id: 5) linked to user
2. User visits next day → Frontend calls: GET /api/cart/ (with token)
3. Backend checks: Cart exists for this user
4. Backend returns: User's existing cart with all items
```

---

### 2. Add Item to Cart

**Endpoint:** `POST /api/cart/items/`

**Description:** Add product to cart (or update quantity if exists)

**Headers:**
- **Authenticated:** `Authorization: Bearer {access_token}` (optional)
- **Guest:** No headers needed

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response (200 OK):**
Returns full cart with updated items:
```json
{
  "id": 1,
  "items": [...],
  "total_items": 2,
  "total_amount": "2380.00",
  ...
}
```

**Error Responses:**

**Product not found (404):**
```json
{
  "error": "Product not found"
}
```

**Out of stock (400):**
```json
{
  "error": "Product is out of stock"
}
```

**Missing product_id (400):**
```json
{
  "error": "product_id is required"
}
```

**Behavior:**
- If product already in cart → adds quantity to existing
- If product not in cart → creates new cart item
- Maximum quantity per item: 99

---

### 3. Update Cart Item Quantity

**Endpoint:** `PUT /api/cart/items/{item_id}/`

**Description:** Update quantity of specific cart item

**Headers:**
- **Authenticated:** `Authorization: Bearer {access_token}` (optional)
- **Guest:** No headers needed

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response (200 OK):**
Returns full updated cart

**Error Responses:**

**Invalid quantity (400):**
```json
{
  "error": "Quantity must be at least 1"
}
```
or
```json
{
  "error": "Quantity cannot exceed 99"
}
```

**Item not found (404):**
```json
{
  "error": "Cart item not found"
}
```

---

### 4. Remove Item from Cart

**Endpoint:** `DELETE /api/cart/items/{item_id}/`

**Description:** Remove specific item from cart

**Headers:**
- **Authenticated:** `Authorization: Bearer {access_token}` (optional)
- **Guest:** No headers needed

**Response (200 OK):**
Returns updated cart without deleted item

**Error Response (404):**
```json
{
  "error": "Cart item not found"
}
```

---

### 5. Clear Cart

**Endpoint:** `DELETE /api/cart/`

**Description:** Remove all items from cart

**Headers:**
- **Authenticated:** `Authorization: Bearer {access_token}` (optional)
- **Guest:** No headers needed

**Response (200 OK):**
```json
{
  "message": "Cart cleared successfully"
}
```

---

### 6. Merge Cart (After Login)

**Endpoint:** `POST /api/cart/merge/`

**Description:** Merge guest cart with user cart after login

**Headers Required:**
```
Authorization: Bearer {access_token}
```

**Request Body (Optional):**
```json
{
  "session_key": "guest_session_key"
}
```

If `session_key` not provided, uses current session.

**Response (200 OK):**
```json
{
  "message": "Cart merged successfully",
  "cart": {
    "id": 1,
    "items": [...],
    "total_items": 3,
    "total_amount": "3570.00",
    ...
  }
}
```

**Behavior:**
- Merges items from guest cart into user cart
- If same product exists in both, quantities are added (max 99)
- Deletes guest cart after merging
- Returns merged user cart

---

## 🔄 Cart Workflow

### Guest User Flow:
1. User browses as guest → Cart stored by session
2. User adds items → `POST /api/cart/items/`
3. Cart persists across page refreshes (session-based)
4. User logs in → Call `POST /api/cart/merge/`
5. Guest cart merged with user cart

### Authenticated User Flow:
1. User logs in → Gets their persistent cart
2. User adds items → `POST /api/cart/items/`
3. Cart persists in database linked to user
4. Cart available across devices (when logged in)

---

## 💡 Usage Examples

### Add Item to Cart (Guest)
```typescript
const addToCart = async (productId, quantity = 1) => {
  const response = await fetch('http://127.0.0.1:8000/api/cart/items/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for session cookies
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity
    }),
  });
  
  return await response.json();
};
```

### Get Cart (Authenticated)
```typescript
const getCart = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/cart/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });
  
  return await response.json();
  // Always returns a cart - never null/undefined!
  // If cart doesn't exist, returns empty cart with items: []
};
```

### Get Cart (Guest - Even Simpler!)
```typescript
const getCart = async () => {
  // No token needed for guests!
  const response = await fetch('http://127.0.0.1:8000/api/cart/', {
    credentials: 'include', // Important for session cookies
  });
  
  const cart = await response.json();
  // Cart is always returned - empty if first visit, full if items added
  
  return cart;
};
```

### Update Cart Item
```typescript
const updateCartItem = async (itemId, quantity) => {
  const response = await fetch(`http://127.0.0.1:8000/api/cart/items/${itemId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ quantity }),
  });
  
  return await response.json();
};
```

### Remove Cart Item
```typescript
const removeCartItem = async (itemId) => {
  const response = await fetch(`http://127.0.0.1:8000/api/cart/items/${itemId}/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  return await response.json();
};
```

### Merge Cart After Login
```typescript
const mergeCart = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/cart/merge/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  return await response.json();
};
```

---

## 🔑 Important Notes

### Session Support
- **Guest carts** use Django sessions
- Make sure to include `credentials: 'include'` in fetch requests
- Session cookie is automatically handled by Django

### Cart Persistence
- **Guest carts:** Persist during session (browser session)
- **User carts:** Persist in database (permanent)
- **After login:** Merge guest cart → user cart (no data loss)

### Quantity Limits
- Minimum: 1 item
- Maximum: 99 items per product
- API validates quantities automatically

### Stock Check
- API checks if product is `in_stock` before adding
- Out of stock products cannot be added to cart

---

## 🧪 Testing

### Test as Guest:
1. **Get cart:** `GET /api/cart/`
2. **Add item:** `POST /api/cart/items/` with `{"product_id": 1, "quantity": 2}`
3. **Check cart:** `GET /api/cart/` (should show added items)

### Test as Authenticated User:
1. **Login:** `POST /api/auth/login/` to get token
2. **Get cart:** `GET /api/cart/` with `Authorization: Bearer {token}`
3. **Add item:** `POST /api/cart/items/` with token
4. **Check cart:** Should persist across requests

### Test Cart Merge:
1. **As guest:** Add items to cart
2. **Login:** Get access token
3. **Merge:** `POST /api/cart/merge/` with token
4. **Check:** User cart should contain merged items

---

## ✅ Features Implemented

- ✅ Get cart (guest & authenticated)
- ✅ Add item to cart
- ✅ Update item quantity
- ✅ Remove item from cart
- ✅ Clear entire cart
- ✅ Merge guest cart with user cart
- ✅ Session-based guest carts
- ✅ Database-persisted user carts
- ✅ Stock validation
- ✅ Quantity limits (1-99)
- ✅ Automatic quantity addition if item exists

---

**Cart API is ready to use!** 🛒

