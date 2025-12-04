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
// ProSeries products
const ProMensMultivitamin = lazy(() => import('./ProMensMultivitamin'));
const ProMensVitalityBoosterGold = lazy(() => import('./ProMensVitalityBoosterGold'));
const ProOmega3Softgel = lazy(() => import('./ProOmega3Softgel'));
const ProWomensHealthPlus = lazy(() => import('./ProWomensHealthPlus'));

// Product ID to component mapping
const productPages: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'womens-health-plus': WomensHealthPlus,
  'dia-care': DiaCare,
  'liver-detox': LiverDetox,
  'bone-joint-support': BoneJointSupport,
  'gut-and-digestion': GutAndDigestion,
  'mens-vitality-booster': MensVitalityBooster,
  // ProSeries products
  'pro-mens-multivitamin': ProMensMultivitamin,
  'pro-mens-vitality-booster-gold': ProMensVitalityBoosterGold,
  'pro-omega-3-softgel': ProOmega3Softgel,
  'pro-womens-health-plus': ProWomensHealthPlus,
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

  // Normalize ID to lowercase for case-insensitive matching
  const normalizedId = id.toLowerCase().trim();
  const ProductPage = productPages[normalizedId];
  
  if (ProductPage) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ProductPage />
      </Suspense>
    );
  }

  // If product not found, redirect to product listing
  console.warn(`Product page not found for ID: ${id} (normalized: ${normalizedId})`);
  return <Navigate to="/product" replace />;
};

export default ProductDetail;
