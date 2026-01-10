import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProOmega3SoftgelPage from '../components/ProOmega3SoftgelPage';
import { getProductById } from '../data/products';

const ProOmega3Softgel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const productId = (id || 'pro-omega-3-softgel').toLowerCase().trim();
  const product = getProductById(productId);

  if (!product) {
    console.warn(`Product not found for ID: ${productId}`);
    return <Navigate to="/product" replace />;
  }

  return <ProOmega3SoftgelPage product={product} />;
};

export default ProOmega3Softgel;






