# 📍 Address Management API Documentation

## Base URL
```
http://127.0.0.1:8000/api/addresses/
```

## ⚡ Quick Start: Add New Address

**Want to add an address?** Check out **[HOW_TO_ADD_ADDRESS.md](./HOW_TO_ADD_ADDRESS.md)** for step-by-step guide!

**Quick example:**
```typescript
const token = localStorage.getItem('access_token');

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
.then(address => console.log('Address created:', address));
```

---

## 🎯 Address Features

✅ **Create Address** - Save shipping addresses  
✅ **List Addresses** - View all saved addresses  
✅ **Update Address** - Modify saved addresses  
✅ **Delete Address** - Remove addresses  
✅ **Set Default** - Mark address as default  
✅ **Default Address Logic** - Automatically manages default address  

---

## 📝 Address Endpoints

### 1. List Addresses

**Endpoint:** `GET /api/addresses/`

**Description:** Get all addresses for the authenticated user. Default address appears first.

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
  },
  {
    "id": 2,
    "address_type": "work",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "address_line_1": "456 Office Park",
    "address_line_2": "",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400002",
    "country": "India",
    "is_default": false,
    "created_at": "2025-01-26T14:00:00Z"
  }
]
```

**Empty Response:**
```json
[]
```

---

### 2. Create Address

**Endpoint:** `POST /api/addresses/`

**Description:** Create a new shipping address.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
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
}
```

**Response (201 Created):**
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

**Address Types:**
- `home` (default)
- `work`
- `other`

**Notes:**
- If `is_default: true`, all other addresses are automatically set to `is_default: false`
- `address_line_2` and `country` are optional

---

### 3. Get Address Details

**Endpoint:** `GET /api/addresses/{id}/`

**Description:** Get details of a specific address.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
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

**Error Response (404):**
```json
{
  "detail": "Not found."
}
```

---

### 4. Update Address

**Endpoint:** `PUT /api/addresses/{id}/`

**Description:** Update an existing address.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "address_type": "home",
  "full_name": "John Doe Updated",
  "phone_number": "+9876543210",
  "address_line_1": "789 New Street",
  "address_line_2": "",
  "city": "Delhi",
  "state": "Delhi",
  "postal_code": "110001",
  "country": "India",
  "is_default": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "address_type": "home",
  "full_name": "John Doe Updated",
  "phone_number": "+9876543210",
  "address_line_1": "789 New Street",
  "address_line_2": "",
  "city": "Delhi",
  "state": "Delhi",
  "postal_code": "110001",
  "country": "India",
  "is_default": true,
  "created_at": "2025-01-27T10:00:00Z"
}
```

**Partial Update (PATCH):**
You can also use `PATCH /api/addresses/{id}/` to update only specific fields:
```json
{
  "city": "Bangalore",
  "state": "Karnataka"
}
```

---

### 5. Delete Address

**Endpoint:** `DELETE /api/addresses/{id}/`

**Description:** Delete an address.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (204 No Content):**
(No response body)

**Error Response (404):**
```json
{
  "detail": "Not found."
}
```

---

### 6. Set Default Address

**Endpoint:** `POST /api/addresses/{id}/set-default/`

**Description:** Set an address as the default shipping address. All other addresses are automatically unset as default.

**Authentication:** Required (JWT Token)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Address set as default successfully",
  "address": {
    "id": 2,
    "address_type": "work",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "address_line_1": "456 Office Park",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400002",
    "country": "India",
    "is_default": true,
    "created_at": "2025-01-26T14:00:00Z"
  }
}
```

---

## 💡 Usage Examples

### List Addresses

```typescript
const getAddresses = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/addresses/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};

// Usage:
const addresses = await getAddresses();
const defaultAddress = addresses.find(addr => addr.is_default);
```

### Create Address

```typescript
const createAddress = async (addressData) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/addresses/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addressData),
  });
  
  return await response.json();
};

// Usage:
const newAddress = {
  address_type: 'home',
  full_name: 'John Doe',
  phone_number: '+1234567890',
  address_line_1: '123 Main Street',
  address_line_2: 'Apt 4B',
  city: 'Mumbai',
  state: 'Maharashtra',
  postal_code: '400001',
  country: 'India',
  is_default: true
};

const address = await createAddress(newAddress);
console.log('Address created:', address.id);
```

### Update Address

```typescript
const updateAddress = async (addressId, updates) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`http://127.0.0.1:8000/api/addresses/${addressId}/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  return await response.json();
};
```

### Delete Address

```typescript
const deleteAddress = async (addressId) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`http://127.0.0.1:8000/api/addresses/${addressId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.status === 204) {
    return { success: true };
  }
  
  throw new Error('Failed to delete address');
};
```

### Set Default Address

```typescript
const setDefaultAddress = async (addressId) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`http://127.0.0.1:8000/api/addresses/${addressId}/set-default/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};
```

---

## 🔄 Address Workflow

### Creating Addresses:
1. User fills address form → `POST /api/addresses/`
2. If `is_default: true` → Other addresses automatically unset as default
3. Address is saved and linked to user

### Using Addresses for Orders:
1. User selects saved address → `GET /api/addresses/` (to show list)
2. User creates order → `POST /api/orders/create/` with `shipping_address_id`

### Managing Default Address:
1. User sets default → `POST /api/addresses/{id}/set-default/`
2. All other addresses automatically unset as default
3. Default address appears first in list

---

## 🔑 Important Notes

### Default Address Logic
- **Only one default address** per user at a time
- When creating/updating address with `is_default: true`, other addresses are automatically set to `false`
- When calling `set-default` endpoint, other addresses are automatically unset

### Address Types
- **home** - Residential address (default)
- **work** - Office/business address
- **other** - Other types of addresses

### Field Requirements
- **Required:** `full_name`, `phone_number`, `address_line_1`, `city`, `state`, `postal_code`
- **Optional:** `address_line_2`, `country` (defaults to "India")

### User Isolation
- Users can only see and manage their own addresses
- Address IDs are user-specific

---

## ✅ Features Implemented

- ✅ Create address
- ✅ List addresses (default first)
- ✅ Get address details
- ✅ Update address (full/partial)
- ✅ Delete address
- ✅ Set default address
- ✅ Automatic default address management
- ✅ Address type support (home/work/other)
- ✅ User-specific address isolation

---

**Address API is ready to use!** 📍

