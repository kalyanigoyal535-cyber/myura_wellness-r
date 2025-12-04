import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ThemedProductPage from './ThemedProductPage';
import { getProductById } from '../data/products';
import { LucideIcon } from 'lucide-react';

interface ProductDetailWrapperProps {
  themeClassName: string;
  decorativeIcons: LucideIcon[];
  fallbackId?: string; // For backward compatibility with slug-based routing
}

const ProductDetailWrapper: React.FC<ProductDetailWrapperProps> = ({
  themeClassName,
  decorativeIcons,
  fallbackId,
}) => {
  const { id } = useParams<{ id: string }>();
  
  // Use the ID from params, or fallback to fallbackId
  const productId = (id || fallbackId || '').toLowerCase().trim();
  
  // Get product from static catalog
  const product = getProductById(productId);

  // Product not found
  if (!product) {
    console.warn(`Product not found for ID: ${productId}`);
    return <Navigate to="/product" replace />;
  }

  return (
    <ThemedProductPage
      product={product}
      themeClassName={themeClassName}
      decorativeIcons={decorativeIcons}
    />
  );
};

export default ProductDetailWrapper;

