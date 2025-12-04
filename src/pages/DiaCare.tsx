import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Activity, Sparkles, Droplets } from 'lucide-react';

const DiaCare: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="dia-care-theme"
      decorativeIcons={[Activity, Sparkles, Droplets]}
      fallbackId="dia-care"
    />
  );
};

export default DiaCare;

