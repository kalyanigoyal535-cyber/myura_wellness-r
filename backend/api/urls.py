from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ProductViewSet, ProductCategoryViewSet,
    CustomTokenObtainPairView, UserRegistrationView,
    UserProfileView, logout_view,
    cart_view, add_to_cart_view, cart_item_view, merge_cart_view,
    OrderViewSet, create_order_view, AddressViewSet,
    contact_submission_view
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', ProductCategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    # Router-generated URLs
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', UserProfileView.as_view(), name='user_profile'),
    
    # Cart endpoints
    path('cart/', cart_view, name='cart'),
    path('cart/items/', add_to_cart_view, name='add_to_cart'),
    path('cart/items/<int:item_id>/', cart_item_view, name='cart_item'),
    path('cart/merge/', merge_cart_view, name='merge_cart'),
    
    # Order endpoints
    path('orders/create/', create_order_view, name='create_order'),
    
    # Address endpoints (handled by router)
    # GET/POST /api/addresses/
    # GET/PUT/DELETE /api/addresses/{id}/
    # POST /api/addresses/{id}/set-default/
    
    # Contact form endpoint
    path('contact/', contact_submission_view, name='contact_submission'),
]

