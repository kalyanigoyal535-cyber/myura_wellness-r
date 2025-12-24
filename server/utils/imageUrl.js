// Generate image URL helper
export const getImageUrl = (req, imageName, folder = null) => {
  if (!imageName) return null;
  
  // If imageName already contains folder path (e.g., "admins/filename.jpg"), use it directly
  // Otherwise, construct path with folder parameter
  let path;
  if (imageName.includes('/')) {
    // Path already includes folder (e.g., "admins/filename.jpg")
    path = `uploads/${imageName}`;
  } else if (folder) {
    // Construct path with folder
    path = `uploads/${folder}/${imageName}`;
  } else {
    // Just use imageName in uploads root
    path = `uploads/${imageName}`;
  }
  
  return `${req.protocol}://${req.get('host')}/${path}`;
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

