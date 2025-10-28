import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, MapPin, Mail } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const FacebookIcon = FaFacebookF as React.ComponentType<{ className?: string }>;
const InstagramIcon = FaInstagram as React.ComponentType<{ className?: string }>;
const YoutubeIcon = FaYoutube as React.ComponentType<{ className?: string }>;
const PinterestIcon = FaPinterestP as React.ComponentType<{ className?: string }>;
const TwitterIcon = FaTwitter as React.ComponentType<{ className?: string }>;
const LinkedinIcon = FaLinkedinIn as React.ComponentType<{ className?: string }>;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      {/* Professional Discount Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-3 px-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <div className="flex items-center space-x-3 text-white">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold tracking-wide">SPECIAL OFFER</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
            <span className="text-sm font-medium text-slate-200">Get 10% off your first order with code <span className="font-bold text-emerald-400">WELCOME10</span></span>
            <div className="hidden md:flex items-center space-x-2 ml-4">
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span className="text-xs text-slate-400 font-medium">Limited time offer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Top Bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2 text-slate-600">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span className="font-medium">Punjabi Colony, Julana, Haryana 126101</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                  <YoutubeIcon className="h-4 w-4" />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                  <PinterestIcon className="h-4 w-4" />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                  <TwitterIcon className="h-4 w-4" />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <a href="mailto:care@myurawellness.com" className="text-slate-500 hover:text-slate-700 transition-colors duration-200">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Main Navigation */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5 sm:py-6 lg:py-8">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="/LogoBlack.png" 
                alt="MYURA Logo" 
                className="h-12 sm:h-16 lg:h-20 xl:h-24 w-auto object-contain filter brightness-0 drop-shadow-md group-hover:drop-shadow-xl group-hover:scale-105 transition-all duration-300 ease-out"
              />
            </Link>

            {/* Professional Navigation Links */}
            <nav className="hidden md:flex space-x-2">
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
                  className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out rounded-md group ${
                    isActive(link.to) 
                      ? 'text-slate-900 bg-slate-100' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive(link.to) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Professional Search and User Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-56 lg:w-64 px-4 py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white hover:border-slate-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200">
                  <User className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button className="p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                  <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    3
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Professional Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-sm">
            <div className="px-4 py-3 space-y-1">
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
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-slate-900 bg-slate-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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

