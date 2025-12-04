# API Endpoints Reference - Myura Wellness

Complete list of all API endpoints ready for frontend-to-backend testing.

## Base URL
```
http://localhost:8000/api/
```

---

## 🔐 Authentication APIs

### 1. User Registration
- **Endpoint**: `POST /api/auth/register/`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password123",
    "password2": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890"
  }
  ```
- **Response**: `200 OK` with user data and tokens
- **Frontend Service**: `authApi.register()`

### 2. User Login
- **Endpoint**: `POST /api/auth/login/`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK` with user data and JWT tokens
- **Frontend Service**: `authApi.login()`

### 3. User Logout
- **Endpoint**: `POST /api/auth/logout/`
- **Auth Required**: Yes (JWT Token)
- **Request Body**: None
- **Response**: `200 OK`
- **Frontend Service**: `authApi.logout()`

### 4. Get User Profile
- **Endpoint**: `GET /api/auth/user/`
- **Auth Required**: Yes (JWT Token)
- **Response**: `200 OK` with user profile data
- **Frontend Service**: `authApi.getProfile()`

### 5. Update User Profile
- **Endpoint**: `PUT /api/auth/user/`
- **Auth Required**: Yes (JWT Token)
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890"
  }
  ```
- **Response**: `200 OK` with updated user data
- **Frontend Service**: `authApi.updateProfile()`

### 6. Refresh Token
- **Endpoint**: `POST /api/auth/token/refresh/`
- **Auth Required**: No (uses refresh token)
- **Request Body**:
  ```json
  {
    "refresh": "refresh_token_here"
  }
  ```
- **Response**: `200 OK` with new access token
- **Frontend Service**: `authApi.refreshToken()`

### 7. Request Password Reset
- **Endpoint**: `POST /api/auth/password/reset/`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: `200 OK` with success message (always returns success for security)
- **Frontend Service**: `authApi.requestPasswordReset()`
- **Note**: Sends password reset email if account exists. Always returns success message to prevent email enumeration.

### 8. Confirm Password Reset
- **Endpoint**: `POST /api/auth/password/reset/confirm/`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "uid": "base64_encoded_user_id",
    "token": "password_reset_token",
    "new_password": "newpassword123",
    "new_password2": "newpassword123"
  }
  ```
- **Response**: `200 OK` with success message
- **Frontend Service**: `authApi.confirmPasswordReset()`
- **Note**: Token expires after 24 hours. uid and token are provided in the reset email link.

---

## 📦 Product APIs

### 9. List All Products
- **Endpoint**: `GET /api/products/`
- **Auth Required**: No
- **Query Parameters**:
  - `category` - Filter by category ID (e.g., `dia-care`)
  - `categories` - Filter by multiple categories (comma-separated)
  - `in_stock` - Filter by stock status (`true`/`false`)
  - `min_price` - Minimum price filter
  - `max_price` - Maximum price filter
  - `min_rating` - Minimum rating filter
  - `max_rating` - Maximum rating filter
  - `search` - Search in name, headline, description
  - `ordering` - Sort by (`price`, `-price`, `rating`, `-rating`, `name`, etc.)
  - `page` - Page number for pagination
- **Example**: `GET /api/products/?category=dia-care&in_stock=true&ordering=-rating`
- **Response**: `200 OK` with paginated product list
- **Frontend Service**: `productsApi.getProducts()`

### 10. Get Product by ID
- **Endpoint**: `GET /api/products/{id}/`
- **Auth Required**: No
- **Example**: `GET /api/products/1/`
- **Response**: `200 OK` with product details
- **Frontend Service**: `productsApi.getProduct()`

### 11. Get Featured Products
- **Endpoint**: `GET /api/products/featured/`
- **Auth Required**: No
- **Response**: `200 OK` with array of featured products
- **Frontend Service**: `productsApi.getFeaturedProducts()`

### 12. Get Related Products
- **Endpoint**: `GET /api/products/related/?product_id={id}`
- **Auth Required**: No
- **Example**: `GET /api/products/related/?product_id=1`
- **Response**: `200 OK` with array of related products
- **Frontend Service**: `productsApi.getRelatedProducts()`

---

## 📂 Category APIs

### 13. List All Categories
- **Endpoint**: `GET /api/categories/`
- **Auth Required**: No
- **Response**: `200 OK` with array of all categories
- **Frontend Service**: `productsApi.getCategories()`

