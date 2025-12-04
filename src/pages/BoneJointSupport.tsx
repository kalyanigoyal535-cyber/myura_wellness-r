import React from 'react';
import ProductDetailWrapper from '../components/ProductDetailWrapper';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const BoneJointSupport: React.FC = () => {
  return (
    <ProductDetailWrapper
      themeClassName="bone-joint-theme"
      decorativeIcons={[Activity, ShieldCheck, HeartPulse]}
      fallbackId="bone-joint-support"
    />
  );
};

export default BoneJointSupport;

