import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Star, Heart, Sparkles, ShieldCheck, HeartPulse, X, ZoomIn, ArrowRight, Leaf, Activity, Droplets } from 'lucide-react';
import ResponsiveProductImage from './ResponsiveProductImage';
import ZoomableImageViewer from './ZoomableImageViewer';
import type { ProductRecord } from '../data/products';
import { getRelatedProducts } from '../data/products';
import useImagePalette from '../hooks/useImagePalette';
import { useCart } from '../context/CartContext';

type CSSCustomProperties = React.CSSProperties & Record<`--${string}`, string>;

const relatedCardStyles: Record<
  string,
  {
    gradient: string;
    accentText: string;
  }
> = {
  'dia-care': { gradient: 'from-purple-50 via-fuchsia-50 to-white', accentText: 'text-purple-600' },
  'liver-detox': { gradient: 'from-emerald-50 via-teal-50 to-white', accentText: 'text-emerald-600' },
  'bone-joint-support': { gradient: 'from-blue-50 via-indigo-50 to-white', accentText: 'text-indigo-600' },
  'gut-and-digestion': { gradient: 'from-amber-50 via-orange-50 to-white', accentText: 'text-amber-600' },
  'womens-health-plus': { gradient: 'from-rose-50 via-pink-50 to-white', accentText: 'text-rose-600' },
  'mens-vitality-booster': { gradient: 'from-sky-50 via-cyan-50 to-white', accentText: 'text-sky-600' },
};

const getRelatedCardStyle = (productId: string) =>
  relatedCardStyles[productId] ?? { gradient: 'from-slate-50 via-slate-100 to-white', accentText: 'text-slate-900' };

interface ThemedProductPageProps {
  product: ProductRecord;
  themeClassName?: string;
  decorativeIcons?: React.ComponentType<{ className?: string }>[];
}

