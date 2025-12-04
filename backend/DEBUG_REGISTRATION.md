# Debug Registration 400 Error

## Quick Debug Steps

### 1. Check Browser Console

Open DevTools (F12) → Console tab and look for the actual error message.

### 2. Check Network Tab

1. Open DevTools (F12) → Network tab
2. Try registering again
3. Click on the failed request (`POST /api/auth/register/`)
4. Go to "Response" tab
5. See the actual error message from backend

### 3. Common Causes of 400 Error

#### A. Password Too Weak

Django has password validators. Password must:
- Be at least 8 characters
- Not be too common
- Not be entirely numeric
- Not be too similar to username/email

**Fix:** Use a stronger password like `TestPass123!`

#### B. Email Already Exists

If email is already registered, you'll get a 400 error.

**Fix:** Use a different email or login instead

#### C. Username Already Exists

If username is already taken.

**Fix:** Use a different username

#### D. Missing Required Fields

Backend requires:
- `email` (required)
- `username` (required)
- `password` (required)
- `password2` (required)
- `first_name` (optional)
- `last_name` (optional)
- `phone_number` (optional)

### 4. Test Registration with cURL

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

This will show you the exact error message.

### 5. Check Django Server Logs

Look at the terminal where Django server is running. It should show the error details.

### 6. Test in Django Shell

```bash
cd backend
python manage.py shell
```

```python
from api.serializers import UserRegistrationSerializer

data = {
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "first_name": "Test",
    "last_name": "User"
}

serializer = UserRegistrationSerializer(data=data)
if serializer.is_valid():
    print("Valid!")
    user = serializer.save()
    print(f"User created: {user.email}")
else:
    print("Errors:", serializer.errors)
```

---

## Quick Fix: Check Error Response

The error message should now be displayed in the frontend. Check the error message shown in the red box on the signup page.

If you see field-specific errors like:
- `email: This field is required.`
- `password: This password is too common.`
- `username: A user with that username already exists.`

These tell you exactly what's wrong!













