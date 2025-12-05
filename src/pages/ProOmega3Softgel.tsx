import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Droplets, HeartPulse, ShieldCheck } from 'lucide-react';

const ProOmega3Softgel: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="pro-omega-3-softgel-theme"
      decorativeIcons={[Droplets, HeartPulse, ShieldCheck]}
      fallbackId="pro-omega-3-softgel"
    />
  );
};

export default ProOmega3Softgel;






