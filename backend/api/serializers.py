from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import (
    ProductCategory, Product, ProductImage,
    Cart, CartItem, Address, Order, OrderItem, ContactSubmission
)

User = get_user_model()


# ==================== USER SERIALIZERS ====================

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label='Confirm Password')

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name', 'phone_number']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


# ==================== PRODUCT IMAGE SERIALIZER ====================

class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'order']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


# ==================== PRODUCT CATEGORY SERIALIZER ====================

class ProductCategorySerializer(serializers.ModelSerializer):
    """Serializer for ProductCategory model"""
    image_url = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'headline', 'description', 'accent_gradient', 
                  'hero_tagline', 'image', 'image_url', 'products_count', 'created_at']
        read_only_fields = ['created_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_products_count(self, obj):
        return obj.products.count()


# ==================== PRODUCT SERIALIZER ====================

class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists (fewer fields)"""
    category = ProductCategorySerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    discount_percent = serializers.ReadOnlyField()
    # Frontend compatibility fields (camelCase)
    originalPrice = serializers.DecimalField(source='original_price', max_digits=10, decimal_places=2, read_only=True, allow_null=True)
    reviews = serializers.IntegerField(source='reviews_count', read_only=True)
    inStock = serializers.BooleanField(source='in_stock', read_only=True)
    accentGradient = serializers.CharField(source='accent_gradient', read_only=True, allow_blank=True)
    heroTagline = serializers.CharField(source='hero_tagline', read_only=True, allow_blank=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'headline', 'price', 'original_price', 'originalPrice',
                  'discount_percent', 'rating', 'reviews_count', 'reviews', 'in_stock', 'inStock',
                  'accent_gradient', 'accentGradient', 'notes', 'summary', 'image', 'image_url',
                  'hero_tagline', 'heroTagline', 'category', 'created_at']
        read_only_fields = ['created_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single product view"""
    category = ProductCategorySerializer(read_only=True)
    gallery_images = ProductImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    discount_percent = serializers.ReadOnlyField()
    # Frontend compatibility fields (camelCase)
    originalPrice = serializers.DecimalField(source='original_price', max_digits=10, decimal_places=2, read_only=True, allow_null=True)
    reviews = serializers.IntegerField(source='reviews_count', read_only=True)
    inStock = serializers.BooleanField(source='in_stock', read_only=True)
    accentGradient = serializers.CharField(source='accent_gradient', read_only=True, allow_blank=True)
    keyIngredients = serializers.CharField(source='key_ingredients', read_only=True)
    suitableFor = serializers.CharField(source='suitable_for', read_only=True)
    howToUse = serializers.CharField(source='how_to_use', read_only=True)
    heroTagline = serializers.CharField(source='hero_tagline', read_only=True, allow_blank=True)
    gallery = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'category', 'name', 'headline', 'price', 'original_price', 'originalPrice',
                  'discount_percent', 'rating', 'reviews_count', 'reviews', 'in_stock', 'inStock',
                  'accent_gradient', 'accentGradient', 'notes', 'summary', 'description', 'benefits',
                  'key_ingredients', 'keyIngredients', 'suitable_for', 'suitableFor',
                  'how_to_use', 'howToUse', 'faqs', 'hero_tagline', 'heroTagline',
                  'image', 'image_url', 'gallery_images', 'gallery', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_gallery(self, obj):
        """Return gallery_images as 'gallery' for frontend compatibility"""
        gallery_images = obj.gallery_images.all()
        serializer = ProductImageSerializer(gallery_images, many=True, context=self.context)
        return serializer.data


# ==================== CART SERIALIZERS ====================

class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for CartItem"""
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        if value > 99:
            raise serializers.ValidationError("Quantity cannot exceed 99.")
        return value


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart with items"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_amount = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_amount', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


# ==================== ADDRESS SERIALIZER ====================

class AddressSerializer(serializers.ModelSerializer):
    """Serializer for Address model"""
    class Meta:
        model = Address
        fields = ['id', 'address_type', 'full_name', 'phone_number', 'address_line_1',
                  'address_line_2', 'city', 'state', 'postal_code', 'country',
                  'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        # If setting as default, unset other default addresses
        if attrs.get('is_default', False):
            user = self.context.get('request').user
            Address.objects.filter(user=user, is_default=True).update(is_default=False)
        return attrs


# ==================== ORDER SERIALIZERS ====================

class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem"""
    product = ProductListSerializer(read_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'subtotal', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order"""
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'user_email', 'status', 'total_amount',
                  'shipping_address', 'payment_status', 'payment_method', 'payment_id',
                  'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    class Meta:
        model = Order
        fields = ['shipping_address', 'payment_method', 'payment_id', 'payment_status']


# ==================== PASSWORD RESET SERIALIZERS ====================

class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """Check if user with this email exists"""
        if not User.objects.filter(email=value).exists():
            # Don't reveal if email exists for security
            pass
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation"""
    token = serializers.CharField(required=True)
    uid = serializers.CharField(required=True)
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True, required=True, label='Confirm Password')

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs


# ==================== CONTACT SERIALIZER ====================

class ContactSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for ContactSubmission model"""
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'phone_number', 'subject', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'is_read', 'created_at']

