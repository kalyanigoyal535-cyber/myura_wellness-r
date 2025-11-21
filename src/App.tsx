import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Gift } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import SpinWheelModal from './components/SpinWheelModal';
import { SpinWheelProvider, useSpinWheel } from './context/SpinWheelContext';

// Lazy load routes for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Product = lazy(() => import('./pages/Product'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const Cart = lazy(() => import('./pages/Cart'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-stone-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
  </div>
);

// Scroll to top component for route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // 'auto' provides instant scroll (default behavior)
    });
  }, [pathname]);

  return null;
};

// Refresh AOS animations on route changes
const AOSRefresher = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Allow the new view to render before refreshing animations
    const timeout = setTimeout(() => {
      AOS.refreshHard();
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const { isOpen, openSpinWheel, closeSpinWheel } = useSpinWheel();

  useEffect(() => {
    // Prevent browser from restoring scroll position on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top on initial page load/refresh
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // 'auto' provides instant scroll (default behavior)
    });

    // Initialize AOS
    if (typeof window !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
        once: false,
        mirror: true,
      offset: 100,
    });
    }
  }, []);

  return (
    <>
        <LoadingScreen />
        <ScrollToTop />
      <AOSRefresher />
        <div className="min-h-screen bg-stone-50 overflow-x-hidden">
          <Header />
          <div style={{ paddingTop: 'var(--header-height, 0px)', transition: 'padding-top 0.45s ease' }}>
          <Suspense fallback={<LoadingFallback />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/cart" element={<Cart />} />
          </Routes>
          </Suspense>
          </div>
          <Footer />
        </div>
        {/* Floating Spin Wheel Button - Bottom Right */}
        <button
          onClick={openSpinWheel}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white shadow-[0_8px_24px_rgba(236,72,153,0.4)] hover:shadow-[0_12px_32px_rgba(236,72,153,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
          aria-label="Spin for discount"
          title="Spin the wheel for exclusive discounts"
        >
          <Gift className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:scale-110 group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full animate-pulse flex items-center justify-center">
            <span className="h-2 w-2 bg-rose-500 rounded-full" />
          </span>
        </button>
        <SpinWheelModal isOpen={isOpen} onClose={closeSpinWheel} />
    </>
  );
};

function App() {
  return (
    <SpinWheelProvider>
      <AppContent />
    </SpinWheelProvider>
  );
}

export default App;
