from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ProductViewSet, ProductCategoryViewSet,
    CustomTokenObtainPairView, UserRegistrationView,
    UserProfileView, logout_view,
    password_reset_request_view, password_reset_confirm_view,
    cart_view, add_to_cart_view, cart_item_view, merge_cart_view,
    OrderViewSet, create_order_view, AddressViewSet,
    contact_submission_view,
    create_phonepe_payment, phonepe_callback, verify_phonepe_payment,
    create_cashfree_payment, cashfree_callback, verify_cashfree_payment
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', ProductCategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    # Order endpoints (must be before router to avoid conflict with orders/{id}/)
    path('orders/create/', create_order_view, name='create_order'),
    
    # Router-generated URLs
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', UserProfileView.as_view(), name='user_profile'),
    path('auth/password/reset/', password_reset_request_view, name='password_reset_request'),
    path('auth/password/reset/confirm/', password_reset_confirm_view, name='password_reset_confirm'),
    
    # Cart endpoints
    path('cart/', cart_view, name='cart'),
    path('cart/items/', add_to_cart_view, name='add_to_cart'),
    path('cart/items/<int:item_id>/', cart_item_view, name='cart_item'),
    path('cart/merge/', merge_cart_view, name='merge_cart'),
    
    # Address endpoints (handled by router)
    # GET/POST /api/addresses/
    # GET/PUT/DELETE /api/addresses/{id}/
    # POST /api/addresses/{id}/set-default/
    
    # Contact form endpoint
    path('contact/', contact_submission_view, name='contact_submission'),
    
    # PhonePe Payment endpoints
    path('payments/phonepe/create/', create_phonepe_payment, name='create_phonepe_payment'),
    path('payments/phonepe/callback/', phonepe_callback, name='phonepe_callback'),
    path('payments/phonepe/verify/', verify_phonepe_payment, name='verify_phonepe_payment'),
    
    # Cashfree Payment endpoints
    path('payments/cashfree/create/', create_cashfree_payment, name='create_cashfree_payment'),
    path('payments/cashfree/callback/', cashfree_callback, name='cashfree_callback'),
    path('payments/cashfree/verify/', verify_cashfree_payment, name='verify_cashfree_payment'),
]

