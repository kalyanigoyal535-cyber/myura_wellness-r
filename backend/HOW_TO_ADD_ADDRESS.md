# 📍 How to Add/Post New Address - Quick Guide

## ⚡ Quick Summary

**Endpoint:** `POST /api/addresses/`  
**URL:** `http://127.0.0.1:8000/api/addresses/`

**Required:** JWT Authentication Token

**Simple Request:**
```json
{
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "address_line_1": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postal_code": "400001"
}
```

---

## 🚀 Step-by-Step Guide

### Step 1: Get Your JWT Token

First, you need to be logged in and have your access token:

```typescript
// After login, store token
const token = localStorage.getItem('access_token');
```

### Step 2: Prepare Address Data

Create an object with address fields:

```typescript
const addressData = {
  address_type: "home",        // Optional: "home" | "work" | "other" (default: "home")
  full_name: "John Doe",
  phone_number: "+1234567890",
  address_line_1: "123 Main Street",
  address_line_2: "Apt 4B",    // Optional
  city: "Mumbai",
  state: "Maharashtra",
  postal_code: "400001",
  country: "India",            // Optional (defaults to "India")
  is_default: true             // Optional (defaults to false)
};
```

### Step 3: POST the Address

```typescript
const response = await fetch('http://127.0.0.1:8000/api/addresses/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(addressData),
});

const newAddress = await response.json();
console.log('Address created:', newAddress);
```

---

## 📝 Complete Examples

### Example 1: JavaScript/TypeScript Function

```typescript
const createAddress = async (addressData) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('You must be logged in to add an address');
  }

  const response = await fetch('http://127.0.0.1:8000/api/addresses/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addressData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create address');
  }

  return await response.json();
};

// Usage:
const address = {
  full_name: "John Doe",
  phone_number: "+1234567890",
  address_line_1: "123 Main Street",
  address_line_2: "Apt 4B",
  city: "Mumbai",
  state: "Maharashtra",
  postal_code: "400001",
  country: "India",
  is_default: true
};

createAddress(address)
  .then(newAddress => {
    console.log('✅ Address created:', newAddress.id);
    console.log('Address:', newAddress);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });
```

### Example 2: React Hook

```typescript
import { useState } from 'react';

const useAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAddress = async (addressData: {
    address_type?: string;
    full_name: string;
    phone_number: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
    is_default?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('You must be logged in');
      }

      const response = await fetch('http://127.0.0.1:8000/api/addresses/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create address');
      }

      const newAddress = await response.json();
      return newAddress;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAddress, loading, error };
};

// Usage in component:
const AddressForm = () => {
  const { createAddress, loading, error } = useAddress();
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAddress = await createAddress(formData);
      alert(`Address created! ID: ${newAddress.id}`);
      // Reset form or redirect
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
        required
      />
      {/* Other form fields... */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Add Address'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

### Example 3: Using cURL (Terminal Testing)

```bash
# First, get your access token (from login)
TOKEN="your_access_token_here"

# Create address
curl -X POST http://127.0.0.1:8000/api/addresses/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address_type": "home",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "address_line_1": "123 Main Street",
    "address_line_2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001",
    "country": "India",
    "is_default": true
  }'
```

### Example 4: Minimal Example (Only Required Fields)

```typescript
const minimalAddress = {
  full_name: "John Doe",
  phone_number: "+1234567890",
  address_line_1: "123 Main Street",
  city: "Mumbai",
  state: "Maharashtra",
  postal_code: "400001"
};

// All other fields are optional and have defaults:
// - address_type: defaults to "home"
// - address_line_2: optional
// - country: defaults to "India"
// - is_default: defaults to false
```

---

## 📋 Required vs Optional Fields

### ✅ Required Fields:
- `full_name` - Full name of the recipient
- `phone_number` - Contact phone number
- `address_line_1` - Primary address line
- `city` - City name
- `state` - State/Province
- `postal_code` - ZIP/Postal code

### ⚪ Optional Fields:
- `address_type` - "home" | "work" | "other" (default: "home")
- `address_line_2` - Secondary address line (apartment, floor, etc.)
- `country` - Country name (default: "India")
- `is_default` - Boolean (default: false)

**Note:** If you set `is_default: true`, all other addresses for this user will automatically be set to `is_default: false`.

---

## ✅ Example Response

After successful POST, you'll receive:

```json
{
  "id": 1,
  "address_type": "home",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "address_line_1": "123 Main Street",
  "address_line_2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postal_code": "400001",
  "country": "India",
  "is_default": true,
  "created_at": "2025-01-27T10:00:00Z"
}
```

---

## ❌ Error Handling

### Error: Not Authenticated (401)
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Solution:** Make sure you're logged in and include the JWT token in headers.

### Error: Validation Failed (400)
```json
{
  "full_name": ["This field is required."],
  "city": ["This field is required."]
}
```

**Solution:** Make sure all required fields are provided.

---

## 🧪 Quick Test in Browser Console

Open browser console (F12) and run:

```javascript
// 1. Make sure you're logged in and have token
const token = localStorage.getItem('access_token');
console.log('Token:', token ? 'Found' : 'Not found - Login first!');

// 2. Create address
fetch('http://127.0.0.1:8000/api/addresses/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    full_name: "John Doe",
    phone_number: "+1234567890",
    address_line_1: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400001",
    is_default: true
  })
})
.then(r => r.json())
.then(address => {
  console.log('✅ Address created:', address);
  console.log('Address ID:', address.id);
})
.catch(err => console.error('❌ Error:', err));
```

---

## 💡 Common Use Cases

### 1. Add Home Address
```typescript
const homeAddress = {
  address_type: "home",
  full_name: "John Doe",
  phone_number: "+1234567890",
  address_line_1: "123 Main Street",
  city: "Mumbai",
  state: "Maharashtra",
  postal_code: "400001",
  is_default: true
};
```

### 2. Add Work Address
```typescript
const workAddress = {
  address_type: "work",
  full_name: "John Doe",
  phone_number: "+1234567890",
  address_line_1: "456 Office Park",
  address_line_2: "Suite 100",
  city: "Mumbai",
  state: "Maharashtra",
  postal_code: "400002",
  is_default: false
};
```

### 3. Add Address from Form Data
```typescript
// Get form data from HTML form
const form = document.getElementById('addressForm');
const formData = new FormData(form);

const addressData = {
  full_name: formData.get('full_name'),
  phone_number: formData.get('phone_number'),
  address_line_1: formData.get('address_line_1'),
  address_line_2: formData.get('address_line_2') || '',
  city: formData.get('city'),
  state: formData.get('state'),
  postal_code: formData.get('postal_code'),
  country: formData.get('country') || 'India',
  is_default: formData.get('is_default') === 'on'
};

await createAddress(addressData);
```

---

## 🎉 That's It!

You now know how to POST a new address! 

**Remember:**
- ✅ You must be logged in (JWT token required)
- ✅ Include all required fields
- ✅ Set `is_default: true` to make it your default address
- ✅ The address will be automatically linked to your user account

**Need help?** Check `ADDRESS_API.md` for complete API documentation.

