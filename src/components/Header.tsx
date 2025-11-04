import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, MapPin, Mail, Loader2, RefreshCw } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { useLocation as useUserLocation } from '../hooks/useLocation';
import { useCart } from '../context/CartContext';

const FacebookIcon = FaFacebookF as React.ComponentType<{ className?: string }>;
const InstagramIcon = FaInstagram as React.ComponentType<{ className?: string }>;
const YoutubeIcon = FaYoutube as React.ComponentType<{ className?: string }>;
const PinterestIcon = FaPinterestP as React.ComponentType<{ className?: string }>;
const TwitterIcon = FaTwitter as React.ComponentType<{ className?: string }>;
const LinkedinIcon = FaLinkedinIn as React.ComponentType<{ className?: string }>;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hideOnFooter, setHideOnFooter] = useState(false);
  const location = useLocation();
  const { address, loading, error, refreshLocation } = useUserLocation();
  const { count } = useCart();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setHideOnFooter(entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.05 }
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm transition-all duration-700 ease-in-out ${hideOnFooter ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
      {/* Professional Discount Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-2 sm:py-3 px-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-white text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold tracking-wide">SPECIAL OFFER</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
            <span className="text-xs sm:text-sm font-medium text-slate-200">Get 10% off your first order with code <span className="font-bold text-emerald-400">WELCOME10</span></span>
            <div className="hidden lg:flex items-center space-x-2 ml-4">
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span className="text-xs text-slate-400 font-medium">Limited time offer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Top Bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-2 sm:py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-slate-600 flex-1 min-w-0">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
              {loading ? (
                <div className="flex items-center space-x-2 min-w-0">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-slate-500 flex-shrink-0" />
                  <span className="font-minimal text-slate-500 truncate">Detecting location...</span>
                </div>
              ) : error ? (
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="font-minimal text-slate-500 truncate hidden xs:inline">Plot No. 15C, IT Park, Sector 22, Panchkula, Haryana, 134109</span>
                  <span className="font-minimal text-slate-500 truncate xs:hidden">Panchkula, Haryana</span>
                  <span className="text-xs text-slate-400 font-minimal flex-shrink-0">(Default)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="font-minimal truncate hidden xs:inline">{address}</span>
                  <span className="font-minimal truncate xs:hidden">{address.split(',')[0]}</span>
                  <button
                    onClick={refreshLocation}
                    className="p-1 hover:bg-slate-200 rounded transition-colors duration-200 flex-shrink-0"
                    title="Refresh location"
                  >
                    <RefreshCw className="h-3 w-3 text-slate-500 hover:text-slate-700" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 ml-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                <FacebookIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                <InstagramIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                <YoutubeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                <PinterestIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                <TwitterIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                <LinkedinIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="mailto:care@myurawellness.com" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Main Navigation */}
      <div className="bg-white/90 backdrop-blur shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-2.5 lg:py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <img 
                src="/Logo-02.png" 
                alt="MYURA Logo" 
                className="h-8 xs:h-10 sm:h-12 md:h-14 lg:h-16 xl:h-16 2xl:h-20 w-auto object-contain filter brightness-0 drop-shadow-md group-hover:drop-shadow-lg group-hover:scale-105 transition-all duration-300 ease-out"
              />
            </Link>

            {/* Simple & Classy Navigation Links */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/product', label: 'Products' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-sm font-medium transition-all duration-200 ease-out group font-minimal ${
                    isActive(link.to) 
                      ? 'text-slate-900' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive(link.to) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></div>
                  )}
                  {!isActive(link.to) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Professional Search and User Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-40 sm:w-48 md:w-56 lg:w-64 px-3 sm:px-4 py-2 sm:py-2.5 pl-8 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white hover:border-slate-400 font-premium placeholder:text-slate-400"
                />
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link to="/my-account" className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200">
                  <User className="h-5 w-5" />
                </Link>
                <div className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center">
                  <Link to="/cart" className="inline-flex h-full w-full items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                  <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-slate-900 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium ring-2 ring-white">
                    {count}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Professional Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-sm">
            <div className="px-4 py-3 space-y-1">
              {/* Mobile Search */}
              <div className="sm:hidden mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white hover:border-slate-400 font-premium placeholder:text-slate-400"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              
              {/* Mobile Navigation Links */}
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/product', label: 'Products' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-200 font-minimal ${
                    isActive(link.to)
                      ? 'text-slate-900 border-l-2 border-slate-900 pl-3'
                      : 'text-slate-600 hover:text-slate-900 hover:pl-3'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

