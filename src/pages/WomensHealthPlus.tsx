import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Plus, Minus, Star, Heart, Sparkles, Flower2, Moon, Sun, ShieldCheck, HeartPulse, X, ZoomIn, Calendar, TrendingUp, Leaf, ArrowRight } from 'lucide-react';
import ResponsiveProductImage from '../components/ResponsiveProductImage';
import { getProductById, getRelatedProducts } from '../data/products';
import useImagePalette from '../hooks/useImagePalette';
import '../styles/womensHealthTheme.css';

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

const WomensHealthPlus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('benefits');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
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
  const palette = useImagePalette(heroImage, product?.id);
  type CSSCustomProperties = React.CSSProperties & Record<`--${string}`, string>;
  const themeVars = useMemo<CSSCustomProperties>(
    () => ({
      '--wh-base': palette.base,
      '--wh-dark': palette.dark,
      '--wh-darker': palette.darker,
      '--wh-light': palette.light,
      '--wh-lighter': palette.lighter,
      '--wh-muted': palette.muted,
      '--wh-border': palette.border,
      '--wh-border-strong': palette.borderStrong,
      '--wh-contrast': palette.contrastText,
      '--wh-base-rgb': palette.rgbString,
      '--wh-accent-rgb': palette.accentRgb,
      '--wh-hero-gradient': palette.heroGradient,
      '--wh-soft-gradient': palette.softGradient,
      '--wh-card-gradient': palette.cardGradient,
      '--wh-cta-gradient': palette.ctaGradient,
      '--wh-page-gradient': palette.pageBackground,
      '--wh-chip-bg': palette.chipBg,
      '--wh-chip-text': palette.chipText,
      '--wh-shadow': palette.shadow,
      '--wh-glow': palette.glow,
      '--wh-highlight': palette.highlight,
    }) as CSSCustomProperties,
    [palette],
  );

  // Preload the hero image for faster color extraction (must be before early return)
  useEffect(() => {
    if (heroImage?.fallback) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.fallback;
      document.head.appendChild(link);
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [heroImage?.fallback]);

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
    const currentThumb = thumbnailRefs.current[activeImageIndex];
    if (!currentThumb) return;
    
    // Use 'nearest' for last image to prevent page shift, 'center' for others
    const isLastImage = activeImageIndex === galleryLength - 1;
    const scrollOption = isLastImage ? 'nearest' : 'center';
    currentThumb.scrollIntoView({ behavior: 'smooth', inline: scrollOption, block: 'nearest' });
  }, [activeImageIndex, galleryLength]);

  const handleOpenZoom = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setIsZoomed(false);
  }, []);

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

  const toggleSection = (sectionId: string) => {
    setExpandedSection((current) => (current === sectionId ? null : sectionId));
  };

  if (!product) {
    return <Navigate to="/product" replace />;
  }

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-pink-50/20 womens-health-theme transition-colors duration-300"
        style={themeVars}
      >
        {/* Hero Section with Elegant Floral Design */}
        <section 
          className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50/80 to-rose-50 pt-12 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20"
          data-aos="fade-in"
          data-aos-duration="1000"
          data-aos-easing="ease-out-cubic"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-transparent blur-3xl" />
            <div className="absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-pink-200/30 via-rose-200/20 to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-gradient-to-tr from-rose-300/25 via-pink-200/20 to-transparent blur-2xl" />
          </div>

          {/* Floral Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
            <div className="absolute top-10 left-10">
              <Flower2 className="h-24 w-24 text-rose-900" />
            </div>
            <div className="absolute top-32 right-20">
              <Flower2 className="h-16 w-16 text-pink-900 rotate-45" />
            </div>
            <div className="absolute bottom-20 left-1/4">
              <Flower2 className="h-20 w-20 text-rose-800 rotate-12" />
            </div>
          </div>

          <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 max-w-7xl mx-auto">
              {/* Image Card - First on mobile, Right on desktop */}
              <div 
                className="flex-1 max-w-lg mx-auto lg:mx-0 order-1 lg:order-2"
                data-aos="zoom-in"
                data-aos-delay="100"
                data-aos-duration="900"
                data-aos-easing="ease-out-cubic"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-300/40 via-pink-300/30 to-rose-400/40 rounded-3xl blur-2xl -z-10" />
                  
                  {/* Image Container */}
                  <div
                    className="relative rounded-[2rem] border-2 border-white/80 bg-white/95 backdrop-blur-sm shadow-2xl p-4"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <button
                      type="button"
                      onClick={handleOpenZoom}
                      className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 rounded-2xl lg:pointer-events-none"
                    >
                      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-rose-50 to-pink-50 shadow-inner transition-transform duration-300 group-hover:scale-[0.98]">
                        <ResponsiveProductImage
                          image={heroImage}
                          className="w-full rounded-[1.5rem]"
                          imgClassName="object-contain w-full h-full rounded-[1.5rem]"
                        />
                      </div>
                      <span className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-700 shadow-lg border border-rose-100 sm:flex lg:hidden">
                        <ZoomIn className="h-3.5 w-3.5" />
                        Zoom
                      </span>
                    </button>
                  </div>

                  {/* Gallery Thumbnails */}
                  {gallery.length > 1 && (
                    <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center scroll-smooth snap-x snap-mandatory pr-4 sm:pr-0">
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
                              ? 'scale-105 ring-2 ring-rose-400 shadow-lg'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          aria-label={`Show product image ${index + 1}`}
                        >
                          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white border border-rose-100 shadow-md">
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

              {/* Price Section - Second on mobile, hidden on desktop (will be inside left content) */}
              <div 
                className="flex-1 order-2 lg:hidden"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="850"
                data-aos-easing="ease-out-cubic"
              >
                <div className="w-full mb-6">
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/90 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.45)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.65),transparent_55%),radial-gradient(circle_at_88%_18%,rgba(236,120,155,0.18),transparent_65%)]" />
                    <div className="relative flex flex-col gap-3.5 p-3.5 sm:gap-4 sm:p-4">
                      <div className="flex flex-col gap-2.5">
                        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-rose-100/70 bg-white/85 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.35em] text-rose-600">
                          Special Ritual Price
                        </span>
                        <div className="flex items-baseline gap-2.5 text-slate-900">
                          <span className="text-2xl sm:text-3xl font-bold leading-none">₹{product.price}</span>
                          <div className="flex flex-col text-[10px] sm:text-xs text-slate-500 leading-tight">
                            <span className="line-through">₹{product.originalPrice}</span>
                            <span className="text-rose-600 font-semibold">
                              Save {discountPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-full border border-rose-200 bg-white/85 shadow-inner flex-shrink-0">
                            <button
                              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                              className="px-2.5 py-1.5 transition-colors hover:bg-rose-50 rounded-l-full"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5 text-rose-700" />
                            </button>
                            <span className="px-3 py-1.5 text-xs font-semibold text-rose-900">{quantity}</span>
                            <button
                              onClick={() => setQuantity((value) => value + 1)}
                              className="px-2.5 py-1.5 transition-colors hover:bg-rose-50 rounded-r-full"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5 text-rose-700" />
                            </button>
                          </div>
                          <div className="flex flex-1 gap-2">
                            <button className="group relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-[0_18px_40px_-30px_rgba(236,72,153,0.65)] transition-all duration-300 hover:scale-[1.01]">
                              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              <span className="relative inline-flex items-center gap-1.5">
                                Add to Cart
                                <Heart className="h-3.5 w-3.5" />
                              </span>
                            </button>
                            <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-white/95 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-rose-700 shadow-[0_14px_32px_-28px_rgba(244,114,182,0.45)] transition-all duration-300 hover:border-rose-300 hover:bg-white">
                              Buy Now
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-rose-700">
                          <div className="inline-flex flex-1 items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 border border-rose-100">
                            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">100% Natural</span>
                          </div>
                          <div className="inline-flex flex-1 items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 border border-rose-100">
                            <Leaf className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">Lab Verified</span>
                          </div>
                          <span className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 uppercase tracking-[0.25em]">
                            {product.inStock ? 'In Stock' : 'Back Soon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Content - Product Name + Price - Third on mobile, First on desktop */}
              <div 
                className="flex-1 space-y-6 text-center lg:text-left mb-0 order-3 lg:order-1"
                data-aos="fade-up"
                data-aos-delay="150"
                data-aos-duration="900"
                data-aos-easing="ease-out-cubic"
              >
                <div 
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/70 backdrop-blur-sm px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-rose-700 shadow-lg"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="800"
                >
                  <Moon className="h-3.5 w-3.5" />
                  Lunar-Aligned Wellness
                  <Flower2 className="h-3.5 w-3.5" />
                </div>
                <h1 
                  className="relative inline-flex items-center justify-center text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight whitespace-nowrap text-white drop-shadow-[0_12px_30px_rgba(15,23,42,0.4)]"
                  data-aos="fade-up"
                  data-aos-delay="250"
                  data-aos-duration="900"
                >
                  <span
                    className="relative px-4 py-1 rounded-full bg-white/10 backdrop-blur text-white tracking-[0.08em]"
                  >
                    {product.name}
                  </span>
                </h1>
                <p 
                  className="text-base sm:text-lg text-white font-display font-semibold tracking-wide max-w-xl mx-auto lg:mx-0 leading-relaxed"
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
                  <div className="flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5 border border-rose-100 shadow-sm flex-shrink-0 text-[11px] sm:text-xs">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-900">{product.rating}.0</span>
                    <span className="text-slate-500">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 border border-rose-200 flex-shrink-0 text-[11px] sm:text-xs">
                    <HeartPulse className="h-4 w-4 text-rose-600" />
                    <span className="font-semibold text-rose-700">Hormonal Balance</span>
                  </div>
                </div>
                {/* Price Section - Desktop only */}
                <div 
                  className="w-full hidden lg:block"
                  data-aos="fade-up"
                  data-aos-delay="400"
                  data-aos-duration="850"
                  data-aos-easing="ease-out-cubic"
                >
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/90 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.45)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.65),transparent_55%),radial-gradient(circle_at_88%_18%,rgba(236,120,155,0.18),transparent_65%)]" />
                    <div className="relative flex flex-col gap-3.5 p-3.5 sm:gap-4 sm:p-4 lg:p-5">
                      <div className="flex flex-col gap-2.5">
                        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-rose-100/70 bg-white/85 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.35em] text-rose-600">
                          Special Ritual Price
                        </span>
                        <div className="flex items-baseline gap-2.5 text-slate-900">
                          <span className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold leading-none">₹{product.price}</span>
                          <div className="flex flex-col text-[10px] sm:text-xs text-slate-500 leading-tight">
                            <span className="line-through">₹{product.originalPrice}</span>
                            <span className="text-rose-600 font-semibold">
                              Save {discountPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-full border border-rose-200 bg-white/85 shadow-inner flex-shrink-0">
                            <button
                              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                              className="px-2.5 py-1.5 transition-colors hover:bg-rose-50 rounded-l-full"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5 text-rose-700" />
                            </button>
                            <span className="px-3 py-1.5 text-xs font-semibold text-rose-900">{quantity}</span>
                            <button
                              onClick={() => setQuantity((value) => value + 1)}
                              className="px-2.5 py-1.5 transition-colors hover:bg-rose-50 rounded-r-full"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5 text-rose-700" />
                            </button>
                          </div>
                          <div className="flex flex-1 gap-2">
                            <button className="group relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-[0_18px_40px_-30px_rgba(236,72,153,0.65)] transition-all duration-300 hover:scale-[1.01]">
                              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              <span className="relative inline-flex items-center gap-1.5">
                                Add to Cart
                                <Heart className="h-3.5 w-3.5" />
                              </span>
                            </button>
                            <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-white/95 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-rose-700 shadow-[0_14px_32px_-28px_rgba(244,114,182,0.45)] transition-all duration-300 hover:border-rose-300 hover:bg-white">
                              Buy Now
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-rose-700">
                          <div className="inline-flex flex-1 items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 border border-rose-100">
                            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">100% Natural</span>
                          </div>
                          <div className="inline-flex flex-1 items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 border border-rose-100">
                            <Leaf className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">Lab Verified</span>
                          </div>
                          <span className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 uppercase tracking-[0.25em]">
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
          <section 
            className="relative max-w-6xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="900"
            data-aos-easing="ease-out-cubic"
          >
            <div className="relative rounded-3xl border-2 border-rose-100 bg-gradient-to-br from-white via-rose-50/30 to-pink-50/40 p-4 sm:p-6 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-200/20 to-pink-200/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-200/20 to-rose-200/10 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <div className="relative space-y-3">
                <div 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-rose-100 border border-rose-200 text-xs font-semibold uppercase tracking-[0.4em] text-white"
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
                  Bring rhythm back to your cycle, skin, and mood
                </h2>
                <p 
                  className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl"
                  data-aos="fade-up"
                  data-aos-delay="250"
                  data-aos-duration="800"
                >
                  {product.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div 
                    className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 border border-rose-100 shadow-sm"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    data-aos-duration="800"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-0.5 text-sm">Cycle Harmony</h3>
                      <p className="text-xs text-slate-600">Balance hormonal peaks and dips naturally throughout your monthly rhythm.</p>
                    </div>
                  </div>
                  <div 
                    className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 border border-rose-100 shadow-sm"
                    data-aos="fade-up"
                    data-aos-delay="350"
                    data-aos-duration="800"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-0.5 text-sm">Inner Radiance</h3>
                      <p className="text-xs text-slate-600">Support skin luminosity and hair strength from within.</p>
                    </div>
                  </div>
                </div>
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
              className="rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-white via-rose-50/20 to-white p-4 sm:p-5 shadow-xl"
              data-aos="slide-right"
              data-aos-delay="200"
              data-aos-duration="850"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-rose-600">Key Ingredients</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">Lab-verified herbal matrix</h3>
                </div>
              </div>
              <div className="space-y-2.5">
                {keyIngredientHighlights.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2.5 text-slate-700"
                    data-aos="fade-up"
                    data-aos-delay={300 + idx * 50}
                    data-aos-duration="700"
                  >
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-rose-400 to-pink-400" />
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
              <div className="rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-white to-pink-50/30 p-4 sm:p-5 shadow-xl">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Moon className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-pink-600">How to Use</p>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Your Daily Ritual</h3>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{product.howToUse}</p>
              </div>

              <div className="rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-white via-rose-50/20 to-white p-4 sm:p-5 shadow-xl">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-rose-600">Suitable For</p>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Perfect For You</h3>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {suitableForHighlights.map((item, idx) => (
                    <li 
                      key={idx} 
                      className="flex gap-2.5 text-slate-700"
                      data-aos="fade-up"
                      data-aos-delay={300 + idx * 50}
                      data-aos-duration="700"
                    >
                      <div className="flex-shrink-0 mt-1.5">
                        <Flower2 className="h-3.5 w-3.5 text-rose-500" />
                      </div>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section 
            className="max-w-6xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="150"
            data-aos-duration="900"
            data-aos-easing="ease-out-cubic"
          >
            <div className="mb-6 text-left">
              <div 
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-rose-100 border border-rose-200 text-[11px] font-semibold uppercase tracking-[0.35em] text-white mb-3"
                data-aos="zoom-in"
                data-aos-delay="200"
                data-aos-duration="700"
              >
                <HeartPulse className="h-3.5 w-3.5 text-rose-700" />
                Botanical Benefits
              </div>
              <h2 
                className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight"
                data-aos="fade-up"
                data-aos-delay="250"
                data-aos-duration="850"
              >
                Feel the difference in every capsule
              </h2>
              <p 
                className="text-base sm:text-lg text-slate-600 max-w-2xl"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="800"
              >
                A thoughtfully crafted blend designed specifically for women's wellness needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.benefits.map((benefit, idx) => {
                const icons = [Flower2, Moon, HeartPulse, Sparkles, ShieldCheck, Sun];
                const Icon = icons[idx % icons.length];
                return (
                  <div
                    key={benefit}
                    className="group relative rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/30 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    data-aos="fade-up"
                    data-aos-delay={400 + idx * 100}
                    data-aos-duration="800"
                    data-aos-easing="ease-out-cubic"
                  >
                    <div className="absolute top-3 right-3 w-14 h-14 bg-gradient-to-br from-rose-200/30 to-pink-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200">
                        <Icon className="h-5 w-5 text-rose-600" />
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
          <section 
            className="max-w-4xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="900"
            data-aos-easing="ease-out-cubic"
          >
            <div className="rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-white via-rose-50/20 to-pink-50/30 p-5 sm:p-6 shadow-xl">
              <div className="text-center mb-6">
                <div 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-rose-100 border border-rose-200 text-[11px] font-semibold uppercase tracking-[0.35em] text-white mb-3"
                  data-aos="zoom-in"
                  data-aos-delay="250"
                  data-aos-duration="700"
                >
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  Frequently Asked
                </div>
                <h2 
                  className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="850"
                >
                  Your questions answered
                </h2>
                <p 
                  className="text-base text-slate-600"
                  data-aos="fade-up"
                  data-aos-delay="350"
                  data-aos-duration="800"
                >
                  Holistic answers for your wellness journey
                </p>
              </div>
              
              <div className="space-y-3">
                {product.faqs.split('.').filter(Boolean).map((answer, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border-2 border-rose-100 bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    data-aos="fade-up"
                    data-aos-delay={350 + idx * 100}
                    data-aos-duration="800"
                    data-aos-easing="ease-out-cubic"
                  >
                    <button
                      onClick={() => toggleSection(`faq-${idx}`)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-rose-50/50 transition-colors duration-200"
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {idx === 0 ? 'How long until I see results?' : `Question ${idx + 1}`}
                      </span>
                      {expandedSection === `faq-${idx}` ? (
                        <Minus className="h-4 w-4 text-rose-600 flex-shrink-0" />
                      ) : (
                        <Plus className="h-4 w-4 text-rose-600 flex-shrink-0" />
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
            <div className="relative rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-100 via-pink-100/80 to-rose-50 p-6 sm:p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-rose-300/20 rounded-full blur-3xl -mr-40 -mt-40" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-rose-300/30 to-pink-300/20 rounded-full blur-3xl -ml-40 -mb-40" />
              
              <div className="relative text-center space-y-4">
                <div 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-rose-200 text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-700"
                  data-aos="zoom-in"
                  data-aos-delay="250"
                  data-aos-duration="700"
                >
                  <Heart className="h-3 w-3" />
                  Daily Devotion
                </div>
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="900"
                >
                  {product.heroTagline}
                </h2>
                <p 
                  className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed"
                  data-aos="fade-up"
                  data-aos-delay="350"
                  data-aos-duration="850"
                >
                  Build a mindful ritual and experience how consistent nourishment transforms the way you move, feel, and glow.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
                  className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.3em] text-rose-600 hover:text-rose-700 transition-colors"
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
                      data-aos="fade-up"
                      data-aos-delay={350 + idx * 100}
                      data-aos-duration="800"
                      data-aos-easing="ease-out-cubic"
                      className="group flex flex-col gap-5 overflow-hidden rounded-3xl border-2 border-rose-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-200"
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
        >
          <div
            className="relative flex h-full w-full flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-8 lg:hidden">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                <ZoomIn className="h-4 w-4" />
                Product Detail View
              </div>
              <button
                type="button"
                onClick={handleCloseZoom}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white transition-all hover:bg-white/30 hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Close zoomed image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center px-3 pb-8 sm:px-10 lg:px-24">
              <ResponsiveProductImage
                image={heroImage}
                className="w-full max-w-2xl lg:max-w-3xl"
                imgClassName="object-contain w-full max-h-[80vh] rounded-[1.75rem] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.65)]"
              />
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
};

export default WomensHealthPlus;

