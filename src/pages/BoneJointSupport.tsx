import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getProductById } from '../data/products';
import ThemedProductPage from '../components/ThemedProductPage';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const BoneJointSupport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');

  if (!product) {
    return <Navigate to="/product" replace />;
  }

  return (
    <ThemedProductPage
      product={product}
      themeClassName="bone-joint-theme"
      decorativeIcons={[Activity, ShieldCheck, HeartPulse]}
    />
  );
};

export default BoneJointSupport;

