"""
Django management command to import ProSeries products from Home.tsx.

Usage:
    python manage.py import_proseries_products
"""
from django.core.management.base import BaseCommand
from api.models import ProductCategory, Product


class Command(BaseCommand):
    help = 'Import ProSeries products from Home.tsx data structure'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting ProSeries products import...'))
        
        # Create or get ProSeries category
        proseries_category, created = ProductCategory.objects.update_or_create(
            id='proseries',
            defaults={
                'name': 'PRO SERIES',
                'headline': 'Premium Wellness Collection',
                'description': 'Advanced premium formulations for optimal health and wellness',
                'accent_gradient': 'from-amber-500/60 via-yellow-400/40 to-slate-900/90',
                'hero_tagline': 'Premium quality for premium wellness',
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created category: {proseries_category.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Using existing category: {proseries_category.name}'))
        
        # ProSeries products data from Home.tsx
        proseries_products = [
            {
                'name': "PRO OMEGA-3 SOFTGEL CAPSULES",
                'headline': 'Premium Omega-3 Support',
                'price': 1199.00,
                'original_price': 1599.00,
                'rating': 5.0,
                'reviews_count': 45,
                'in_stock': True,
                'accent_gradient': 'from-amber-500/60 via-yellow-400/40 to-slate-900/90',
                'notes': ['High potency', 'Premium quality', 'Easy absorption'],
                'summary': 'Advanced softgel formulation for optimal health with premium Omega-3 fatty acids.',
                'description': 'PRO OMEGA-3 SOFTGEL CAPSULES deliver high-potency Omega-3 fatty acids in an easy-to-absorb softgel format. Formulated with premium quality ingredients to support cardiovascular health, brain function, and overall wellness.',
                'benefits': [
                    'Supports cardiovascular health',
                    'Promotes brain function and cognitive health',
                    'Reduces inflammation naturally',
                    'Easy-to-absorb softgel formulation',
                    'Premium quality ingredients',
                ],
                'key_ingredients': 'High-potency Omega-3 fatty acids (EPA and DHA) from premium fish oil sources, encapsulated in easy-to-digest softgel capsules for optimal absorption.',
                'suitable_for': 'Ideal for adults seeking premium Omega-3 support for cardiovascular health, brain function, and overall wellness.',
                'how_to_use': 'Take 1-2 softgel capsules daily with meals, or as directed by your healthcare provider.',
                'faqs': 'Premium quality Omega-3 supplement. Consult your healthcare provider if you are pregnant, nursing, or on blood-thinning medication.',
                'hero_tagline': 'Premium Omega-3 Support',
            },
            {
                'name': "PRO MEN'S VITALITY BOOSTER GOLD",
                'headline': 'Premium Vitality Support',
                'price': 2499.00,
                'original_price': 3799.00,
                'rating': 5.0,
                'reviews_count': 32,
                'in_stock': True,
                'accent_gradient': 'from-amber-500/60 via-yellow-400/40 to-slate-900/90',
                'notes': ['Gold formula', 'Premium blend', 'Enhanced energy'],
                'summary': 'Gold formulation for enhanced performance and vitality with premium ingredients.',
                'description': "PRO MEN'S VITALITY BOOSTER GOLD is an advanced premium formulation designed to enhance energy, stamina, and overall vitality. This gold-grade supplement combines the finest ingredients for maximum effectiveness.",
                'benefits': [
                    'Enhanced energy and stamina',
                    'Improved performance and endurance',
                    'Premium quality ingredients',
                    'Advanced formulation',
                    'Optimal vitality support',
                ],
                'key_ingredients': 'Premium blend of Ashwagandha KSM-66, Safed Musli, Gokshura, L-Citrulline, Korean Ginseng, and other premium ingredients in gold-grade formulation.',
                'suitable_for': 'Ideal for men seeking premium vitality support, enhanced performance, and optimal energy levels.',
                'how_to_use': 'Take 2 capsules daily with breakfast, or as directed by your healthcare provider.',
                'faqs': 'Premium gold-grade formulation. Consult your healthcare provider if you have cardiovascular conditions or are on medication.',
                'hero_tagline': 'Premium Vitality Support',
            },
            {
                'name': "PRO WOMEN'S HEALTH PLUS",
                'headline': 'Premium Women\'s Wellness',
                'price': 2599.00,
                'original_price': 2599.00,
                'rating': 5.0,
                'reviews_count': 28,
                'in_stock': True,
                'accent_gradient': 'from-rose-500/60 via-pink-400/40 to-slate-900/90',
                'notes': ['Premium formula', 'Advanced support', 'Holistic wellness'],
                'summary': 'Advanced formulation for women\'s health with premium ingredients.',
                'description': "PRO WOMEN'S HEALTH PLUS is a premium advanced formulation designed specifically for women's wellness. This comprehensive supplement supports hormonal balance, energy, and overall health with premium-quality ingredients.",
                'benefits': [
                    'Supports hormonal balance',
                    'Promotes energy and vitality',
                    'Advanced formula for women',
                    'Premium quality ingredients',
                    'Holistic wellness support',
                ],
                'key_ingredients': 'Premium blend of Shatavari, Dong Quai, Evening Primrose Oil, Iron Bisglycinate, Vitamins B6 & B12, Zinc, and other premium ingredients.',
                'suitable_for': 'Ideal for women seeking premium wellness support, hormonal balance, and advanced health benefits.',
                'how_to_use': 'Take 2 capsules daily with breakfast, or as directed by your healthcare provider.',
                'faqs': 'Premium advanced formulation. Consult your healthcare provider if you are pregnant, nursing, or on medication.',
                'hero_tagline': 'Premium Women\'s Wellness',
            },
            {
                'name': "PRO MEN'S MULTIVITAMIN",
                'headline': 'Complete Multivitamin Support',
                'price': 1449.00,
                'original_price': 1899.00,
                'rating': 5.0,
                'reviews_count': 67,
                'in_stock': True,
                'accent_gradient': 'from-amber-500/60 via-yellow-400/40 to-slate-900/90',
                'notes': ['Complete formula', 'Essential vitamins', 'Daily support'],
                'summary': 'Comprehensive multivitamin formulation for men with essential vitamins and minerals.',
                'description': "PRO MEN'S MULTIVITAMIN provides comprehensive nutritional support with essential vitamins and minerals specifically formulated for men's health needs.",
                'benefits': [
                    'Complete vitamin and mineral support',
                    'Designed for men\'s health needs',
                    'Daily nutritional foundation',
                    'Premium quality ingredients',
                    'Easy-to-take formulation',
                ],
                'key_ingredients': 'Comprehensive blend of essential vitamins (A, C, D, E, K, B-complex) and minerals (Zinc, Magnesium, Selenium, etc.) formulated for men.',
                'suitable_for': 'Ideal for men seeking comprehensive daily nutritional support and essential vitamin and mineral supplementation.',
                'how_to_use': 'Take 1-2 capsules daily with meals, or as directed by your healthcare provider.',
                'faqs': 'Complete multivitamin formulation. Consult your healthcare provider if you have specific health conditions or are on medication.',
                'hero_tagline': 'Complete Multivitamin Support',
            },
        ]
        
        created_count = 0
        updated_count = 0
        
        for product_data in proseries_products:
            product, created = Product.objects.update_or_create(
                category=proseries_category,
                name=product_data['name'],
                defaults={
                    'headline': product_data['headline'],
                    'price': product_data['price'],
                    'original_price': product_data.get('original_price'),
                    'rating': product_data['rating'],
                    'reviews_count': product_data['reviews_count'],
                    'in_stock': product_data['in_stock'],
                    'accent_gradient': product_data['accent_gradient'],
                    'notes': product_data['notes'],
                    'summary': product_data['summary'],
                    'description': product_data['description'],
                    'benefits': product_data['benefits'],
                    'key_ingredients': product_data['key_ingredients'],
                    'suitable_for': product_data['suitable_for'],
                    'how_to_use': product_data['how_to_use'],
                    'faqs': product_data['faqs'],
                    'hero_tagline': product_data['hero_tagline'],
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'  [OK] Created product: {product.name}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'  [UPDATED] Updated product: {product.name}'))
        
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS(f'ProSeries import completed!'))
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count} products'))
        self.stdout.write(self.style.SUCCESS(f'  Updated: {updated_count} products'))
        self.stdout.write(self.style.SUCCESS(f'  Total ProSeries products: {Product.objects.filter(category=proseries_category).count()}'))
        self.stdout.write(self.style.SUCCESS('='*50))

