"""
Django management command to cleanup old proseries category and move products to new categories.

Usage:
    python manage.py cleanup_proseries
"""
from django.core.management.base import BaseCommand
from api.models import ProductCategory, Product


class Command(BaseCommand):
    help = 'Cleanup old proseries category and move products to individual categories'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting ProSeries cleanup...'))
        
        # Mapping of product names to their new category IDs
        product_to_category = {
            "PRO OMEGA-3 SOFTGEL CAPSULES": "pro-omega-3-softgel-capsules",
            "PRO MEN'S VITALITY BOOSTER GOLD": "pro-mens-vitality-booster-gold",
            "PRO WOMEN'S HEALTH PLUS": "pro-womens-health-plus",
            "PRO MEN'S MULTIVITAMIN": "pro-mens-multivitamin",
        }
        
        old_category = ProductCategory.objects.filter(id='proseries').first()
        
        if not old_category:
            self.stdout.write(self.style.SUCCESS('No old proseries category found. Nothing to cleanup.'))
            return
        
        products_in_old = Product.objects.filter(category=old_category)
        self.stdout.write(self.style.WARNING(f'Found {products_in_old.count()} products in old proseries category'))
        
        moved_count = 0
        deleted_count = 0
        
        for product in products_in_old:
            new_category_id = product_to_category.get(product.name)
            
            if new_category_id:
                new_category = ProductCategory.objects.filter(id=new_category_id).first()
                
                if new_category:
                    # Check if product already exists in new category
                    existing = Product.objects.filter(category=new_category, name=product.name).first()
                    
                    if existing:
                        # Product already exists in new category, delete the old one
                        product.delete()
                        deleted_count += 1
                        self.stdout.write(self.style.SUCCESS(f'  [DELETED] Duplicate: {product.name}'))
                    else:
                        # Move product to new category
                        product.category = new_category
                        product.save()
                        moved_count += 1
                        self.stdout.write(self.style.SUCCESS(f'  [MOVED] {product.name} -> {new_category.name}'))
                else:
                    self.stdout.write(self.style.ERROR(f'  [ERROR] New category not found: {new_category_id}'))
            else:
                self.stdout.write(self.style.WARNING(f'  [SKIP] No mapping for: {product.name}'))
        
        # Delete old category if empty
        remaining = Product.objects.filter(category=old_category).count()
        if remaining == 0:
            old_category.delete()
            self.stdout.write(self.style.SUCCESS(f'[DELETED] Old proseries category'))
        else:
            self.stdout.write(self.style.WARNING(f'[KEPT] Old proseries category (still has {remaining} products)'))
        
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('Cleanup completed!'))
        self.stdout.write(self.style.SUCCESS(f'  Moved: {moved_count} products'))
        self.stdout.write(self.style.SUCCESS(f'  Deleted: {deleted_count} duplicates'))
        self.stdout.write(self.style.SUCCESS('='*60))













