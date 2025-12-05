"""
Django management command to sync ALL products and categories from frontend to database.

This command imports:
- All 6 main products from products.ts
- All 4 ProSeries products from Home.tsx

Usage:
    python manage.py sync_all_products
"""
from django.core.management.base import BaseCommand
from api.models import ProductCategory, Product


class Command(BaseCommand):
    help = 'Sync all products and categories from frontend code to database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting comprehensive product sync...'))
        
        # All products data from frontend
        all_products_data = [
            # Main Products from products.ts
            {
                'category_id': 'dia-care',
                'category_name': 'DIA CARE',
                'category_headline': 'Glycemic Harmony Blend',
                'category_description': 'Diabetes management and blood sugar balance products',
                'category_accent_gradient': 'from-purple-500/60 via-fuchsia-400/40 to-slate-900/90',
                'category_hero_tagline': 'Support balanced blood sugar without compromise',
                'product': {
                    'name': 'DIA CARE',
                    'headline': 'Glycemic Harmony Blend',
                    'price': 1190.00,
                    'original_price': 1499.00,
                    'rating': 5.0,
                    'reviews_count': 128,
                    'in_stock': True,
                    'accent_gradient': 'from-purple-500/60 via-fuchsia-400/40 to-slate-900/90',
                    'notes': [],
                    'summary': 'A natural botanical blend that supports healthy blood sugar balance, boosts energy and metabolism, and promotes overall metabolic wellness—gently and effectively.',
                    'description': 'MYURA Diabetes Management is a nutritional wellness formula for anyone who wants steady glucose rhythms without harsh synthetics. Whether you are managing early signs of imbalance or striving to maintain consistent energy throughout the day, this 15-herb blend works in harmony with your body to keep pancreatic health, digestion, and sugar regulation in check.',
                    'benefits': [
                        'Supports balanced blood sugar levels naturally',
                        'Improves daily energy, metabolism, and sugar control',
                        'Helps curb cravings and reduces fatigue after meals',
                        'Aids pancreatic, liver, and cardiovascular health',
                        'Promotes a steady, non-spiking energy flow',
                    ],
                    'key_ingredients': 'Each 500 mg capsule features Neem, Vijaysar, Amla, Kutki, Giloy, Karela, Jamun, Gudmar, Methi, Turmeric, Jamun seed, Kalmegh, Shilajit, and other classical botanicals chosen for comprehensive metabolic support.',
                    'suitable_for': 'Ideal for adults seeking natural support in managing blood sugar levels, individuals with a family history of diabetes or pre-diabetic symptoms, and anyone who experiences fatigue or cravings after meals.',
                    'how_to_use': 'Take 1–2 capsules, twice or thrice daily, with warm water or milk—preferably after meals.',
                    'faqs': 'Designed for routine wellness use. Consult your healthcare provider if you are pregnant, nursing, or on prescription medication.',
                    'hero_tagline': 'Support balanced blood sugar without compromise',
                }
            },
            {
                'category_id': 'liver-detox',
                'category_name': 'LIVER DETOX FORMULA',
                'category_headline': 'Deep Cleanse Elixir',
                'category_description': 'Liver detoxification and cleansing products',
                'category_accent_gradient': 'from-emerald-400/60 via-teal-300/40 to-slate-900/90',
                'category_hero_tagline': 'Clarify, cleanse, and feel light every day',
                'product': {
                    'name': 'LIVER DETOX FORMULA',
                    'headline': 'Deep Cleanse Elixir',
                    'price': 1320.00,
                    'original_price': 1990.00,
                    'rating': 5.0,
                    'reviews_count': 95,
                    'in_stock': True,
                    'accent_gradient': 'from-emerald-400/60 via-teal-300/40 to-slate-900/90',
                    'notes': [],
                    'summary': 'Revitalise the body\'s master filter with botanicals that restore clarity from within.',
                    'description': 'Liver Detox Formula is a slow-infused tonic that supports daily detoxification, combats sluggishness, and renews digestive vitality. Thoughtfully crafted to flush toxic build-up while keeping you energised.',
                    'benefits': [
                        'Assists the liver\'s natural detox pathways',
                        'Combats bloating and heaviness after rich meals',
                        'Promotes clearer skin and brighter mood',
                        'Supports bile production and digestive comfort',
                        'Protects hepatic tissue from oxidative stress',
                    ],
                    'key_ingredients': 'Milk thistle seed, Kutki root, Dandelion, Triphala, Turmeric, and Bioperine synergise to sweep toxins, enhance bile flow, and protect liver cells.',
                    'suitable_for': 'Perfect for individuals experiencing digestive slowdown, dull skin tone, or lifestyle-induced toxin load including processed foods or alcohol.',
                    'how_to_use': 'Take two capsules after breakfast and dinner. Hydrate amply and pair with leafy greens to amplify detox benefits.',
                    'faqs': 'Gentle enough for daily use. You may experience lighter digestion within the first week. If pregnant or nursing, please check with your healthcare provider.',
                    'hero_tagline': 'Clarify, cleanse, and feel light every day',
                }
            },
            {
                'category_id': 'bone-joint-support',
                'category_name': 'BONE & JOINT SUPPORT',
                'category_headline': 'Mobility Care Formula',
                'category_description': 'Bone and joint health support products',
                'category_accent_gradient': 'from-blue-500/60 via-indigo-400/40 to-slate-900/90',
                'category_hero_tagline': '',
                'product': {
                    'name': 'BONE & JOINT SUPPORT',
                    'headline': 'Mobility Care Formula',
                    'price': 1299.00,
                    'original_price': 1499.00,
                    'rating': 5.0,
                    'reviews_count': 67,
                    'in_stock': True,
                    'accent_gradient': 'from-blue-500/60 via-indigo-400/40 to-slate-900/90',
                    'notes': [],
                    'summary': 'Strengthen movement and cushion every step with collagen-smart nourishment.',
                    'description': 'Bone & Joint Support is an advanced mobility blend engineered to reinforce cartilage, lubricate joints, and ease stiffness so you can move with youthful freedom.',
                    'benefits': [
                        'Supports joint cushioning and flexibility',
                        'Provides plant-driven collagen stimulation',
                        'Eases stiffness from long hours or workouts',
                        'Feeds bones with highly bioavailable minerals',
                        'Guards connective tissue from wear and tear',
                    ],
                    'key_ingredients': 'Boswellia serrata, Shallaki, Cissus quadrangularis, plant-based Calcium, Bamboo silica, and Vitamin D3 combine to protect joints and rebuild resilience.',
                    'suitable_for': 'Great for active individuals, professionals seated long hours, and anyone seeking graceful ageing support for joints.',
                    'how_to_use': 'Take two capsules with breakfast and two with dinner. Keep hydration high and pair with gentle mobility stretches.',
                    'faqs': 'Expect progressive relief within 3-4 weeks. Safe to pair with physiotherapy and light exercise. Consult your physician if on anticoagulant therapy.',
                    'hero_tagline': '',
                }
            },
            {
                'category_id': 'gut-and-digestion',
                'category_name': 'GUT AND DIGESTION',
                'category_headline': 'Microbiome Balance Mix',
                'category_description': 'Digestive health and gut wellness products',
                'category_accent_gradient': 'from-amber-500/60 via-orange-400/40 to-slate-900/90',
                'category_hero_tagline': 'Comfort, clarity, and complete nourishment',
                'product': {
                    'name': 'GUT AND DIGESTION',
                    'headline': 'Microbiome Balance Mix',
                    'price': 980.00,
                    'original_price': 1199.00,
                    'rating': 5.0,
                    'reviews_count': 89,
                    'in_stock': True,
                    'accent_gradient': 'from-amber-500/60 via-orange-400/40 to-slate-900/90',
                    'notes': [],
                    'summary': 'Soothe the gut, rebalance the microbiome, and glow from improved nutrient absorption.',
                    'description': 'Gut and Digestion is a cultured botanical blend that supports digestive fire, nurtures friendly flora, and keeps you feeling light after every meal.',
                    'benefits': [
                        'Relieves bloating, gas, and post-meal heaviness',
                        'Feeds the microbiome with prebiotic fibres',
                        'Delivers soil-based probiotics for resilience',
                        'Supports nutrient assimilation and gut lining integrity',
                        'Calms the gut-brain axis to reduce stress-induced flare-ups',
                    ],
                    'key_ingredients': 'Prebiotic chicory inulin, Triphala, Licorice root, Ginger, peppermint, and resilient Bacillus coagulans spores craft the perfect balance of comfort and flora diversity.',
                    'suitable_for': 'Designed for those managing bloating, irregular digestion, or wanting support after antibiotics or travel.',
                    'how_to_use': 'Take two capsules before your largest meal or as advised by your practitioner. Pair with mindful chewing and warm water through the day.',
                    'faqs': 'You may feel lighter within the first week. Temporary adjustments are normal as the microbiome rebalances. Safe for daily long-term use.',
                    'hero_tagline': 'Comfort, clarity, and complete nourishment',
                }
            },
            {
                'category_id': 'womens-health-plus',
                'category_name': "WOMEN'S HEALTH PLUS",
                'category_headline': 'Hormonal Vitality Ritual',
                'category_description': "Women's health and hormonal balance products",
                'category_accent_gradient': 'from-rose-500/60 via-pink-400/40 to-slate-900/90',
                'category_hero_tagline': 'Radiance is a daily ritual',
                'product': {
                    'name': "WOMEN'S HEALTH PLUS",
                    'headline': 'Hormonal Vitality Ritual',
                    'price': 1260.00,
                    'original_price': 1699.00,
                    'rating': 5.0,
                    'reviews_count': 156,
                    'in_stock': True,
                    'accent_gradient': 'from-rose-500/60 via-pink-400/40 to-slate-900/90',
                    'notes': [],
                    'summary': 'Bring rhythm back to your cycle, skin, and mood with plant wisdom tailored for women.',
                    'description': "Women's Health Plus is a lunar-aligned blend that balances hormones, uplifts mood, and supports radiance from the inside out.",
                    'benefits': [
                        'Balances hormonal peaks and dips across the month',
                        'Eases PMS discomfort and mood swings',
                        'Supports skin luminosity and hair strength',
                        'Optimises energy and stress response',
                        'Fortifies iron stores and micronutrient reserves',
                    ],
                    'key_ingredients': 'Shatavari nourishes estrogen balance and soothes the nervous system. Dong Quai supports circulation and eases cyclical discomfort. Evening primrose oil delivers GLA to hydrate skin and calm inflammation. Iron bisglycinate rebuilds iron stores without upsetting the gut. Vitamins B6 & B12 steady mood and energy metabolism. Zinc keeps hormones converting smoothly and fortifies skin resilience.',
                    'suitable_for': 'Ideal for women seeking cycle balance, perimenopause support, or a daily ritual for mood and beauty resilience.',
                    'how_to_use': 'Take two capsules with breakfast. During luteal days, an additional capsule with dinner can provide extra comfort.',
                    'faqs': 'Consistent use over 8-12 weeks amplifies results. Safe alongside most oral contraceptives, though we recommend checking with your doctor.',
                    'hero_tagline': 'Radiance is a daily ritual',
                }
            },
            {
                'category_id': 'mens-vitality-booster',
                'category_name': "MEN'S VITALITY BOOSTER",
                'category_headline': 'Performance Energy Complex',
                'category_description': "Men's health and vitality products",
                'category_accent_gradient': 'from-sky-500/60 via-cyan-400/40 to-slate-900/90',
                'category_hero_tagline': 'Command the day with effortless drive',
                'product': {
                    'name': "MEN'S VITALITY BOOSTER",
                    'headline': 'Performance Energy Complex',
                    'price': 1599.00,
                    'original_price': 2150.00,
                    'rating': 5.0,
                    'reviews_count': 73,
                    'in_stock': True,
                    'accent_gradient': 'from-sky-500/60 via-cyan-400/40 to-slate-900/90',
                    'notes': ['Endurance botanical stack', 'Daily stress resilience'],
                    'summary': 'Energise stamina, focus, and resilience with botanicals tuned to men\'s physiology.',
                    'description': "Men's Vitality Booster is a performance ritual that promotes stamina, mental sharpness, and robust stress response without the jitters.",
                    'benefits': [
                        'Improves energy and endurance for busy days or training',
                        'Supports hormonal balance and vitality',
                        'Enhances mental focus and clarity',
                        'Helps manage stress by modulating cortisol',
                        'Boosts nitric oxide for healthy circulation',
                    ],
                    'key_ingredients': 'Ashwagandha KSM-66, Safed Musli, Gokshura, L-Citrulline, Korean Ginseng, and Magnesium activate cellular energy while fortifying endurance.',
                    'suitable_for': 'Ideal for professionals, athletes, and men managing stress-heavy routines who want clean, sustained drive.',
                    'how_to_use': 'Take two capsules with breakfast. On high-output days, an additional capsule pre-workout enhances stamina.',
                    'faqs': 'Non-stimulant and safe for everyday use. Results build steadily over 3-6 weeks. Consult a practitioner if you have cardiovascular conditions.',
                    'hero_tagline': 'Command the day with effortless drive',
                }
            },
            # ProSeries Products from Home.tsx - Each with separate category
            {
                'category_id': 'pro-omega-3-softgel-capsules',
                'category_name': 'PRO OMEGA-3 SOFTGEL CAPSULES',
                'category_headline': 'Premium Omega-3 Support',
                'category_description': 'Advanced softgel formulation for optimal health with premium Omega-3 fatty acids',
                'category_accent_gradient': 'from-amber-500/60 via-yellow-400/40 to-slate-900/90',
                'category_hero_tagline': 'Premium Omega-3 Support',
                'product': {
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
                }
            },
            {
                'category_id': 'pro-mens-vitality-booster-gold',
                'category_name': "PRO MEN'S VITALITY BOOSTER GOLD",
                'category_headline': 'Premium Vitality Support',
                'category_description': 'Gold formulation for enhanced performance and vitality with premium ingredients',
                'category_accent_gradient': 'from-amber-500/60 via-yellow-400/40 to-slate-900/90',
                'category_hero_tagline': 'Premium Vitality Support',
                'product': {
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
                }
            },
            {
                'category_id': 'pro-womens-health-plus',
                'category_name': "PRO WOMEN'S HEALTH PLUS",
                'category_headline': 'Premium Women\'s Wellness',
                'category_description': 'Advanced formulation for women\'s health with premium ingredients',
                'category_accent_gradient': 'from-rose-500/60 via-pink-400/40 to-slate-900/90',
                'category_hero_tagline': 'Premium Women\'s Wellness',
                'product': {
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
                }
            },
            {
                'category_id': 'pro-mens-multivitamin',
                'category_name': "PRO MEN'S MULTIVITAMIN",
                'category_headline': 'Complete Multivitamin Support',
                'category_description': 'Comprehensive multivitamin formulation for men with essential vitamins and minerals',
                'category_accent_gradient': 'from-amber-500/60 via-yellow-400/40 to-slate-900/90',
                'category_hero_tagline': 'Complete Multivitamin Support',
                'product': {
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
                }
            },
        ]
        
        created_categories = 0
        updated_categories = 0
        created_products = 0
        updated_products = 0
        
        # Process all products
        for item in all_products_data:
            category_id = item['category_id']
            category_data = {
                'id': category_id,
                'name': item['category_name'],
                'headline': item['category_headline'],
                'description': item['category_description'],
                'accent_gradient': item['category_accent_gradient'],
                'hero_tagline': item['category_hero_tagline'],
            }
            
            # Create or update category
            category, cat_created = ProductCategory.objects.update_or_create(
                id=category_id,
                defaults=category_data
            )
            
            if cat_created:
                created_categories += 1
                self.stdout.write(self.style.SUCCESS(f'[NEW] Category: {category.name}'))
            else:
                updated_categories += 1
                self.stdout.write(self.style.WARNING(f'[UPDATED] Category: {category.name}'))
            
            # Create or update product
            product_data = item['product']
            product, prod_created = Product.objects.update_or_create(
                category=category,
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
            
            if prod_created:
                created_products += 1
                self.stdout.write(self.style.SUCCESS(f'  [NEW] Product: {product.name}'))
            else:
                updated_products += 1
                self.stdout.write(self.style.WARNING(f'  [UPDATED] Product: {product.name}'))
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('SYNC COMPLETED SUCCESSFULLY!'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.SUCCESS(f'Categories:'))
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_categories}'))
        self.stdout.write(self.style.SUCCESS(f'  Updated: {updated_categories}'))
        self.stdout.write(self.style.SUCCESS(f'Products:'))
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_products}'))
        self.stdout.write(self.style.SUCCESS(f'  Updated: {updated_products}'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.SUCCESS(f'\nTotal Categories in DB: {ProductCategory.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Total Products in DB: {Product.objects.count()}'))
        self.stdout.write(self.style.SUCCESS('='*60))

