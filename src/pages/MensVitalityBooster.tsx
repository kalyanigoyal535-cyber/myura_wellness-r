import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getProductById } from '../data/products';
import ThemedProductPage from '../components/ThemedProductPage';
import { Activity, Sparkles, ShieldCheck } from 'lucide-react';

const MensVitalityBooster: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');

  if (!product) {
    return <Navigate to="/product" replace />;
  }

  return (
    <ThemedProductPage
      product={product}
      themeClassName="mens-vitality-theme"
      decorativeIcons={[Activity, Sparkles, ShieldCheck]}
    />
  );
};

export default MensVitalityBooster;

