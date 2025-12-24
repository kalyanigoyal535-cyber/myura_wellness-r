// Generate image URL helper
export const getImageUrl = (req, imageName) => {
  if (!imageName) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${imageName}`;
};

// Format product with image URLs
export const formatProduct = (req, product) => {
  return {
    ...product,
    price: parseFloat(product.price),
    original_price: product.original_price ? parseFloat(product.original_price) : null,
    originalPrice: product.original_price ? parseFloat(product.original_price) : null,
    rating: parseFloat(product.rating),
    notes: JSON.parse(product.notes || '[]'),
    benefits: JSON.parse(product.benefits || '[]'),
    image_url: getImageUrl(req, product.image),
  };
};

// Format category with image URL
export const formatCategory = (req, category) => {
  return {
    ...category,
    image_url: getImageUrl(req, category.image),
  };
};

