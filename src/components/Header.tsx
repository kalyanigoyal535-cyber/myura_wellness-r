import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, MapPin, Mail, Loader2, RefreshCw, Sparkles, Gift, Star, Truck, X, TrendingUp, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { useLocation as useUserLocation } from '../hooks/useLocation';
import { useCart } from '../context/CartContext';
import { productCatalog } from '../data/products';
import ResponsiveProductImage from './ResponsiveProductImage';

const FacebookIcon = FaFacebookF as React.ComponentType<{ className?: string }>;
const InstagramIcon = FaInstagram as React.ComponentType<{ className?: string }>;
const YoutubeIcon = FaYoutube as React.ComponentType<{ className?: string }>;
const PinterestIcon = FaPinterestP as React.ComponentType<{ className?: string }>;
const TwitterIcon = FaTwitter as React.ComponentType<{ className?: string }>;
const LinkedinIcon = FaLinkedinIn as React.ComponentType<{ className?: string }>;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const headerRef = React.useRef<HTMLElement>(null);
  const topBarRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { address, loading, error, refreshLocation } = useUserLocation();
  const { count } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof productCatalog>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mobileDropdownPosition, setMobileDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isDesktopViewport, setIsDesktopViewport] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);
  
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => {
      if (!prev) setIsSearchOpen(false);
      return !prev;
    });
  }, []);
  
  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true);
  }, []);
  
  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }, []);

  // Track viewport breakpoint for desktop vs mobile rendering
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setIsDesktopViewport(window.innerWidth >= 1024);

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search function - searches through name, headline, description, benefits, etc.
  const performSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = trimmedQuery.toLowerCase();
    const results = productCatalog.filter((product) => {
      const searchableText = [
        product.name,
        product.headline,
        product.summary,
        product.description,
        product.heroTagline,
        ...product.benefits,
        product.keyIngredients,
        product.suitableFor,
        product.howToUse,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(lowerQuery);
    });

    // Sort by relevance (exact name match first, then headline, then others)
    const sortedResults = results.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(lowerQuery);
      const bNameMatch = b.name.toLowerCase().includes(lowerQuery);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;

      const aHeadlineMatch = a.headline.toLowerCase().includes(lowerQuery);
      const bHeadlineMatch = b.headline.toLowerCase().includes(lowerQuery);
      if (aHeadlineMatch && !bHeadlineMatch) return -1;
      if (!aHeadlineMatch && bHeadlineMatch) return 1;

      return 0;
    });

    const limitedResults = sortedResults.slice(0, 6);
    setSearchResults(limitedResults);
    // Always show dropdown when there's a query
    setShowResults(true);
    setSelectedIndex(-1);
  }, []);

  // Update dropdown position for desktop
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;

    const updatePosition = () => {
      if (desktopSearchInputRef.current) {
        const rect = desktopSearchInputRef.current.getBoundingClientRect();
        const enhancedWidth = Math.max(rect.width * 1.35, 520);
        setDropdownPosition({
          top: rect.bottom + 12,
          left: rect.left,
          width: enhancedWidth
        });
      }
    };

    const startAnimationLoop = () => {
      const loop = () => {
        updatePosition();
        rafId = requestAnimationFrame(loop);
      };
      loop();
    };
    
    if (searchQuery.trim().length > 0 && showResults && window.innerWidth >= 1024) {
      updatePosition();
      // Update on scroll to keep it aligned with search input and while header animates
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      startAnimationLoop();
    }
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [searchQuery, showResults]);

  // Update dropdown position for mobile
  useEffect(() => {
    const updateMobilePosition = () => {
      if (searchInputRef.current && isSearchOpen) {
        const rect = searchInputRef.current.getBoundingClientRect();
        // Use viewport-relative coordinates (getBoundingClientRect already gives viewport coords)
        setMobileDropdownPosition({
          top: rect.bottom + 12,
          left: rect.left,
          width: rect.width
        });
      }
    };
    
    if (searchQuery.trim().length > 0 && isSearchOpen && showResults && window.innerWidth < 1024) {
      updateMobilePosition();
      // Update on scroll to keep it aligned with search input
      window.addEventListener('scroll', updateMobilePosition, true);
      window.addEventListener('resize', updateMobilePosition);
    }
    
    return () => {
      window.removeEventListener('scroll', updateMobilePosition, true);
      window.removeEventListener('resize', updateMobilePosition);
    };
  }, [searchQuery, isSearchOpen, showResults]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Perform search immediately - no delay
    if (value.trim().length > 0) {
      performSearch(value);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [performSearch]);

  // Handle search result click
  const handleResultClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setIsSearchOpen(false);
    if (searchInputRef.current) searchInputRef.current.blur();
    if (desktopSearchInputRef.current) desktopSearchInputRef.current.blur();
  }, [navigate]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleResultClick(searchResults[selectedIndex].id);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSearchQuery('');
      setSearchResults([]);
      if (searchInputRef.current) searchInputRef.current.blur();
      if (desktopSearchInputRef.current) desktopSearchInputRef.current.blur();
    }
  }, [showResults, searchResults, selectedIndex, handleResultClick]);

  // Close search results on outside click
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        desktopSearchInputRef.current &&
        !desktopSearchInputRef.current.contains(event.target as Node)
      ) {
        handleSearchClose();
      }
    };

    if (showResults) {
      document.addEventListener('pointerdown', handleClickOutside);
      return () => document.removeEventListener('pointerdown', handleClickOutside);
    }
  }, [showResults, handleSearchClose]);
  
  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        handleMenuClose();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isMenuOpen, handleMenuClose]);

  useEffect(() => {
    if (isDesktopViewport && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isDesktopViewport, isMenuOpen]);

  // Banner data - Premium & Attractive
  const banners = useMemo(() => [
    {
      text: "New to Myura? Welcome! Enjoy 10% off your first purchase. Your wellness journey starts here.",
      textMobile: "Get 10% off your first purchase.",
      highlight: "10% OFF First Purchase",
      highlightMobile: "10% OFF",
      badge: "NEW CUSTOMER",
      icon: Gift,
      color: "from-emerald-400 to-teal-500"
    },
    {
      text: "Limited Time: Complimentary shipping on all orders. No minimum purchase required. Shop now.",
      textMobile: "FREE Shipping on all orders. No minimum required.",
      highlight: "FREE Shipping",
      highlightMobile: "FREE Shipping",
      badge: "THIS WEEK",
      icon: Truck,
      color: "from-blue-400 to-indigo-500"
    },
    {
      text: "Pure ingredients. Proven results. Join thousands who trust Myura for their wellness journey.",
      textMobile: "Pure ingredients. Trusted by thousands.",
      highlight: "Trusted by Thousands",
      highlightMobile: "Trusted",
      badge: "PREMIUM QUALITY",
      icon: Star,
      color: "from-amber-400 to-orange-500"
    },
    {
      text: "Welcome to the Myura family. Use code WELCOME10 at checkout for 10% off your first order.",
      textMobile: "Use code WELCOME10 for 10% off your first order.",
      highlight: "WELCOME10",
      highlightMobile: "WELCOME10",
      badge: "EXCLUSIVE",
      icon: Sparkles,
      color: "from-emerald-400 to-green-500"
    }
  ], []);

  // Banner rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Detect scroll to adjust header sizing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const measureTopBar = useCallback(() => {
    const topBarEl = topBarRef.current;
    if (!topBarEl) return;

    const previousTransition = topBarEl.style.transition;
    const previousMaxHeight = topBarEl.style.maxHeight;

    // Temporarily disable transition and max-height constraint so we can measure the actual size
    topBarEl.style.transition = 'none';
    topBarEl.style.maxHeight = 'none';

    const measuredHeight = topBarEl.scrollHeight;
    setTopBarHeight(measuredHeight);

    // Restore inline styles so React retains control
    topBarEl.style.maxHeight = previousMaxHeight;
    topBarEl.style.transition = previousTransition;
  }, []);

  // Measure top bar height for smooth collapsing
  useEffect(() => {
    measureTopBar();
    window.addEventListener('resize', measureTopBar);

    return () => {
      window.removeEventListener('resize', measureTopBar);
    };
  }, [measureTopBar]);

  // Recalculate top bar height when location state updates
  useEffect(() => {
    measureTopBar();
  }, [address, loading, error, measureTopBar]);

  const updateHeaderHeight = useCallback(() => {
    if (typeof window === 'undefined') return;
    requestAnimationFrame(() => {
      const height = headerRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    });
  }, []);

  // Calculate header height and set CSS variable for content padding
  useEffect(() => {
    updateHeaderHeight();
    const timeout = window.setTimeout(updateHeaderHeight, 520);
    return () => window.clearTimeout(timeout);
  }, [updateHeaderHeight, currentBannerIndex, isScrolled, topBarHeight]);

  useEffect(() => {
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [updateHeaderHeight]);

  // Reinforce fixed positioning in case external styles interfere
  useEffect(() => {
    const applyFixedStyles = () => {
      const headerEl = headerRef.current;
      if (!headerEl) return;

      headerEl.style.position = 'fixed';
      headerEl.style.top = '0px';
      headerEl.style.left = '0px';
      headerEl.style.right = '0px';
      headerEl.style.width = '100%';
      headerEl.style.zIndex = '9999';
    };

    const handleScrollOrResize = () => {
      requestAnimationFrame(applyFixedStyles);
    };

    applyFixedStyles();
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);
  
  // Memoize navigation links
  const navLinks = useMemo(() => [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/product', label: 'Products' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' }
  ], []);

  const currentBanner = banners[currentBannerIndex];

  const trimmedSearchQuery = searchQuery.trim();
  const shouldShowMobileResults = trimmedSearchQuery.length > 0 && isSearchOpen && showResults;
  const shouldShowDesktopResults = trimmedSearchQuery.length > 0 && isDesktopViewport && showResults;
  const shouldShowMenuOverlay = isMenuOpen && !isDesktopViewport;
  const shouldShowSearchOverlay = shouldShowMobileResults || shouldShowDesktopResults;

  const headerContent = (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur shadow-sm transition-shadow duration-300"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 9999,
        pointerEvents: 'auto'
      } as React.CSSProperties}
    >
      {/* Premium Rotating Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-2 sm:py-2.5 sm:py-3 px-2 sm:px-3 md:px-4 relative overflow-hidden">
        <div className="w-full flex items-center justify-center relative z-10">
          <div className="flex items-center justify-center w-full gap-1.5 sm:gap-2 md:gap-3">
            {/* Premium Badge - Smaller on mobile */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold font-sharp text-white tracking-wider uppercase whitespace-nowrap">
                  {currentBanner.badge}
                </span>
              </div>
            </div>

            {/* Aesthetic Icon */}
            <div className="flex-shrink-0 hidden sm:block">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.color} opacity-20 blur-md rounded-full`}></div>
                <div className="relative p-1.5 sm:p-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  {React.createElement(currentBanner.icon, {
                    className: `h-3 w-3 sm:h-4 sm:w-4 text-white`,
                    strokeWidth: 2.5
                  })}
                </div>
              </div>
            </div>
            
            {/* Banner text with fade animation - Responsive content */}
            <div className="flex-1 text-center min-w-0">
              <div 
                key={currentBannerIndex}
                className="animate-[fadeIn_0.5s_ease-in-out]"
              >
                {/* Mobile version - shorter text */}
                <p className="text-xs sm:text-sm md:text-base font-medium text-white leading-tight sm:leading-normal px-1 sm:hidden">
                  <span className="font-minimal text-slate-100">
                    {currentBanner.textMobile.split(currentBanner.highlightMobile)[0]}
                  </span>
                  <span className={`font-bold font-sharp bg-gradient-to-r ${currentBanner.color} bg-clip-text text-transparent mx-0.5`}>
                    {currentBanner.highlightMobile}
                  </span>
                  <span className="font-minimal text-slate-100">
                    {currentBanner.textMobile.split(currentBanner.highlightMobile)[1]}
                  </span>
                </p>
                
                {/* Desktop version - full text */}
                <p className="hidden sm:block text-xs sm:text-xs md:text-sm font-medium text-white leading-tight sm:leading-normal px-1">
                  <span className="font-minimal text-slate-100">
                    {currentBanner.text.split(currentBanner.highlight)[0]}
                  </span>
                  <span className={`font-bold font-sharp bg-gradient-to-r ${currentBanner.color} bg-clip-text text-transparent mx-1`}>
                    {currentBanner.highlight}
                  </span>
                  <span className="font-minimal text-slate-100">
                    {currentBanner.text.split(currentBanner.highlight)[1]}
                  </span>
                </p>
              </div>
            </div>

            {/* Premium Indicator dots */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2 sm:ml-3">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentBannerIndex
                      ? 'w-2 h-2 bg-white shadow-lg scale-125 ring-2 ring-white/50'
                      : 'w-1.5 h-1.5 bg-slate-400/60 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-4s pointer-events-none"></div>
      </div>

      {/* Professional Top Bar */}
      <div
        ref={topBarRef}
        aria-hidden={isScrolled}
        className="bg-slate-50 border-b border-slate-200 py-2 sm:py-2.5 overflow-hidden"
        style={{
          maxHeight: isScrolled ? 0 : topBarHeight || undefined,
          opacity: isScrolled ? 0 : 1,
          transform: isScrolled ? 'translateY(-12px)' : 'translateY(0)',
          paddingTop: isScrolled ? '0px' : undefined,
          paddingBottom: isScrolled ? '0px' : undefined,
          pointerEvents: isScrolled ? 'none' : 'auto',
          transition: 'max-height 0.45s ease, opacity 0.45s ease, transform 0.45s ease, padding 0.45s ease'
        }}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between items-center text-xs sm:text-sm gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 flex-1 min-w-0">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
              {loading ? (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-slate-500 flex-shrink-0" />
                  <span className="font-minimal text-slate-500 truncate">Detecting location...</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="font-minimal text-slate-500 truncate hidden xs:inline">Plot No. 15C, IT Park, Sector 22, Panchkula, Haryana, 134109</span>
                  <span className="font-minimal text-slate-500 truncate xs:hidden">Panchkula, Haryana</span>
                  <span className="text-xs text-slate-400 font-minimal flex-shrink-0">(Default)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="font-minimal truncate hidden xs:inline">{address}</span>
                  <span className="font-minimal truncate xs:hidden">{address.split(',')[0]}</span>
                  <button
                    onClick={refreshLocation}
                    className="p-1 hover:bg-slate-200 rounded transition-colors duration-200 flex-shrink-0 flex items-center justify-center"
                    title="Refresh location"
                  >
                    <RefreshCw className="h-3 w-3 text-slate-500 hover:text-slate-700" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-4 flex-shrink-0">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center">
                <FacebookIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center">
                <InstagramIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center">
                <YoutubeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center">
                <PinterestIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center">
                <TwitterIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center">
                <LinkedinIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="mailto:care@myurawellness.com" className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Main Navigation */}
      <div
        className={`bg-white/90 backdrop-blur border-b border-slate-200 transition-shadow duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div
            className="flex items-center justify-between gap-2 sm:gap-3 min-w-0"
            style={{
              paddingTop: isScrolled ? '0.45rem' : '0.75rem',
              paddingBottom: isScrolled ? '0.45rem' : '0.75rem',
              transition: 'padding 0.45s ease'
            }}
          >
            {/* Left Side - Search Icon and Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
              {/* Mobile Search - Icon on leftmost */}
              <div className="lg:hidden relative flex-shrink-0">
                {!isSearchOpen ? (
                  // Search Icon Button (Mobile - when closed)
                  <button
                    onClick={handleSearchOpen}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                ) : (
                  // Search Input (Mobile - when open) - Expands to the right
                  <div className="relative max-w-[calc(100vw-180px)] sm:max-w-[280px] w-[160px] sm:w-[220px] animate-slideIn-cubic">
                    <div className="relative group">
                    <input
                        ref={searchInputRef}
                      type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                      if (searchQuery.trim()) {
                        performSearch(searchQuery);
                      }
                    }}
                      autoFocus
                        className="w-full px-4 py-2 pl-9 pr-9 text-xs sm:text-sm border-2 border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 transition-all duration-300 bg-white/95 backdrop-blur-sm hover:bg-white hover:border-slate-300 hover:shadow-md font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                            setShowResults(false);
                          }}
                          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-1 transition-all duration-200"
                        >
                          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      )}
                      {!searchQuery && (
                    <button
                      onClick={handleSearchClose}
                          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-1 transition-all duration-200"
                        >
                          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logo */}
              <Link 
                to="/" 
                className={`flex items-center group flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isSearchOpen 
                    ? 'scale-[0.88] translate-x-1 opacity-90' 
                    : 'scale-100 translate-x-0 opacity-100'
                } ${isScrolled ? 'scale-[0.95]' : 'scale-100'}`}
                style={{
                  transition: 'transform 0.45s ease, opacity 0.45s ease'
                }}
              >
                <img 
                  src="/Logo-02.png" 
                  alt="MYURA Logo" 
                  className="w-auto object-contain filter brightness-0 drop-shadow-md group-hover:drop-shadow-lg group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    height: isScrolled ? '2.6rem' : '3.1rem',
                    transition: 'height 0.45s ease'
                  }}
                />
              </Link>
            </div>

            {/* Simple & Classy Navigation Links - Desktop only */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 items-center flex-1 justify-center">
              {navLinks.map((link) => (
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

            {/* User Actions - Right side */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
              {/* Desktop Search - Always visible */}
              <div className="hidden lg:block relative">
                <div className="relative group">
                <input
                    ref={desktopSearchInputRef}
                  type="text"
                    placeholder="Search products, benefits, ingredients..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (searchQuery.trim()) {
                        performSearch(searchQuery);
                      }
                    }}
                    className="w-48 md:w-56 lg:w-64 xl:w-72 px-5 py-2.5 pl-11 pr-11 text-sm border-2 border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-slate-300 hover:shadow-md font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setShowResults(false);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-1 transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <Link to="/my-account" className="inline-flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 flex-shrink-0">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <div className="relative inline-flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center flex-shrink-0">
                <Link to="/cart" className="inline-flex h-full w-full items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-slate-900 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium ring-2 ring-white">
                  {count}
                </span>
              </div>
              {/* Professional Mobile menu button */}
              <button
                ref={menuButtonRef}
                onClick={handleMenuToggle}
                className="lg:hidden p-2 sm:p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 flex-shrink-0 flex items-center justify-center"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Professional Mobile menu */}
        {isMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden bg-white border-t border-slate-200 shadow-sm">
            <div className="px-4 py-3 space-y-1">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-200 font-minimal ${
                    isActive(link.to)
                      ? 'text-slate-900 border-l-2 border-slate-900 pl-3'
                      : 'text-slate-600 hover:text-slate-900 hover:pl-3'
                  }`}
                  onClick={handleMenuClose}
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

  // Use portal to render header directly to body, bypassing any parent transforms
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      let headerContainer = document.getElementById('header-portal-container');
      if (!headerContainer) {
        headerContainer = document.createElement('div');
        headerContainer.id = 'header-portal-container';
        // Portal container should be normal div, header inside will be fixed
        headerContainer.style.cssText = `
          position: relative;
          width: 100%;
          pointer-events: none;
        `;
        document.body.insertBefore(headerContainer, document.body.firstChild);
      }
      setPortalContainer(headerContainer);
    }
  }, []);

  // Render header via portal if available, otherwise render directly
  // Don't return null - always render something
  if (typeof document !== 'undefined' && portalContainer && mounted) {
    return (
      <>
        {createPortal(headerContent, portalContainer)}
        {/* Mobile Search Results Dropdown - Portal to render above everything */}
        {(shouldShowSearchOverlay || shouldShowMenuOverlay) && createPortal(
          <div
            className="fixed inset-0 z-[9990] bg-slate-950/25 backdrop-blur-[1px]"
            style={{ pointerEvents: 'auto' }}
            aria-hidden="true"
            onPointerDown={shouldShowSearchOverlay ? handleSearchClose : handleMenuClose}
          />,
          document.body
        )}
        {shouldShowMobileResults && createPortal(
          <div
            ref={searchResultsRef}
            className="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] border-2 border-slate-300 overflow-hidden max-h-[70vh] overflow-y-auto"
            style={{ 
              zIndex: 99999,
              position: 'fixed',
              top: mobileDropdownPosition.top > 0 ? `${mobileDropdownPosition.top}px` : (searchInputRef.current ? `${searchInputRef.current.getBoundingClientRect().bottom + 12}px` : '100px'),
              left: '10px',
              right: '10px',
              width: 'calc(100vw - 20px)',
              maxWidth: 'calc(100vw - 20px)',
              pointerEvents: 'auto'
            } as React.CSSProperties}
          >
            <div className="p-3">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg">
                    <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {searchResults.map((product, idx) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left group border-2 ${
                          selectedIndex === idx
                            ? 'bg-gradient-to-r from-slate-50 to-white scale-[1.02] shadow-lg border-slate-300'
                            : 'bg-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-white border-transparent hover:border-slate-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 group-hover:border-slate-300 transition-all duration-300">
                          <ResponsiveProductImage
                            image={product.image}
                            className="w-full h-full"
                            imgClassName="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate group-hover:text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">{product.headline}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-0.5">
                              {[...Array(product.rating)].map((_, i) => (
                                <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-slate-900">₹{product.price}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-6 px-4 text-center">
                  <Search className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 mb-1">No products found</p>
                  <p className="text-[10px] text-slate-500">Try different keywords</p>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
        {/* Desktop Search Results Dropdown - Portal */}
        {shouldShowDesktopResults && createPortal(
          <div
            ref={searchResultsRef}
            className="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] border-2 border-slate-300 overflow-hidden max-h-[520px] overflow-y-auto"
            style={{ 
              zIndex: 99999,
              position: 'fixed',
              top: dropdownPosition.top > 0 ? `${dropdownPosition.top}px` : (desktopSearchInputRef.current ? `${desktopSearchInputRef.current.getBoundingClientRect().bottom + 12}px` : '100px'),
              left: dropdownPosition.left > 0 ? `${dropdownPosition.left}px` : (desktopSearchInputRef.current ? `${desktopSearchInputRef.current.getBoundingClientRect().left}px` : '50%'),
              width: dropdownPosition.width > 0 ? `${dropdownPosition.width}px` : '520px',
              maxWidth: '760px',
              pointerEvents: 'auto'
            } as React.CSSProperties}
          >
            <div className="p-3">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {searchResults.length} {searchResults.length === 1 ? 'Result Found' : 'Results Found'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {searchResults.map((product, idx) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left group border-2 ${
                          selectedIndex === idx
                            ? 'bg-gradient-to-r from-slate-50 via-white to-slate-50 scale-[1.02] shadow-lg border-slate-300'
                            : 'bg-white hover:bg-gradient-to-r hover:from-slate-50 hover:via-white hover:to-slate-50 border-transparent hover:border-slate-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 border-2 border-slate-200 group-hover:border-slate-300 group-hover:shadow-md transition-all duration-300">
                          <ResponsiveProductImage
                            image={product.image}
                            className="w-full h-full"
                            imgClassName="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-slate-900 truncate group-hover:text-slate-800 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-600 truncate mt-1 font-medium">{product.headline}</p>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-1.5">{product.summary}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-0.5">
                                {[...Array(product.rating)].map((_, i) => (
                                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <span className="text-xs text-slate-500 font-medium">({product.reviews})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-slate-900">₹{product.price}</span>
                              {product.originalPrice > product.price && (
                                <span className="text-xs text-slate-400 line-through font-medium">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                  {searchResults.length >= 6 && (
                    <div className="mt-3 pt-3 border-t-2 border-slate-200">
                      <Link
                        to={`/product?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowResults(false);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 rounded-xl transition-all duration-300 border-2 border-slate-200 hover:border-slate-300 hover:shadow-md"
                      >
                        <span>View All Results</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 px-4 text-center">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">No products found</p>
                  <p className="text-xs text-slate-500">Try searching for product names, benefits, or ingredients</p>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }
  
  // Fallback: render directly if portal not ready (for SSR or initial render)
  return (
    <>
      {headerContent}
      {/* Mobile Search Results Dropdown - Portal */}
      {(shouldShowSearchOverlay || shouldShowMenuOverlay) && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9990] bg-slate-950/25 backdrop-blur-[1px]"
          style={{ pointerEvents: 'auto' }}
          aria-hidden="true"
          onPointerDown={shouldShowSearchOverlay ? handleSearchClose : handleMenuClose}
        />,
        document.body
      )}
      {shouldShowMobileResults && typeof document !== 'undefined' && createPortal(
        <div
          ref={searchResultsRef}
          className="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] border-2 border-slate-300 overflow-hidden max-h-[70vh] overflow-y-auto"
          style={{ 
            zIndex: 99999,
            position: 'fixed',
            top: mobileDropdownPosition.top > 0 ? `${mobileDropdownPosition.top}px` : (searchInputRef.current ? `${searchInputRef.current.getBoundingClientRect().bottom + 12}px` : '100px'),
            left: '10px',
            right: '10px',
            width: 'calc(100vw - 20px)',
            maxWidth: 'calc(100vw - 20px)',
            pointerEvents: 'auto'
          } as React.CSSProperties}
        >
          <div className="p-3">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg">
                  <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                  </span>
                </div>
                <div className="space-y-2">
                  {searchResults.map((product, idx) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left group border-2 ${
                        selectedIndex === idx
                          ? 'bg-gradient-to-r from-slate-50 to-white scale-[1.02] shadow-lg border-slate-300'
                          : 'bg-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-white border-transparent hover:border-slate-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 group-hover:border-slate-300 transition-all duration-300">
                        <ResponsiveProductImage
                          image={product.image}
                          className="w-full h-full"
                          imgClassName="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate group-hover:text-slate-800">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">{product.headline}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(product.rating)].map((_, i) => (
                              <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-900">₹{product.price}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-6 px-4 text-center">
                <Search className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 mb-1">No products found</p>
                <p className="text-[10px] text-slate-500">Try different keywords</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
      {/* Desktop Search Results Dropdown - Portal */}
      {shouldShowDesktopResults && typeof document !== 'undefined' && createPortal(
        <div
          ref={searchResultsRef}
          className="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] border-2 border-slate-300 overflow-hidden max-h-[520px] overflow-y-auto"
            style={{ 
              zIndex: 99999,
              position: 'fixed',
              top: dropdownPosition.top > 0 ? `${dropdownPosition.top}px` : (desktopSearchInputRef.current ? `${desktopSearchInputRef.current.getBoundingClientRect().bottom + 12}px` : '100px'),
              left: dropdownPosition.left > 0 ? `${dropdownPosition.left}px` : (desktopSearchInputRef.current ? `${desktopSearchInputRef.current.getBoundingClientRect().left}px` : '50%'),
              width: dropdownPosition.width > 0 ? `${dropdownPosition.width}px` : '520px',
              maxWidth: '760px',
              pointerEvents: 'auto'
            } as React.CSSProperties}
        >
          <div className="p-3">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {searchResults.length} {searchResults.length === 1 ? 'Result Found' : 'Results Found'}
                  </span>
                </div>
                <div className="space-y-2">
                  {searchResults.map((product, idx) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left group border-2 ${
                        selectedIndex === idx
                          ? 'bg-gradient-to-r from-slate-50 via-white to-slate-50 scale-[1.02] shadow-lg border-slate-300'
                          : 'bg-white hover:bg-gradient-to-r hover:from-slate-50 hover:via-white hover:to-slate-50 border-transparent hover:border-slate-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 border-2 border-slate-200 group-hover:border-slate-300 group-hover:shadow-md transition-all duration-300">
                        <ResponsiveProductImage
                          image={product.image}
                          className="w-full h-full"
                          imgClassName="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-900 truncate group-hover:text-slate-800 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-sm text-slate-600 truncate mt-1 font-medium">{product.headline}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1.5">{product.summary}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              {[...Array(product.rating)].map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500 font-medium">({product.reviews})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-slate-900">₹{product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs text-slate-400 line-through font-medium">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
                {searchResults.length >= 6 && (
                  <div className="mt-3 pt-3 border-t-2 border-slate-200">
                    <Link
                      to={`/product?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setShowResults(false);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 rounded-xl transition-all duration-300 border-2 border-slate-200 hover:border-slate-300 hover:shadow-md"
                    >
                      <span>View All Results</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 px-4 text-center">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700 mb-1">No products found</p>
                <p className="text-xs text-slate-500">Try searching for product names, benefits, or ingredients</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default React.memo(Header);

