import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Plus, Minus, Star, Heart, Activity, Sparkles, Droplets, ShieldCheck, HeartPulse, X, ZoomIn } from 'lucide-react';
import ResponsiveProductImage from '../components/ResponsiveProductImage';
import { getProductById, getRelatedProducts } from '../data/products';

type ProductTheme = {
  heroGradient: string;
  heroTexture: string;
  badgeText: string;
  badgeBorder: string;
  badgeBg: string;
  priceCardGradient: string;
  saveText: string;
  stockBadge: string;
  qtyBorder: string;
  ctaGradient: string;
  galleryRingActive: string;
  galleryGlow: string;
  sectionPrimaryGradient: string;
  sectionSecondaryGradient: string;
  sectionFaqGradient: string;
  sectionCtaGradient: string;
  accentPill: string;
  accentIconBg: string;
  accentIconText: string;
};

const baseTheme: ProductTheme = {
  heroGradient: 'from-white via-emerald-50 to-white',
  heroTexture:
    'bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.16),transparent_50%),radial-gradient(circle_at_80%_35%,rgba(59,130,246,0.12),transparent_55%)]',
  badgeText: 'text-emerald-700',
  badgeBorder: 'border-emerald-100',
  badgeBg: 'bg-emerald-50/80',
  priceCardGradient: 'from-white via-emerald-50/70 to-white',
  saveText: 'text-emerald-600',
  stockBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  qtyBorder: 'border-emerald-100',
  ctaGradient: 'from-slate-900 via-emerald-600 to-slate-900',
  galleryRingActive: 'ring-emerald-200 shadow-[0_20px_45px_-24px_rgba(16,185,129,0.35)]',
  galleryGlow: 'to-emerald-100/35',
  sectionPrimaryGradient: 'from-white via-emerald-50 to-teal-50',
  sectionSecondaryGradient: 'from-emerald-50 via-white to-slate-50',
  sectionFaqGradient: 'from-white via-slate-50 to-emerald-50/70',
  sectionCtaGradient: 'from-emerald-50 via-white to-teal-50',
  accentPill: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  accentIconBg: 'bg-emerald-50',
  accentIconText: 'text-emerald-600',
};

const createTheme = (overrides: Partial<ProductTheme>): ProductTheme => ({
  ...baseTheme,
  ...overrides,
});

