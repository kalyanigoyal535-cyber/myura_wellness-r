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

const buildImageDescriptorFromOptimized = (
  folder: string,
  baseName: string,
  extension: 'png' | 'jpg',
  alt: string
): ResponsiveImageDescriptor => {
  const baseFolder = `/Final Images/${folder}`;
  const optimizedPath = `${baseFolder}/optimized/${baseName}.${extension}`;

  return {
    alt,
    fallback: encodeAssetPath(optimizedPath),
    placeholder: encodeAssetPath(optimizedPath),
    sources: [],
    fallbackSrcSet: `${encodeAssetPath(optimizedPath)} 960w`,
    width: 960,
    height: 960,
  };
};

const buildImageDescriptorSimple = (
  folder: string,
  baseName: string,
  extension: 'png' | 'jpg',
  alt: string
): ResponsiveImageDescriptor => {
  const baseFolder = `/Final Images/${folder}`;
  const imagePath = `${baseFolder}/${baseName}.${extension}`;

  return {
    alt,
    fallback: encodeAssetPath(imagePath),
    placeholder: encodeAssetPath(imagePath),
    sources: [],
    fallbackSrcSet: `${encodeAssetPath(imagePath)} 960w`,
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

const buildGalleryFromOptimized = (
  folder: string,
  extension: 'png' | 'jpg',
  altBase: string,
  frames: Array<{ name: string; altSuffix: string }>
) =>
  frames.map(({ name, altSuffix }) =>
    buildImageDescriptorFromOptimized(folder, name, extension, `${altBase} ${altSuffix}`.trim())
  );

const buildGallerySimple = (
  folder: string,
  extension: 'png' | 'jpg',
  altBase: string,
  frames: Array<{ name: string; altSuffix: string }>
) =>
  frames.map(({ name, altSuffix }) =>
    buildImageDescriptorSimple(folder, name, extension, `${altBase} ${altSuffix}`.trim())
  );

export type ProductRecord = {
  id: string; // Category slug for routing (e.g., 'dia-care')
  numericId?: number; // Numeric product ID for API operations (e.g., cart)
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
    id: 'pro-mens-multivitamin',
    name: 'PRO MEN\'S MULTIVITAMIN',
    headline: 'Science-Informed Daily Formula',
    price: 1449,
    originalPrice: 1899,
    rating: 5,
    reviews: 156,
    inStock: true,
    accentGradient: 'from-orange-800/75 via-red-700/65 to-slate-900/90',
    notes: ['Science-informed', 'Comprehensive formula'],
    summary:
      'A comprehensive, science-informed daily formula crafted to support immunity, vitality, skin health, and everyday performance.',
    description:
      'MYURA Men\'s Multivitamin is a comprehensive, science-informed daily formula crafted to support immunity, vitality, skin health, and everyday performance. This advanced blend replenishes essential vitamins and minerals while providing powerful antioxidants and herbal adaptogens for complete men\'s wellness.',
    benefits: [
      'Replenishes daily vitamins & minerals to support immunity and metabolic health',
      'Supplies antioxidants (CoQ10, resveratrol, grape seed, green tea) for cellular protection',
      'Supports energy, stamina, and recovery with amino acids and bioactive extracts',
      'Promotes skin glow & eye health (Lycopene, lutein/zeaxanthin, mixed carotenoids)',
      'Includes herbal adaptogens (Ginseng, Ashwagandha, Shilajit) to support stress resilience and mental focus',
    ],
    keyIngredients:
      'Flaxseed Oil – 50 mg, Wheat Germ Oil – 25 mg, Krill Oil – 25 mg, Ginseng Extract – 12.5 mg, Ginkgo Biloba Extract – 20 mg, Citrus Bioflavonoids – 12.5 mg, Green Tea Extract – 10 mg, Grape Seed Extract – 10 mg, Bilberry Extract – 10 mg, Resveratrol – 10 mg, Co-Enzyme Q10 – 10 mg, Seabuckthorn Oil – 10 mg, Betaine Hydrochloride – 10 mg, Policosanol – 10 mg, Lutein / Zeaxanthin Complex – 10 mg, Mixed Carotenoids (30% dispersion) – 5 mg, Chloride (Eq. to elemental Chloride) – 2 mg, Manganese (as Manganese Sulphate; Eq. to elemental Manganese) – 4 mg, Magnesium (as Magnesium Oxide; Eq. to elemental Magnesium) – 5 mg, Calcium (as Dibasic Calcium Phosphate; Eq. to elemental Calcium) – 5 mg, Phosphorus (Eq. to elemental Phosphorous) – 3.86 mg, Copper (as Copper Sulphate; Eq. to elemental Copper) – 1.7 mg, Molybdenum (as Sodium Molybdate; Eq. to elemental Molybdenum) – 45 mcg, Selenium (as Sodium Selenate; Eq. to elemental Selenium) – 40 mcg, Iodine (as Potassium Iodide; Eq. to elemental Iodine) – 50 mcg, Chromium (as Chromium Picolinate; Eq. to elemental Chromium) – 50 mcg.',
    suitableFor:
      'Adult men seeking a single, broad-spectrum multivitamin to support daily nutrition. Men with active lifestyles who want support for energy, recovery, and immunity. Those looking to complement a balanced diet with antioxidants, amino acids, and botanical extracts. (Not for use by pregnant or lactating women or minors. Consult your healthcare provider if you are on medication or have existing health conditions.)',
    howToUse:
      'Take 1 tablet daily or as directed by a Dietitian. Swallow whole with water — do not chew or crush. Do not exceed the recommended daily dose. Store in a cool, dry, and dark place away from direct sunlight.',
    faqs:
      'Comprehensive daily formula for long-term use. Results are cumulative and best seen with consistent use. Consult your healthcare provider if you are on medication or have existing health conditions. Not for use by pregnant or lactating women or minors.',
    image: buildImageDescriptorFromOptimized(
      'ProSeries/PRO MEN\'S MULTIVITAMIN',
      'main',
      'png',
      'PRO Men\'s Multivitamin premium supplement bottle'
    ),
    gallery: buildGalleryFromOptimized('ProSeries/PRO MEN\'S MULTIVITAMIN', 'png', 'PRO Men\'s Multivitamin', [
      { name: 'main', altSuffix: 'hero bottle premium display' },
      { name: '2', altSuffix: 'styled on professional surface' },
      { name: '3', altSuffix: 'capsules detail shot' },
      { name: '4', altSuffix: 'flat lay with wellness elements' },
    ]),
    heroTagline: 'Supporting immunity, vitality, and everyday performance',
  },
  {
    id: 'pro-mens-vitality-booster-gold',
    name: 'PRO MEN\'S VITALITY BOOSTER GOLD',
    headline: 'Advanced Nutraceutical Formula',
    price: 2499,
    originalPrice: 3799,
    rating: 5,
    reviews: 134,
    inStock: true,
    accentGradient: 'from-teal-500/70 via-cyan-400/50 to-slate-900/90',
    notes: ['Advanced nutraceutical', 'Gold formula'],
    summary:
      'Experience enhanced everyday energy and vitality with MYURA Men\'s Vitality Booster Gold — an advanced nutraceutical thoughtfully formulated to support stamina, endurance, and overall men\'s wellness.',
    description:
      'Experience enhanced everyday energy and vitality with MYURA Men\'s Vitality Booster Gold — an advanced nutraceutical thoughtfully formulated to support stamina, endurance, and overall men\'s wellness. This premium blend combines powerful botanical extracts, essential micronutrients, and performance-enhancing compounds for optimal men\'s health.',
    benefits: [
      'Boosts energy, stamina, and endurance for enhanced daily and athletic performance',
      'Promotes reproductive health and hormonal balance naturally',
      'Helps improve muscle strength and overall physical performance',
      'Supports stress management and mental focus for a balanced lifestyle',
      'Enriched with CoQ10, Vitamin D3, Zinc & Magnesium for cellular energy and immunity',
    ],
    keyIngredients:
      'Horny Goat Weed Extract – 300 mg, Maca Root Powder – 100 mg, Citrulline Malate – 100 mg, Tongkat Ali Root – 40 mg, Tribulus Terrestris Extract – 25 mg, Muira Puama Root – 5 mg, L-Arginine – 5 mg, Panax Ginseng Root – 5 mg, Cayenne Pepper Powder – 5 mg, Yohimbine – 2 mg, Vitamin D3 – 600 IU, Co-Enzyme Q10 – 100 mg, Zinc Sulphate (eq. to Elemental Zinc) – 17.6 mg, Magnesium Oxide (eq. to Elemental Magnesium) – 50 mg. No artificial preservatives. Approved colour used. 100% vegetarian tablets.',
    suitableFor:
      'Adult men looking to enhance stamina, energy, and reproductive vitality. Fitness enthusiasts aiming to improve strength and performance. Professionals facing stress, fatigue, or low motivation. Men seeking overall hormonal balance and active wellness. (Not intended for women or minors. Please consult a dietitian before prolonged use.)',
    howToUse:
      'Take 1 tablet daily or as directed by a Dietitian. Swallow whole with water — do not chew or crush. For best results, follow a balanced diet and consistent exercise routine.',
    faqs:
      'Advanced nutraceutical formula for daily use. Results typically improve with consistent use. Not intended for women or minors. Please consult a dietitian before prolonged use, especially if you have cardiovascular conditions or are on medications.',
    image: buildImageDescriptorSimple(
      'ProSeries/PRO MEN\'S VITALITY BOOSTER GOLD',
      'main',
      'png',
      'PRO Men\'s Vitality Booster Gold premium supplement bottle'
    ),
    gallery: buildGallerySimple('ProSeries/PRO MEN\'S VITALITY BOOSTER GOLD', 'png', 'PRO Men\'s Vitality Booster Gold', [
      { name: 'main', altSuffix: 'hero gold bottle premium display' },
      { name: '1', altSuffix: 'styled on luxury surface' },
      { name: '2', altSuffix: 'capsules with premium accents' },
      { name: '3', altSuffix: 'flat lay with elite elements' },
    ]),
    heroTagline: 'Enhanced energy and vitality for everyday performance',
  },
  {
    id: 'pro-omega-3-softgel',
    name: 'PRO OMEGA-3 SOFTGEL CAPSULES',
    headline: 'High-Purity Fish Oil',
    price: 1199,
    originalPrice: 1599,
    rating: 5,
    reviews: 178,
    inStock: true,
    accentGradient: 'from-green-700/75 via-emerald-600/65 to-slate-900/90',
    notes: ['High-purity', 'EPA & DHA'],
    summary:
      'MYURA Omega-3 Softgel Capsules deliver high-purity fish oil rich in EPA (Eicosapentaenoic Acid) and DHA (Docosahexaenoic Acid) — two essential omega-3 fatty acids that support heart, brain, vision, and overall metabolic health.',
    description:
      'MYURA Omega-3 Softgel Capsules deliver high-purity fish oil rich in EPA (Eicosapentaenoic Acid) and DHA (Docosahexaenoic Acid) — two essential omega-3 fatty acids that support heart, brain, vision, and overall metabolic health. Each softgel provides optimal concentrations of these essential nutrients for comprehensive wellness support.',
    benefits: [
      'Supports heart health by promoting balanced lipid levels and circulation',
      'Helps maintain brain function, focus, and memory',
      'Promotes healthy vision and eye comfort',
      'Aids joint flexibility and natural anti-inflammatory balance',
      'Contributes to metabolic and cellular function for daily wellness',
    ],
    keyIngredients:
      'Fish Oil (Omega-3 Fatty Acid) – 1000 mg, providing Eicosapentaenoic Acid (EPA) – 180 mg, providing Docosahexaenoic Acid (DHA) – 120 mg. High-purity, molecularly distilled fish oil for optimal absorption and effectiveness.',
    suitableFor:
      'Adults seeking to support heart, brain, eye, and joint health. Individuals with low dietary intake of omega-3 fatty acids. Professionals or fitness enthusiasts aiming for metabolic balance and focus.',
    howToUse:
      'Take one softgel capsule daily, or as directed by a Dietitian. Swallow whole with water — do not chew or crush. For optimal absorption, take with meals containing healthy fats. Store in a cool, dry place away from direct sunlight.',
    faqs:
      'High-purity, molecularly distilled fish oil for maximum freshness and effectiveness. No fishy aftertaste. Safe for daily long-term use. Consult your doctor if you are on blood-thinning medications or have seafood allergies.',
    image: buildImageDescriptorSimple(
      'ProSeries/PRO OMEGA-3 SOFTGEL CAPSULES',
      'main',
      'png',
      'PRO Omega-3 Softgel Capsules premium supplement bottle'
    ),
    gallery: buildGallerySimple('ProSeries/PRO OMEGA-3 SOFTGEL CAPSULES', 'png', 'PRO Omega-3 Softgel Capsules', [
      { name: 'main', altSuffix: 'hero softgel bottle premium display' },
      { name: '1', altSuffix: 'styled on clean surface' },
      { name: '2', altSuffix: 'softgel capsules detail' },
      { name: '4', altSuffix: 'flat lay with marine elements' },
    ]),
    heroTagline: 'Supporting heart, brain, vision, and metabolic health',
  },
  {
    id: 'pro-womens-health-plus',
    name: 'PRO WOMEN\'S HEALTH PLUS',
    headline: 'Holistic Ayurvedic Formulation',
    price: 2599,
    originalPrice: 2599,
    rating: 5,
    reviews: 167,
    inStock: true,
    accentGradient: 'from-pink-500/70 via-rose-400/50 to-slate-900/90',
    notes: ['Holistic Ayurvedic', 'Nine classical herbs'],
    summary:
      'A gentle, holistic Ayurvedic formulation designed to nurture a woman\'s body and mind naturally. Enriched with nine classical herbs, it supports hormonal harmony, strengthens the reproductive system, and promotes everyday wellness.',
    description:
      'MYURA Women\'s Health Plus is a gentle, holistic Ayurvedic formulation designed to nurture a woman\'s body and mind naturally. Enriched with nine classical herbs, it supports hormonal harmony, strengthens the reproductive system, and promotes everyday wellness. From relieving menstrual discomfort to enhancing vitality, this blend offers the perfect balance of tradition and care for modern women.',
    benefits: [
      'Helps balance female hormones and regulate the menstrual cycle',
      'Supports uterine and reproductive health naturally',
      'Aids relief from leucorrhea, pelvic pain, and backache',
      'Enhances strength, stamina, and inner vitality',
      'Boosts immunity and emotional well-being for daily balance',
    ],
    keyIngredients:
      'Ashoka Chhal (Saraca asoca) – 300 mg, Shatavari (Asparagus racemosus) – 100 mg, Ashwagandha (Withania somnifera) – 100 mg, Lodhra (Symplocos racemosa) – 75 mg (supports menstrual balance and reduces fatigue), Gokshura (Tribulus terrestris) – 50 mg, Dashmool (Classical) – 50 mg, Yashtimadhu (Licorice) – 25 mg, Kumari (Aloe vera) – 25 mg (promotes hormonal balance and skin health), Guduchi (Tinospora cordifolia) – 25 mg. Approved colour used. No added preservatives. Appropriate overages added to compensate for storage loss.',
    suitableFor:
      'Women looking for natural hormonal and menstrual support. Those facing fatigue, pelvic pain, or backache during cycles. Women seeking daily vitality, immunity, and inner strength. (Not recommended for pregnant or lactating women unless advised by a physician.)',
    howToUse:
      'Take 1–2 tablets twice a day with water or as directed by a physician. Store in a cool, dry, and dark place, away from direct sunlight and moisture. For best results, maintain regular use alongside a balanced lifestyle.',
    faqs:
      'Gentle, holistic Ayurvedic formulation for daily use. Consistent use provides optimal results. Not recommended for pregnant or lactating women unless advised by a physician. Consult your healthcare provider if you have pre-existing medical conditions.',
    image: buildImageDescriptorFromOptimized(
      'ProSeries/PRO WOMEN\'S HEALTH PLUS',
      'main',
      'png',
      'PRO Women\'s Health Plus premium supplement bottle'
    ),
    gallery: buildGalleryFromOptimized('ProSeries/PRO WOMEN\'S HEALTH PLUS', 'png', 'PRO Women\'s Health Plus', [
      { name: 'main', altSuffix: 'hero bottle premium display' },
      { name: '2', altSuffix: 'styled on elegant surface' },
      { name: '3', altSuffix: 'capsules with floral accents' },
      { name: '4', altSuffix: 'flat lay with wellness elements' },
    ]),
    heroTagline: 'Nurturing your body and mind naturally',
  },
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
    notes: [],
    summary:
      'A natural botanical blend that supports healthy blood sugar balance, boosts energy and metabolism, and promotes overall metabolic wellness—gently and effectively.',
    description:
      'MYURA Diabetes Management is a nutritional wellness formula for anyone who wants steady glucose rhythms without harsh synthetics. Whether you are managing early signs of imbalance or striving to maintain consistent energy throughout the day, this 15-herb blend works in harmony with your body to keep pancreatic health, digestion, and sugar regulation in check.',
    benefits: [
      'Supports balanced blood sugar levels naturally',
      'Improves daily energy, metabolism, and sugar control',
      'Helps curb cravings and reduces fatigue after meals',
      'Aids pancreatic, liver, and cardiovascular health',
      'Promotes a steady, non-spiking energy flow',
    ],
    keyIngredients:
      'Each 500 mg capsule features Neem, Vijaysar, Amla, Kutki, Giloy, Karela, Jamun, Gudmar, Methi, Turmeric, Jamun seed, Kalmegh, Shilajit, and other classical botanicals chosen for comprehensive metabolic support.',
    suitableFor:
      'Ideal for adults seeking natural support in managing blood sugar levels, individuals with a family history of diabetes or pre-diabetic symptoms, and anyone who experiences fatigue or cravings after meals.',
    howToUse:
      'Take 1–2 capsules, twice or thrice daily, with warm water or milk—preferably after meals.',
    faqs:
      'Designed for routine wellness use. Consult your healthcare provider if you are pregnant, nursing, or on prescription medication.',
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
    heroTagline: 'Support balanced blood sugar without compromise',
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
    notes: [],
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
    notes: [],
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
    heroTagline: '',
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
    notes: [],
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
    image: buildImageDescriptorSimple(
      'Gut & Digestions',
      'main',
      'png',
      'Gut and Digestion tonic with fresh ingredients'
    ),
    gallery: buildGallerySimple('Gut & Digestions', 'png', 'Gut and Digestion blend', [
      { name: 'main', altSuffix: 'hero bottle close-up' },
      { name: '1', altSuffix: 'styled on marble surface' },
      { name: '2', altSuffix: 'with measuring spoon of powder' },
      { name: '3', altSuffix: 'flat lay with fresh ingredients' },
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
    notes: [],
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
      'Shatavari nourishes estrogen balance and soothes the nervous system. Dong Quai supports circulation and eases cyclical discomfort. Evening primrose oil delivers GLA to hydrate skin and calm inflammation. Iron bisglycinate rebuilds iron stores without upsetting the gut. Vitamins B6 & B12 steady mood and energy metabolism. Zinc keeps hormones converting smoothly and fortifies skin resilience.',
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



