import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Activity, Sparkles, ShieldCheck } from 'lucide-react';

const MensVitalityBooster: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="mens-vitality-theme"
      decorativeIcons={[Activity, Sparkles, ShieldCheck]}
      fallbackId="mens-vitality-booster"
    />
  );
};

export default MensVitalityBooster;

