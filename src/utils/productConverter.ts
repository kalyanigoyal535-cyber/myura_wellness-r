import { Product as ApiProduct } from '../services/types';
import { ProductRecord } from '../data/products';

/**
 * Convert API product to frontend ProductRecord format
 */
export const apiProductToFrontend = (apiProduct: ApiProduct): ProductRecord => {
  // Use camelCase fields if available, fallback to snake_case
  const price = parseFloat(apiProduct.price);
  const originalPrice = apiProduct.originalPrice 
    ? parseFloat(apiProduct.originalPrice) 
    : apiProduct.original_price 
    ? parseFloat(apiProduct.original_price) 
    : undefined;
  
  const rating = parseFloat(apiProduct.rating);
  const reviews = apiProduct.reviews || apiProduct.reviews_count || 0;
  const inStock = apiProduct.inStock !== undefined ? apiProduct.inStock : apiProduct.in_stock;
  
  // Build image descriptor from API product
  const imageUrl = apiProduct.image_url || apiProduct.image || '';
  const productName = apiProduct.name || 'Product';
  const image = {
    alt: `${productName} product image`,
    fallback: imageUrl,
    sources: [
      {
        srcSet: imageUrl,
        media: '(min-width: 1024px)',
      },
      {
        srcSet: imageUrl,
        media: '(min-width: 768px)',
      },
      {
        srcSet: imageUrl,
        media: '(max-width: 767px)',
      },
    ],
  };

  // Build gallery from API product gallery_images
  const gallery = (apiProduct.gallery || apiProduct.gallery_images || []).map((img, index) => ({
    alt: img.alt_text || `${productName} gallery image ${index + 1}`,
    fallback: img.image_url || img.image || '',
    sources: [
      {
        srcSet: img.image_url || img.image || '',
        media: '(min-width: 1024px)',
      },
      {
        srcSet: img.image_url || img.image || '',
        media: '(min-width: 768px)',
      },
      {
        srcSet: img.image_url || img.image || '',
        media: '(max-width: 767px)',
      },
    ],
  }));

  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    headline: apiProduct.headline || '',
    price: price,
    originalPrice: originalPrice || price,
    rating: rating,
    reviews: reviews,
    inStock: inStock,
    accentGradient: apiProduct.accentGradient || apiProduct.accent_gradient || 'from-slate-600 to-slate-800',
    notes: apiProduct.notes || [],
    summary: apiProduct.summary || '',
    description: apiProduct.description || apiProduct.summary || '',
    benefits: apiProduct.benefits || [],
    keyIngredients: apiProduct.keyIngredients || apiProduct.key_ingredients || '',
    suitableFor: apiProduct.suitableFor || apiProduct.suitable_for || '',
    howToUse: apiProduct.howToUse || apiProduct.how_to_use || '',
    faqs: apiProduct.faqs || '',
    image: image,
    gallery: gallery.length > 0 ? gallery : [image], // Fallback to main image if no gallery
    heroTagline: apiProduct.heroTagline || apiProduct.hero_tagline || '',
  };
};

/**
 * Convert array of API products to frontend format
 */
export const apiProductsToFrontend = (apiProducts: ApiProduct[]): ProductRecord[] => {
  return apiProducts.map(apiProductToFrontend);
};

