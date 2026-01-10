import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProMensVitalityBoosterGoldPage from '../components/ProMensVitalityBoosterGoldPage';
import { getProductById } from '../data/products';

const ProMensVitalityBoosterGold: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const productId = (id || 'pro-mens-vitality-booster-gold').toLowerCase().trim();
  const product = getProductById(productId);

  if (!product) {
    console.warn(`Product not found for ID: ${productId}`);
    return <Navigate to="/product" replace />;
  }

  return <ProMensVitalityBoosterGoldPage product={product} />;
};

export default ProMensVitalityBoosterGold;






