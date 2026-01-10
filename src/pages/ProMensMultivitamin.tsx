import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProMensMultivitaminPage from '../components/ProMensMultivitaminPage';
import { getProductById } from '../data/products';

const ProMensMultivitamin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const productId = (id || 'pro-mens-multivitamin').toLowerCase().trim();
  const product = getProductById(productId);

  if (!product) {
    console.warn(`Product not found for ID: ${productId}`);
    return <Navigate to="/product" replace />;
  }

  return <ProMensMultivitaminPage product={product} />;
};

export default ProMensMultivitamin;






