from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, ProductCategory, Product, ProductImage,
    Cart, CartItem, Address, Order, OrderItem, ContactSubmission
)

# Custom User Admin
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'phone_number', 'is_staff', 'created_at']
    list_filter = ['is_staff', 'is_superuser', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone_number',)}),
    )

# Product Admin
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'order']

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'id', 'created_at']
    search_fields = ['name', 'id']
    prepopulated_fields = {'id': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'original_price', 'in_stock', 'rating', 'reviews_count', 'created_at']
    list_filter = ['category', 'in_stock', 'created_at']
    search_fields = ['name', 'category__name']
    list_editable = ['in_stock', 'price']
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('category', 'name', 'headline', 'price', 'original_price')
        }),
        ('Status & Ratings', {
            'fields': ('in_stock', 'rating', 'reviews_count')
        }),
        ('Visual Styling', {
            'fields': ('accent_gradient', 'hero_tagline')
        }),
        ('Content', {
            'fields': ('summary', 'description', 'key_ingredients', 'benefits', 'notes', 'suitable_for', 'how_to_use', 'faqs')
        }),
        ('Images', {
            'fields': ('image',)
        }),
    )

# Cart Admin
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'created_at']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'total_items', 'total_amount', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'session_key']
    readonly_fields = ['created_at', 'updated_at', 'total_items', 'total_amount']
    inlines = [CartItemInline]

# Address Admin
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'city', 'state', 'is_default']
    list_filter = ['address_type', 'state', 'is_default']
    search_fields = ['user__email', 'full_name', 'city']

# Order Admin
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total_amount', 'payment_status', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'user__email']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]

# Contact Admin
@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['created_at']
    list_editable = ['is_read']
