# 📦 Order API Documentation

## Base URL
```
http://127.0.0.1:8000/api/orders/
```

---

## 🎯 Order Features

✅ **Create Order from Cart** - Convert cart items into an order  
✅ **Order History** - View all past orders  
✅ **Order Details** - Get detailed information about specific orders  
✅ **Order Cancellation** - Cancel pending orders  
✅ **Address Management** - Use saved addresses or provide new one  

---

## 📝 Order Endpoints

### 1. Create Order from Cart

**Endpoint:** `POST /api/orders/create/`

**Description:** Creates an order from the current user's cart. Cart is cleared after order creation.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body (New Address):**
```json
{
  "shipping_address": {
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "address_line_1": "123 Main Street",
    "address_line_2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001",
    "country": "India"
  },
  "payment_method": "razorpay",
  "payment_id": "pay_xyz123",
  "payment_status": "paid"
}
```

**Request Body (Using Saved Address):**
```json
{
  "shipping_address_id": 1,
  "payment_method": "razorpay",
  "payment_id": "pay_xyz123",
  "payment_status": "paid"
}
```

**Response (201 Created):**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "order_number": "MYU12345678",
    "user": 1,
    "user_email": "user@example.com",
    "status": "pending",
    "total_amount": "3570.00",
    "shipping_address": {
      "full_name": "John Doe",
      "phone_number": "+1234567890",
      "address_line_1": "123 Main Street",
      "address_line_2": "Apt 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postal_code": "400001",
      "country": "India"
    },
    "payment_status": "paid",
    "payment_method": "razorpay",
    "payment_id": "pay_xyz123",
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "DIA CARE",
          "price": "1190.00",
          ...
        },
        "quantity": 2,
        "price": "1190.00",
        "subtotal": "2380.00"
      },
      {
        "id": 2,
        "product": {
          "id": 2,
          "name": "LIVER DETOX FORMULA",
          ...
        },
        "quantity": 1,
        "price": "1320.00",
        "subtotal": "1320.00"
      }
    ],
    "created_at": "2025-01-27T10:30:00Z",
    "updated_at": "2025-01-27T10:30:00Z"
  }
}
```

**Error Responses:**

**Empty Cart (400):**
```json
{
  "error": "Cart is empty. Add items to cart before creating order."
}
```

**Cart Not Found (400):**
```json
{
  "error": "Cart not found. Add items to cart before creating order."
}
```

**Out of Stock Product (400):**
```json
{
  "error": "Product \"DIA CARE\" is out of stock."
}
```

**Address Not Found (404):**
```json
{
  "error": "Address not found."
}
```

**Missing Address (400):**
```json
{
  "error": "Either shipping_address or shipping_address_id is required."
}
```

---

### 2. List User Orders

**Endpoint:** `GET /api/orders/`

**Description:** Get all orders for the authenticated user.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "order_number": "MYU12345678",
    "status": "pending",
    "total_amount": "3570.00",
    "payment_status": "paid",
    "created_at": "2025-01-27T10:30:00Z",
    ...
  },
  {
    "id": 2,
    "order_number": "MYU87654321",
    "status": "delivered",
    "total_amount": "1190.00",
    "payment_status": "paid",
    "created_at": "2025-01-26T14:20:00Z",
    ...
  }
]
```

**Empty Response:**
```json
[]
```

---

### 3. Get Order Details

**Endpoint:** `GET /api/orders/{id}/`

**Description:** Get detailed information about a specific order.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "order_number": "MYU12345678",
  "user": 1,
  "user_email": "user@example.com",
  "status": "pending",
  "total_amount": "3570.00",
  "shipping_address": {
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "address_line_1": "123 Main Street",
    ...
  },
  "payment_status": "paid",
  "payment_method": "razorpay",
  "payment_id": "pay_xyz123",
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "DIA CARE",
        "price": "1190.00",
        ...
      },
      "quantity": 2,
      "price": "1190.00",
      "subtotal": "2380.00"
    }
  ],
  "created_at": "2025-01-27T10:30:00Z",
  "updated_at": "2025-01-27T10:30:00Z"
}
```

**Error Response (404):**
```json
{
  "detail": "Not found."
}
```

---

### 4. Cancel Order

**Endpoint:** `POST /api/orders/{id}/cancel/`

**Description:** Cancel a pending order. Only pending orders can be cancelled.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "id": 1,
    "order_number": "MYU12345678",
    "status": "cancelled",
    "payment_status": "refunded",
    ...
  }
}
```

