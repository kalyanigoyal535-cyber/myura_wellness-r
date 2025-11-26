# 🚀 Myura Wellness - Complete API Summary

## 📋 All Available APIs

This document provides a quick overview of all available API endpoints in the Myura Wellness backend.

---

## 🌐 Base URL
```
http://127.0.0.1:8000/api/
```

---

## 📚 API Categories

### 1. 🔐 Authentication API
**Documentation:** [AUTHENTICATION_API.md](./AUTHENTICATION_API.md)

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (JWT tokens)
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/user/` - Get current user profile
- `PUT /api/auth/user/` - Update user profile

---

### 2. 🛍️ Product API
**Documentation:** Check Product endpoints in router

- `GET /api/products/` - List all products (with filters, search, pagination)
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/related/?product_id={id}` - Get related products
- `GET /api/categories/` - List all categories
- `GET /api/categories/{id}/` - Get category with products

**Filters:**
- `?category={id}` - Filter by category
- `?in_stock={true/false}` - Filter by stock status
- `?min_price={amount}&max_price={amount}` - Price range
- `?min_rating={rating}&max_rating={rating}` - Rating range
- `?on_sale={true/false}` - Filter by sale status
- `?search={keyword}` - Search products
- `?ordering={field}` - Sort results

---

### 3. 🛒 Cart API
**Documentation:** [CART_API.md](./CART_API.md) | [HOW_TO_ADD_TO_CART.md](./HOW_TO_ADD_TO_CART.md)

- `GET /api/cart/` - Get current cart (auto-creates if doesn't exist)
- `POST /api/cart/items/` - Add item to cart
- `PUT /api/cart/items/{id}/` - Update cart item quantity
- `DELETE /api/cart/items/{id}/` - Remove item from cart
- `DELETE /api/cart/` - Clear entire cart
- `POST /api/cart/merge/` - Merge guest cart with user cart

**Features:**
- Works for guests (session-based)
- Works for authenticated users
- Automatic cart creation
- Stock validation

---

### 4. 📦 Order API
**Documentation:** [ORDER_API.md](./ORDER_API.md)

- `POST /api/orders/create/` - Create order from cart
- `GET /api/orders/` - List user orders
- `GET /api/orders/{id}/` - Get order details
- `POST /api/orders/{id}/cancel/` - Cancel pending order

**Features:**
- Create order from cart
- Automatic cart clearing
- Address validation
- Stock validation
- Order status tracking
- Payment status tracking

---

### 5. 📍 Address Management API
**Documentation:** [ADDRESS_API.md](./ADDRESS_API.md)

- `GET /api/addresses/` - List user addresses
- `POST /api/addresses/` - Create new address
- `GET /api/addresses/{id}/` - Get address details
- `PUT /api/addresses/{id}/` - Update address
- `PATCH /api/addresses/{id}/` - Partial update address
- `DELETE /api/addresses/{id}/` - Delete address
- `POST /api/addresses/{id}/set-default/` - Set as default address

**Features:**
- Default address management
- Address types (home/work/other)
- User-specific addresses

---

### 6. 📧 Contact Form API
**Documentation:** [CONTACT_API.md](./CONTACT_API.md)

- `POST /api/contact/` - Submit contact form

**Features:**
- Public endpoint (no authentication)
- Message tracking (read/unread)
- Admin panel integration

---

## 🔄 Typical User Workflow

### 1. Browse Products (Guest or Authenticated)
```
GET /api/products/
GET /api/products/{id}/
GET /api/categories/
```

### 2. Add to Cart
```
POST /api/cart/items/
Body: { "product_id": 1, "quantity": 2 }
```

### 3. View Cart
```
GET /api/cart/
```

### 4. Manage Addresses (Authenticated)
```
GET /api/addresses/
POST /api/addresses/
POST /api/addresses/{id}/set-default/
```

### 5. Create Order (Authenticated)
```
POST /api/orders/create/
Body: {
  "shipping_address_id": 1,
  "payment_method": "razorpay",
  "payment_id": "pay_xyz123",
  "payment_status": "paid"
}
```

### 6. View Orders (Authenticated)
```
GET /api/orders/
GET /api/orders/{id}/
```

### 7. Cancel Order (Authenticated)
```
POST /api/orders/{id}/cancel/
```

---

## 🔐 Authentication

Most endpoints require JWT authentication:

```typescript
const token = localStorage.getItem('access_token');

fetch('http://127.0.0.1:8000/api/endpoint/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

**Public Endpoints** (No auth required):
- `GET /api/products/`
- `GET /api/categories/`
- `POST /api/cart/items/` (works for guests)
- `POST /api/contact/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`

---

## 📊 Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### List Response (Paginated)
```json
{
  "count": 100,
  "next": "http://127.0.0.1:8000/api/products/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

---

## 🧪 Testing

### Quick Test with cURL

**Get Products:**
```bash
curl http://127.0.0.1:8000/api/products/
```

**Login:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Add to Cart (Guest):**
```bash
curl -X POST http://127.0.0.1:8000/api/cart/items/ \
  -H "Content-Type: application/json" \
  -b cookies.txt -c cookies.txt \
  -d '{"product_id":1,"quantity":2}'
```

---

## ✅ Completed Features

- ✅ User authentication (JWT)
- ✅ Product catalog (filtering, search, pagination)
- ✅ Category management
- ✅ Shopping cart (guest & authenticated)
- ✅ Order management
- ✅ Address management
- ✅ Contact form submissions
- ✅ Admin panel integration

---

## 📚 Documentation Files

- [AUTHENTICATION_API.md](./AUTHENTICATION_API.md) - Auth endpoints
- [CART_API.md](./CART_API.md) - Cart endpoints
- [HOW_TO_ADD_TO_CART.md](./HOW_TO_ADD_TO_CART.md) - Quick cart guide
- [ORDER_API.md](./ORDER_API.md) - Order endpoints
- [ADDRESS_API.md](./ADDRESS_API.md) - Address endpoints
- [CONTACT_API.md](./CONTACT_API.md) - Contact form endpoint

---

## 🎉 All APIs Ready!

The backend is fully functional and ready for frontend integration!

