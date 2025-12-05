"""
Comprehensive API tests for Product endpoints
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Product, ProductCategory, ProductImage

User = get_user_model()


class ProductAPITestCase(TestCase):
    """Test cases for Product API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        
        # Create test category
        self.category = ProductCategory.objects.create(
            id='test-category',
            name='Test Category',
            headline='Test Category Headline',
            description='Test category description'
        )
        
        # Create test products
        self.product1 = Product.objects.create(
            category=self.category,
            name='Test Product 1',
            headline='Test Headline 1',
            price=100.00,
            original_price=150.00,
            rating=4.5,
            reviews_count=10,
            in_stock=True,
            summary='Test summary 1',
            description='Test description 1',
            benefits=['Benefit 1', 'Benefit 2'],
            key_ingredients='Ingredient 1, Ingredient 2',
            suitable_for='Suitable for testing',
            how_to_use='Use as directed',
            faqs='FAQ content'
        )
        
        self.product2 = Product.objects.create(
            category=self.category,
            name='Test Product 2',
            headline='Test Headline 2',
            price=200.00,
            rating=4.8,
            reviews_count=20,
            in_stock=True,
            summary='Test summary 2',
            description='Test description 2',
            benefits=['Benefit 3'],
            key_ingredients='Ingredient 3',
            suitable_for='Suitable for testing 2',
            how_to_use='Use as directed 2',
            faqs='FAQ content 2'
        )
        
        self.product3 = Product.objects.create(
            category=self.category,
            name='Out of Stock Product',
            headline='Out of Stock',
            price=300.00,
            rating=3.5,
            reviews_count=5,
            in_stock=False,
            summary='Out of stock summary',
            description='Out of stock description',
            benefits=[],
            key_ingredients='Ingredients',
            suitable_for='Everyone',
            how_to_use='Use as needed',
            faqs='FAQ'
        )
    
    def test_list_products(self):
        """Test listing all products"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertGreaterEqual(len(response.data['results']), 2)
    
    def test_list_products_with_pagination(self):
        """Test product list pagination"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)
    
    def test_get_product_detail(self):
        """Test getting a single product detail"""
        response = self.client.get(f'/api/products/{self.product1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.product1.id)
        self.assertEqual(response.data['name'], 'Test Product 1')
        self.assertIn('gallery_images', response.data)
    
    def test_get_nonexistent_product(self):
        """Test getting a product that doesn't exist"""
        response = self.client.get('/api/products/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_filter_products_by_category(self):
        """Test filtering products by category"""
        response = self.client.get(f'/api/products/?category={self.category.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for product in response.data['results']:
            self.assertEqual(product['category']['id'], self.category.id)
    
    def test_filter_products_by_in_stock(self):
        """Test filtering products by stock status"""
        response = self.client.get('/api/products/?in_stock=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for product in response.data['results']:
            self.assertTrue(product['in_stock'])
    
    def test_search_products(self):
        """Test searching products"""
        response = self.client.get('/api/products/?search=Test Product 1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        self.assertEqual(response.data['results'][0]['name'], 'Test Product 1')
    
    def test_filter_by_price_range(self):
        """Test filtering products by price range"""
        response = self.client.get('/api/products/?min_price=100&max_price=200')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for product in response.data['results']:
            price = float(product['price'])
            self.assertGreaterEqual(price, 100)
            self.assertLessEqual(price, 200)
    
    def test_filter_by_rating(self):
        """Test filtering products by rating"""
        response = self.client.get('/api/products/?min_rating=4.5')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for product in response.data['results']:
            rating = float(product['rating'])
            self.assertGreaterEqual(rating, 4.5)
    
    def test_filter_by_discount(self):
        """Test filtering products with discount"""
        response = self.client.get('/api/products/?has_discount=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for product in response.data['results']:
            if product.get('original_price'):
                self.assertGreater(float(product['original_price']), float(product['price']))
    
    def test_sort_products_by_price_asc(self):
        """Test sorting products by price ascending"""
        response = self.client.get('/api/products/?ordering=price')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prices = [float(p['price']) for p in response.data['results']]
        self.assertEqual(prices, sorted(prices))
    
    def test_sort_products_by_price_desc(self):
        """Test sorting products by price descending"""
        response = self.client.get('/api/products/?ordering=-price')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prices = [float(p['price']) for p in response.data['results']]
        self.assertEqual(prices, sorted(prices, reverse=True))
    
    def test_get_featured_products(self):
        """Test getting featured products"""
        response = self.client.get('/api/products/featured/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        for product in response.data:
            self.assertTrue(product['in_stock'])
            self.assertGreaterEqual(float(product['rating']), 4.5)
    
    def test_get_related_products(self):
        """Test getting related products"""
        response = self.client.get(f'/api/products/related/?product_id={self.product1.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        # Related products should be from same category but not the same product
        for product in response.data:
            self.assertEqual(product['category']['id'], self.category.id)
            self.assertNotEqual(product['id'], self.product1.id)
    
    def test_get_related_products_missing_product_id(self):
        """Test getting related products without product_id"""
        response = self.client.get('/api/products/related/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProductCategoryAPITestCase(TestCase):
    """Test cases for Product Category API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        
        self.category = ProductCategory.objects.create(
            id='test-category',
            name='Test Category',
            headline='Test Headline',
            description='Test Description'
        )
        
        self.product = Product.objects.create(
            category=self.category,
            name='Test Product',
            price=100.00,
            rating=4.5,
            reviews_count=10,
            in_stock=True,
            summary='Summary',
            description='Description',
            benefits=[],
            key_ingredients='Ingredients',
            suitable_for='Everyone',
            how_to_use='Use as needed',
            faqs='FAQ'
        )
    
    def test_list_categories(self):
        """Test listing all categories"""
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreater(len(response.data), 0)
    
    def test_get_category_detail(self):
        """Test getting a single category detail"""
        response = self.client.get(f'/api/categories/{self.category.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.category.id)
        self.assertIn('products', response.data)
        self.assertIn('products_count', response.data)
    
    def test_get_category_with_products(self):
        """Test getting category with its products"""
        response = self.client.get(f'/api/categories/{self.category.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['products']), 0)
        self.assertEqual(response.data['products'][0]['name'], 'Test Product')
    
    def test_filter_category_products_by_stock(self):
        """Test filtering category products by stock status"""
        response = self.client.get(f'/api/categories/{self.category.id}/?in_stock=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for product in response.data['products']:
            self.assertTrue(product['in_stock'])
    
    def test_search_category_products(self):
        """Test searching products within a category"""
        response = self.client.get(f'/api/categories/{self.category.id}/?search=Test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['products']), 0)













