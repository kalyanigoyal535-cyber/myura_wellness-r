import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Heart, Sparkles, Leaf } from 'lucide-react';

const ProWomensHealthPlus: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="pro-womens-health-plus-theme"
      decorativeIcons={[Heart, Sparkles, Leaf]}
      fallbackId="pro-womens-health-plus"
    />
  );
};

export default ProWomensHealthPlus;