const productThemes: Record<string, ProductTheme> = {
  default: baseTheme,
  'dia-care': createTheme({
    heroGradient: 'from-white via-rose-50 to-white',
    heroTexture:
      'bg-[radial-gradient(circle_at_20%_18%,rgba(244,114,182,0.18),transparent_55%),radial-gradient(circle_at_78%_32%,rgba(251,191,36,0.15),transparent_60%)]',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-100',
    badgeBg: 'bg-rose-50/80',
    priceCardGradient: 'from-white via-rose-50/70 to-white',
    stockBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    qtyBorder: 'border-rose-100',
    ctaGradient: 'from-rose-600 via-amber-400 to-rose-600',
    galleryRingActive: 'ring-rose-200 shadow-[0_20px_45px_-24px_rgba(244,114,182,0.35)]',
    galleryGlow: 'to-rose-100/40',
    sectionPrimaryGradient: 'from-white via-rose-50 to-amber-50',
    sectionSecondaryGradient: 'from-rose-50 via-white to-slate-50',
    sectionFaqGradient: 'from-white via-rose-50 to-white',
    sectionCtaGradient: 'from-rose-50 via-white to-emerald-50',
    accentPill: 'bg-rose-50 text-rose-700 border border-rose-100',
    accentIconBg: 'bg-rose-50',
    accentIconText: 'text-rose-600',
  }),
  'liver-detox': createTheme({
    heroGradient: 'from-white via-teal-50 to-white',
    heroTexture:
      'bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.2),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(56,189,248,0.18),transparent_60%)]',
    badgeText: 'text-teal-700',
    badgeBorder: 'border-teal-100',
    badgeBg: 'bg-teal-50/80',
    priceCardGradient: 'from-white via-teal-50/70 to-white',
    saveText: 'text-cyan-700',
    stockBadge: 'bg-teal-50 text-teal-700 border-teal-200',
    qtyBorder: 'border-teal-100',
    ctaGradient: 'from-teal-600 via-emerald-500 to-teal-600',
    galleryRingActive: 'ring-teal-200 shadow-[0_20px_45px_-24px_rgba(45,212,191,0.35)]',
    galleryGlow: 'to-teal-100/35',
    sectionPrimaryGradient: 'from-white via-teal-50 to-emerald-50',
    sectionSecondaryGradient: 'from-teal-50 via-white to-slate-50',
    sectionFaqGradient: 'from-white via-teal-50 to-white',
    sectionCtaGradient: 'from-teal-50 via-white to-emerald-50',
    accentPill: 'bg-teal-50 text-teal-700 border border-teal-100',
    accentIconBg: 'bg-teal-50',
    accentIconText: 'text-teal-600',
  }),
  'bone-joint-support': createTheme({
    heroGradient: 'from-white via-indigo-50 to-rose-50',
    heroTexture:
      'bg-[radial-gradient(circle_at_20%_18%,rgba(99,102,241,0.16),transparent_55%),radial-gradient(circle_at_78%_30%,rgba(251,146,60,0.18),transparent_60%)]',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-100',
    badgeBg: 'bg-indigo-50/80',
    saveText: 'text-amber-600',
    stockBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    qtyBorder: 'border-indigo-100',
    ctaGradient: 'from-indigo-600 via-amber-500 to-indigo-600',
    galleryRingActive: 'ring-indigo-200 shadow-[0_20px_45px_-24px_rgba(99,102,241,0.35)]',
    galleryGlow: 'to-indigo-100/40',
    sectionPrimaryGradient: 'from-white via-indigo-50 to-amber-50',
    sectionSecondaryGradient: 'from-indigo-50 via-white to-slate-50',
    sectionFaqGradient: 'from-white via-indigo-50 to-white',
    sectionCtaGradient: 'from-indigo-50 via-white to-emerald-50',
    accentPill: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    accentIconBg: 'bg-indigo-50',
    accentIconText: 'text-indigo-600',
  }),
  'gut-and-digestion': createTheme({
    heroGradient: 'from-white via-amber-50 to-white',
    heroTexture:
      'bg-[radial-gradient(circle_at_18%_20%,rgba(251,191,36,0.18),transparent_55%),radial-gradient(circle_at_78%_28%,rgba(16,185,129,0.16),transparent_60%)]',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-100',
    badgeBg: 'bg-amber-50/80',
    saveText: 'text-emerald-700',
    stockBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    qtyBorder: 'border-amber-100',
    ctaGradient: 'from-amber-500 via-emerald-500 to-amber-500',
    galleryRingActive: 'ring-amber-200 shadow-[0_20px_45px_-24px_rgba(251,191,36,0.35)]',
    galleryGlow: 'to-amber-100/35',
    sectionPrimaryGradient: 'from-white via-amber-50 to-emerald-50',
    sectionSecondaryGradient: 'from-amber-50 via-white to-slate-50',
    sectionFaqGradient: 'from-white via-amber-50 to-white',
    sectionCtaGradient: 'from-amber-50 via-white to-emerald-50',
    accentPill: 'bg-amber-50 text-amber-700 border border-amber-100',
    accentIconBg: 'bg-amber-50',
    accentIconText: 'text-amber-600',
  }),
  'womens-health-plus': createTheme({
    heroGradient: 'from-white via-rose-50 to-pink-50',
    heroTexture:
      'bg-[radial-gradient(circle_at_18%_18%,rgba(244,114,182,0.2),transparent_55%),radial-gradient(circle_at_78%_32%,rgba(236,72,153,0.2),transparent_60%)]',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-100',
    badgeBg: 'bg-rose-50/80',
    saveText: 'text-emerald-600',
    stockBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    qtyBorder: 'border-rose-100',
    ctaGradient: 'from-rose-600 via-pink-500 to-rose-600',
    galleryRingActive: 'ring-rose-200 shadow-[0_20px_45px_-24px_rgba(244,114,182,0.35)]',
    galleryGlow: 'to-rose-100/40',
    sectionPrimaryGradient: 'from-white via-rose-50 to-pink-50',
    sectionSecondaryGradient: 'from-rose-50 via-white to-slate-50',
    sectionFaqGradient: 'from-white via-rose-50 to-white',
    sectionCtaGradient: 'from-rose-50 via-white to-pink-50',
    accentPill: 'bg-rose-50 text-rose-700 border border-rose-100',
    accentIconBg: 'bg-rose-50',
    accentIconText: 'text-rose-600',
  }),
  'mens-vitality-booster': createTheme({
    heroGradient: 'from-white via-sky-50 to-white',
    heroTexture:
      'bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.18),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(148,163,184,0.16),transparent_60%)]',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    badgeBg: 'bg-slate-100/70',
    saveText: 'text-sky-700',
    stockBadge: 'bg-slate-100 text-slate-700 border-slate-200',
    qtyBorder: 'border-slate-200',
    ctaGradient: 'from-slate-800 via-sky-600 to-slate-800',
    galleryRingActive: 'ring-sky-200 shadow-[0_20px_45px_-24px_rgba(14,165,233,0.35)]',
    galleryGlow: 'to-sky-100/35',
    sectionPrimaryGradient: 'from-white via-sky-50 to-slate-50',
    sectionSecondaryGradient: 'from-slate-50 via-white to-slate-100',
    sectionFaqGradient: 'from-white via-slate-50 to-white',
    sectionCtaGradient: 'from-sky-50 via-white to-slate-50',
    accentPill: 'bg-slate-100 text-slate-700 border border-slate-200',
    accentIconBg: 'bg-slate-100',
    accentIconText: 'text-slate-600',
  }),
};

