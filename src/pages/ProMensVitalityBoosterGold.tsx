import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Activity, Sparkles, Award } from 'lucide-react';

const ProMensVitalityBoosterGold: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="pro-mens-vitality-booster-gold-theme"
      decorativeIcons={[Activity, Sparkles, Award]}
      fallbackId="pro-mens-vitality-booster-gold"
    />
  );
};

export default ProMensVitalityBoosterGold;




