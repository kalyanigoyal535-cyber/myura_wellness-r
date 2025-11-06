import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';

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

function App() {
  useEffect(() => {
    // Initialize AOS only once
    if (typeof window !== 'undefined' && !document.querySelector('[data-aos]')) {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100,
      });
    }
  }, []);

  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-stone-50 overflow-x-hidden">
          <Header />
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
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