const ProductDetail: React.FC = () => {
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

  const theme = productThemes[id ?? 'default'] ?? productThemes.default;

  const gallery =
    product?.gallery && product.gallery.length > 0
      ? product.gallery
      : product?.image
      ? [product.image]
      : [];
  const heroImage = gallery[activeImageIndex] ?? product?.image;
  const galleryLength = gallery.length;

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
    currentThumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeImageIndex]);

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

  if (!product) {
    return <Navigate to="/product" replace />;
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSection((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <>
      <div className="min-h-screen bg-white">
      <section className={`relative overflow-hidden bg-gradient-to-r ${theme.heroGradient} py-6 sm:py-9`}>
        <div className={`absolute inset-0 ${theme.heroTexture}`} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-2 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] ${theme.badgeText} shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)]`}
              >
                Exclusive Ritual · Myura Apothecary
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">{product.name}</h1>
              <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0">{product.heroTagline}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-left">
                {product.notes.slice(0, 2).map((note) => (
                  <div
                    key={note}
                    className={`rounded-full border ${theme.badgeBorder} bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm`}
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div
                className={`rounded-2xl border border-slate-100 bg-gradient-to-br ${theme.priceCardGradient} px-5 py-5 text-slate-900 shadow-[0_35px_85px_-45px_rgba(15,23,42,0.35)]`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                  <div>
                    <p className="uppercase tracking-[0.35em] text-slate-400 text-[10px]">Today’s ritual price</p>
                    <p className="text-3xl font-semibold text-slate-900">₹{product.price}</p>
                    <p className="text-xs text-slate-500">
                      <span className="line-through text-slate-400/80">₹{product.originalPrice}</span>{' '}
                      <span className={`${theme.saveText} font-semibold`}>Save {discountPercent}%</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="uppercase tracking-[0.35em] text-slate-400 text-[10px]">Rating</p>
                    <p className="text-2xl font-semibold text-slate-900">{product.rating}.0/5</p>
                    <p className="text-xs text-slate-500">{product.reviews} verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div
              className="relative mx-auto w-[88%] max-w-md sm:w-[80%] sm:max-w-lg lg:w-[68%] lg:max-w-2xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="pointer-events-none absolute -left-8 top-6 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-200/40 via-transparent to-emerald-100/20 blur-3xl" />
              <div className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 rounded-full bg-gradient-to-br from-amber-200/40 via-transparent to-pink-100/30 blur-3xl" />
              <button
                type="button"
                onClick={handleOpenZoom}
                className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded-2xl"
              >
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_25px_55px_-35px_rgba(15,23,42,0.45)] transition-transform duration-300 group-active:scale-[0.99]">
                  <ResponsiveProductImage
                    image={heroImage}
                    className="w-full"
                    imgClassName="object-contain p-0 m-0"
                  />
                </div>
                <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/95 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-800 shadow-lg">
                  <ZoomIn className="h-3.5 w-3.5" />
                  Tap to zoom
                </span>
              </button>
            </div>
            {gallery.length > 1 && (
              <>
                <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible scroll-smooth snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
                {gallery.map((galleryImage, index) => (
                  <button
                    key={`${galleryImage.fallback}-${galleryImage.alt}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                      ref={(element) => {
                        thumbnailRefs.current[index] = element;
                      }}
                    className={`group relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-2xl transition-all duration-300 snap-start ${
                      activeImageIndex === index ? 'scale-100' : 'opacity-80 hover:opacity-100 hover:-translate-y-0.5'
                    }`}
                    aria-label={`Show product image ${index + 1}`}
                  >
                    <div
                      className={`relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-[0_12px_35px_-22px_rgba(15,23,42,0.35)] ring-1 ${
                        activeImageIndex === index ? theme.galleryRingActive : 'ring-slate-100'
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-transparent ${theme.galleryGlow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                      />
                      <ResponsiveProductImage
                        image={galleryImage}
                        className="h-full w-full"
                        imgClassName="object-contain p-3"
                      />
                    </div>
                  </button>
                ))}
                </div>
                <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={() => handleGalleryNav(-1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
                    aria-label="Show previous image"
                  >
                    {'<'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGalleryNav(1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
                    aria-label="Show next image"
                  >
                    {'>'}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-3 rounded-[2.5rem] border border-slate-100 bg-white/95 p-6 shadow-[0_35px_85px_-45px_rgba(15,23,42,0.45)]">
              <Link
                to="/product"
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400 transition-colors hover:text-slate-700"
              >
                ← Product Collection
              </Link>
              <p className={`text-xs font-semibold uppercase tracking-[0.4em] ${theme.badgeText}`}>
                {product.headline}
              </p>
              <h2 className="text-4xl font-bold text-slate-900">{product.name}</h2>
              <p className="text-base leading-relaxed text-slate-600">{product.summary}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: product.rating }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-500">
                  {product.rating}.0 · {product.reviews} artisan reviews
                </span>
              </div>
            </div>

            <div
              className={`rounded-[2.5rem] border border-slate-100 bg-gradient-to-br ${theme.sectionSecondaryGradient} p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] space-y-6`}
            >
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">today’s ritual price</p>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-4xl font-bold text-slate-900">₹{product.price}</span>
                    <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] shadow-inner border ${theme.stockBadge}`}
                >
                  {product.inStock ? 'In Stock' : 'Back Soon'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center rounded-full border ${theme.qtyBorder} bg-white shadow-inner`}>
                  <button
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="px-4 py-3 transition-colors hover:bg-slate-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 text-slate-700" />
                  </button>
                  <span className="px-6 py-3 text-base font-semibold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((value) => value + 1)}
                    className="px-4 py-3 transition-colors hover:bg-slate-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 text-slate-700" />
                  </button>
                </div>
                <button
                  className="inline-flex grow basis-48 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:bg-slate-800 hover:shadow-[0_22px_44px_-22px_rgba(15,23,42,0.45)]"
                >
                  Add to cart
                </button>
                <button
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Save to wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <section
          className={`relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br ${theme.sectionPrimaryGradient} p-6 sm:p-10 text-slate-800`}
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="relative flex flex-col items-center">
            <div className="space-y-4 max-w-3xl">
              <p className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] ${theme.accentPill}`}>
                Inside the ritual
              </p>
              <h3 className="text-3xl font-bold text-slate-900">
                A calm, consistent approach to metabolic balance
              </h3>
              <p className="text-base leading-relaxed text-slate-600">
                DIA CARE is a 15-herb ritual for people who want smooth glucose rhythms without harsh synthetics. Two
                capsules a day keep energy even, focus clear, and digestion comfortable.
              </p>
              <p className="text-base leading-relaxed text-slate-600">
                Think Neem, Vijaysar, Jamun, Gudmar, and adaptogens working quietly in the background—protecting
                pancreatic health, calming cravings, and softening stress spikes so you stay centred.
              </p>
            </div>
          </div>
        </section>

        <section
          className={`rounded-[2.5rem] border border-slate-100 bg-gradient-to-br ${theme.sectionSecondaryGradient} p-6 sm:p-8 shadow-[0_30px_70px_-55px_rgba(15,23,42,0.35)] text-slate-800`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                Botanical glow
              </p>
              <h3 className="text-3xl font-bold text-slate-900">Feel the difference in every capsule</h3>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] ${theme.accentPill}`}>
              {product.headline}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.benefits.map((benefit, idx) => {
              const icons = [Activity, Sparkles, Droplets, ShieldCheck, HeartPulse];
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm text-slate-700 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.2)]"
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 ${theme.accentIconBg} ${theme.accentIconText}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{benefit}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div
            className={`rounded-[2rem] border border-slate-100 bg-gradient-to-br ${theme.sectionSecondaryGradient} p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.3)] text-slate-800`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Key ingredients</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">Lab-verified herbal matrix</h3>
            <div className="mt-6 space-y-3">
              {keyIngredientHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-slate-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.25)] space-y-4 text-slate-700">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">How to use</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.howToUse}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Suitable for</p>
              <ul className="mt-3 space-y-3">
                {suitableForHighlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-600">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-slate-400/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className={`rounded-3xl border border-slate-100 bg-gradient-to-br ${theme.sectionFaqGradient} p-6 sm:p-8 shadow-[0_35px_85px_-50px_rgba(15,23,42,0.25)] text-slate-800`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">FAQs</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Still curious about DIA CARE?</h3>
            </div>
            <span className="text-sm text-slate-500">Holistic answers for modern routines</span>
          </div>
          <div className="space-y-4">
            {product.faqs.split('.').filter(Boolean).map((answer, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <button
                  onClick={() => toggleSection(`faq-${idx}`)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-semibold text-slate-800">Ritual tip {idx + 1}</span>
                  {expandedSection === `faq-${idx}` ? (
                    <Minus className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Plus className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {expandedSection === `faq-${idx}` && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{answer.trim()}.</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={`overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br ${theme.sectionCtaGradient}`}>
          <div className="relative px-6 py-14 sm:px-10 lg:px-16">
            <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-indigo-100/55 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4 max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                  Daily devotion
                </p>
                <h3 className="text-3xl font-bold leading-tight lg:text-4xl text-slate-900">
                  {product.heroTagline}
                </h3>
                <p className="text-lg text-slate-600">
                  Build a mindful ritual and experience how consistent nourishment transforms the way you
                  move, feel, and glow.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-[0_18px_38px_-24px_rgba(15,23,42,0.35)] transition-colors hover:bg-white"
              >
                Talk to a specialist
              </Link>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-3xl font-bold text-slate-900">You may also love</h3>
              <Link
                to="/product"
                className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 transition-colors hover:text-slate-700"
              >
                View all products
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="group flex flex-col gap-5 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="overflow-hidden rounded-2xl bg-slate-900/5 p-4">
                    <ResponsiveProductImage
                      image={related.image}
                      className="aspect-square overflow-hidden rounded-xl"
                      imgClassName="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {related.headline}
                    </p>
                    <h4 className="text-xl font-semibold text-slate-900">{related.name}</h4>
                    <div className="flex items-baseline gap-3 text-slate-900">
                      <span className="text-lg font-semibold">₹{related.price}</span>
                      <span className="text-sm text-slate-400 line-through">₹{related.originalPrice}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      </div>
      {isZoomed && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseZoom}
        >
          <div
            className="relative z-[1250] flex w-full max-w-[860px] flex-col gap-4 rounded-3xl bg-white p-4 sm:p-5 lg:p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                <ZoomIn className="h-4 w-4 text-emerald-500" />
                Label magnifier
              </div>
              <button
                type="button"
                onClick={handleCloseZoom}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                aria-label="Close zoomed image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center max-h-[70vh]">
              <ResponsiveProductImage
                image={heroImage}
                className="w-full"
                imgClassName="object-contain w-full max-h-[65vh] p-4 sm:p-6"
              />
            </div>
            <div className="text-center text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
              Pinch or scroll to inspect every detail
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;

