"""
Comprehensive API tests for Cart endpoints
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Product, ProductCategory, Cart, CartItem

User = get_user_model()


class CartAPITestCase(TestCase):
    """Test cases for Cart API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        
        # Create user
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Create category and product
        self.category = ProductCategory.objects.create(
            id='test-category',
            name='Test Category'
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
    
    def test_get_cart_unauthenticated(self):
        """Test getting cart as unauthenticated user (guest cart)"""
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('items', response.data)
        self.assertEqual(len(response.data['items']), 0)
    
    def test_get_cart_authenticated(self):
        """Test getting cart as authenticated user"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('items', response.data)
    
    def test_add_item_to_cart(self):
        """Test adding item to cart"""
        response = self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 2
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['quantity'], 2)
    
    def test_add_item_to_cart_invalid_product(self):
        """Test adding invalid product to cart"""
        response = self.client.post('/api/cart/items/', {
            'product_id': 99999,
            'quantity': 1
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_add_out_of_stock_product(self):
        """Test adding out of stock product to cart"""
        self.product.in_stock = False
        self.product.save()
        
        response = self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 1
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_cart_item_quantity(self):
        """Test updating cart item quantity"""
        # First add item
        self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 1
        })
        
        # Get cart to find item ID
        cart_response = self.client.get('/api/cart/')
        item_id = cart_response.data['items'][0]['id']
        
        # Update quantity
        response = self.client.put(f'/api/cart/items/{item_id}/', {
            'quantity': 5
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['items'][0]['quantity'], 5)
    
    def test_remove_cart_item(self):
        """Test removing item from cart"""
        # Add item
        self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 1
        })
        
        # Get cart
        cart_response = self.client.get('/api/cart/')
        item_id = cart_response.data['items'][0]['id']
        
        # Remove item
        response = self.client.delete(f'/api/cart/items/{item_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 0)
    
    def test_clear_cart(self):
        """Test clearing entire cart"""
        # Add items
        self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 2
        })
        
        # Clear cart
        response = self.client.delete('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify cart is empty
        cart_response = self.client.get('/api/cart/')
        self.assertEqual(len(cart_response.data['items']), 0)
    
    def test_merge_cart_authenticated(self):
        """Test merging guest cart with user cart"""
        # Add item as guest
        self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 1
        })
        
        # Login and merge
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/merge/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('cart', response.data)
    
    def test_cart_total_calculation(self):
        """Test cart total amount calculation"""
        # Add multiple items
        self.client.post('/api/cart/items/', {
            'product_id': self.product.id,
            'quantity': 3
        })
        
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['total_amount']), 300.00)
        self.assertEqual(response.data['total_items'], 3)













