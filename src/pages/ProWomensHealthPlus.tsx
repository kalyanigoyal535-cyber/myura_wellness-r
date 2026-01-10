import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProWomensHealthPlusPage from '../components/ProWomensHealthPlusPage';
import { getProductById } from '../data/products';

const ProWomensHealthPlus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const productId = (id || 'pro-womens-health-plus').toLowerCase().trim();
  const product = getProductById(productId);

  if (!product) {
    console.warn(`Product not found for ID: ${productId}`);
    return <Navigate to="/product" replace />;
  }

  return <ProWomensHealthPlusPage product={product} />;
};

export default ProWomensHealthPlus;






