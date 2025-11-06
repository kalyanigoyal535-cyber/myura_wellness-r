import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import MyAccount from './pages/MyAccount';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100,
    });
  }, []);

  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-stone-50 overflow-x-hidden">
          <Header />
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
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
