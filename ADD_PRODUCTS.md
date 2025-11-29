# Add Products to Database

## ✅ Products Successfully Imported!

6 products have been added to the database:
1. DIA CARE
2. LIVER DETOX FORMULA
3. BONE & JOINT SUPPORT
4. GUT AND DIGESTION
5. WOMEN'S HEALTH PLUS
6. MEN'S VITALITY BOOSTER

---

## 🔄 How to Import Products Again

If you need to re-import or update products:

```bash
cd backend
python manage.py import_products
```

This command will:
- Create categories if they don't exist
- Create products if they don't exist
- Update existing products with new data

---

## 🧪 Test Products API

### In Browser Console:

```javascript
// Get all products
fetch('http://127.0.0.1:8000/api/products/')
  .then(res => res.json())
  .then(data => console.log('Products:', data));

// Get featured products
fetch('http://127.0.0.1:8000/api/products/featured/')
  .then(res => res.json())
  .then(data => console.log('Featured:', data));

// Get categories
fetch('http://127.0.0.1:8000/api/categories/')
  .then(res => res.json())
  .then(data => console.log('Categories:', data));
```

### In Frontend:

1. Go to http://localhost:3000/product
2. Products should now load from the API
3. Check Network tab to see API calls

---

## 📝 Add More Products

### Option 1: Use Django Admin

1. Go to http://127.0.0.1:8000/admin/
2. Login with superuser credentials
3. Navigate to "Products"
4. Click "Add Product"
5. Fill in product details
6. Save

### Option 2: Update Import Command

Edit `backend/api/management/commands/import_products.py` and add more products to the `products_data` list.

### Option 3: Use Django Shell

```bash
cd backend
python manage.py shell
```

```python
from api.models import ProductCategory, Product

# Create category
category = ProductCategory.objects.get_or_create(
    id='new-category',
    defaults={
        'name': 'New Category',
        'headline': 'Category Headline',
        'description': 'Category description'
    }
)[0]

# Create product
product = Product.objects.create(
    category=category,
    name='New Product',
    headline='Product Headline',
    price=999.00,
    original_price=1299.00,
    rating=4.5,
    reviews_count=0,
    in_stock=True,
    summary='Product summary',
    description='Product description',
    key_ingredients='Ingredients list',
    suitable_for='Who it\'s for',
    how_to_use='How to use',
    faqs='FAQs'
)

print(f"Created product: {product.name}")
```

---

## ✅ Verify Products

```bash
cd backend
python manage.py shell
```

```python
from api.models import Product, ProductCategory

print(f"Categories: {ProductCategory.objects.count()}")
print(f"Products: {Product.objects.count()}")

for product in Product.objects.all():
    print(f"- {product.name} (₹{product.price})")
```

---

**Products are now available via the API!** 🎉



