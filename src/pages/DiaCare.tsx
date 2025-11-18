import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getProductById } from '../data/products';
import ThemedProductPage from '../components/ThemedProductPage';
import { Activity, Sparkles, Droplets } from 'lucide-react';

const DiaCare: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');

  if (!product) {
    return <Navigate to="/product" replace />;
  }

  return (
    <ThemedProductPage
      product={product}
      themeClassName="dia-care-theme"
      decorativeIcons={[Activity, Sparkles, Droplets]}
    />
  );
};

export default DiaCare;

