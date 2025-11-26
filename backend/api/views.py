from rest_framework import viewsets, filters, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from django.contrib.auth import get_user_model
from .models import Product, ProductCategory, Cart, CartItem, Order, OrderItem, Address, ContactSubmission
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    ProductCategorySerializer,
    UserSerializer, UserRegistrationSerializer,
    CartSerializer, CartItemSerializer,
    OrderSerializer, OrderCreateSerializer, AddressSerializer,
    ContactSubmissionSerializer
)

User = get_user_model()


# ==================== PRODUCT VIEWSET ====================

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing products.
    Provides list and detail views with filtering and search.
    
    List endpoint: GET /api/products/
    Detail endpoint: GET /api/products/{id}/
    Filter by category: GET /api/products/?category=dia-care
    Search: GET /api/products/?search=keyword
    Filter by stock: GET /api/products/?in_stock=true
    """
    queryset = Product.objects.select_related('category').prefetch_related('gallery_images').all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category__id': ['exact', 'in'],  # Filter by category ID or multiple categories
        'in_stock': ['exact'],
        'rating': ['gte', 'lte', 'exact'],  # Filter by rating range
        'price': ['gte', 'lte', 'exact'],  # Price filtering
        'reviews_count': ['gte', 'lte'],  # Filter by review count
    }
    search_fields = ['name', 'headline', 'description', 'summary', 'category__name', 'key_ingredients']
    ordering_fields = ['price', 'rating', 'created_at', 'name', 'reviews_count']
    ordering = ['-created_at']  # Default ordering

    def get_serializer_context(self):
        """Add request context for image URLs"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_serializer_class(self):
        """Use detailed serializer for detail view, lightweight for list"""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        """Custom queryset with enhanced filtering"""
        queryset = super().get_queryset()
        
        # Filter by multiple categories (comma-separated)
        categories = self.request.query_params.get('categories', None)
        if categories:
            category_list = [cat.strip() for cat in categories.split(',')]
            queryset = queryset.filter(category__id__in=category_list)
        
        # Filter by single category (backward compatibility)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__id=category)
        
        # Filter by price range (enhanced)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except (ValueError, TypeError):
                pass
        
        # Filter by rating range
        min_rating = self.request.query_params.get('min_rating', None)
        max_rating = self.request.query_params.get('max_rating', None)
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except (ValueError, TypeError):
                pass
        if max_rating:
            try:
                queryset = queryset.filter(rating__lte=float(max_rating))
            except (ValueError, TypeError):
                pass
        
        # Filter by discount (products with discount)
        has_discount = self.request.query_params.get('has_discount', None)
        if has_discount:
            if has_discount.lower() == 'true':
                queryset = queryset.filter(
                    original_price__isnull=False
                ).exclude(original_price=F('price'))
            elif has_discount.lower() == 'false':
                # Products without discount (no original_price or original_price == price)
                queryset = queryset.filter(
                    Q(original_price__isnull=True) | Q(original_price=F('price'))
                )
        
        # Filter by on sale (has discount)
        on_sale = self.request.query_params.get('on_sale', None)
        if on_sale:
            if on_sale.lower() == 'true':
                # Products on sale (have discount: original_price > price)
                queryset = queryset.filter(
                    original_price__isnull=False,
                    original_price__gt=F('price')
                )
            elif on_sale.lower() == 'false':
                # Products NOT on sale (no discount: exclude products where original_price > price)
                # This means: original_price is null OR original_price <= price
                queryset = queryset.exclude(
                    original_price__isnull=False,
                    original_price__gt=F('price')
                )
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products (highly rated, in stock)"""
        featured = self.get_queryset().filter(
            in_stock=True,
            rating__gte=4.5
        ).order_by('-rating', '-reviews_count')[:6]
        
        serializer = ProductListSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def related(self, request, pk=None):
        """Get related products (same category, excluding current product)"""
        product_id = request.query_params.get('product_id', None)
        if not product_id:
            return Response(
                {"error": "product_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=product_id)
            related = self.get_queryset().filter(
                category=product.category
            ).exclude(id=product_id)[:4]
            
            serializer = ProductListSerializer(related, many=True, context={'request': request})
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ==================== PRODUCT CATEGORY VIEWSET ====================

class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing product categories.
    
    List endpoint: GET /api/categories/
    Detail endpoint: GET /api/categories/{id}/ (includes products)
    """
    queryset = ProductCategory.objects.prefetch_related('products').all()
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'  # Use slug/id field for lookup

    def get_serializer_context(self):
        """Add request context for image URLs"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def retrieve(self, request, *args, **kwargs):
        """Custom retrieve to include products in category"""
        instance = self.get_object()
        
        # Get products in this category
        products = Product.objects.filter(category=instance).select_related('category').prefetch_related('gallery_images')
        
        # Apply filters from query params
        in_stock = request.query_params.get('in_stock', None)
        if in_stock is not None:
            in_stock_bool = in_stock.lower() == 'true'
            products = products.filter(in_stock=in_stock_bool)
        
        # Apply search
        search = request.query_params.get('search', None)
        if search:
            products = products.filter(
                Q(name__icontains=search) |
                Q(headline__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Serialize category
        category_serializer = self.get_serializer(instance)
        
        # Serialize products
        product_serializer = ProductListSerializer(products, many=True, context={'request': request})
        
        # Combine response
        response_data = category_serializer.data
        response_data['products'] = product_serializer.data
        response_data['products_count'] = products.count()
        
        return Response(response_data)


# ==================== AUTHENTICATION VIEWS ====================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer to include user data"""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user data to response
        data['user'] = UserSerializer(self.user).data
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that returns user data with tokens"""
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(generics.CreateAPIView):
    """
    User registration endpoint.
    
    POST /api/auth/register/
    Body: {
        "email": "user@example.com",
        "username": "username",
        "password": "password123",
        "password2": "password123",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "+1234567890"
    }
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update current user profile.
    
    GET /api/auth/user/ - Get current user
    PUT /api/auth/user/ - Update current user
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout endpoint.
    
    POST /api/auth/logout/
    Note: Client should discard tokens on their end.
    For token blacklisting, install django-rest-framework-simplejwt[token_blacklist]
    """
    return Response(
        {'message': 'Successfully logged out. Please discard tokens on client side.'},
        status=status.HTTP_200_OK
    )


# ==================== CART VIEWS ====================

def get_or_create_cart(request):
    """
    Helper function to get or create cart for authenticated user or guest.
    Returns (cart, created) tuple.
    """
    if request.user.is_authenticated:
        # Authenticated user - get/create cart for user
        cart, created = Cart.objects.get_or_create(
            user=request.user,
            session_key__isnull=True,
            defaults={'user': request.user}
        )
    else:
        # Guest user - use session key
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        
        cart, created = Cart.objects.get_or_create(
            user=None,
            session_key=session_key,
            defaults={'session_key': session_key}
        )
    return cart, created


@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
def cart_view(request):
    """
    Get or clear cart.
    
    GET /api/cart/ - Get current user's cart (creates if doesn't exist)
    DELETE /api/cart/ - Clear cart (remove all items)
    
    Works for both authenticated users and guests (using session).
    """
    if request.method == 'GET':
        cart, created = get_or_create_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        cart, _ = get_or_create_cart(request)
        cart.items.all().delete()
        return Response(
            {'message': 'Cart cleared successfully'},
            status=status.HTTP_200_OK
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_cart_view(request):
    """
    Add item to cart.
    
    POST /api/cart/items/
    Body: {
        "product_id": 1,
        "quantity": 2
    }
    
    If item already exists, quantity is added to existing quantity.
    """
    cart, _ = get_or_create_cart(request)
    
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    
    if not product_id:
        return Response(
            {'error': 'product_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if not product.in_stock:
        return Response(
            {'error': 'Product is out of stock'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get or create cart item
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        # Item already exists - add to quantity
        cart_item.quantity = min(cart_item.quantity + quantity, 99)
        cart_item.save()
    
    serializer = CartSerializer(cart, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def cart_item_view(request, item_id):
    """
    Update or remove cart item.
    
    PUT /api/cart/items/{id}/ - Update item quantity
    Body: {
        "quantity": 3
    }
    
    DELETE /api/cart/items/{id}/ - Remove item from cart
    """
    cart, _ = get_or_create_cart(request)
    
    try:
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return Response(
            {'error': 'Cart item not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'PUT':
        quantity = request.data.get('quantity')
        if quantity is None:
            return Response(
                {'error': 'quantity is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        quantity = int(quantity)
        if quantity < 1:
            return Response(
                {'error': 'Quantity must be at least 1'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if quantity > 99:
            return Response(
                {'error': 'Quantity cannot exceed 99'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item.quantity = quantity
        cart_item.save()
        
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        cart_item.delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def merge_cart_view(request):
    """
    Merge guest cart (from session) with user cart after login.
    
    POST /api/cart/merge/
    Body: {
        "session_key": "guest_session_key"  (optional - will use current session if not provided)
    }
    
    This is called after user logs in to merge their guest cart with their user cart.
    """
    # Get current user's cart (or create)
    user_cart, _ = Cart.objects.get_or_create(
        user=request.user,
        session_key__isnull=True,
        defaults={'user': request.user}
    )
    
    # Get guest cart from session
    session_key = request.data.get('session_key') or request.session.session_key
    
    if session_key:
        try:
            guest_cart = Cart.objects.get(user=None, session_key=session_key)
            
            # Merge items from guest cart to user cart
            for guest_item in guest_cart.items.all():
                cart_item, created = CartItem.objects.get_or_create(
                    cart=user_cart,
                    product=guest_item.product,
                    defaults={'quantity': guest_item.quantity}
                )
                
                if not created:
                    # Item exists in both carts - add quantities (max 99)
                    cart_item.quantity = min(cart_item.quantity + guest_item.quantity, 99)
                    cart_item.save()
            
            # Delete guest cart
            guest_cart.delete()
            
        except Cart.DoesNotExist:
            pass  # No guest cart to merge
    
    serializer = CartSerializer(user_cart, context={'request': request})
    return Response({
        'message': 'Cart merged successfully',
        'cart': serializer.data
    }, status=status.HTTP_200_OK)


# ==================== ORDER API VIEWS ====================

class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order management.
    
    GET /api/orders/ - List user's orders
    GET /api/orders/{id}/ - Get order details
    POST /api/orders/{id}/cancel/ - Cancel order
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return orders for authenticated user only"""
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')
    
    def get_serializer_context(self):
        """Add request context for serializers"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel an order.
        POST /api/orders/{id}/cancel/
        """
        order = self.get_object()
        
        # Only allow canceling pending orders
        if order.status != 'pending':
            return Response(
                {'error': f'Cannot cancel order with status: {order.status}. Only pending orders can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.payment_status = 'refunded' if order.payment_status == 'paid' else 'failed'
        order.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'message': 'Order cancelled successfully',
            'order': serializer.data
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order_view(request):
    """
    Create order from cart.
    
    POST /api/orders/create/
    Body: {
        "shipping_address": {
            "full_name": "John Doe",
            "phone_number": "+1234567890",
            "address_line_1": "123 Main St",
            "address_line_2": "Apt 4B",
            "city": "Mumbai",
            "state": "Maharashtra",
            "postal_code": "400001",
            "country": "India"
        },
        "payment_method": "razorpay",
        "payment_id": "pay_xyz123",
        "payment_status": "paid"
    }
    
    If shipping_address_id is provided instead, uses existing address:
    Body: {
        "shipping_address_id": 1,
        "payment_method": "razorpay",
        ...
    }
    """
    # Get user's cart
    try:
        cart = Cart.objects.get(user=request.user, session_key__isnull=True)
    except Cart.DoesNotExist:
        return Response(
            {'error': 'Cart not found. Add items to cart before creating order.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if cart has items
    cart_items = cart.items.all()
    if not cart_items.exists():
        return Response(
            {'error': 'Cart is empty. Add items to cart before creating order.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate all items are in stock
    for item in cart_items:
        if not item.product.in_stock:
            return Response(
                {'error': f'Product "{item.product.name}" is out of stock.'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Get or validate shipping address
    shipping_address_id = request.data.get('shipping_address_id')
    shipping_address_data = request.data.get('shipping_address')
    
    if shipping_address_id:
        # Use existing address
        try:
            address = Address.objects.get(id=shipping_address_id, user=request.user)
            shipping_address = {
                'full_name': address.full_name,
                'phone_number': address.phone_number,
                'address_line_1': address.address_line_1,
                'address_line_2': address.address_line_2,
                'city': address.city,
                'state': address.state,
                'postal_code': address.postal_code,
                'country': address.country,
            }
        except Address.DoesNotExist:
            return Response(
                {'error': 'Address not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
    elif shipping_address_data:
        # Use provided address data
        shipping_address = shipping_address_data
    else:
        return Response(
            {'error': 'Either shipping_address or shipping_address_id is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calculate total amount
    total_amount = cart.total_amount
    
    # Create order
    order_data = {
        'user': request.user,
        'total_amount': total_amount,
        'shipping_address': shipping_address,
        'payment_method': request.data.get('payment_method', ''),
        'payment_id': request.data.get('payment_id', ''),
        'payment_status': request.data.get('payment_status', 'pending'),
    }
    
    order = Order.objects.create(**order_data)
    
    # Create order items from cart items
    for cart_item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=cart_item.quantity,
            price=cart_item.product.price  # Store price at time of order
        )
    
    # Clear cart after order creation
    cart.items.all().delete()
    
    # Serialize and return order
    serializer = OrderSerializer(order, context={'request': request})
    return Response({
        'message': 'Order created successfully',
        'order': serializer.data
    }, status=status.HTTP_201_CREATED)


# ==================== ADDRESS API VIEWS ====================

class AddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Address management.
    
    GET /api/addresses/ - List user's addresses
    POST /api/addresses/ - Create new address
    GET /api/addresses/{id}/ - Get address details
    PUT /api/addresses/{id}/ - Update address
    DELETE /api/addresses/{id}/ - Delete address
    POST /api/addresses/{id}/set-default/ - Set as default address
    """
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return addresses for authenticated user only"""
        return Address.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        """Add request context for serializers"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        """Create address and handle default address logic"""
        # If setting as default, unset other default addresses
        if serializer.validated_data.get('is_default', False):
            Address.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Update address and handle default address logic"""
        # If setting as default, unset other default addresses
        if serializer.validated_data.get('is_default', False):
            Address.objects.filter(
                user=self.request.user, 
                is_default=True
            ).exclude(id=self.get_object().id).update(is_default=False)
        
        serializer.save()
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """
        Set address as default.
        POST /api/addresses/{id}/set-default/
        """
        address = self.get_object()
        
        # Unset all other default addresses for this user
        Address.objects.filter(user=request.user, is_default=True).exclude(id=address.id).update(is_default=False)
        
        # Set this address as default
        address.is_default = True
        address.save()
        
        serializer = self.get_serializer(address)
        return Response({
            'message': 'Address set as default successfully',
            'address': serializer.data
        }, status=status.HTTP_200_OK)


# ==================== CONTACT FORM API ====================

@api_view(['POST'])
@permission_classes([AllowAny])  # Anyone can submit contact form
def contact_submission_view(request):
    """
    Submit contact form.
    
    POST /api/contact/
    Body: {
        "name": "John Doe",
        "email": "john@example.com",
        "phone_number": "+1234567890",
        "subject": "Question about products",
        "message": "I have a question..."
    }
    """
    serializer = ContactSubmissionSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Thank you for contacting us! We will get back to you soon.',
            'submission': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
