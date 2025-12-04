import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Droplets, Sparkles, Leaf } from 'lucide-react';

const LiverDetox: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="liver-detox-theme"
      decorativeIcons={[Droplets, Sparkles, Leaf]}
      fallbackId="liver-detox"
    />
  );
};

export default LiverDetox;