const ThemedProductPage: React.FC<ThemedProductPageProps> = React.memo(({ product, themeClassName = 'themed-product', decorativeIcons = [] }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('benefits');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);

  const discountPercent = Math.round(
    (((product?.originalPrice ?? 0) - (product?.price ?? 0)) / (product?.originalPrice ?? 1)) * 100
  );

  const keyIngredientHighlights =
    product?.keyIngredients
      .split('.')
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const suitableForHighlights =
    product?.suitableFor
      .split('.')
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  const relatedProducts = useMemo(
    () => (product ? getRelatedProducts(product.id) : []),
    [product]
  );

  const gallery =
    product?.gallery && product.gallery.length > 0
      ? product.gallery
      : product?.image
      ? [product.image]
      : [];
  
  const heroImage = gallery[activeImageIndex] ?? product?.image;
  const galleryLength = gallery.length;
  const palette = useImagePalette(heroImage, product.id);
  
  const themeVars = useMemo<CSSCustomProperties>(
    () => ({
      '--product-base': palette.base,
      '--product-dark': palette.dark,
      '--product-darker': palette.darker,
      '--product-light': palette.light,
      '--product-lighter': palette.lighter,
      '--product-muted': palette.muted,
      '--product-border': palette.border,
      '--product-border-strong': palette.borderStrong,
      '--product-contrast': palette.contrastText,
      '--product-base-rgb': palette.rgbString,
      '--product-accent-rgb': palette.accentRgb,
      '--product-hero-gradient': palette.heroGradient,
      '--product-soft-gradient': palette.softGradient,
      '--product-card-gradient': palette.cardGradient,
      '--product-cta-gradient': palette.ctaGradient,
      '--product-page-gradient': palette.pageBackground,
      '--product-chip-bg': palette.chipBg,
      '--product-chip-text': palette.chipText,
      '--product-shadow': palette.shadow,
      '--product-glow': palette.glow,
      '--product-highlight': palette.highlight,
    }) as CSSCustomProperties,
    [palette],
  );

  const handleGalleryNav = useCallback(
    (delta: number) => {
      setActiveImageIndex((prev) => {
        if (!galleryLength) return prev;
        return (prev + delta + galleryLength) % galleryLength;
      });
    },
    [galleryLength]
  );

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const startX = event.touches[0]?.clientX;
    touchStartXRef.current = startX ?? null;
    touchCurrentXRef.current = startX ?? null;
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    touchCurrentXRef.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartXRef.current === null || touchCurrentXRef.current === null) {
      return;
    }
    const delta = touchStartXRef.current - touchCurrentXRef.current;
    if (Math.abs(delta) > 40) {
      handleGalleryNav(delta > 0 ? 1 : -1);
    }
    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
  }, [handleGalleryNav]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 640) return;
    const container = thumbnailContainerRef.current;
    const currentThumb = thumbnailRefs.current[activeImageIndex];
    if (!container || !currentThumb) return;

    const containerRect = container.getBoundingClientRect();
    const thumbRect = currentThumb.getBoundingClientRect();
    const deltaLeft = thumbRect.left - containerRect.left;
    const targetScrollLeft =
      container.scrollLeft + deltaLeft - (container.clientWidth - thumbRect.width) / 2;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });
  }, [activeImageIndex]);

  const handleOpenZoom = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setIsZoomed(false);
  }, []);

  const handleBackdropPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        handleCloseZoom();
      }
    },
    [handleCloseZoom]
  );

  useEffect(() => {
    if (!isZoomed) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomed]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const eventName = 'myura:header-compact';
    window.dispatchEvent(new CustomEvent(eventName, { detail: isZoomed }));
    return () => {
      window.dispatchEvent(new CustomEvent(eventName, { detail: false }));
    };
  }, [isZoomed]);

  const toggleSection = (sectionId: string) => {
    setExpandedSection((current) => (current === sectionId ? null : sectionId));
  };

  const Icon1 = decorativeIcons[0] || Sparkles;
  const Icon2 = decorativeIcons[1] || Leaf;
  const Icon3 = decorativeIcons[2] || Activity;

  // Preload the hero image for faster color extraction
  useEffect(() => {
    if (heroImage?.fallback) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.fallback;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [heroImage?.fallback]);

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-b from-white via-white to-white ${themeClassName} transition-colors duration-300`}
        style={themeVars}
      >
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden pt-12 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20"
          style={{ background: `var(--product-hero-gradient)` }}
          data-aos="fade-in"
          data-aos-duration="1000"
          data-aos-easing="ease-out-cubic"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div 
              className="absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl"
              style={{ background: `var(--product-glow)` }}
            />
            <div 
              className="absolute top-1/2 -left-32 h-80 w-80 rounded-full blur-3xl"
              style={{ background: `var(--product-highlight)` }}
            />
            <div 
              className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full blur-2xl"
              style={{ background: `var(--product-glow)` }}
            />
          </div>

          <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 max-w-7xl mx-auto">
              {/* Image Card */}
              <div 
                className="flex-1 max-w-lg mx-auto lg:mx-0 order-1 lg:order-2"
                data-aos="zoom-in"
                data-aos-delay="100"
                data-aos-duration="900"
                data-aos-easing="ease-out-cubic"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl blur-2xl -z-10"
                    style={{ background: `var(--product-glow)` }}
                  />
                  
                  {/* Image Container */}
                  <div
                    className="relative rounded-[2rem] border-2 border-white/80 bg-white/95 backdrop-blur-sm shadow-2xl p-4"
                    style={{ boxShadow: `var(--product-shadow)` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <button
                      type="button"
                      onClick={handleOpenZoom}
                      className="group relative block w-full focus:outline-none focus-visible:ring-2 rounded-2xl lg:pointer-events-none"
                      style={{ '--tw-ring-color': 'var(--product-base)' } as React.CSSProperties}
                    >
                      <div 
                        className="relative overflow-hidden rounded-[1.75rem] shadow-inner transition-transform duration-300 group-hover:scale-[0.98]"
                        style={{ background: `var(--product-soft-gradient)` }}
                      >
                        <ResponsiveProductImage
                          image={heroImage}
                          className="w-full rounded-[1.5rem]"
                          imgClassName="object-contain w-full h-full rounded-[1.5rem]"
                        />
                      </div>
                      <span 
                        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] shadow-lg border sm:flex lg:hidden"
                        style={{ 
                          color: 'var(--product-darker)',
                          borderColor: 'var(--product-border)'
                        }}
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                        Zoom
                      </span>
                    </button>
                  </div>

                  {/* Gallery Thumbnails */}
                  {gallery.length > 1 && (
                    <div
                      ref={thumbnailContainerRef}
                      className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center scroll-smooth snap-x snap-mandatory"
                    >
                      {gallery.map((galleryImage, index) => (
                        <button
                          key={`${galleryImage.fallback}-${galleryImage.alt}`}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          ref={(element) => {
                            thumbnailRefs.current[index] = element;
                          }}
                          className={`group relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-2xl transition-all duration-300 snap-start ${
                            activeImageIndex === index
                              ? 'scale-105 ring-2 shadow-lg'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          style={activeImageIndex === index ? {
                            '--tw-ring-color': 'var(--product-base)',
                            boxShadow: `var(--product-shadow)`
                          } as React.CSSProperties : {}}
                          aria-label={`Show product image ${index + 1}`}
                        >
                          <div 
                            className="relative h-full w-full overflow-hidden rounded-2xl bg-white border shadow-md"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <ResponsiveProductImage
                              image={galleryImage}
                              className="h-full w-full"
                              imgClassName="object-contain p-1.5"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Section - Mobile */}
              <div className="flex-1 order-2 lg:hidden">
                <div className="w-full mb-6">
                  <div 
                    className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/90 shadow-xl"
                    style={{ 
                      boxShadow: `var(--product-shadow)`,
                      borderColor: 'var(--product-border)'
                    }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ background: `var(--product-soft-gradient)` }}
                    />
                    <div className="relative flex flex-col gap-3.5 p-3.5 sm:gap-4 sm:p-4">
                      <div className="flex flex-col gap-2.5">
                        <span 
                          className="inline-flex items-center gap-1.5 self-start rounded-full border bg-white/85 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.35em]"
                          style={{ 
                            color: 'var(--product-darker)',
                            borderColor: 'var(--product-border)'
                          }}
                        >
                          Special Ritual Price
                        </span>
                        <div className="flex items-baseline gap-2.5 text-slate-900">
                          <span className="text-2xl sm:text-3xl font-bold leading-none">₹{product.price}</span>
                          <div className="flex flex-col text-[10px] sm:text-xs text-slate-500 leading-tight">
                            <span className="line-through">₹{product.originalPrice}</span>
                            <span className="font-semibold" style={{ color: 'var(--product-darker)' }}>
                              Save {discountPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="flex items-center rounded-full border bg-white/85 shadow-inner flex-shrink-0"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <button
                              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                              className="px-2.5 py-1.5 transition-colors rounded-l-full hover:opacity-70"
                              style={{ color: 'var(--product-darker)' }}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 py-1.5 text-xs font-semibold" style={{ color: 'var(--product-darker)' }}>{quantity}</span>
                            <button
                              onClick={() => setQuantity((value) => value + 1)}
                              className="px-2.5 py-1.5 transition-colors rounded-r-full hover:opacity-70"
                              style={{ color: 'var(--product-darker)' }}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex flex-1 gap-2">
                            <button 
                              onClick={async () => {
                                if (isAddingToCart) return;
                                setIsAddingToCart(true);
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image?.fallback || '',
                                }, quantity);
                                // Reset after animation
                                setTimeout(() => setIsAddingToCart(false), 1000);
                              }}
                              disabled={isAddingToCart || !product.inStock}
                              className="group relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ 
                                background: `var(--product-cta-gradient)`,
                                boxShadow: `var(--product-shadow)`
                              }}
                            >
                              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              <span className="relative inline-flex items-center gap-1.5">
                                {isAddingToCart ? 'Added!' : 'Add to Cart'}
                                {isAddingToCart ? (
                                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                                ) : (
                                  <Heart className="h-3.5 w-3.5" />
                                )}
                              </span>
                            </button>
                            <button 
                              onClick={() => {
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image?.fallback || '',
                                }, quantity);
                                navigate('/cart');
                              }}
                              disabled={!product.inStock}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border bg-white/95 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ 
                                borderColor: 'var(--product-border)',
                                color: 'var(--product-darker)',
                                boxShadow: `var(--product-shadow)`
                              }}
                            >
                              Buy Now
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold" style={{ color: 'var(--product-darker)' }}>
                          <div 
                            className="inline-flex flex-1 items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 border"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">100% Natural</span>
                          </div>
                          <div 
                            className="inline-flex flex-1 items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 border"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <Leaf className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">Lab Verified</span>
                          </div>
                          <span 
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border px-2 py-0.5 uppercase tracking-[0.25em]"
                            style={{ 
                              borderColor: 'var(--product-border)',
                              backgroundColor: 'var(--product-chip-bg)'
                            }}
                          >
                            {product.inStock ? 'In Stock' : 'Back Soon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Content - Product Name + Price */}
              <div 
                className="flex-1 space-y-6 text-center lg:text-left mb-0 order-3 lg:order-1"
                data-aos="fade-up"
                data-aos-delay="150"
                data-aos-duration="900"
                data-aos-easing="ease-out-cubic"
              >
                <div 
                  className="inline-flex flex-col items-center lg:items-start gap-2 text-center lg:text-left"
                >
                  <div
                    className="inline-flex items-center gap-2 rounded-full border bg-white/70 backdrop-blur-sm px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] shadow-lg"
                    style={{ 
                      borderColor: 'var(--product-border)',
                      color: 'var(--product-darker)',
                      boxShadow: `var(--product-shadow)`
                    }}
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="800"
                  >
                    <Icon1 className="h-3.5 w-3.5" />
                    {product.headline}
                    <Icon2 className="h-3.5 w-3.5" />
                  </div>
                  <h1 
                    className="relative inline-flex items-center justify-center lg:justify-start text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg"
                    style={{ color: 'var(--product-contrast)' }}
                    data-aos="fade-up"
                    data-aos-delay="250"
                    data-aos-duration="900"
                  >
                    <span
                      className="relative px-4 py-1 rounded-full bg-white/10 backdrop-blur tracking-[0.08em]"
                    >
                      {product.name}
                    </span>
                  </h1>
                </div>
                <p 
                  className="text-base sm:text-lg font-display font-semibold tracking-wide max-w-xl mx-auto lg:mx-0 leading-relaxed" 
                  style={{ color: 'var(--product-contrast)' }}
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="850"
                >
                  {product.summary}
                </p>
                <div 
                  className="flex flex-wrap sm:flex-nowrap justify-center lg:justify-start gap-2 pt-2"
                  data-aos="fade-up"
                  data-aos-delay="350"
                  data-aos-duration="800"
                >
                  <div 
                    className="flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5 border shadow-sm flex-shrink-0 text-[11px] sm:text-xs"
                    style={{ borderColor: 'var(--product-border)' }}
                  >
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-900">{product.rating}.0</span>
                    <span className="text-slate-500">({product.reviews} reviews)</span>
                  </div>
                  <div 
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border flex-shrink-0 text-[11px] sm:text-xs"
                    style={{ 
                      borderColor: 'var(--product-border)',
                      backgroundColor: 'var(--product-chip-bg)',
                      color: 'var(--product-chip-text)'
                    }}
                  >
                    <HeartPulse className="h-4 w-4" />
                    <span className="font-semibold">{product.headline}</span>
                  </div>
                </div>
                {/* Price Section - Desktop only */}
                <div className="w-full hidden lg:block">
                  <div 
                    className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/90 shadow-xl"
                    style={{ 
                      boxShadow: `var(--product-shadow)`,
                      borderColor: 'var(--product-border)'
                    }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ background: `var(--product-soft-gradient)` }}
                    />
                    <div className="relative flex flex-col gap-3.5 p-3.5 sm:gap-4 sm:p-4 lg:p-5">
                      <div className="flex flex-col gap-2.5">
                        <span 
                          className="inline-flex items-center gap-1.5 self-start rounded-full border bg-white/85 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.35em]"
                          style={{ 
                            color: 'var(--product-darker)',
                            borderColor: 'var(--product-border)'
                          }}
                        >
                          Special Ritual Price
                        </span>
                        <div className="flex items-baseline gap-2.5 text-slate-900">
                          <span className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold leading-none">₹{product.price}</span>
                          <div className="flex flex-col text-[10px] sm:text-xs text-slate-500 leading-tight">
                            <span className="line-through">₹{product.originalPrice}</span>
                            <span className="font-semibold" style={{ color: 'var(--product-darker)' }}>
                              Save {discountPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="flex items-center rounded-full border bg-white/85 shadow-inner flex-shrink-0"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <button
                              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                              className="px-2.5 py-1.5 transition-colors rounded-l-full hover:opacity-70"
                              style={{ color: 'var(--product-darker)' }}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 py-1.5 text-xs font-semibold" style={{ color: 'var(--product-darker)' }}>{quantity}</span>
                            <button
                              onClick={() => setQuantity((value) => value + 1)}
                              className="px-2.5 py-1.5 transition-colors rounded-r-full hover:opacity-70"
                              style={{ color: 'var(--product-darker)' }}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex flex-1 gap-2">
                            <button 
                              onClick={async () => {
                                if (isAddingToCart) return;
                                setIsAddingToCart(true);
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image?.fallback || '',
                                }, quantity);
                                // Reset after animation
                                setTimeout(() => setIsAddingToCart(false), 1000);
                              }}
                              disabled={isAddingToCart || !product.inStock}
                              className="group relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ 
                                background: `var(--product-cta-gradient)`,
                                boxShadow: `var(--product-shadow)`
                              }}
                            >
                              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              <span className="relative inline-flex items-center gap-1.5">
                                {isAddingToCart ? 'Added!' : 'Add to Cart'}
                                {isAddingToCart ? (
                                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                                ) : (
                                  <Heart className="h-3.5 w-3.5" />
                                )}
                              </span>
                            </button>
                            <button 
                              onClick={() => {
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image?.fallback || '',
                                }, quantity);
                                navigate('/cart');
                              }}
                              disabled={!product.inStock}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border bg-white/95 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ 
                                borderColor: 'var(--product-border)',
                                color: 'var(--product-darker)',
                                boxShadow: `var(--product-shadow)`
                              }}
                            >
                              Buy Now
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold" style={{ color: 'var(--product-darker)' }}>
                          <div 
                            className="inline-flex flex-1 items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 border"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">100% Natural</span>
                          </div>
                          <div 
                            className="inline-flex flex-1 items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 border"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <Leaf className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">Lab Verified</span>
                          </div>
                          <span 
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border px-2 py-0.5 uppercase tracking-[0.25em]"
                            style={{ 
                              borderColor: 'var(--product-border)',
                              backgroundColor: 'var(--product-chip-bg)'
                            }}
                          >
                            {product.inStock ? 'In Stock' : 'Back Soon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {/* Wellness Journey Section */}
          <section className="relative max-w-6xl mx-auto">
            <div 
              className="relative rounded-3xl border-2 bg-gradient-to-br from-white via-white to-white p-4 sm:p-6 shadow-xl overflow-hidden"
              style={{ 
                borderColor: 'var(--product-border)',
                background: `var(--product-card-gradient)`,
                boxShadow: `var(--product-shadow)`
              }}
            >
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32"
                style={{ background: `var(--product-glow)` }}
              />
              <div 
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl -ml-32 -mb-32"
                style={{ background: `var(--product-highlight)` }}
              />
              
              <div className="relative space-y-3">
                <div 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-xs font-semibold uppercase tracking-[0.4em] text-white"
                  style={{ 
                    backgroundColor: 'var(--product-base)',
                    borderColor: 'var(--product-border-strong)'
                  }}
                  data-aos="zoom-in"
                  data-aos-delay="150"
                  data-aos-duration="700"
                >
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  Your Wellness Journey
                </div>
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="850"
                >
                  {product.heroTagline || product.headline}
                </h2>
                <p 
                  className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl"
                  data-aos="fade-up"
                  data-aos-delay="250"
                  data-aos-duration="800"
                >
                  {product.description}
                </p>
              </div>
            </div>
          </section>

          {/* Ingredients & Usage Section */}
          <section 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="150"
            data-aos-duration="900"
            data-aos-easing="ease-out-cubic"
          >
            {/* Key Ingredients */}
            <div 
              className="rounded-2xl border-2 bg-gradient-to-br from-white via-white to-white p-4 sm:p-5 shadow-xl"
              style={{ 
                borderColor: 'var(--product-border)',
                background: `var(--product-card-gradient)`,
                boxShadow: `var(--product-shadow)`
              }}
              data-aos="slide-right"
              data-aos-delay="200"
              data-aos-duration="850"
            >
              <div className="flex items-center gap-2.5 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--product-chip-bg)' }}
                  >
                    <span style={{ color: 'var(--product-darker)' }}>
                      <Leaf className="h-5 w-5" />
                    </span>
                  </div>
                <div>
                  <p 
                    className="text-[10px] font-semibold uppercase tracking-[0.4em]"
                    style={{ color: 'var(--product-darker)' }}
                  >
                    Key Ingredients
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">Lab-verified herbal matrix</h3>
                </div>
              </div>
              <div className="space-y-2.5">
                {keyIngredientHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-slate-700">
                    <div className="flex-shrink-0 mt-1.5">
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: `var(--product-base)` }}
                      />
                    </div>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use & Suitable For */}
            <div 
              className="space-y-4"
              data-aos="slide-left"
              data-aos-delay="250"
              data-aos-duration="850"
            >
              <div 
                className="rounded-2xl border-2 bg-gradient-to-br from-white to-white p-4 sm:p-5 shadow-xl"
                style={{ 
                  borderColor: 'var(--product-border)',
                  background: `var(--product-card-gradient)`,
                  boxShadow: `var(--product-shadow)`
                }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--product-chip-bg)' }}
                  >
                    <span style={{ color: 'var(--product-darker)' }}>
                      <Icon3 className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <p 
                      className="text-[10px] font-semibold uppercase tracking-[0.4em]"
                      style={{ color: 'var(--product-darker)' }}
                    >
                      How to Use
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Your Daily Ritual</h3>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{product.howToUse}</p>
              </div>

              <div 
                className="rounded-2xl border-2 bg-gradient-to-br from-white via-white to-white p-4 sm:p-5 shadow-xl"
                style={{ 
                  borderColor: 'var(--product-border)',
                  background: `var(--product-card-gradient)`,
                  boxShadow: `var(--product-shadow)`
                }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--product-chip-bg)' }}
                  >
                    <span style={{ color: 'var(--product-darker)' }}>
                      <Heart className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <p 
                      className="text-[10px] font-semibold uppercase tracking-[0.4em]"
                      style={{ color: 'var(--product-darker)' }}
                    >
                      Suitable For
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Perfect For You</h3>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {suitableForHighlights.map((item, idx) => (
                    <li key={idx} className="flex gap-2.5 text-slate-700">
                      <div className="flex-shrink-0 mt-1.5">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: `var(--product-base)` }}
                        />
                      </div>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="max-w-6xl mx-auto">
            <div className="mb-6 text-left">
              <div 
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-[11px] font-semibold uppercase tracking-[0.35em] text-white mb-3"
                style={{ 
                  backgroundColor: 'var(--product-base)',
                  borderColor: 'var(--product-border-strong)'
                }}
              >
                <HeartPulse className="h-3.5 w-3.5" />
                Botanical Benefits
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight">
                Feel the difference in every capsule
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
                A thoughtfully crafted blend designed specifically for your wellness needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.benefits.map((benefit, idx) => {
                const icons = [Activity, Sparkles, Droplets, ShieldCheck, HeartPulse, Leaf];
                const Icon = icons[idx % icons.length];
                return (
                  <div
                    key={benefit}
                    className="group relative rounded-2xl border bg-gradient-to-br from-white to-white p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    style={{ 
                      borderColor: 'var(--product-border)',
                      background: `var(--product-card-gradient)`,
                      boxShadow: activeImageIndex === idx ? `var(--product-shadow)` : undefined
                    }}
                    data-aos="fade-up"
                    data-aos-delay={400 + idx * 100}
                    data-aos-duration="800"
                    data-aos-easing="ease-out-cubic"
                  >
                    <div 
                      className="absolute top-3 right-3 w-14 h-14 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `var(--product-glow)` }}
                    />
                    <div className="relative flex items-center gap-3">
                      <div 
                        className="inline-flex items-center justify-center w-10 h-10 rounded-2xl border"
                        style={{ 
                          background: `var(--product-chip-bg)`,
                          borderColor: 'var(--product-border)'
                        }}
                      >
                        <span style={{ color: 'var(--product-darker)' }}>
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {benefit}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQs Section */}
          <section className="max-w-4xl mx-auto">
            <div 
              className="rounded-2xl border-2 bg-gradient-to-br from-white via-white to-white p-5 sm:p-6 shadow-xl"
              style={{ 
                borderColor: 'var(--product-border)',
                background: `var(--product-card-gradient)`,
                boxShadow: `var(--product-shadow)`
              }}
            >
              <div className="text-center mb-6">
                <div 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-[11px] font-semibold uppercase tracking-[0.35em] text-white mb-3"
                  style={{ 
                    backgroundColor: 'var(--product-base)',
                    borderColor: 'var(--product-border-strong)'
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  Frequently Asked
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  Your questions answered
                </h2>
                <p className="text-base text-slate-600">Holistic answers for your wellness journey</p>
              </div>
              
              <div className="space-y-3">
                {product.faqs.split('.').filter(Boolean).map((answer, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border-2 bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    style={{ borderColor: 'var(--product-border)' }}
                  >
                    <button
                      onClick={() => toggleSection(`faq-${idx}`)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-200 hover:opacity-80"
                      style={{ 
                        backgroundColor: expandedSection === `faq-${idx}` ? 'var(--product-chip-bg)' : 'transparent'
                      }}
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {idx === 0 ? 'How long until I see results?' : `Question ${idx + 1}`}
                      </span>
                      {expandedSection === `faq-${idx}` ? (
                        <span style={{ color: 'var(--product-darker)' }}>
                          <Minus className="h-4 w-4 flex-shrink-0" />
                        </span>
                      ) : (
                        <span style={{ color: 'var(--product-darker)' }}>
                          <Plus className="h-4 w-4 flex-shrink-0" />
                        </span>
                      )}
                    </button>
                    {expandedSection === `faq-${idx}` && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-slate-700 leading-relaxed">{answer.trim()}.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section 
            className="relative max-w-6xl mx-auto"
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
            data-aos-easing="ease-out-cubic"
          >
            <div 
              className="relative rounded-2xl border-2 p-6 sm:p-8 shadow-2xl overflow-hidden"
              style={{ 
                borderColor: 'var(--product-border-strong)',
                background: `var(--product-cta-gradient)`,
                boxShadow: `var(--product-shadow)`
              }}
            >
              <div 
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -mr-40 -mt-40"
                style={{ background: `var(--product-glow)` }}
              />
              <div 
                className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl -ml-40 -mb-40"
                style={{ background: `var(--product-highlight)` }}
              />
              
              <div className="relative text-center space-y-4">
                <div 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white/80 backdrop-blur-sm border text-[11px] font-semibold uppercase tracking-[0.35em]"
                  style={{ 
                    borderColor: 'var(--product-border)',
                    color: 'var(--product-darker)'
                  }}
                  data-aos="zoom-in"
                  data-aos-delay="250"
                  data-aos-duration="700"
                >
                  <Heart className="h-3 w-3" />
                  Daily Devotion
                </div>
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="900"
                >
                  {product.heroTagline || product.headline}
                </h2>
                <p 
                  className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
                  data-aos="fade-up"
                  data-aos-delay="350"
                  data-aos-duration="850"
                >
                  Build a mindful ritual and experience how consistent nourishment transforms the way you move, feel, and glow.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/95 px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{ color: 'var(--product-darker)' }}
                  data-aos="zoom-in"
                  data-aos-delay="400"
                  data-aos-duration="800"
                >
                  Talk to a specialist
                  <Sparkles className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section 
              className="max-w-6xl mx-auto space-y-8"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="900"
              data-aos-easing="ease-out-cubic"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div
                  data-aos="fade-up"
                  data-aos-delay="250"
                  data-aos-duration="850"
                >
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">You may also love</h3>
                  <p className="text-lg text-slate-600 mt-2">Complete your wellness routine</p>
                </div>
                <Link
                  to="/product"
                  className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.3em] transition-colors"
                  style={{ color: 'var(--product-darker)' }}
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="800"
                >
                  View all products →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((related, idx) => {
                  const cardStyle = getRelatedCardStyle(related.id);
                  return (
                    <Link
                      key={related.id}
                      to={`/product/${related.id}`}
                      className="group flex flex-col gap-5 overflow-hidden rounded-3xl border-2 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        boxShadow: `var(--product-shadow)`
                      }}
                      data-aos="fade-up"
                      data-aos-delay={350 + idx * 100}
                      data-aos-duration="800"
                      data-aos-easing="ease-out-cubic"
                    >
                      <div className={`overflow-hidden rounded-2xl bg-gradient-to-br ${cardStyle.gradient} p-4`}>
                        <ResponsiveProductImage
                          image={related.image}
                          className="aspect-square overflow-hidden rounded-xl"
                          imgClassName="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${cardStyle.accentText}`}>
                          {related.headline}
                        </p>
                        <h4 className="text-xl font-bold text-slate-900">{related.name}</h4>
                        <div className="flex items-baseline gap-3 text-slate-900">
                          <span className={`text-lg font-bold ${cardStyle.accentText}`}>₹{related.price}</span>
                          <span className="text-sm text-slate-400 line-through">₹{related.originalPrice}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[2000] bg-slate-950/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseZoom}
          onPointerDown={handleBackdropPointerDown}
        >
          <div
            className="relative flex h-full w-full flex-col"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseZoom}
              className="absolute right-4 top-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white text-slate-900 shadow-xl transition hover:scale-105 active:scale-95"
              aria-label="Close zoomed image"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center justify-between gap-3 px-4 pt-6 pb-4 sm:px-8 lg:hidden">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                <ZoomIn className="h-4 w-4" />
                Product Detail View
              </div>
              <button
                type="button"
                onClick={handleCloseZoom}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-lg transition hover:bg-white/25 active:scale-95"
                aria-label="Close zoom overlay"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center px-3 pb-8 pt-5 sm:px-10 sm:pt-8 lg:px-24 lg:pt-10">
              <ZoomableImageViewer image={heroImage} onClose={handleCloseZoom} />
            </div>
            <div className="pb-6 text-center space-y-2 lg:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                Pinch or scroll to inspect every detail
              </p>
              <p className="text-[10px] font-medium text-white/60">
                Tap outside or use the X button to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ThemedProductPage.displayName = 'ThemedProductPage';

export default ThemedProductPage;

