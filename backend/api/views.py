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
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
import uuid
import json
from .models import Product, ProductCategory, Cart, CartItem, Order, OrderItem, Address, ContactSubmission
from .phonepe_payment import phonepe_client
from .cashfree_payment import cashfree_client
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    ProductCategorySerializer,
    UserSerializer, UserRegistrationSerializer,
    CartSerializer, CartItemSerializer,
    OrderSerializer, OrderCreateSerializer, AddressSerializer,
    ContactSubmissionSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
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


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request_view(request):
    """
    Password reset request endpoint.
    
    POST /api/auth/password/reset/
    Body: {
        "email": "user@example.com"
    }
    
    Sends password reset email to user if email exists.
    Always returns success message for security (don't reveal if email exists).
    """
    serializer = PasswordResetRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    email = serializer.validated_data['email']
    
    try:
        user = User.objects.get(email=email)
        
        # Generate password reset token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Build reset URL (frontend URL)
        # In production, this should be your frontend URL
        reset_url = f"{request.scheme}://{request.get_host()}/reset-password/{uid}/{token}"
        
        # For development, use localhost:3000
        if settings.DEBUG:
            reset_url = f"http://localhost:3000/reset-password/{uid}/{token}"
        
        # Send email
        try:
            send_mail(
                subject='Password Reset Request - Myura Wellness',
                message=f'''
Hello {user.get_full_name() or user.username},

You requested to reset your password for your Myura Wellness account.

Click the link below to reset your password:
{reset_url}

This link will expire in 24 hours.

If you didn't request this password reset, please ignore this email.

Best regards,
Myura Wellness Team
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@myurawellness.com',
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            # Log error but don't reveal to user
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send password reset email: {e}")
            # In production, you might want to use a proper email service
            # For now, we'll still return success for security
    
    except User.DoesNotExist:
        # Don't reveal if email exists
        pass
    
    # Always return success message for security
    return Response(
        {
            'message': 'If an account with that email exists, we have sent a password reset link.'
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm_view(request):
    """
    Password reset confirmation endpoint.
    
    POST /api/auth/password/reset/confirm/
    Body: {
        "uid": "base64_encoded_user_id",
        "token": "password_reset_token",
        "new_password": "newpassword123",
        "new_password2": "newpassword123"
    }
    """
    serializer = PasswordResetConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    uid = serializer.validated_data['uid']
    token = serializer.validated_data['token']
    new_password = serializer.validated_data['new_password']
    
    try:
        # Decode user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        
        # Verify token
        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'Invalid or expired reset token.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response(
            {'message': 'Password has been reset successfully. You can now login with your new password.'},
            status=status.HTTP_200_OK
        )
        
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response(
            {'error': 'Invalid reset link.'},
            status=status.HTTP_400_BAD_REQUEST
        )


# ==================== CART VIEWS ====================

def get_or_create_cart(request):
    """
    Helper function to get or create cart for authenticated user or guest.
    Returns (cart, created) tuple.
    
    Supports cart ID from X-Cart-ID header as fallback when session cookies fail.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    if request.user.is_authenticated:
        # Authenticated user - get/create cart for user
        cart, created = Cart.objects.get_or_create(
            user=request.user,
            session_key__isnull=True,
            defaults={'user': request.user}
        )
        logger.info(f"[Cart] Authenticated user - Cart ID: {cart.id}, Created: {created}")
    else:
        # Guest user - use session key or cart ID header
        # First, check if cart ID is provided in header (fallback for session issues)
        cart_id_header = request.headers.get('X-Cart-ID', None)
        if cart_id_header:
            try:
                cart_id = int(cart_id_header)
                # Try to get cart by ID (must be guest cart with no user)
                try:
                    cart = Cart.objects.get(id=cart_id, user=None)
                    created = False
                    logger.info(f"[Cart] Using cart from X-Cart-ID header - Cart ID: {cart.id}, Items: {cart.items.count()}")
                    return cart, created
                except Cart.DoesNotExist:
                    logger.warning(f"[Cart] Cart ID {cart_id} from header not found, falling back to session")
            except (ValueError, TypeError):
                logger.warning(f"[Cart] Invalid cart ID in header: {cart_id_header}")
        
        # CRITICAL: Access session to ensure it's loaded
        # This triggers Django's session middleware to load the session from the cookie
        _ = request.session.get('_dummy', None)
        
        # Check if session key exists
        if not request.session.session_key:
            logger.warning("[Cart] No session key found, creating new session")
            request.session.create()
            request.session.save()
        else:
            logger.info(f"[Cart] Existing session key found: {request.session.session_key[:10]}...")
        
        session_key = request.session.session_key
        
        # Always mark as modified to ensure it's saved
        request.session.modified = True
        
        # Try to get existing cart first
        # Check if multiple carts exist for this session (shouldn't happen, but helps debug)
        existing_carts = Cart.objects.filter(user=None, session_key=session_key)
        if existing_carts.exists():
            if existing_carts.count() > 1:
                logger.error(f"[Cart] WARNING: Multiple carts found for session {session_key[:10]}...! Count: {existing_carts.count()}")
                # Use the most recently updated cart (ordering is already set in model Meta)
                cart = existing_carts.first()
            else:
                cart = existing_carts.first()
            created = False
            logger.info(f"[Cart] Found existing cart - Cart ID: {cart.id}, Session: {session_key[:10]}..., Items: {cart.items.count()}")
        else:
            # Create new cart
            cart = Cart.objects.create(user=None, session_key=session_key)
            created = True
            logger.warning(f"[Cart] Created NEW cart - Cart ID: {cart.id}, Session: {session_key[:10]}...")
        
        # Explicitly save session to ensure cookie is set
        # This is critical for session persistence
        request.session.save()
        logger.debug(f"[Cart] Session saved - Key: {session_key[:10]}..., Modified: {request.session.modified}")
    
    return cart, created


@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
def cart_view(request):
    """
    Get or clear cart.
    
    GET /api/cart/ - Get current user's cart (creates if doesn't exist)
    DELETE /api/cart/ - Clear cart (remove all items)
    
    Works for both authenticated users and guests (using session).
    Supports X-Cart-ID header as fallback when session cookies fail.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    if request.method == 'GET':
        # CRITICAL: Access session early to ensure it's loaded from cookie
        if not request.user.is_authenticated:
            # Touch session to load it
            _ = request.session.get('_init', None)
            logger.info(f"[CartView GET] Session key: {request.session.session_key[:10] if request.session.session_key else 'None'}...")
        
        cart, created = get_or_create_cart(request)
        logger.info(f"[CartView GET] Using cart ID: {cart.id}, Created: {created}")
        
        # Ensure session is saved for guest users
        if not request.user.is_authenticated:
            request.session.modified = True
            request.session.save()
            logger.debug(f"[CartView GET] Session saved")
        
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        cart, _ = get_or_create_cart(request)
        cart.items.all().delete()
        
        # Update cart's updated_at timestamp by saving the cart
        # This ensures updated_at reflects the latest cart modification
        cart.save(update_fields=['updated_at'])
        
        # Ensure session is saved for guest users
        if not request.user.is_authenticated:
            request.session.modified = True
            request.session.save()
        
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
    import logging
    logger = logging.getLogger(__name__)
    
    # CRITICAL: Access session early to ensure it's loaded from cookie
    # This must happen before get_or_create_cart
    if not request.user.is_authenticated:
        # Touch session to load it
        _ = request.session.get('_init', None)
        logger.info(f"[AddToCart] Session key before cart lookup: {request.session.session_key[:10] if request.session.session_key else 'None'}...")
    
    cart, created = get_or_create_cart(request)
    logger.info(f"[AddToCart] Using cart ID: {cart.id}, Created: {created}")
    
    # Ensure session is saved for guest users
    if not request.user.is_authenticated:
        request.session.modified = True
        request.session.save()
        logger.debug(f"[AddToCart] Session saved - Key: {request.session.session_key[:10] if request.session.session_key else 'None'}...")
    
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
    
    # Update cart's updated_at timestamp by saving the cart
    # This ensures updated_at reflects the latest cart modification
    cart.save(update_fields=['updated_at'])
    
    # CRITICAL: Refresh cart from database to get all items (including the one we just added)
    # This ensures we return the complete cart state
    cart.refresh_from_db()
    
    # Ensure session is saved for guest users before returning
    if not request.user.is_authenticated:
        request.session.modified = True
        request.session.save()
        logger.debug(f"[AddToCart] Session saved - Key: {request.session.session_key[:10] if request.session.session_key else 'None'}...")
    
    # Serialize cart with all items
    serializer = CartSerializer(cart, context={'request': request})
    logger.info(f"[AddToCart] Returning cart with {len(cart.items.all())} items, Cart ID: {cart.id}")
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
    
    Supports X-Cart-ID header as fallback when session cookies fail.
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
        
        # Update cart's updated_at timestamp by saving the cart
        # This ensures updated_at reflects the latest cart modification
        cart.save(update_fields=['updated_at'])
        
        # Ensure session is saved for guest users
        if not request.user.is_authenticated:
            request.session.modified = True
            request.session.save()
        
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        cart_item.delete()
        
        # Update cart's updated_at timestamp by saving the cart
        # This ensures updated_at reflects the latest cart modification
        cart.save(update_fields=['updated_at'])
        
        # Ensure session is saved for guest users
        if not request.user.is_authenticated:
            request.session.modified = True
            request.session.save()
        
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
            items_merged = False
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
                items_merged = True
            
            # Update cart's updated_at timestamp if items were merged
            if items_merged:
                user_cart.save(update_fields=['updated_at'])
            
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
    
    Note: Order creation is handled by create_order_view at /api/orders/create/
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'delete', 'head', 'options']  # Disable POST for create
    
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
        
        # Also create an Address record for the user (so it appears in Address API)
        try:
            Address.objects.create(
                user=request.user,
                address_type='home',  # Default to 'home' for checkout addresses
                full_name=shipping_address_data.get('full_name', ''),
                phone_number=shipping_address_data.get('phone_number', ''),
                address_line_1=shipping_address_data.get('address_line_1', ''),
                address_line_2=shipping_address_data.get('address_line_2', ''),
                city=shipping_address_data.get('city', ''),
                state=shipping_address_data.get('state', ''),
                postal_code=shipping_address_data.get('postal_code', ''),
                country=shipping_address_data.get('country', 'India'),
                is_default=False,  # Don't set as default automatically
            )
        except Exception as e:
            # Log error but don't fail order creation if address creation fails
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'Failed to create Address record: {str(e)}')
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


# ==================== PHONEPE PAYMENT VIEWS ====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_phonepe_payment(request):
    """
    Create PhonePe payment request
    POST /api/payments/phonepe/create/
    Body: {
        "amount": 10000,  // Amount in paise
        "order_id": 123   // Your order ID
    }
    """
    try:
        amount = request.data.get('amount')
        order_id = request.data.get('order_id')
        
        if not amount or amount <= 0:
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not order_id:
            return Response(
                {'error': 'Order ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify order belongs to user
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Generate unique transaction ID
        transaction_id = f"TXN{order.order_number}{uuid.uuid4().hex[:8].upper()}"
        
        # Create payment request
        payment_response = phonepe_client.create_payment_request(
            transaction_id=transaction_id,
            amount=amount,
            user_id=request.user.id,
            order_id=order_id
        )
        
        if payment_response.get("success"):
            # Store transaction ID in order (temporarily)
            order.payment_id = transaction_id
            order.save()
            
            return Response({
                'payment_url': payment_response['payment_url'],
                'transaction_id': transaction_id,
                'order_id': order_id
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': payment_response.get('error', 'Payment request failed')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])  # PhonePe will call this
def phonepe_callback(request):
    """
    Handle PhonePe payment callback
    POST /api/payments/phonepe/callback/
    """
    try:
        # Get Authorization header for callback verification
        authorization = request.headers.get('Authorization', '')
        
        # Get payload
        payload = request.body.decode('utf-8')
        
        # Parse callback data
        callback_data = json.loads(payload)
        
        # Extract transaction details
        callback_type = callback_data.get('type', '')
        data = callback_data.get('data', {})
        
        # Get merchant order ID from callback
        merchant_order_id = data.get('merchantOrderId', '')
        
        if not merchant_order_id:
            return Response(
                {'error': 'Missing merchant order ID'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find order by transaction ID (stored in payment_id)
        try:
            order = Order.objects.get(payment_id=merchant_order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check payment state
        payment_state = data.get('state', '')
        
        # Update order based on payment status
        if payment_state == 'COMPLETED' or payment_state == 'PAYMENT_SUCCESS':
            order.payment_status = 'paid'
            if data.get('transactionId'):
                order.payment_id = data['transactionId']  # Store PhonePe transaction ID
            order.status = 'processing'
            order.save()
            
            return Response({
                'success': True,
                'message': 'Payment successful',
                'order_id': order.id
            }, status=status.HTTP_200_OK)
        else:
            order.payment_status = 'failed'
            order.save()
            
            return Response({
                'success': False,
                'message': data.get('message', 'Payment failed'),
                'order_id': order.id
            }, status=status.HTTP_200_OK)
            
    except json.JSONDecodeError:
        return Response(
            {'error': 'Invalid JSON payload'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_phonepe_payment(request):
    """
    Verify payment status from frontend
    POST /api/payments/phonepe/verify/
    Body: {
        "transaction_id": "TXN123456",
        "order_id": 123
    }
    """
    try:
        transaction_id = request.data.get('transaction_id')
        order_id = request.data.get('order_id')
        
        if not transaction_id or not order_id:
            return Response(
                {'error': 'Transaction ID and Order ID are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify order belongs to user
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check payment status
        status_response = phonepe_client.check_payment_status(transaction_id)
        
        if status_response.get('success') and status_response.get('data'):
            payment_data = status_response['data']
            payment_state = payment_data.get('state', '')
            
            if payment_state == 'COMPLETED' or payment_state == 'PAYMENT_SUCCESS':
                order.payment_status = 'paid'
                order.status = 'processing'
                if payment_data.get('transactionId'):
                    order.payment_id = payment_data['transactionId']
                order.save()
                
                return Response({
                    'success': True,
                    'payment_status': 'paid',
                    'order': OrderSerializer(order).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'payment_status': 'pending',
                    'message': 'Payment is still processing'
                }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Failed to verify payment status'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== CASHFREE PAYMENT VIEWS ====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cashfree_payment(request):
    """
    Create Cashfree payment session
    POST /api/payments/cashfree/create/
    Body: {
        "amount": 1000,  // Amount in rupees
        "order_id": 123,  // Your order ID
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_phone": "+919876543210"
    }
    """
    try:
        amount = request.data.get('amount')
        order_id = request.data.get('order_id')
        customer_name = request.data.get('customer_name')
        customer_email = request.data.get('customer_email')
        customer_phone = request.data.get('customer_phone')
        
        if not amount or amount <= 0:
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not order_id:
            return Response(
                {'error': 'Order ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify order belongs to user
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Use order details if customer details not provided
        if not customer_name:
            customer_name = order.shipping_address.get('full_name', request.user.get_full_name() or request.user.email)
        if not customer_email:
            customer_email = order.shipping_address.get('email', request.user.email)
        if not customer_phone:
            customer_phone = order.shipping_address.get('phone_number', '')
        
        # Generate unique order ID for Cashfree (using our order number)
        cashfree_order_id = f"CF{order.order_number}"
        
        # Create payment session
        payment_response = cashfree_client.create_payment_session(
            order_id=cashfree_order_id,
            amount=float(amount),
            customer_details={
                'customer_id': str(request.user.id),
                'name': customer_name,
                'email': customer_email,
                'phone': customer_phone
            },
            order_meta={
                'db_order_id': str(order.id),
                'order_number': order.order_number
            }
        )
        
        if payment_response.get("success"):
            # Store payment session ID in order
            order.payment_id = payment_response.get('payment_session_id', cashfree_order_id)
            order.save()
            
            return Response({
                'payment_url': payment_response.get('payment_url', ''),
                'payment_session_id': payment_response.get('payment_session_id', ''),
                'order_id': order_id,
                'cashfree_order_id': cashfree_order_id
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': payment_response.get('error', 'Payment session creation failed')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])  # Cashfree will call this
def cashfree_callback(request):
    """
    Handle Cashfree payment callback/webhook
    POST /api/payments/cashfree/callback/
    """
    try:
        # Get webhook payload
        payload = request.data
        
        # Extract order details from webhook
        order_id = payload.get('order_id', '')
        order_amount = payload.get('order_amount', 0)
        payment_status = payload.get('payment_status', '')
        reference_id = payload.get('reference_id', '')
        tx_status = payload.get('tx_status', '')
        payment_message = payload.get('payment_message', '')
        signature = payload.get('signature', '')
        
        if not order_id:
            return Response(
                {'error': 'Missing order ID'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find order by payment_id (which stores Cashfree order ID or payment_session_id)
        try:
            order = Order.objects.get(payment_id=order_id)
        except Order.DoesNotExist:
            # Try to find by order_number if payment_id doesn't match
            if order_id.startswith('CF'):
                order_number = order_id[2:]  # Remove 'CF' prefix
                try:
                    order = Order.objects.get(order_number=order_number)
                except Order.DoesNotExist:
                    return Response(
                        {'error': 'Order not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            else:
                return Response(
                    {'error': 'Order not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Verify webhook signature if provided
        if signature:
            is_valid = cashfree_client.verify_webhook_signature(
                order_id=order_id,
                order_amount=str(order_amount),
                reference_id=reference_id or '',
                tx_status=tx_status or '',
                payment_message=payment_message or '',
                signature=signature
            )
            if not is_valid:
                return Response(
                    {'error': 'Invalid signature'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Update order based on payment status
        if payment_status == 'SUCCESS' or tx_status == 'SUCCESS':
            order.payment_status = 'paid'
            if reference_id:
                order.payment_id = reference_id  # Store Cashfree transaction ID
            order.status = 'processing'
            order.save()
            
            return Response({
                'success': True,
                'message': 'Payment successful',
                'order_id': order.id
            }, status=status.HTTP_200_OK)
        else:
            order.payment_status = 'failed'
            order.save()
            
            return Response({
                'success': False,
                'message': payment_message or 'Payment failed',
                'order_id': order.id
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_cashfree_payment(request):
    """
    Verify payment status from frontend
    POST /api/payments/cashfree/verify/
    Body: {
        "order_id": "ORDER_123456",  // Cashfree order ID or payment_session_id
        "order_db_id": 123  // Your database order ID
    }
    """
    try:
        cashfree_order_id = request.data.get('order_id')
        order_db_id = request.data.get('order_db_id')
        
        if not cashfree_order_id:
            return Response(
                {'error': 'Order ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get order from database
        try:
            if order_db_id:
                order = Order.objects.get(id=order_db_id, user=request.user)
            else:
                # Try to find by payment_id
                order = Order.objects.get(payment_id=cashfree_order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check payment status with Cashfree
        status_response = cashfree_client.get_payment_status(cashfree_order_id)
        
        if status_response.get('success') and status_response.get('data'):
            payment_data = status_response['data']
            payment_status = payment_data.get('payment_status', '')
            tx_status = payment_data.get('tx_status', '')
            
            if payment_status == 'SUCCESS' or tx_status == 'SUCCESS':
                order.payment_status = 'paid'
                order.status = 'processing'
                if payment_data.get('cf_payment_id'):
                    order.payment_id = payment_data['cf_payment_id']
                order.save()
                
                return Response({
                    'success': True,
                    'payment_status': 'paid',
                    'order': OrderSerializer(order).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'payment_status': 'pending',
                    'message': payment_data.get('payment_message', 'Payment is still processing')
                }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Failed to verify payment status'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