**Error Response - Order Not Pending (400):**
```json
{
  "error": "Cannot cancel order with status: processing. Only pending orders can be cancelled."
}
```

---

## 💡 Usage Examples

### Create Order (JavaScript/TypeScript)

```typescript
const createOrder = async (shippingAddress, paymentDetails) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/orders/create/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shipping_address: shippingAddress,
      payment_method: paymentDetails.method,
      payment_id: paymentDetails.id,
      payment_status: paymentDetails.status,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }
  
  return await response.json();
};

// Usage:
const shippingAddress = {
  full_name: "John Doe",
  phone_number: "+1234567890",
  address_line_1: "123 Main Street",
  city: "Mumbai",
  state: "Maharashtra",
  postal_code: "400001",
  country: "India"
};

const paymentDetails = {
  method: "razorpay",
  id: "pay_xyz123",
  status: "paid"
};

createOrder(shippingAddress, paymentDetails)
  .then(result => {
    console.log('Order created:', result.order.order_number);
    console.log('Order ID:', result.order.id);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

### Create Order with Saved Address

```typescript
const createOrderWithSavedAddress = async (addressId, paymentDetails) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/orders/create/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shipping_address_id: addressId,
      payment_method: paymentDetails.method,
      payment_id: paymentDetails.id,
      payment_status: paymentDetails.status,
    }),
  });
  
  return await response.json();
};
```

### List Orders

```typescript
const getOrders = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/orders/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};
```

### Get Order Details

```typescript
const getOrderDetails = async (orderId) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};
```

### Cancel Order

```typescript
const cancelOrder = async (orderId) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/cancel/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};
```

---

## 🔄 Order Workflow

1. **User adds items to cart** → `POST /api/cart/items/`
2. **User goes to checkout** → `GET /api/cart/` (to review)
3. **User selects/enters shipping address**
4. **User completes payment** (via payment gateway)
5. **Frontend creates order** → `POST /api/orders/create/`
6. **Cart is automatically cleared**
7. **Order is created with status "pending"**
8. **Admin updates order status** (processing → shipped → delivered)

---

## 📊 Order Statuses

- **pending** - Order placed, awaiting processing
- **processing** - Order being prepared
- **shipped** - Order shipped, in transit
- **delivered** - Order delivered to customer
- **cancelled** - Order cancelled

## 💳 Payment Statuses

- **pending** - Payment not yet received
- **paid** - Payment completed
- **failed** - Payment failed
- **refunded** - Payment refunded

---

## 🔑 Important Notes

### Order Creation
- **Cart is cleared** automatically after order creation
- **Order number** is auto-generated (format: `MYU` + 8 random characters)
- **Product prices** are stored at time of order (won't change if product price updates)
- **Cart validation** - Checks that cart exists, has items, and all items are in stock

### Order Cancellation
- Only **pending** orders can be cancelled
- Payment status is automatically updated:
  - If paid → becomes "refunded"
  - If pending → becomes "failed"

### Address Options
- **Option 1:** Provide full address in `shipping_address` object
- **Option 2:** Use saved address with `shipping_address_id`

---

## ✅ Features Implemented

- ✅ Create order from cart
- ✅ List user orders
- ✅ Get order details
- ✅ Cancel pending orders
- ✅ Automatic cart clearing
- ✅ Stock validation
- ✅ Address validation
- ✅ Order number generation
- ✅ Price snapshot (stores price at order time)

---

**Order API is ready to use!** 📦

