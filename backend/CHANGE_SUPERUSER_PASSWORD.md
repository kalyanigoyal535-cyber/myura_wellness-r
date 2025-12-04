# Change Django Superuser Password

## Method 1: Using Django's changepassword Command (Recommended)

This is the easiest and most secure method:

```bash
cd backend
python manage.py changepassword <username>
```

Replace `<username>` with your superuser's username. For example:

```bash
python manage.py changepassword admin
```

The command will prompt you to enter the new password twice (for confirmation).

---

## Method 2: Using Django Shell

If you prefer to use Python code:

```bash
cd backend
python manage.py shell
```

Then paste this code (replace `'admin'` with your username and `'newpassword123'` with your desired password):

```python
from django.contrib.auth import get_user_model

User = get_user_model()
username = 'admin'  # Replace with your superuser username
new_password = 'newpassword123'  # Replace with your desired password

try:
    user = User.objects.get(username=username)
    user.set_password(new_password)
    user.save()
    print(f"Password changed successfully for user: {username}")
except User.DoesNotExist:
    print(f"User '{username}' not found!")
```

---

## Method 3: Change Password by Email

If you know the email but not the username:

```bash
cd backend
python manage.py shell
```

```python
from django.contrib.auth import get_user_model

User = get_user_model()
email = 'admin@myura.com'  # Replace with your superuser email
new_password = 'newpassword123'  # Replace with your desired password

try:
    user = User.objects.get(email=email)
    user.set_password(new_password)
    user.save()
    print(f"Password changed successfully for user: {user.username} ({user.email})")
except User.DoesNotExist:
    print(f"User with email '{email}' not found!")
```

---

## Method 4: List All Superusers First

If you're not sure of the username, first list all superusers:

```bash
cd backend
python manage.py shell
```

```python
from django.contrib.auth import get_user_model

User = get_user_model()
superusers = User.objects.filter(is_superuser=True)

print("Superusers:")
for user in superusers:
    print(f"  - Username: {user.username}, Email: {user.email}")
```

Then use one of the methods above to change the password.

---

## Quick One-Liner (Windows PowerShell)

```powershell
cd backend; python manage.py changepassword admin
```

---

## Verify Password Changed

After changing the password, verify it works:

1. Start Django server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Go to: http://127.0.0.1:8000/admin/

3. Login with your username and new password

---

## Notes

- The password will be hashed automatically by Django
- Make sure to use a strong password
- If you forget the username, use Method 4 to list all superusers first










