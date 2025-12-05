import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Activity, Award, ShieldCheck } from 'lucide-react';

const ProMensMultivitamin: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="pro-mens-multivitamin-theme"
      decorativeIcons={[Activity, Award, ShieldCheck]}
      fallbackId="pro-mens-multivitamin"
    />
  );
};

export default ProMensMultivitamin;






