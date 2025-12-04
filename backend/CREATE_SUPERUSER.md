# Create Django Superuser - Quick Commands

## Method 1: Interactive (Recommended)

```bash
cd backend
python manage.py createsuperuser
```

Then follow the prompts:
- Email address: (enter your email)
- Username: (enter username)
- Password: (enter password)
- Password (again): (confirm password)

---

## Method 2: Using Django Shell

```bash
cd backend
python manage.py shell
```

Then paste this code:

```python
from api.models import User

User.objects.create_superuser(
    email='admin@myura.com',
    username='admin',
    password='yourpassword123'
)

print("Superuser created!")
exit()
```

**Replace `'yourpassword123'` with your desired password.**

---

## Method 3: One-liner (Windows PowerShell)

```powershell
cd backend; python manage.py createsuperuser
```

---

## Verify Superuser Created

```bash
cd backend
python manage.py shell
```

```python
from api.models import User
print("Superusers:", User.objects.filter(is_superuser=True).count())
for user in User.objects.filter(is_superuser=True):
    print(f"Email: {user.email}, Username: {user.username}")
exit()
```

---

## Login to Admin

1. Start Django server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Go to: http://127.0.0.1:8000/admin/

3. Login with your credentials













