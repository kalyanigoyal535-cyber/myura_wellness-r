# 🔐 Authentication API Documentation

## Base URL
```
http://127.0.0.1:8000/api/auth/
```

---

## 📝 Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register/`

**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890"
}
```

**Required Fields:**
- `email` - Must be unique
- `username` - Must be unique
- `password` - Must meet Django password requirements
- `password2` - Must match password

**Optional Fields:**
- `first_name`
- `last_name`
- `phone_number`

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "date_joined": "2025-01-27T..."
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "message": "User registered successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "email": ["user with this email already exists."],
  "password": ["Password fields didn't match."]
}
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login/`

**Description:** Authenticate user and get JWT tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "date_joined": "2025-01-27T..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "No active account found with the given credentials"
}
```

**Note:** Login uses `email` as the username field (not `username`)

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/user/`

**Description:** Get current authenticated user's profile

**Headers Required:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "date_joined": "2025-01-27T..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 4. Update User Profile

**Endpoint:** `PUT /api/auth/user/`

**Description:** Update current user's profile information

**Headers Required:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "+1234567890",
  "date_joined": "2025-01-27T..."
}
```

---

### 5. Refresh Access Token

**Endpoint:** `POST /api/auth/token/refresh/`

**Description:** Get a new access token using refresh token

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Token Lifetime:**
- **Access Token:** 1 hour
- **Refresh Token:** 7 days

---

### 6. Logout

**Endpoint:** `POST /api/auth/logout/`

**Description:** Logout user (client should discard tokens)

**Headers Required:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out. Please discard tokens on client side."
}
```

**Note:** Tokens are not blacklisted on the server. Client should discard them.

---

## 🔑 JWT Token Usage

### Storing Tokens
Store both `access` and `refresh` tokens securely (localStorage or httpOnly cookies).

### Using Access Token
Include in API requests:
```
Authorization: Bearer {access_token}
```

### Token Refresh Flow
1. Access token expires after 1 hour
2. Use refresh token to get new access token
3. Refresh token expires after 7 days
4. User must login again after refresh token expires

---

## 📋 Frontend Integration Example

### Registration
```typescript
const register = async (userData) => {
  const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  // Store tokens
  localStorage.setItem('access_token', data.tokens.access);
  localStorage.setItem('refresh_token', data.tokens.refresh);
  
  return data;
};
```

### Login
```typescript
const login = async (email, password) => {
  const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  // Store tokens
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  
  return data;
};
```

### Authenticated Request
```typescript
const getCurrentUser = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/auth/user/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};
```

### Refresh Token
```typescript
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  const response = await fetch('http://127.0.0.1:8000/api/auth/token/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  
  const data = await response.json();
  
  // Update access token
  localStorage.setItem('access_token', data.access);
  
  return data;
};
```

---

## 🧪 Testing with Postman

### Register
1. Method: POST
2. URL: `http://127.0.0.1:8000/api/auth/register/`
3. Body (raw JSON):
```json
{
  "email": "test@example.com",
  "username": "testuser",
  "password": "testpass123",
  "password2": "testpass123"
}
```

### Login
1. Method: POST
2. URL: `http://127.0.0.1:8000/api/auth/login/`
3. Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "testpass123"
}
```

### Get User (with token)
1. Method: GET
2. URL: `http://127.0.0.1:8000/api/auth/user/`
3. Headers:
   - Key: `Authorization`
   - Value: `Bearer {your_access_token}`

---

## ✅ Features

- ✅ User registration with email/username
- ✅ User login with email and password
- ✅ JWT token authentication
- ✅ Token refresh mechanism
- ✅ Get current user profile
- ✅ Update user profile
- ✅ Protected endpoints (require authentication)
- ✅ Custom token claims (email, username)

---

## 🔄 Next Steps

After authentication is working:
1. ⏭️ Build Cart API (with user authentication)
2. ⏭️ Build Order API
3. ⏭️ Connect frontend login/register forms
4. ⏭️ Implement protected routes

---

**Authentication API is ready to use!** 🔐

