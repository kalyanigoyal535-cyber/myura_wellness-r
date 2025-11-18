import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getProductById } from '../data/products';
import ThemedProductPage from '../components/ThemedProductPage';
import { Sparkles, Leaf, Activity } from 'lucide-react';

const GutAndDigestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');

  if (!product) {
    return <Navigate to="/product" replace />;
  }

  return (
    <ThemedProductPage
      product={product}
      themeClassName="gut-digestion-theme"
      decorativeIcons={[Sparkles, Leaf, Activity]}
    />
  );
};

export default GutAndDigestion;

