import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getProductById } from '../data/products';
import ThemedProductPage from '../components/ThemedProductPage';
import { Droplets, Sparkles, Leaf } from 'lucide-react';

const LiverDetox: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');

  if (!product) {
    return <Navigate to="/product" replace />;
  }

  return (
    <ThemedProductPage
      product={product}
      themeClassName="liver-detox-theme"
      decorativeIcons={[Droplets, Sparkles, Leaf]}
    />
  );
};

export default LiverDetox;

