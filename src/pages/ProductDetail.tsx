import React, { Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load themed product pages for better code splitting
const WomensHealthPlus = lazy(() => import('./WomensHealthPlus'));
const DiaCare = lazy(() => import('./DiaCare'));
const LiverDetox = lazy(() => import('./LiverDetox'));
const BoneJointSupport = lazy(() => import('./BoneJointSupport'));
const GutAndDigestion = lazy(() => import('./GutAndDigestion'));
const MensVitalityBooster = lazy(() => import('./MensVitalityBooster'));

// Product ID to component mapping
const productPages: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'womens-health-plus': WomensHealthPlus,
  'dia-care': DiaCare,
  'liver-detox': LiverDetox,
  'bone-joint-support': BoneJointSupport,
  'gut-and-digestion': GutAndDigestion,
  'mens-vitality-booster': MensVitalityBooster,
};

// Loading fallback for lazy loaded pages
const LoadingFallback = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
  </div>
);

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <Navigate to="/product" replace />;
  }

  const ProductPage = productPages[id];
  
  if (ProductPage) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ProductPage />
      </Suspense>
    );
  }

  return <Navigate to="/product" replace />;
};

export default ProductDetail;