### 14. Get Category with Products
- **Endpoint**: `GET /api/categories/{id}/`
- **Auth Required**: No
- **Query Parameters**:
  - `in_stock` - Filter products by stock status
  - `search` - Search products in category
- **Example**: `GET /api/categories/dia-care/?in_stock=true`
- **Response**: `200 OK` with category details and products array
- **Frontend Service**: `productsApi.getCategory()`

---

## 🛒 Cart APIs

### 15. Get Cart
- **Endpoint**: `GET /api/cart/`
- **Auth Required**: No (uses session or JWT)
- **Response**: `200 OK` with cart data (creates cart if doesn't exist)
- **Frontend Service**: `cartApi.getCart()`

### 16. Add Item to Cart
- **Endpoint**: `POST /api/cart/items/`
- **Auth Required**: No (uses session or JWT)
- **Request Body**:
  ```json
  {
    "product_id": 1,
    "quantity": 2
  }
  ```
- **Response**: `200 OK` with updated cart data
- **Frontend Service**: `cartApi.addToCart()`

### 17. Update Cart Item
- **Endpoint**: `PUT /api/cart/items/{item_id}/`
- **Auth Required**: No (uses session or JWT)
- **Request Body**:
  ```json
  {
    "quantity": 3
  }
  ```
- **Response**: `200 OK` with updated cart data
- **Frontend Service**: `cartApi.updateCartItem()`

### 18. Remove Cart Item
- **Endpoint**: `DELETE /api/cart/items/{item_id}/`
- **Auth Required**: No (uses session or JWT)
- **Response**: `200 OK` with updated cart data
- **Frontend Service**: `cartApi.removeCartItem()`

### 19. Clear Cart
- **Endpoint**: `DELETE /api/cart/`
- **Auth Required**: No (uses session or JWT)
- **Response**: `204 No Content`
- **Frontend Service**: `cartApi.clearCart()`

### 20. Merge Guest Cart with User Cart
- **Endpoint**: `POST /api/cart/merge/`
- **Auth Required**: Yes (JWT Token)
- **Request Body**:
  ```json
  {
    "session_key": "optional_session_key"
  }
  ```
- **Response**: `200 OK` with merged cart data
- **Frontend Service**: `cartApi.mergeCart()`

---

## 📋 Order APIs

### 21. List User Orders
- **Endpoint**: `GET /api/orders/`
- **Auth Required**: Yes (JWT Token)
- **Response**: `200 OK` with paginated list of user's orders
- **Frontend Service**: Not yet implemented (use `apiClient.get('/orders/')`)

### 22. Get Order by ID
- **Endpoint**: `GET /api/orders/{id}/`
- **Auth Required**: Yes (JWT Token)
- **Response**: `200 OK` with order details
- **Frontend Service**: Not yet implemented (use `apiClient.get('/orders/{id}/')`)

### 23. Create Order
- **Endpoint**: `POST /api/orders/create/`
- **Auth Required**: Yes (JWT Token)
- **Request Body**:
  ```json
  {
    "shipping_address_id": 1,
    "billing_address_id": 2,
    "payment_method": "razorpay",
    "payment_status": "pending"
  }
  ```
  OR with inline address:
  ```json
  {
    "shipping_address": {
      "full_name": "John Doe",
      "phone_number": "+1234567890",
      "address_line_1": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postal_code": "400001",
      "country": "India"
    },
    "payment_method": "razorpay",
    "payment_status": "paid"
  }
  ```
- **Response**: `201 Created` with order data
- **Frontend Service**: Not yet implemented (use `apiClient.post('/orders/create/', data)`)

### 24. Cancel Order
- **Endpoint**: `POST /api/orders/{id}/cancel/`
- **Auth Required**: Yes (JWT Token)
- **Response**: `200 OK` with cancelled order data
- **Note**: Only pending orders can be cancelled
- **Frontend Service**: Not yet implemented (use `apiClient.post('/orders/{id}/cancel/')`)

---

## 📍 Address APIs

### 25. List User Addresses
- **Endpoint**: `GET /api/addresses/`
- **Auth Required**: Yes (JWT Token)
- **Response**: `200 OK` with array of user's addresses
- **Frontend Service**: Not yet implemented (use `apiClient.get('/addresses/')`)

### 26. Create Address
- **Endpoint**: `POST /api/addresses/`
- **Auth Required**: Yes (JWT Token)
- **Request Body**:
  ```json
  {
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "address_type": "home",
    "is_default": true
  }
  ```
- **Response**: `201 Created` with address data
- **Frontend Service**: Not yet implemented (use `apiClient.post('/addresses/', data)`)

### 27. Get Address by ID
- **Endpoint**: `GET /api/addresses/{id}/`
- **Auth Required**: Yes (JWT Token)
- **Response**: `200 OK` with address details
- **Frontend Service**: Not yet implemented (use `apiClient.get('/addresses/{id}/')`)

### 28. Update Address
- **Endpoint**: `PUT /api/addresses/{id}/`
- **Auth Required**: Yes (JWT Token)
- **Request Body**: Same as create
- **Response**: `200 OK` with updated address data
- **Frontend Service**: Not yet implemented (use `apiClient.put('/addresses/{id}/', data)`)

### 29. Delete Address
- **Endpoint**: `DELETE /api/addresses/{id}/`
- **Auth Required**: Yes (JWT Token)
- **Response**: `204 No Content`
- **Frontend Service**: Not yet implemented (use `apiClient.delete('/addresses/{id}/')`)

### 30. Set Default Address
- **Endpoint**: `POST /api/addresses/{id}/set-default/`
- **Auth Required**: Yes (JWT Token)
- **Response**: `200 OK` with updated address data
- **Frontend Service**: Not yet implemented (use `apiClient.post('/addresses/{id}/set-default/')`)

---

## 📧 Contact APIs

### 31. Submit Contact Form
- **Endpoint**: `POST /api/contact/`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "subject": "Product Questions & Advice",
    "message": "I have a question about..."
  }
  ```
- **Response**: `201 Created` with submission confirmation
- **Frontend Service**: `contactApi.submitContact()`

---

## 🔑 Authentication Headers

For authenticated endpoints, include JWT token in headers:
```
Authorization: Bearer {access_token}
```

---

## 📊 Response Formats

### Success Response
```json
{
  "id": 1,
  "name": "Product Name",
  ...
}
```

### Error Response
```json
{
  "error": "Error message",
  "detail": "Detailed error information"
}
```

### Paginated Response
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## ✅ Testing Checklist

### Authentication (8 endpoints)
- [ ] User Registration
- [ ] User Login
- [ ] User Logout
- [ ] Get User Profile
- [ ] Update User Profile
- [ ] Refresh Token
- [ ] Request Password Reset
- [ ] Confirm Password Reset

### Products (4 endpoints)
- [ ] List Products (with filters)
- [ ] Get Product by ID
- [ ] Get Featured Products
- [ ] Get Related Products

### Categories (2 endpoints)
- [ ] List Categories
- [ ] Get Category with Products

### Cart (6 endpoints)
- [ ] Get Cart
- [ ] Add Item to Cart
- [ ] Update Cart Item
- [ ] Remove Cart Item
- [ ] Clear Cart
- [ ] Merge Cart

### Orders (4 endpoints)
- [ ] List Orders
- [ ] Get Order by ID
- [ ] Create Order
- [ ] Cancel Order

### Addresses (6 endpoints)
- [ ] List Addresses
- [ ] Create Address
- [ ] Get Address by ID
- [ ] Update Address
- [ ] Delete Address
- [ ] Set Default Address

### Contact (1 endpoint)
- [ ] Submit Contact Form

**Total: 30 API Endpoints**

---

## 🚀 Quick Test Examples

### Using cURL

```bash
# Get all products
curl http://localhost:8000/api/products/

# Get product by ID
curl http://localhost:8000/api/products/1/

# Get cart
curl http://localhost:8000/api/cart/

# Add to cart
curl -X POST http://localhost:8000/api/cart/items/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Get user profile (with token)
curl http://localhost:8000/api/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Frontend Services

```typescript
import { productsApi, cartApi, authApi } from './services';

// Get products
const products = await productsApi.getProducts({ category: 'dia-care' });

// Add to cart
await cartApi.addToCart(1, 2);

// Login
await authApi.login({ email: 'user@example.com', password: 'password123' });
```

---

## 📝 Notes

1. **CORS**: Make sure CORS is configured in Django settings for frontend domain
2. **CSRF**: CSRF protection is disabled for API endpoints (using JWT)
3. **Session**: Cart uses session keys for guest users, JWT tokens for authenticated users
4. **Pagination**: Product list endpoints support pagination
5. **Filtering**: Most list endpoints support extensive filtering and search
6. **Error Handling**: All endpoints return consistent error formats

---

**Last Updated**: After password reset integration
**Total Endpoints**: 30
**Frontend Services Implemented**: 20 (including password reset)
**Frontend Services Pending**: 10 (Orders & Addresses)

