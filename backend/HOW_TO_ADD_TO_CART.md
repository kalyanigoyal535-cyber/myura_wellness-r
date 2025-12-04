# 🛒 How to Add Items to Cart - Quick Guide

## 📋 Quick Summary

**Endpoint:** `POST /api/cart/items/`  
**URL:** `http://127.0.0.1:8000/api/cart/items/`

**Simple Request:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

---

## 🚀 3 Ways to Add Items

### 1️⃣ **Using JavaScript/TypeScript (Frontend)**

```typescript
// Simple function to add item to cart
const addToCart = async (productId: number, quantity: number = 1) => {
  const response = await fetch('http://127.0.0.1:8000/api/cart/items/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT: Needed for session cookies
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add item to cart');
  }

  const cart = await response.json();
  return cart;
};

// Usage Example:
// Add 2 units of product with ID 1
addToCart(1, 2)
  .then(cart => {
    console.log('Cart updated:', cart);
    console.log('Total items:', cart.total_items);
    console.log('Total amount:', cart.total_amount);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

### 2️⃣ **For Authenticated Users (with JWT Token)**

```typescript
const addToCartAuthenticated = async (productId: number, quantity: number = 1) => {
  const token = localStorage.getItem('access_token'); // Get JWT token

  const response = await fetch('http://127.0.0.1:8000/api/cart/items/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Add JWT token
    },
    credentials: 'include',
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity
    }),
  });

  const cart = await response.json();
  return cart;
};
```

### 3️⃣ **Using cURL (Testing in Terminal)**

#### Guest User (No Login):
```bash
curl -X POST http://127.0.0.1:8000/api/cart/items/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

#### Authenticated User:
```bash
curl -X POST http://127.0.0.1:8000/api/cart/items/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

---

## 📝 Step-by-Step Example

### Step 1: Get Cart (Optional)
```typescript
// Check your current cart
const getCart = async () => {
  const response = await fetch('http://127.0.0.1:8000/api/cart/', {
    credentials: 'include',
  });
  return await response.json();
};

const cart = await getCart();
console.log('Current cart:', cart);
// Output: { id: 1, items: [], total_items: 0, total_amount: "0.00" }
```

### Step 2: Add Product to Cart
```typescript
// Add product with ID 1, quantity 2
const result = await addToCart(1, 2);

console.log('Updated cart:', result);
// Output: {
//   id: 1,
//   items: [
//     {
//       id: 1,
//       product: { id: 1, name: "DIA CARE", price: "1190.00", ... },
//       quantity: 2,
//       subtotal: "2380.00"
//     }
//   ],
//   total_items: 2,
//   total_amount: "2380.00"
// }
```

### Step 3: Add More Items
```typescript
// Add another product
await addToCart(2, 1); // Product ID 2, quantity 1

// Add same product again (quantity will be added)
await addToCart(1, 1); // Product ID 1, now quantity becomes 3

const finalCart = await getCart();
console.log('Final cart total:', finalCart.total_items); // 4 items
```

---

## 🎯 Real Product IDs (Based on Your Database)

You can use these product IDs for testing:

- **ID: 1** - DIA CARE (₹1190.00)
- **ID: 2** - LIVER DETOX FORMULA (₹1320.00)
- **ID: 3** - WEIGHT LOSS FORMULA (₹1490.00)
- **ID: 4** - IMMUNE BOOST FORMULA (₹1240.00)
- **ID: 5** - SKIN GLOW FORMULA (₹1380.00)
- **ID: 6** - STRESS RELIEF FORMULA (₹1290.00)

**Note:** To see actual product IDs in your database, check the admin panel or API: `http://127.0.0.1:8000/api/products/`

---

## ✅ What Happens When You Add Items?

1. **If product NOT in cart** → Creates new cart item
2. **If product ALREADY in cart** → Adds quantity to existing item
3. **If product out of stock** → Returns error: `"Product is out of stock"`
4. **If product doesn't exist** → Returns error: `"Product not found"`
5. **Quantity limits** → Minimum: 1, Maximum: 99

---

## 🔍 Example Response After Adding Item

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
        "image_url": "http://127.0.0.1:8000/media/products/...",
        "rating": "5.00",
        "reviews": 128,
        "inStock": true
      },
      "quantity": 2,
      "subtotal": "2380.00"
    }
  ],
  "total_items": 2,
  "total_amount": "2380.00",
  "created_at": "2025-01-27T10:30:00Z",
  "updated_at": "2025-01-27T10:35:00Z"
}
```

---

## ❌ Error Handling

```typescript
try {
  const cart = await addToCart(1, 2);
  console.log('Success!', cart);
} catch (error) {
  if (error.message === 'Product is out of stock') {
    alert('Sorry, this product is currently out of stock.');
  } else if (error.message === 'Product not found') {
    alert('Product not found. Please refresh the page.');
  } else {
    alert('Failed to add item. Please try again.');
  }
}
```

---

## 💡 Complete React Hook Example

```typescript
import { useState } from 'react';

const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = async (productId: number, quantity: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }

      const cart = await response.json();
      return cart;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading, error };
};

// Usage in component:
const MyComponent = () => {
  const { addToCart, loading, error } = useCart();

  const handleAddToCart = async (productId: number) => {
    try {
      const cart = await addToCart(productId, 1);
      alert(`Added! Cart now has ${cart.total_items} items`);
    } catch (err) {
      alert(error || 'Failed to add item');
    }
  };

  return (
    <button 
      onClick={() => handleAddToCart(1)} 
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};
```

---

## 🧪 Quick Test in Browser Console

Open browser console (F12) on your site and run:

```javascript
// 1. Add item to cart
fetch('http://127.0.0.1:8000/api/cart/items/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ product_id: 1, quantity: 2 })
})
.then(r => r.json())
.then(cart => {
  console.log('✅ Cart:', cart);
  console.log('Total:', cart.total_items, 'items, ₹' + cart.total_amount);
})
.catch(err => console.error('❌ Error:', err));

// 2. Check cart
fetch('http://127.0.0.1:8000/api/cart/', {
  credentials: 'include'
})
.then(r => r.json())
.then(cart => console.log('🛒 Your cart:', cart));
```

---

## 🎉 That's It!

You now know how to add items to cart! The backend handles everything automatically:
- Creates cart if it doesn't exist
- Merges quantities if product already in cart
- Validates stock and quantities
- Returns updated cart with totals

**Need help?** Check `CART_API.md` for complete API documentation.

