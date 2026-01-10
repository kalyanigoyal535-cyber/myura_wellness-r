import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Star, Heart, Sparkles, ShieldCheck, HeartPulse, X, ZoomIn, ArrowRight, Leaf, Activity, Droplets, Award, BadgeCheck, Medal, Shield, Target, Zap, Clock, TrendingUp, ChevronDown, ChevronUp, Check } from 'lucide-react';
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
  'pro-mens-multivitamin': { gradient: 'from-orange-50 via-red-50 to-white', accentText: 'text-orange-600' },
  'pro-mens-vitality-booster-gold': { gradient: 'from-teal-50 via-cyan-50 to-white', accentText: 'text-teal-600' },
  'pro-omega-3-softgel': { gradient: 'from-green-50 via-emerald-50 to-white', accentText: 'text-green-600' },
  'pro-womens-health-plus': { gradient: 'from-pink-50 via-rose-50 to-white', accentText: 'text-pink-600' },
};

const getRelatedCardStyle = (productId: string) =>
  relatedCardStyles[productId] ?? { gradient: 'from-slate-50 via-slate-100 to-white', accentText: 'text-slate-900' };

interface ProOmega3SoftgelPageProps {
  product: ProductRecord;
}

const ProOmega3SoftgelPage: React.FC<ProOmega3SoftgelPageProps> = React.memo(({ product }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('benefits');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isIngredientsExpanded, setIsIngredientsExpanded] = useState(false);
  const [isHowToUseExpanded, setIsHowToUseExpanded] = useState(false);
  const [isSuitableForExpanded, setIsSuitableForExpanded] = useState(false);
  const [isIngredientBreakdownExpanded, setIsIngredientBreakdownExpanded] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineLineRef = useRef<HTMLDivElement | null>(null);
  const [lineProgress, setLineProgress] = useState(0);

  const salePrice = product?.price ?? 1199;
  const discountPercent = Math.round(
    (((product?.originalPrice ?? 0) - salePrice) / (product?.originalPrice ?? 1)) * 100
  );

  const keyIngredientHighlights = useMemo(() => {
    if (!product?.keyIngredients) return [];
    
    // For Omega-3, handle Fish Oil with nested EPA and DHA
    let text = product.keyIngredients;
    
    // Remove footer notes first
    const footerPatterns = [
      /No added preservatives[^.]*/i,
      /No artificial preservatives[^.]*/i,
      /Approved colour used[^.]*/i,
      /Appropriate overages added[^.]*/i,
      /High-purity, molecularly distilled[^.]*/i,
      /for optimal absorption and effectiveness[^.]*/i
    ];
    
    footerPatterns.forEach(pattern => {
      text = text.replace(pattern, '');
    });
    
    // Handle Fish Oil with EPA and DHA as sub-items
    // Format: "Fish Oil (Omega-3 Fatty Acid) – 1000 mg, providing Eicosapentaenoic Acid (EPA) – 180 mg, providing Docosahexaenoic Acid (DHA) – 120 mg"
    const ingredients: Array<{ name: string; dosage: string; subItems?: Array<{ name: string; dosage: string }> }> = [];
    
    // Clean up text - remove extra spaces
    text = text.replace(/\s+/g, ' ').trim();
    
    // Check if it contains Fish Oil with EPA/DHA (handle both en-dash and regular dash)
    const fishOilMatch = text.match(/Fish\s+Oil\s*\([^)]*\)\s*[–-]\s*(\d+\s*mg)/i);
    
    if (fishOilMatch) {
      const subItems: Array<{ name: string; dosage: string }> = [];
      
      // Try to match EPA (handle both full name and abbreviation)
      const epaMatch = text.match(/providing\s+Eicosapentaenoic\s+Acid\s*\(?\s*EPA\s*\)?\s*[–-]\s*(\d+\s*mg)/i) || 
                       text.match(/providing\s+EPA\s*[–-]\s*(\d+\s*mg)/i);
      if (epaMatch) {
        subItems.push({ name: 'Eicosapentaenoic Acid (EPA)', dosage: epaMatch[1] });
      }
      
      // Try to match DHA (handle both full name and abbreviation)
      const dhaMatch = text.match(/providing\s+Docosahexaenoic\s+Acid\s*\(?\s*DHA\s*\)?\s*[–-]\s*(\d+\s*mg)/i) || 
                       text.match(/providing\s+DHA\s*[–-]\s*(\d+\s*mg)/i);
      if (dhaMatch) {
        subItems.push({ name: 'Docosahexaenoic Acid (DHA)', dosage: dhaMatch[1] });
      }
      
      ingredients.push({
        name: 'Fish Oil (Omega-3 Fatty Acid)',
        dosage: fishOilMatch[1],
        subItems: subItems.length > 0 ? subItems : undefined
      });
    } else {
      // Fallback to original parsing for other ingredients
      const parts = text.split(',').filter(p => p.trim() && (p.includes('–') || p.includes('-')));
      parts.forEach(part => {
        const match = part.trim().match(/(.+?)\s*[–-]\s*(.+)/);
        if (match && !match[1].toLowerCase().includes('providing')) {
          ingredients.push({ name: match[1].trim(), dosage: match[2].trim() });
        }
      });
    }
    
    return ingredients;
  }, [product?.keyIngredients]);

  const suitableForHighlights = useMemo(() => {
    if (!product?.suitableFor) return [];
    // Split by periods, but handle the disclaimer separately
    let text = product.suitableFor;
    const disclaimerPattern = /\(Not intended for[^)]*\)/i;
    const hasDisclaimer = disclaimerPattern.test(text);
    
    // Remove disclaimer from main content
    text = text.replace(disclaimerPattern, '').trim();
    
    // Split by periods to get individual points
    const items = text
      .split('.')
      .map((item) => item.trim())
      .filter(Boolean)
      .filter(item => item.length > 10); // Filter out very short fragments
      
    return items;
  }, [product?.suitableFor]);

  // Extract the three critical systems for Omega-3
  const criticalSystems = useMemo(() => {
    const systems = [
      {
        title: 'The Cognitive Processor',
        description: 'The human brain is roughly 60% fat, and DHA is its primary structural component. Neural insulation: DHA integrates into the brain\'s wiring, supporting fast and clear transmission of electrical signals. Visual acuity: As a major component of the retina, DHA is essential for maintaining sharp, clear vision and reducing eye fatigue in a digital world.',
        icon: Activity,
      },
      {
        title: 'The Circulatory Pipeline',
        description: 'A healthy heart relies on "elastic" and efficient blood vessels. Vascular dynamics: EPA helps maintain the flexibility of your arteries, ensuring that nutrient-rich blood flows with minimal resistance. Response management: EPA acts as a precursor to molecules that manage the body\'s natural response to physical stress, keeping your internal environment balanced.',
        icon: HeartPulse,
      },
      {
        title: 'Metabolic & Joint Resilience',
        description: 'Omega-3 fatty acids aren\'t just for the heart; they are systemic "lubricants." Joint comfort: By modulating pathways associated with physical exertion, these fatty acids support joint mobility and comfort after high-intensity activity. Cellular power: By protecting the mitochondria from oxidative stress, Omega-3s ensure your "power plants" continue to produce energy efficiently.',
        icon: ShieldCheck,
      },
    ];
    return systems;
  }, []);

  // Extract 60-day saturation timeline for Omega-3
  const saturationTimeline = useMemo(() => {
    const timelineData = [
      {
        phase: 'The First 10 Days',
        title: 'Initial Saturation',
        description: 'Essential fatty acids begin integrating into cell membranes; you may notice subtle improvements in skin hydration and eye comfort.',
        icon: Activity,
      },
      {
        phase: 'Weeks 3–4',
        title: 'Cognitive Baseline',
        description: 'DHA levels in the brain begin to optimize, leading to more consistent mental clarity and focus during demanding tasks.',
        icon: TrendingUp,
      },
      {
        phase: 'Weeks 6–8',
        title: 'Systemic Resilience',
        description: 'EPA reaches steady-state levels in the tissues, supporting enhanced recovery from physical exercise and cardiovascular efficiency.',
        icon: Award,
      },
    ];
    return timelineData;
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  // Timeline line scroll animation
  useEffect(() => {
    if (!timelineRef.current || !timelineLineRef.current) return;

    const timeline = timelineRef.current;
    const line = timelineLineRef.current;
    const timelineItems = timeline.querySelectorAll('[data-timeline-item]');

    const updateLineProgress = () => {
      const timelineRect = timeline.getBoundingClientRect();
      const timelineTop = timelineRect.top + window.scrollY;
      const timelineBottom = timelineTop + timelineRect.height;
      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;

      // Calculate how much of the timeline is visible
      const visibleTop = Math.max(timelineTop, viewportTop);
      const visibleBottom = Math.min(timelineBottom, viewportBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const totalHeight = timelineRect.height;

      // Calculate progress based on which items are visible
      let progress = 0;
      timelineItems.forEach((item, idx) => {
        const itemRect = item.getBoundingClientRect();
        const itemTop = itemRect.top + window.scrollY;
        const itemCenter = itemTop + itemRect.height / 2;

        if (itemCenter <= viewportBottom) {
          progress = Math.max(progress, ((idx + 1) / timelineItems.length) * 100);
        } else if (itemRect.top <= viewportBottom) {
          const itemProgress = ((viewportBottom - itemTop) / itemRect.height) * (100 / timelineItems.length);
          progress = Math.max(progress, ((idx / timelineItems.length) * 100) + itemProgress);
        }
      });

      setLineProgress(Math.min(100, Math.max(0, progress)));
    };

    updateLineProgress();
    window.addEventListener('scroll', updateLineProgress, { passive: true });
    window.addEventListener('resize', updateLineProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateLineProgress);
      window.removeEventListener('resize', updateLineProgress);
    };
  }, [saturationTimeline]);

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
        className="min-h-screen bg-gradient-to-b from-white via-white to-white transition-colors duration-300"
        style={themeVars}
      >
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-12 lg:pb-12"
          style={{ background: `var(--product-hero-gradient)` }}
          data-aos="fade-in"
          data-aos-duration="1000"
          data-aos-easing="ease-out-cubic"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div 
              className="absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl opacity-60"
              style={{ background: `var(--product-glow)` }}
            />
            <div 
              className="absolute top-1/2 -left-32 h-80 w-80 rounded-full blur-3xl opacity-50"
              style={{ background: `var(--product-highlight)` }}
            />
          </div>

          <div className="relative w-full mx-auto px-8 sm:px-12 lg:px-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 w-full">
              {/* Image Card */}
              <div 
                className="flex-1 max-w-lg mx-auto lg:mx-0 order-1 lg:order-2"
                data-aos="zoom-in"
                data-aos-delay="100"
                data-aos-duration="900"
              >
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-3xl blur-2xl -z-10 opacity-50"
                    style={{ background: `var(--product-glow)` }}
                  />
                  
                  <div
                    className="relative rounded-[2rem] border-2 border-white/80 bg-white/95 backdrop-blur-sm shadow-2xl p-4"
                    style={{ boxShadow: `var(--product-shadow)` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        // Only allow zoom on mobile/touch devices
                        if (window.innerWidth < 1024) {
                          handleOpenZoom();
                        }
                      }}
                      className="group relative block w-full focus:outline-none focus-visible:ring-2 rounded-2xl lg:cursor-default"
                      style={{ '--tw-ring-color': 'var(--product-base)' } as React.CSSProperties}
                    >
                      <div 
                        className="relative overflow-hidden rounded-[1.75rem] shadow-inner transition-transform duration-300 lg:group-hover:scale-100 group-hover:scale-[0.98]"
                        style={{ background: `var(--product-soft-gradient)` }}
                      >
                        <ResponsiveProductImage
                          image={heroImage}
                          className="w-full rounded-[1.5rem]"
                          imgClassName="object-contain w-full h-full rounded-[1.5rem]"
                        />
                        
                        {/* PRO SERIES Badge Overlay */}
                        <div className="absolute top-1 left-2 sm:top-1.5 sm:left-2.5 lg:top-2 lg:left-3 z-20">
                          <div
                            className="rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-2 sm:px-2.5 lg:px-3 lg:py-1 py-0.5 text-[7px] sm:text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.22em] lg:tracking-[0.25em] text-white shadow-[0_4px_12px_-4px_rgba(217,119,6,0.6),0_2px_6px_-2px_rgba(251,191,36,0.4)] backdrop-blur transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105 border border-amber-300/50"
                          >
                            <div className="relative flex items-center gap-1 lg:gap-1.5">
                              <Award className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                                PRO SERIES
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
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

              {/* Content Section */}
              <div 
                className="flex-1 flex items-start text-center lg:text-left mb-6 order-3 lg:order-1 mt-4 lg:mt-0"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <div className="w-full space-y-3 sm:space-y-4 -mt-2 sm:-mt-4 lg:-mt-8">
                  {/* Product Name */}
                  <h1 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-black break-words sm:whitespace-nowrap"
                  >
                    {product.name}
                  </h1>

                {/* Headline */}
                <p 
                  className="text-[10px] sm:text-xs lg:text-sm font-medium text-slate-800 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-2 sm:mb-3 break-words sm:whitespace-nowrap relative inline-block pb-1 border-b-2 border-slate-800/40" 
                >
                  {product.headline}
                </p>

                {/* Summary */}
                <div className="max-w-2xl mx-auto lg:mx-0">
                  <p 
                    className="text-xs sm:text-sm lg:text-base text-black leading-relaxed" 
                  >
                    <span className="font-bold text-slate-900 italic">Optimize Your Cellular Infrastructure</span>{' '}
                    <span className="font-medium text-black">Your body is composed of trillions of cells, and every single one is encased in a fatty membrane. MYURA PRO SERIES OMEGA-3 provides the high-purity EPA and DHA needed to ensure these membranes remain fluid, responsive, and resilient.</span>
                  </p>
                </div>

                {/* Rating */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
                  <div 
                    className="flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5 border shadow-sm text-xs"
                    style={{ borderColor: 'var(--product-border)' }}
                  >
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900">{product.rating}.0</span>
                    <span className="text-slate-600">({product.reviews})</span>
                  </div>
                  <div 
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-xs"
                    style={{ 
                      borderColor: 'var(--product-border)',
                      backgroundColor: 'var(--product-chip-bg)',
                      color: 'var(--product-chip-text)'
                    }}
                  >
                    <Medal className="h-3.5 w-3.5" />
                    <span className="font-semibold">{product.notes[0]}</span>
                  </div>
                </div>

                {/* Price Section - Desktop Only */}
                <div className="hidden lg:block w-full max-w-full">
                  <div 
                    className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 bg-white/90 shadow-xl py-4 px-4 sm:py-5 sm:px-6 lg:px-8"
                    style={{ 
                      boxShadow: `var(--product-shadow)`,
                      borderColor: 'var(--product-border-strong)',
                      borderWidth: '2px'
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{ background: `var(--product-soft-gradient)` }}
                    />
                    <div className="relative">
                      {/* Urgency Hook */}
                      <div className="mb-2 sm:mb-3 w-full">
                        <span 
                          className="flex items-center justify-center gap-1 rounded-full border-2 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide w-full shadow-lg"
                          style={{ 
                            background: `var(--product-cta-gradient)`,
                            borderColor: 'var(--product-border-strong)',
                            color: 'var(--product-contrast)',
                            boxShadow: `var(--product-shadow)`
                          }}
                        >
                          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-pulse" style={{ color: 'var(--product-contrast)' }} />
                          <span className="truncate">Limited Time Offer - {discountPercent}% OFF</span>
                        </span>
                      </div>

                      {/* Promotional Offers */}
                      <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-1.5 overflow-hidden">
                        <div 
                          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border-2 backdrop-blur-sm shadow-md animate-pulse"
                          style={{ 
                            backgroundColor: 'var(--product-base)',
                            borderColor: 'var(--product-border-strong)',
                            color: 'var(--product-contrast)',
                            boxShadow: `var(--product-shadow)`,
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                          }}
                        >
                          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 animate-spin" style={{ color: 'var(--product-contrast)', animation: 'spin 3s linear infinite' }} />
                          <span className="text-[9px] sm:text-[10px] font-extrabold whitespace-nowrap truncate">Buy One, Get One Free</span>
                        </div>
                        <div className="hidden sm:flex flex-shrink-0 font-bold text-xs" style={{ color: 'var(--product-darker)' }}>•</div>
                        <div 
                          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border-2 backdrop-blur-sm shadow-md animate-pulse"
                          style={{ 
                            background: `var(--product-hero-gradient)`,
                            borderColor: 'var(--product-border-strong)',
                            color: 'var(--product-contrast)',
                            boxShadow: `var(--product-shadow)`,
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            animationDelay: '0.5s'
                          }}
                        >
                          <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" style={{ color: 'var(--product-contrast)' }} />
                          <span className="text-[9px] sm:text-[10px] font-extrabold whitespace-nowrap truncate">Get a Flat 40% Discount</span>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="mb-3">
                        <div className="flex flex-col sm:flex-row items-start gap-3 mb-1.5 sm:mb-2">
                          <div className="flex flex-col gap-1 flex-shrink-0 w-full sm:w-auto">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] sm:text-[10px] font-medium text-slate-600">Regular price</span>
                              <span className="line-through text-[10px] sm:text-xs text-slate-400">Rs. {product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] sm:text-[10px] font-medium text-slate-600">Sale price</span>
                              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">Rs. {salePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                          {/* Trust Badges - Right of Price */}
                          <div className="flex flex-wrap gap-1 flex-1 justify-start sm:justify-end w-full sm:w-auto">
                            {[
                              { icon: ShieldCheck, text: '100% Natural' },
                              { icon: Award, text: 'Result-Oriented' },
                              { icon: BadgeCheck, text: 'GMP Certified' },
                              { icon: Medal, text: 'FSSAI Approved' },
                            ].map((badge, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center gap-0.5 rounded-full bg-white/85 px-2 py-0.5 border text-[8px] font-semibold"
                                style={{ borderColor: 'var(--product-border)' }}
                              >
                                <badge.icon className="h-2.5 w-2.5" style={{ color: 'var(--product-darker)' }} />
                                <span className="text-slate-700">{badge.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Quantity - Below Badges */}
                        <div className="flex items-center justify-center sm:justify-end gap-1.5 w-full sm:w-auto">
                          <span className="text-[10px] sm:text-xs font-semibold text-slate-700">Quantity:</span>
                          <div 
                            className="flex items-center rounded-full border-2 bg-white shadow-inner"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <button
                              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                              className="px-2.5 sm:px-3 py-1.5 sm:py-2 transition-colors rounded-l-full hover:opacity-70"
                              style={{ color: 'var(--product-darker)' }}
                            >
                              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>
                            <span className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold min-w-[1.75rem] sm:min-w-[2rem] text-center" style={{ color: 'var(--product-darker)' }}>{quantity}</span>
                            <button
                              onClick={() => setQuantity((value) => value + 1)}
                              className="px-2.5 sm:px-3 py-1.5 sm:py-2 transition-colors rounded-r-full hover:opacity-70"
                              style={{ color: 'var(--product-darker)' }}
                            >
                              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row gap-2">
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
                              setTimeout(() => setIsAddingToCart(false), 1000);
                            }}
                            disabled={isAddingToCart || !product.inStock}
                            className="group relative flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 shadow-lg"
                            style={{ 
                              background: `var(--product-cta-gradient)`,
                              boxShadow: `var(--product-shadow)`
                            }}
                          >
                            {isAddingToCart ? 'Added!' : 'Add to Cart'}
                            {isAddingToCart ? (
                              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            ) : (
                              <Heart className="h-3.5 w-3.5" />
                            )}
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
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border-2 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-slate-50 disabled:opacity-50"
                            style={{ 
                              borderColor: 'var(--product-border)',
                              color: 'var(--product-darker)',
                            }}
                          >
                            Buy Now
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Benefit Hook - Bottom */}
                      <div className="mt-2 pt-2 border-t" style={{ borderTopColor: 'var(--product-border)' }}>
                        <p className="text-[9px] font-medium text-slate-600 text-center">
                          ✓ Free Shipping • ✓ 60-Day Money Back • ✓ Secure Payment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              {/* Price Section - Mobile: Below Image, Desktop: In Content */}
              <div className="w-full order-2 lg:order-3 lg:hidden">
                <div className="w-full max-w-full">
                  <div 
                    className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 bg-white/90 shadow-xl py-4 px-4 sm:py-5 sm:px-6"
                    style={{ 
                      boxShadow: `var(--product-shadow)`,
                      borderColor: 'var(--product-border-strong)',
                      borderWidth: '2px'
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{ background: `var(--product-soft-gradient)` }}
                    />
                    <div className="relative">
                      {/* Urgency Hook */}
                      <div className="mb-2 sm:mb-3 w-full">
                        <span 
                          className="flex items-center justify-center gap-1 rounded-full border-2 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide w-full shadow-lg"
                          style={{ 
                            background: `var(--product-cta-gradient)`,
                            borderColor: 'var(--product-border-strong)',
                            color: 'var(--product-contrast)',
                            boxShadow: `var(--product-shadow)`
                          }}
                        >
                          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-pulse" style={{ color: 'var(--product-contrast)' }} />
                          <span className="truncate">Limited Time Offer - {discountPercent}% OFF</span>
                        </span>
                      </div>

                      {/* Promotional Offers */}
                      <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-1.5 overflow-hidden">
                        <div 
                          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border-2 backdrop-blur-sm shadow-md animate-pulse"
                          style={{ 
                            backgroundColor: 'var(--product-base)',
                            borderColor: 'var(--product-border-strong)',
                            color: 'var(--product-contrast)',
                            boxShadow: `var(--product-shadow)`,
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                          }}
                        >
                          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 animate-spin" style={{ color: 'var(--product-contrast)', animation: 'spin 3s linear infinite' }} />
                          <span className="text-[9px] sm:text-[10px] font-extrabold whitespace-nowrap truncate">Buy One, Get One Free</span>
                        </div>
                        <div className="hidden sm:flex flex-shrink-0 font-bold text-xs" style={{ color: 'var(--product-darker)' }}>•</div>
                        <div 
                          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border-2 backdrop-blur-sm shadow-md animate-pulse"
                          style={{ 
                            background: `var(--product-hero-gradient)`,
                            borderColor: 'var(--product-border-strong)',
                            color: 'var(--product-contrast)',
                            boxShadow: `var(--product-shadow)`,
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            animationDelay: '0.5s'
                          }}
                        >
                          <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" style={{ color: 'var(--product-contrast)' }} />
                          <span className="text-[9px] sm:text-[10px] font-extrabold whitespace-nowrap truncate">Get a Flat 40% Discount</span>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="mb-3">
                        <div className="flex flex-col sm:flex-row items-start gap-3 mb-1.5 sm:mb-2">
                          <div className="flex flex-col gap-1 flex-shrink-0 w-full sm:w-auto">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] sm:text-[10px] font-medium text-slate-600">Regular price</span>
                              <span className="line-through text-[10px] sm:text-xs text-slate-400">Rs. {product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] sm:text-[10px] font-medium text-slate-600">Sale price</span>
                              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">Rs. 1,499.00</span>
                            </div>
                          </div>
                          {/* Trust Badges - Right of Price */}
                          <div className="flex flex-wrap gap-1 flex-1 justify-start sm:justify-end w-full sm:w-auto">
                            {[
                              { icon: ShieldCheck, text: '100% Natural' },
                              { icon: Award, text: 'Result-Oriented' },
                              { icon: BadgeCheck, text: 'GMP Certified' },
                              { icon: Medal, text: 'FSSAI Approved' },
                            ].map((badge, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center gap-0.5 rounded-full bg-white/85 px-2 py-0.5 border text-[8px] font-semibold"
                                style={{ borderColor: 'var(--product-border)' }}
                              >
                                <badge.icon className="h-2.5 w-2.5" style={{ color: 'var(--product-darker)' }} />
                                <span className="text-slate-700">{badge.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Quantity - Below Badges */}
                        <div className="flex items-center justify-center sm:justify-end gap-1.5 w-full sm:w-auto">
                          <span className="text-[10px] sm:text-xs font-semibold text-slate-700">Quantity:</span>
                          <div 
                            className="flex items-center rounded-full border-2 bg-white shadow-inner"
                            style={{ borderColor: 'var(--product-border)' }}
                          >
                            <button
                              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                              className="px-2.5 sm:px-3 py-1.5 sm:py-2 transition-colors rounded-l-full hover:opacity-70"
                              style={{ color: 'var(--product-darker)' }}
                            >
                              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>
                            <span className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold min-w-[1.75rem] sm:min-w-[2rem] text-center" style={{ color: 'var(--product-darker)' }}>{quantity}</span>
                            <button
                              onClick={() => setQuantity((value) => value + 1)}
                              className="px-2.5 sm:px-3 py-1.5 sm:py-2 transition-colors rounded-r-full hover:opacity-70"
                              style={{ color: 'var(--product-darker)' }}
                            >
                              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row gap-2">
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
                              setTimeout(() => setIsAddingToCart(false), 1000);
                            }}
                            disabled={isAddingToCart || !product.inStock}
                            className="group relative flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 shadow-lg"
                            style={{ 
                              background: `var(--product-cta-gradient)`,
                              boxShadow: `var(--product-shadow)`
                            }}
                          >
                            {isAddingToCart ? 'Added!' : 'Add to Cart'}
                            {isAddingToCart ? (
                              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            ) : (
                              <Heart className="h-3.5 w-3.5" />
                            )}
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
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border-2 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-slate-50 disabled:opacity-50"
                            style={{ 
                              borderColor: 'var(--product-border)',
                              color: 'var(--product-darker)',
                            }}
                          >
                            Buy Now
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Benefit Hook - Bottom */}
                      <div className="mt-2 pt-2 border-t" style={{ borderTopColor: 'var(--product-border)' }}>
                        <p className="text-[9px] font-medium text-slate-600 text-center">
                          ✓ Free Shipping • ✓ 60-Day Money Back • ✓ Secure Payment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 lg:pb-16 space-y-12">
          
          {/* Critical Systems Section */}
          <section className="max-w-7xl mx-auto relative">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div 
                className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{ background: `var(--product-glow)` }}
              />
              <div 
                className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{ background: `var(--product-highlight)` }}
              />
            </div>

            <div className="relative text-center mb-8">
              <div 
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 border text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-3"
                style={{ 
                  backgroundColor: 'var(--product-base)',
                  borderColor: 'var(--product-border-strong)'
                }}
              >
                <Target className="h-3.5 w-3.5" />
                BIO-STRUCTURAL FOUNDATION
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                The Science of Systemic Fluidity
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto">
                Modern diets often lack the essential long-chain polyunsaturated fats required for peak biological function
              </p>
            </div>

            {/* Critical Systems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 relative">
              {criticalSystems.map((system, idx) => {
                const Icon = system.icon;
                return (
                  <div
                    key={idx}
                    className="group relative rounded-2xl border-2 bg-white overflow-hidden p-4 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ 
                      borderColor: 'var(--product-border)',
                      boxShadow: `var(--product-shadow)`
                    }}
                    data-aos="fade-up"
                    data-aos-delay={idx * 100}
                  >
                    {/* Background Gradient */}
                    <div 
                      className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                      style={{ background: `var(--product-soft-gradient)` }}
                    />
                    
                    {/* Glow Effect */}
                    <div 
                      className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                      style={{ background: `var(--product-glow)` }}
                    />

                    <div className="relative z-10">
                      {/* Icon with Enhanced Styling */}
                      <div className="mb-3 flex items-center gap-3">
                        <div 
                          className="inline-flex items-center justify-center w-12 h-12 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                          style={{ 
                            background: `var(--product-chip-bg)`,
                            boxShadow: `var(--product-shadow)`
                          }}
                        >
                          <Icon className="h-6 w-6" style={{ color: 'var(--product-darker)' }} />
                        </div>
                        {/* Pillar Number Badge */}
                        <div 
                          className="flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-sm"
                          style={{ 
                            borderColor: 'var(--product-border-strong)',
                            backgroundColor: 'var(--product-base)',
                            color: 'var(--product-contrast)'
                          }}
                        >
                          {idx + 1}
                        </div>
                      </div>
                      
                      <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-tight">
                        {system.title}
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {system.description}
                      </p>

                      {/* Decorative Bottom Accent */}
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--product-border)' }}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-0.5 flex-1 rounded-full"
                            style={{ background: `var(--product-base)` }}
                          />
                          <Sparkles className="h-3 w-3" style={{ color: 'var(--product-darker)' }} />
                          <div 
                            className="h-0.5 flex-1 rounded-full"
                            style={{ background: `var(--product-base)` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 60-Day Saturation Timeline */}
          <section className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div 
                className="inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 border text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-2 sm:mb-3"
                style={{ 
                  backgroundColor: 'var(--product-base)',
                  borderColor: 'var(--product-border-strong)'
                }}
              >
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                60-DAY SATURATION
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 mb-2">
                What to Expect: The 60-Day Saturation Timeline
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 max-w-3xl mx-auto px-4">
                Essential fatty acids integrate into your cellular infrastructure over time
              </p>
            </div>

            <div className="relative px-4 sm:px-0" ref={timelineRef}>
              {/* Timeline Line Background - Mobile Vertical (Left Side) */}
              <div 
                className="sm:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200/50"
              />

              {/* Timeline Line - Mobile Vertical - Animated Fill (Left Side) */}
              <div 
                ref={timelineLineRef}
                className="sm:hidden absolute left-4 top-0 w-0.5 transition-all duration-500 ease-out z-0"
                style={{ 
                  background: `linear-gradient(to bottom, var(--product-base), var(--product-highlight))`,
                  height: `${lineProgress}%`
                }}
              />

              {/* Timeline Line Background - Desktop Center */}
              <div 
                className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-slate-200/50"
              />

              {/* Timeline Line - Desktop Center - Animated Fill */}
              <div 
                className="hidden sm:block absolute left-1/2 top-0 w-0.5 -translate-x-1/2 transition-all duration-500 ease-out z-0"
                style={{ 
                  background: `linear-gradient(to bottom, var(--product-base), var(--product-highlight))`,
                  height: `${lineProgress}%`
                }}
              />

              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {saturationTimeline.map((phase, idx) => {
                  const Icon = phase.icon;
                  const isEven = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      data-timeline-item
                      className={`relative flex flex-col lg:flex-row items-start sm:items-center gap-4 sm:gap-5 ${
                        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      }`}
                      data-aos="fade-up"
                      data-aos-delay={idx * 150}
                    >
                      {/* Timeline Dot - Desktop */}
                      <div className="hidden lg:block absolute left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-3 shadow-lg z-20" 
                        style={{ 
                          borderColor: 'var(--product-base)',
                          boxShadow: `var(--product-shadow)`,
                          borderWidth: '3px'
                        }}
                      >
                        <div className="w-full h-full rounded-full flex items-center justify-center"
                          style={{ background: `var(--product-base)` }}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                      </div>

                      {/* Timeline Dot - Mobile */}
                      <div className="sm:hidden absolute left-4 top-6 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 shadow-md z-20" 
                        style={{ 
                          borderColor: 'var(--product-base)',
                          boxShadow: `var(--product-shadow)`,
                          borderWidth: '2px'
                        }}
                      >
                        <div className="w-full h-full rounded-full flex items-center justify-center"
                          style={{ background: `var(--product-base)` }}
                        >
                          <Icon className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`flex-1 w-[85%] sm:w-auto lg:w-5/12 ml-10 sm:ml-0 ${isEven ? 'lg:pr-10' : 'lg:pl-10'}`}>
                        <div 
                          className="rounded-xl sm:rounded-2xl border-2 bg-white p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                          style={{ 
                            borderColor: 'var(--product-border)',
                            boxShadow: `var(--product-shadow)`
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div 
                              className="hidden sm:flex lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl"
                              style={{ background: `var(--product-chip-bg)` }}
                            >
                              <Icon className="h-5 w-5" style={{ color: 'var(--product-darker)' }} />
                            </div>
                            <div className="flex-1">
                              <div 
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-0.5 border text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-1.5"
                                style={{ 
                                  backgroundColor: 'var(--product-chip-bg)',
                                  borderColor: 'var(--product-border)',
                                  color: 'var(--product-chip-text)'
                                }}
                              >
                                <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                                {phase.phase}
                              </div>
                              <h3 className="text-lg sm:text-xl font-bold text-slate-900">{phase.title}</h3>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{phase.description}</p>
                        </div>
                      </div>

                      {/* Empty space for alignment */}
                      <div className="hidden lg:block flex-1 lg:w-5/12" />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Key Ingredients, How to Use & Suitable For with Why Choose */}
          <section className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
              {/* Left side: Dropdowns (2 columns on large screens) */}
              <div className="lg:col-span-2 flex flex-col gap-3">
              {/* Key Ingredients */}
              <div 
                className="rounded-xl border-2 bg-white p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                style={{ 
                  borderColor: 'var(--product-border)',
                  boxShadow: `var(--product-shadow)`
                }}
              >
              {/* Decorative Background */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                style={{ background: `var(--product-glow)` }}
              />
              
              <div className="relative z-10">
                <button
                  onClick={() => setIsIngredientsExpanded(!isIngredientsExpanded)}
                  className="w-full flex items-center justify-between gap-2 mb-2 hover:opacity-80 transition-opacity group"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg shadow-md"
                      style={{ background: `var(--product-chip-bg)` }}
                    >
                      <Leaf className="h-4 w-4" style={{ color: 'var(--product-darker)' }} />
                    </div>
                    <div className="text-left">
                      <div 
                        className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 border text-[7px] font-bold uppercase tracking-[0.2em] mb-0.5"
                        style={{ 
                          backgroundColor: 'var(--product-chip-bg)',
                          borderColor: 'var(--product-border)',
                          color: 'var(--product-chip-text)'
                        }}
                      >
                        <BadgeCheck className="h-1.5 w-1.5" />
                        KEY INGREDIENTS
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Lab-Verified Formula</h3>
                    </div>
                  </div>
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'var(--product-chip-bg)',
                      transform: isIngredientsExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    <ChevronDown className="h-3 w-3" style={{ color: 'var(--product-darker)' }} />
                  </div>
                </button>
                
                <div 
                  className={`space-y-2 overflow-hidden ${
                    isIngredientsExpanded ? 'block' : 'hidden'
                  }`}
                >
                  {keyIngredientHighlights.map((ingredient, idx) => {
                    // Handle both object format (new) and string format (fallback)
                    let name: string;
                    let dosage: string;
                    let subItems: Array<{ name: string; dosage: string }> | undefined;
                    
                    if (typeof ingredient === 'object' && 'name' in ingredient) {
                      name = ingredient.name;
                      dosage = ingredient.dosage;
                      subItems = ingredient.subItems;
                    } else {
                      // Fallback for string format
                      const parts = String(ingredient).split('–').map(p => p.trim());
                      name = parts[0];
                      dosage = parts.length > 1 ? parts.slice(1).join('–') : '';
                    }
                    
                    return (
                      <div key={idx}>
                        <div
                          className="flex items-start gap-2 p-2 rounded-lg border"
                          style={{ 
                            borderColor: 'var(--product-border)',
                            backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : `rgba(${palette.rgbString}, 0.05)`
                          }}
                        >
                          <div 
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                            style={{ background: `var(--product-base)` }}
                          >
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <span className="text-sm sm:text-base font-semibold text-slate-900">{name}</span>
                              {dosage && (
                                <span 
                                  className="text-xs sm:text-sm font-medium whitespace-nowrap"
                                  style={{ color: 'var(--product-darker)' }}
                                >
                                  {dosage}
                                </span>
                              )}
                            </div>
                            {/* Sub-items for EPA and DHA */}
                            {subItems && subItems.length > 0 && (
                              <div className="mt-2 ml-8 space-y-1.5">
                                {subItems.map((subItem, subIdx) => (
                                  <div key={subIdx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: `var(--product-base)` }} />
                                    <span className="text-xs sm:text-sm text-slate-700">
                                      <span className="font-medium">providing {subItem.name}</span>
                                      {' '}— {subItem.dosage}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Footer Note */}
                  <div className="mt-5 pt-4 border-t flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600" style={{ borderColor: 'var(--product-border)' }}>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" style={{ color: 'var(--product-darker)' }} />
                      <span className="font-medium">No added preservatives</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <Droplets className="h-4 w-4" style={{ color: 'var(--product-darker)' }} />
                      <span className="font-medium">Approved colour used</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" style={{ color: 'var(--product-darker)' }} />
                      <span className="font-medium">Appropriate overages added</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* How to Use Card */}
            <div 
              className="rounded-xl border-2 bg-white p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
              style={{ 
                borderColor: 'var(--product-border)',
                boxShadow: `var(--product-shadow)`
              }}
            >
              {/* Decorative Background */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                style={{ background: `var(--product-glow)` }}
              />
              
              <div className="relative z-10">
                <button
                  onClick={() => setIsHowToUseExpanded(!isHowToUseExpanded)}
                  className="w-full flex items-center justify-between gap-2 mb-2 hover:opacity-80 transition-opacity group"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg shadow-md"
                      style={{ background: `var(--product-chip-bg)` }}
                    >
                      <Activity className="h-4 w-4" style={{ color: 'var(--product-darker)' }} />
                    </div>
                    <div className="text-left">
                      <div 
                        className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 border text-[7px] font-bold uppercase tracking-[0.2em] mb-0.5"
                        style={{ 
                          backgroundColor: 'var(--product-chip-bg)',
                          borderColor: 'var(--product-border)',
                          color: 'var(--product-chip-text)'
                        }}
                      >
                        <Clock className="h-1.5 w-1.5" />
                        USAGE GUIDE
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">How to Use</h3>
                    </div>
                  </div>
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'var(--product-chip-bg)',
                      transform: isHowToUseExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    <ChevronDown className="h-3 w-3" style={{ color: 'var(--product-darker)' }} />
                  </div>
                </button>
                
                <div className={`space-y-3 overflow-hidden ${isHowToUseExpanded ? 'block' : 'hidden'}`}>
                  {/* Dosage Highlight */}
                  <div 
                    className="p-3 rounded-lg border"
                    style={{ 
                      borderColor: 'var(--product-border)',
                      backgroundColor: `rgba(${palette.rgbString}, 0.05)`
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: `var(--product-base)` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">Dosage</span>
                    </div>
                    <p className="text-sm text-slate-700 ml-7">Take 1 tablet daily or as directed by a Dietitian. Swallow whole with water — do not chew or crush.</p>
                  </div>
                  
                  {/* Instructions */}
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Take 1 softgel daily or as directed by a Dietitian. Swallow whole with water — do not chew or crush.
                    </p>
                    <div className="pt-3 border-t" style={{ borderColor: 'var(--product-border)' }}>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-900">60-Day Timeline:</span> Initial saturation in days 1-10, cognitive baseline by weeks 3-4, and systemic resilience achieved by weeks 6-8.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suitable For Card */}
            <div 
              className="rounded-xl border-2 bg-white p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
              style={{ 
                borderColor: 'var(--product-border)',
                boxShadow: `var(--product-shadow)`
              }}
            >
              {/* Decorative Background */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                style={{ background: `var(--product-highlight)` }}
              />
              
              <div className="relative z-10">
                <button
                  onClick={() => setIsSuitableForExpanded(!isSuitableForExpanded)}
                  className="w-full flex items-center justify-between gap-2 mb-2 hover:opacity-80 transition-opacity group"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg shadow-md"
                      style={{ background: `var(--product-chip-bg)` }}
                    >
                      <Target className="h-4 w-4" style={{ color: 'var(--product-darker)' }} />
                    </div>
                    <div className="text-left">
                      <div 
                        className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 border text-[7px] font-bold uppercase tracking-[0.2em] mb-0.5"
                        style={{ 
                          backgroundColor: 'var(--product-chip-bg)',
                          borderColor: 'var(--product-border)',
                          color: 'var(--product-chip-text)'
                        }}
                      >
                        <BadgeCheck className="h-1.5 w-1.5" />
                        IDEAL FOR
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Suitable For</h3>
                    </div>
                  </div>
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'var(--product-chip-bg)',
                      transform: isSuitableForExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    <ChevronDown className="h-3 w-3" style={{ color: 'var(--product-darker)' }} />
                  </div>
                </button>
                
                <div className={`space-y-2 overflow-hidden ${isSuitableForExpanded ? 'block' : 'hidden'}`}>
                  {suitableForHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-lg border"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : `rgba(${palette.rgbString}, 0.05)`
                      }}
                    >
                      <Check 
                        className="flex-shrink-0 h-5 w-5 mt-0.5" 
                        style={{ color: 'var(--product-base)' }} 
                      />
                      <p className="text-sm text-slate-700 leading-relaxed flex-1">{item}</p>
                    </div>
                  ))}
                  
                  {/* Safety Tagline */}
                  <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--product-border)' }}>
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: `rgba(${palette.rgbString}, 0.08)` }}>
                      <ShieldCheck className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--product-darker)' }} />
                      <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--product-darker)' }}>
                        100% Pure • Lab-Tested • Safe & Natural
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Ingredient Breakdown: How It Works */}
              <div 
                className="rounded-xl border-2 bg-white p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                style={{ 
                  borderColor: 'var(--product-border)',
                  boxShadow: `var(--product-shadow)`
                }}
              >
                {/* Decorative Background */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                  style={{ background: `var(--product-glow)` }}
                />
                
                <div className="relative z-10">
                  <button
                    onClick={() => setIsIngredientBreakdownExpanded(!isIngredientBreakdownExpanded)}
                    className="w-full flex items-center justify-between gap-2 mb-2 hover:opacity-80 transition-opacity group"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg shadow-md"
                        style={{ background: `var(--product-chip-bg)` }}
                      >
                        <Leaf className="h-4 w-4" style={{ color: 'var(--product-darker)' }} />
                      </div>
                      <div className="text-left">
                        <div 
                          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 border text-[7px] font-bold uppercase tracking-[0.2em] mb-0.5"
                          style={{ 
                            backgroundColor: 'var(--product-chip-bg)',
                            borderColor: 'var(--product-border)',
                            color: 'var(--product-chip-text)'
                          }}
                        >
                          <BadgeCheck className="h-1.5 w-1.5" />
                          INGREDIENT BREAKDOWN
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">How It Works</h3>
                      </div>
                    </div>
                    <div 
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: 'var(--product-chip-bg)',
                        transform: isIngredientBreakdownExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <ChevronDown className="h-3 w-3" style={{ color: 'var(--product-darker)' }} />
                    </div>
                  </button>
                  
                  <div className={`space-y-4 overflow-hidden ${isIngredientBreakdownExpanded ? 'block' : 'hidden'}`}>
                    {/* Cognitive Processor */}
                    <div 
                      className="rounded-lg border-2 bg-white p-4"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        backgroundColor: `rgba(${palette.rgbString}, 0.05)`
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div 
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl shadow-md flex-shrink-0"
                          style={{ background: `var(--product-chip-bg)` }}
                        >
                          <Activity className="h-5 w-5" style={{ color: 'var(--product-darker)' }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-slate-900 mb-2">The Cognitive Processor</h4>
                          <p className="text-sm text-slate-700 leading-relaxed mb-2">
                            The human brain is roughly 60% fat, and DHA is its primary structural component.
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed mb-2">
                            <strong>Neural Insulation:</strong> DHA integrates into the brain's wiring, supporting the fast and clear transmission of electrical signals.
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Visual Acuity:</strong> As a major component of the retina, DHA is essential for maintaining sharp, clear vision and reducing eye fatigue in a digital world.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Circulatory Pipeline */}
                    <div 
                      className="rounded-lg border-2 bg-white p-4"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div 
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl shadow-md flex-shrink-0"
                          style={{ background: `var(--product-chip-bg)` }}
                        >
                          <HeartPulse className="h-5 w-5" style={{ color: 'var(--product-darker)' }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-slate-900 mb-2">The Circulatory Pipeline</h4>
                          <p className="text-sm text-slate-700 leading-relaxed mb-2">
                            A healthy heart relies on "elastic" and efficient blood vessels.
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed mb-2">
                            <strong>Vascular Dynamics:</strong> EPA helps maintain the flexibility of your arteries, ensuring that nutrient-rich blood flows with minimal resistance.
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Response Management:</strong> EPA acts as a precursor to molecules that manage the body's natural response to physical stress, keeping your internal environment balanced.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metabolic & Joint Resilience */}
                    <div 
                      className="rounded-lg border-2 bg-white p-4"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        backgroundColor: `rgba(${palette.rgbString}, 0.05)`
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div 
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl shadow-md flex-shrink-0"
                          style={{ background: `var(--product-chip-bg)` }}
                        >
                          <ShieldCheck className="h-5 w-5" style={{ color: 'var(--product-darker)' }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-slate-900 mb-2">Metabolic & Joint Resilience</h4>
                          <p className="text-sm text-slate-700 leading-relaxed mb-2">
                            Omega-3 fatty acids aren't just for the heart; they are systemic "lubricants."
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed mb-2">
                            <strong>Joint Comfort:</strong> By modulating pathways associated with physical exertion, these fatty acids support joint mobility and comfort after high-intensity activity.
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            <strong>Cellular Power:</strong> By protecting the mitochondria from oxidative stress, Omega-3s ensure your "power plants" continue to produce energy efficiently.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Why Choose the Pro Series (1 column on large screens) */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-xl border-2 bg-white p-4 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative sticky top-4"
                style={{ 
                  borderColor: 'var(--product-border)',
                  boxShadow: `var(--product-shadow)`
                }}
              >
                {/* Decorative Background */}
                <div 
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
                  style={{ background: `var(--product-glow)` }}
                />
                
                <div className="relative z-10">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-5">
                    Why Choose MYURA Pro Series Omega-3?
                  </h2>
                  
                  <div className="space-y-3 lg:space-y-4">
                    <div
                      className="flex items-start gap-3 p-3 lg:p-4 rounded-lg border bg-white/80 backdrop-blur-sm"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        boxShadow: `var(--product-shadow)`
                      }}
                    >
                      <Check 
                        className="flex-shrink-0 h-5 w-5 mt-0.5" 
                        style={{ color: 'var(--product-base)' }} 
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-1">Precision Ratio</p>
                        <p className="text-xs lg:text-sm text-slate-700 leading-relaxed">A concentrated blend of 180mg EPA and 120mg DHA per capsule for targeted physiological support.</p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-3 p-3 lg:p-4 rounded-lg border bg-white/80 backdrop-blur-sm"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        boxShadow: `var(--product-shadow)`
                      }}
                    >
                      <Check 
                        className="flex-shrink-0 h-5 w-5 mt-0.5" 
                        style={{ color: 'var(--product-base)' }} 
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-1">High Bioavailability</p>
                        <p className="text-xs lg:text-sm text-slate-700 leading-relaxed">Formulated in easy-to-swallow softgels for rapid absorption.</p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-3 p-3 lg:p-4 rounded-lg border bg-white/80 backdrop-blur-sm"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        boxShadow: `var(--product-shadow)`
                      }}
                    >
                      <Check 
                        className="flex-shrink-0 h-5 w-5 mt-0.5" 
                        style={{ color: 'var(--product-base)' }} 
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-1">Purity First</p>
                        <p className="text-xs lg:text-sm text-slate-700 leading-relaxed">Sourced from premium fish oil to ensure a clean, high-performance lipid profile.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Dropdown - Full Width */}
          <div className="w-full mt-4 lg:mt-6">
            <div 
              className="rounded-xl border-2 bg-white p-4 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
              style={{ 
                borderColor: 'var(--product-border)',
                boxShadow: `var(--product-shadow)`
              }}
            >
              {/* Decorative Background */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                style={{ background: `var(--product-glow)` }}
              />
              
              <div className="relative z-10">
                <button
                  onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
                  className="w-full flex items-center justify-between gap-2 mb-2 hover:opacity-80 transition-opacity group"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg shadow-md"
                      style={{ background: `var(--product-chip-bg)` }}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <div 
                        className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 border text-[7px] font-bold uppercase tracking-[0.2em] mb-0.5"
                        style={{ 
                          backgroundColor: 'var(--product-chip-bg)',
                          borderColor: 'var(--product-border)',
                          color: 'var(--product-chip-text)'
                        }}
                      >
                        <Star className="h-1.5 w-1.5" />
                        CUSTOMER REVIEWS
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">What Our Customers Say</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-900">5.0</span>
                        <span className="text-[10px] text-slate-500">(134 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'var(--product-chip-bg)',
                      transform: isReviewsExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    <ChevronDown className="h-3 w-3" style={{ color: 'var(--product-darker)' }} />
                  </div>
                </button>
                
                <div className={`space-y-4 overflow-hidden ${isReviewsExpanded ? 'block' : 'hidden'}`}>
                  {[
                    {
                      name: 'Rajesh Kumar',
                      rating: 5,
                      date: '2 weeks ago',
                      review: 'Excellent product! I\'ve been using this for 45 days now and I can feel the difference. My energy levels are consistently high throughout the day, and I\'ve noticed better recovery after workouts. The 60-day journey is real - I\'m seeing progressive improvements.'
                    },
                    {
                      name: 'Amit Sharma',
                      rating: 4,
                      date: '1 month ago',
                      review: 'Best supplement I\'ve tried. The systemic approach really works. No crashes, just sustained energy. My work capacity has definitely increased, and I feel more balanced overall. Highly recommend for anyone serious about their health.'
                    },
                    {
                      name: 'Vikram Patel',
                      rating: 5,
                      date: '3 weeks ago',
                      review: 'After 8 weeks, I can confidently say this product delivers. The muscle fullness and recovery speed improvements are noticeable. Clean ingredients, no side effects. Worth every rupee for the quality and results.'
                    },
                    {
                      name: 'Suresh Reddy',
                      rating: 4,
                      date: '2 months ago',
                      review: 'I was skeptical at first, but the research-backed formula convinced me. The first 10 days showed immediate vascularity improvements. By week 4, my strength gains were evident. Now at week 8, I feel at my peak. This is the real deal.'
                    },
                    {
                      name: 'Anil Mehta',
                      rating: 5,
                      date: '1 week ago',
                      review: 'Clean label integrity is what sold me. No hidden stimulants, just pure nutrients. I\'ve tried many supplements, but this one stands out. The anabolic architecture approach makes sense, and the results speak for themselves.'
                    },
                    {
                      name: 'Ravi Singh',
                      rating: 4,
                      date: '3 weeks ago',
                      review: 'Good product overall. Started noticing improvements around week 3. Energy levels are better, and recovery has improved. Would like to see faster results, but I understand it\'s a systemic approach that takes time.'
                    },
                    {
                      name: 'Karan Malhotra',
                      rating: 5,
                      date: '1 month ago',
                      review: 'Outstanding results! The 60-day journey concept is accurate. I\'ve completed the full cycle and the transformation is remarkable. Better strength, improved mood, and sustained energy. This is now a permanent part of my routine.'
                    },
                    {
                      name: 'Nikhil Joshi',
                      rating: 4,
                      date: '2 weeks ago',
                      review: 'Solid supplement with clean ingredients. I appreciate the transparency in labeling. Results are gradual but consistent. The research-backed approach gives me confidence in the product.'
                    }
                  ].map((review, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border-2 bg-white p-4"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        boxShadow: `var(--product-shadow)`,
                        backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : `rgba(${palette.rgbString}, 0.05)`
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ background: `var(--product-base)` }}
                            >
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                              <p className="text-xs text-slate-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-12">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-slate-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed ml-12">
                        {review.review}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">You may also love</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">Complete your wellness routine</p>
                </div>
                <Link
                  to="/product"
                  className="inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-[0.25em] transition-colors"
                  style={{ color: 'var(--product-darker)' }}
                >
                  View all products →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((related, idx) => {
                  const cardStyle = getRelatedCardStyle(related.id);
                  return (
                    <Link
                      key={related.id}
                      to={`/product/${related.id}`}
                      className="group flex flex-col gap-4 overflow-hidden rounded-2xl border-2 bg-white/80 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                      style={{ 
                        borderColor: 'var(--product-border)',
                        boxShadow: `var(--product-shadow)`
                      }}
                      data-aos="fade-up"
                      data-aos-delay={idx * 100}
                    >
                      <div className={`overflow-hidden rounded-xl bg-gradient-to-br ${cardStyle.gradient} p-3`}>
                        <ResponsiveProductImage
                          image={related.image}
                          className="aspect-square overflow-hidden rounded-lg"
                          imgClassName="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${cardStyle.accentText}`}>
                          {related.headline}
                        </p>
                        <h4 className="text-lg font-bold text-slate-900">{related.name}</h4>
                        <div className="flex items-baseline gap-2 text-slate-900">
                          <span className={`text-base font-bold ${cardStyle.accentText}`}>₹{related.price}</span>
                          <span className="text-xs text-slate-400 line-through">₹{related.originalPrice}</span>
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
              className="absolute right-4 top-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white text-slate-900 shadow-xl transition hover:scale-105"
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-lg transition hover:bg-white/25"
                aria-label="Close zoom overlay"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center px-3 py-6 sm:px-10 sm:py-8 lg:px-24 lg:py-10">
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

ProOmega3SoftgelPage.displayName = 'ProOmega3SoftgelPage';

export default ProOmega3SoftgelPage;

