import { ResponsiveImageDescriptor } from '../components/ResponsiveProductImage';

const encodeAssetPath = (path: string) =>
  encodeURI(path).replace(/&/g, '%26').replace(/'/g, '%27');

const buildImageDescriptor = (
  folder: string,
  baseName: string,
  extension: 'png' | 'jpg',
  alt: string
): ResponsiveImageDescriptor => {
  const baseFolder = `/Final Images/${folder}`;
  const optimizedBase = `${baseFolder}/optimized/${baseName}`;

  return {
    alt,
    fallback: encodeAssetPath(`${baseFolder}/${baseName}.${extension}`),
    placeholder: encodeAssetPath(`${optimizedBase}-placeholder.jpg`),
    sources: [
      {
        type: 'image/avif',
        srcSet: [
          `${encodeAssetPath(`${optimizedBase}-320w.avif`)} 320w`,
          `${encodeAssetPath(`${optimizedBase}-640w.avif`)} 640w`,
          `${encodeAssetPath(`${optimizedBase}-960w.avif`)} 960w`,
        ].join(', '),
      },
      {
        type: 'image/webp',
        srcSet: [
          `${encodeAssetPath(`${optimizedBase}-320w.webp`)} 320w`,
          `${encodeAssetPath(`${optimizedBase}-640w.webp`)} 640w`,
          `${encodeAssetPath(`${optimizedBase}-960w.webp`)} 960w`,
        ].join(', '),
      },
    ],
    fallbackSrcSet: [
      `${encodeAssetPath(`${optimizedBase}-320w.webp`)} 320w`,
      `${encodeAssetPath(`${optimizedBase}-640w.webp`)} 640w`,
      `${encodeAssetPath(`${optimizedBase}-960w.webp`)} 960w`,
    ].join(', '),
    width: 960,
    height: 960,
  };
};

const buildGallery = (
  folder: string,
  extension: 'png' | 'jpg',
  altBase: string,
  frames: Array<{ name: string; altSuffix: string }>
) =>
  frames.map(({ name, altSuffix }) =>
    buildImageDescriptor(folder, name, extension, `${altBase} ${altSuffix}`.trim())
  );

export type ProductRecord = {
  id: string;
  name: string;
  headline: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  accentGradient: string;
  notes: string[];
  summary: string;
  description: string;
  benefits: string[];
  keyIngredients: string;
  suitableFor: string;
  howToUse: string;
  faqs: string;
  image: ResponsiveImageDescriptor;
  gallery: ResponsiveImageDescriptor[];
  heroTagline: string;
};

export const productCatalog: ProductRecord[] = [
  {
    id: 'dia-care',
    name: 'DIA CARE',
    headline: 'Glycemic Harmony Blend',
    price: 1190,
    originalPrice: 1499,
    rating: 5,
    reviews: 128,
    inStock: true,
    accentGradient: 'from-purple-500/60 via-fuchsia-400/40 to-slate-900/90',
    notes: ['Low GI botanical matrix', 'Chromium + adaptogenic herbs'],
    summary:
      'Support balanced blood sugar and sustained daytime energy without the crash.',
    description:
      'Dia Care is a ritual-led formula that helps support healthy glucose metabolism and soften post-meal spikes. Crafted with clinically studied botanicals, it keeps you grounded, clear, and energised throughout your day.',
    benefits: [
      'Helps maintain healthy blood sugar rhythms',
      'Reduces cravings triggered by glycemic swings',
      'Supports pancreatic and hepatic wellness',
      'Delivers steady, sustained energy levels',
      'Fortified with antioxidants that protect vascular integrity',
    ],
    keyIngredients:
      'Gymnema sylvestre leaf, Jamun seed, Cinnamon bark, Fenugreek seed, Chromium picolinate, and adaptogenic Ashwagandha harmonise to stabilise sugar absorption and improve insulin sensitivity.',
    suitableFor:
      'Ideal for individuals managing erratic energy, sugar cravings, or early metabolic warning signs and seeking a nature-first approach to metabolic balance.',
    howToUse:
      'Take two capsules twice daily with water after meals. Pair with mindful eating and daily movement for enhanced outcomes.',
    faqs:
      'You can pair Dia Care with other Myura blends. We suggest consistent use for at least 6-8 weeks to experience full benefits. Always consult your practitioner if you are on prescription medication.',
    image: buildImageDescriptor(
      'Dia Care',
      'main',
      'png',
      'Dia Care supplement bottle surrounded by botanicals'
    ),
    gallery: buildGallery('Dia Care', 'png', 'Dia Care supplement', [
      { name: 'main', altSuffix: 'hero bottle close-up' },
      { name: '1', altSuffix: 'styled on marble surface' },
      { name: '3', altSuffix: 'with measuring spoon of powder' },
      { name: '4', altSuffix: 'flat lay with fresh ingredients' },
    ]),
    heroTagline: 'Metabolic clarity in every capsule',
  },
  {
    id: 'liver-detox',
    name: 'LIVER DETOX FORMULA',
    headline: 'Deep Cleanse Elixir',
    price: 1320,
    originalPrice: 1990,
    rating: 5,
    reviews: 95,
    inStock: true,
    accentGradient: 'from-emerald-400/60 via-teal-300/40 to-slate-900/90',
    notes: ['Milk thistle powered', 'Supports gentle daily detox'],
    summary:
      'Revitalise the body’s master filter with botanicals that restore clarity from within.',
    description:
      'Liver Detox Formula is a slow-infused tonic that supports daily detoxification, combats sluggishness, and renews digestive vitality. Thoughtfully crafted to flush toxic build-up while keeping you energised.',
    benefits: [
      'Assists the liver’s natural detox pathways',
      'Combats bloating and heaviness after rich meals',
      'Promotes clearer skin and brighter mood',
      'Supports bile production and digestive comfort',
      'Protects hepatic tissue from oxidative stress',
    ],
    keyIngredients:
      'Milk thistle seed, Kutki root, Dandelion, Triphala, Turmeric, and Bioperine synergise to sweep toxins, enhance bile flow, and protect liver cells.',
    suitableFor:
      'Perfect for individuals experiencing digestive slowdown, dull skin tone, or lifestyle-induced toxin load including processed foods or alcohol.',
    howToUse:
      'Take two capsules after breakfast and dinner. Hydrate amply and pair with leafy greens to amplify detox benefits.',
    faqs:
      'Gentle enough for daily use. You may experience lighter digestion within the first week. If pregnant or nursing, please check with your healthcare provider.',
    image: buildImageDescriptor(
      'Liver Detox',
      'main',
      'png',
      'Liver Detox formula bottle with citrus and herbs'
    ),
    gallery: buildGallery('Liver Detox', 'png', 'Liver Detox formula', [
      { name: 'main', altSuffix: 'hero bottle with citrus accents' },
      { name: '1', altSuffix: 'styled on slate with glassware' },
      { name: '2', altSuffix: 'capsules and dried botanicals' },
      { name: '4', altSuffix: 'flat lay with lemon slices' },
    ]),
    heroTagline: 'Clarify, cleanse, and feel light every day',
  },
  {
    id: 'bone-joint-support',
    name: 'BONE & JOINT SUPPORT',
    headline: 'Mobility Care Formula',
    price: 1299,
    originalPrice: 1499,
    rating: 5,
    reviews: 67,
    inStock: true,
    accentGradient: 'from-blue-500/60 via-indigo-400/40 to-slate-900/90',
    notes: ['Advanced collagen boosters', 'Joint comfort botanicals'],
    summary:
      'Strengthen movement and cushion every step with collagen-smart nourishment.',
    description:
      'Bone & Joint Support is an advanced mobility blend engineered to reinforce cartilage, lubricate joints, and ease stiffness so you can move with youthful freedom.',
    benefits: [
      'Supports joint cushioning and flexibility',
      'Provides plant-driven collagen stimulation',
      'Eases stiffness from long hours or workouts',
      'Feeds bones with highly bioavailable minerals',
      'Guards connective tissue from wear and tear',
    ],
    keyIngredients:
      'Boswellia serrata, Shallaki, Cissus quadrangularis, plant-based Calcium, Bamboo silica, and Vitamin D3 combine to protect joints and rebuild resilience.',
    suitableFor:
      'Great for active individuals, professionals seated long hours, and anyone seeking graceful ageing support for joints.',
    howToUse:
      'Take two capsules with breakfast and two with dinner. Keep hydration high and pair with gentle mobility stretches.',
    faqs:
      'Expect progressive relief within 3-4 weeks. Safe to pair with physiotherapy and light exercise. Consult your physician if on anticoagulant therapy.',
    image: buildImageDescriptor(
      'Bons &  Joints',
      'main',
      'png',
      'Bone and Joint Support blend with active botanicals'
    ),
    gallery: buildGallery('Bons &  Joints', 'png', 'Bone and Joint Support', [
      { name: 'main', altSuffix: 'hero display with herbal accents' },
      { name: '1', altSuffix: 'capsules and wooden spoon' },
      { name: '3', altSuffix: 'on textured stone surface' },
      { name: '4', altSuffix: 'flat lay with joint-friendly herbs' },
    ]),
    heroTagline: 'Movement without compromise',
  },
  {
    id: 'gut-and-digestion',
    name: 'GUT AND DIGESTION',
    headline: 'Microbiome Balance Mix',
    price: 980,
    originalPrice: 1199,
    rating: 5,
    reviews: 89,
    inStock: true,
    accentGradient: 'from-amber-500/60 via-orange-400/40 to-slate-900/90',
    notes: ['Pre + probiotic synergy', 'Calms and nurtures digestion'],
    summary:
      'Soothe the gut, rebalance the microbiome, and glow from improved nutrient absorption.',
    description:
      'Gut and Digestion is a cultured botanical blend that supports digestive fire, nurtures friendly flora, and keeps you feeling light after every meal.',
    benefits: [
      'Relieves bloating, gas, and post-meal heaviness',
      'Feeds the microbiome with prebiotic fibres',
      'Delivers soil-based probiotics for resilience',
      'Supports nutrient assimilation and gut lining integrity',
      'Calms the gut-brain axis to reduce stress-induced flare-ups',
    ],
    keyIngredients:
      'Prebiotic chicory inulin, Triphala, Licorice root, Ginger, peppermint, and resilient Bacillus coagulans spores craft the perfect balance of comfort and flora diversity.',
    suitableFor:
      'Designed for those managing bloating, irregular digestion, or wanting support after antibiotics or travel.',
    howToUse:
      'Take two capsules before your largest meal or as advised by your practitioner. Pair with mindful chewing and warm water through the day.',
    faqs:
      'You may feel lighter within the first week. Temporary adjustments are normal as the microbiome rebalances. Safe for daily long-term use.',
    image: buildImageDescriptor(
      'Gut & Digestions',
      'main',
      'png',
      'Gut and Digestion tonic with fresh ingredients'
    ),
    gallery: buildGallery('Gut & Digestions', 'png', 'Gut and Digestion blend', [
      { name: 'main', altSuffix: 'hero jar with citrus and herbs' },
      { name: '1', altSuffix: 'capsules next to tea cup' },
      { name: '2', altSuffix: 'flat lay with spices' },
      { name: '3', altSuffix: 'close-up of capsules and botanicals' },
    ]),
    heroTagline: 'Comfort, clarity, and complete nourishment',
  },
  {
    id: 'womens-health-plus',
    name: "WOMEN'S HEALTH PLUS",
    headline: 'Hormonal Vitality Ritual',
    price: 1260,
    originalPrice: 1699,
    rating: 5,
    reviews: 156,
    inStock: true,
    accentGradient: 'from-rose-500/60 via-pink-400/40 to-slate-900/90',
    notes: ['Cycle-supportive adaptogens', 'Beauty-from-within nutrients'],
    summary:
      'Bring rhythm back to your cycle, skin, and mood with plant wisdom tailored for women.',
    description:
      "Women's Health Plus is a lunar-aligned blend that balances hormones, uplifts mood, and supports radiance from the inside out.",
    benefits: [
      'Balances hormonal peaks and dips across the month',
      'Eases PMS discomfort and mood swings',
      'Supports skin luminosity and hair strength',
      'Optimises energy and stress response',
      'Fortifies iron stores and micronutrient reserves',
    ],
    keyIngredients:
      'Shatavari, Dong Quai, Evening primrose, Iron bisglycinate, Vitamins B6 & B12, and Zinc cultivate hormonal harmony and radiance.',
    suitableFor:
      'Ideal for women seeking cycle balance, perimenopause support, or a daily ritual for mood and beauty resilience.',
    howToUse:
      'Take two capsules with breakfast. During luteal days, an additional capsule with dinner can provide extra comfort.',
    faqs:
      'Consistent use over 8-12 weeks amplifies results. Safe alongside most oral contraceptives, though we recommend checking with your doctor.',
    image: buildImageDescriptor(
      'Women_s Health Plus',
      'main',
      'png',
      "Women's Health Plus premium blend bottle"
    ),
    gallery: buildGallery('Women_s Health Plus', 'png', "Women's Health Plus blend", [
      { name: 'main', altSuffix: 'hero bottle with floral styling' },
      { name: '2', altSuffix: 'capsules on silk cloth' },
      { name: '3', altSuffix: 'flat lay with rose petals' },
      { name: '4', altSuffix: 'detail shot with cup of tea' },
    ]),
    heroTagline: 'Radiance is a daily ritual',
  },
  {
    id: 'mens-vitality-booster',
    name: "MEN'S VITALITY BOOSTER",
    headline: 'Performance Energy Complex',
    price: 1599,
    originalPrice: 2150,
    rating: 5,
    reviews: 73,
    inStock: true,
    accentGradient: 'from-sky-500/60 via-cyan-400/40 to-slate-900/90',
    notes: ['Endurance botanical stack', 'Daily stress resilience'],
    summary:
      'Energise stamina, focus, and resilience with botanicals tuned to men’s physiology.',
    description:
      "Men's Vitality Booster is a performance ritual that promotes stamina, mental sharpness, and robust stress response without the jitters.",
    benefits: [
      'Improves energy and endurance for busy days or training',
      'Supports hormonal balance and vitality',
      'Enhances mental focus and clarity',
      'Helps manage stress by modulating cortisol',
      'Boosts nitric oxide for healthy circulation',
    ],
    keyIngredients:
      'Ashwagandha KSM-66, Safed Musli, Gokshura, L-Citrulline, Korean Ginseng, and Magnesium activate cellular energy while fortifying endurance.',
    suitableFor:
      'Ideal for professionals, athletes, and men managing stress-heavy routines who want clean, sustained drive.',
    howToUse:
      'Take two capsules with breakfast. On high-output days, an additional capsule pre-workout enhances stamina.',
    faqs:
      'Non-stimulant and safe for everyday use. Results build steadily over 3-6 weeks. Consult a practitioner if you have cardiovascular conditions.',
    image: buildImageDescriptor(
      'Men_s Vitalty Boost',
      'main',
      'jpg',
      "Men's Vitality Boost supplement bottle"
    ),
    gallery: buildGallery('Men_s Vitalty Boost', 'jpg', "Men's Vitality Boost blend", [
      { name: 'main', altSuffix: 'hero bottle with dark botanicals' },
      { name: '1', altSuffix: 'flat lay with energising herbs' },
      { name: '2', altSuffix: 'capsules on brushed metal surface' },
      { name: '4', altSuffix: 'detail with tonic shot glass' },
    ]),
    heroTagline: 'Command the day with effortless drive',
  },
];

const productMap = productCatalog.reduce<Record<string, ProductRecord>>((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});

export const getProductById = (id: string | undefined | null) =>
  id ? productMap[id] ?? null : null;

export const getRelatedProducts = (id: string, limit = 4) =>
  productCatalog.filter((product) => product.id !== id).slice(0, limit);

export { encodeAssetPath, buildImageDescriptor };



