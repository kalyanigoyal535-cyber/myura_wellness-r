import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Sparkles, Leaf, Activity } from 'lucide-react';

const GutAndDigestion: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="gut-digestion-theme"
      decorativeIcons={[Sparkles, Leaf, Activity]}
      fallbackId="gut-and-digestion"
    />
  );
};

export default GutAndDigestion;

