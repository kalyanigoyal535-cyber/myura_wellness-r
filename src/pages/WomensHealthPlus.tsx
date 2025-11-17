import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Plus, Minus, Star, Heart, Sparkles, Flower2, Moon, Sun, ShieldCheck, HeartPulse, X, ZoomIn, Calendar, TrendingUp, Leaf } from 'lucide-react';
import ResponsiveProductImage from '../components/ResponsiveProductImage';
import { getProductById, getRelatedProducts } from '../data/products';

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
      <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-pink-50/20">
        {/* Hero Section with Elegant Floral Design */}
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50/80 to-rose-50 py-12 sm:py-16 lg:py-20">
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
              {/* Left Content */}
              <div className="flex-1 space-y-6 text-center lg:text-left mb-8 lg:mb-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/70 backdrop-blur-sm px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-rose-700 shadow-lg">
                  <Moon className="h-3.5 w-3.5" />
                  Lunar-Aligned Wellness
                  <Flower2 className="h-3.5 w-3.5" />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {product.name}
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                  {product.heroTagline}
                </p>
                <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {product.summary}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                  <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 border border-rose-100 shadow-sm">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-slate-900">{product.rating}.0</span>
                    <span className="text-xs text-slate-500">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 border border-rose-200">
                    <HeartPulse className="h-4 w-4 text-rose-600" />
                    <span className="text-sm font-semibold text-rose-700">Hormonal Balance</span>
                  </div>
                </div>
              </div>

              {/* Right Image Card */}
              <div className="flex-1 max-w-lg mx-auto lg:mx-0">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-300/40 via-pink-300/30 to-rose-400/40 rounded-3xl blur-2xl -z-10" />
                  
                  {/* Image Container */}
                  <div
                    className="relative rounded-3xl border-2 border-white/80 bg-white/90 backdrop-blur-sm shadow-2xl p-6 sm:p-8"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <button
                      type="button"
                      onClick={handleOpenZoom}
                      className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 rounded-2xl"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-4 shadow-inner transition-transform duration-300 group-hover:scale-[0.98]">
                        <ResponsiveProductImage
                          image={heroImage}
                          className="w-full"
                          imgClassName="object-contain p-0 m-0"
                        />
                      </div>
                      <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-700 shadow-lg border border-rose-100">
                        <ZoomIn className="h-3.5 w-3.5" />
                        Zoom
                      </span>
                    </button>
                  </div>

                  {/* Gallery Thumbnails */}
                  {gallery.length > 1 && (
                    <div className="mt-6 flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center scroll-smooth snap-x snap-mandatory">
                      {gallery.map((galleryImage, index) => (
                        <button
                          key={`${galleryImage.fallback}-${galleryImage.alt}`}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          ref={(element) => {
                            thumbnailRefs.current[index] = element;
                          }}
                          className={`group relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-2xl transition-all duration-300 snap-start ${
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
                              imgClassName="object-contain p-2"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="rounded-3xl border-2 border-white/90 bg-white/80 backdrop-blur-sm shadow-2xl p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs uppercase tracking-[0.4em] text-rose-600 font-semibold mb-2">
                      Special Ritual Price
                    </p>
                    <div className="flex items-baseline gap-4 justify-center sm:justify-start">
                      <span className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{product.price}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xl text-slate-400 line-through">₹{product.originalPrice}</span>
                        <span className="text-sm font-semibold text-rose-600">Save {discountPercent}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border-2 border-rose-200 bg-rose-50">
                      <button
                        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                        className="px-4 py-3 transition-colors hover:bg-rose-100 rounded-l-full"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4 text-rose-700" />
                      </button>
                      <span className="px-6 py-3 text-lg font-bold text-rose-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity((value) => value + 1)}
                        className="px-4 py-3 transition-colors hover:bg-rose-100 rounded-r-full"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4 text-rose-700" />
                      </button>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.3em] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <Heart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-200 bg-white/80 text-rose-600 transition-all hover:bg-rose-50 hover:border-rose-300 hover:scale-110"
                      aria-label="Save to wishlist"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-rose-100 flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-rose-700">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="font-semibold">100% Natural</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-700">
                    <Leaf className="h-4 w-4" />
                    <span className="font-semibold">Lab Verified</span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] ${
                      product.inStock
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Back Soon'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {/* Wellness Journey Section */}
          <section className="relative max-w-6xl mx-auto">
            <div className="relative rounded-3xl border-2 border-rose-100 bg-gradient-to-br from-white via-rose-50/30 to-pink-50/40 p-8 sm:p-12 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-200/20 to-pink-200/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-200/20 to-rose-200/10 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-rose-100 border border-rose-200 text-xs font-semibold uppercase tracking-[0.4em] text-rose-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Your Wellness Journey
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  Bring rhythm back to your cycle, skin, and mood
                </h2>
                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-3xl">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="flex items-start gap-4 rounded-2xl bg-white/80 p-6 border border-rose-100 shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Cycle Harmony</h3>
                      <p className="text-sm text-slate-600">Balance hormonal peaks and dips naturally throughout your monthly rhythm.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-2xl bg-white/80 p-6 border border-rose-100 shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Inner Radiance</h3>
                      <p className="text-sm text-slate-600">Support skin luminosity and hair strength from within.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-rose-100 border border-rose-200 text-xs font-semibold uppercase tracking-[0.4em] text-rose-700 mb-4">
                <HeartPulse className="h-3.5 w-3.5" />
                Botanical Benefits
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Feel the difference in every capsule
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                A thoughtfully crafted blend designed specifically for women's wellness needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.benefits.map((benefit, idx) => {
                const icons = [Flower2, Moon, HeartPulse, Sparkles, ShieldCheck, Sun];
                const Icon = icons[idx % icons.length];
                return (
                  <div
                    key={benefit}
                    className="group relative rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-white to-rose-50/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-rose-200/30 to-pink-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 mb-4 border border-rose-200">
                        <Icon className="h-7 w-7 text-rose-600" />
                      </div>
                      <p className="text-base font-semibold text-slate-900 leading-relaxed">{benefit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ingredients & Usage Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Key Ingredients */}
            <div className="rounded-3xl border-2 border-rose-100 bg-gradient-to-br from-white via-rose-50/20 to-white p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-600">Key Ingredients</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">Lab-verified herbal matrix</h3>
                </div>
              </div>
              <div className="space-y-4">
                {keyIngredientHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-slate-700">
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-rose-400 to-pink-400" />
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use & Suitable For */}
            <div className="space-y-6">
              <div className="rounded-3xl border-2 border-rose-100 bg-gradient-to-br from-white to-pink-50/30 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Moon className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-pink-600">How to Use</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">Your Daily Ritual</h3>
                  </div>
                </div>
                <p className="text-base text-slate-700 leading-relaxed">{product.howToUse}</p>
              </div>

              <div className="rounded-3xl border-2 border-rose-100 bg-gradient-to-br from-white via-rose-50/20 to-white p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-600">Suitable For</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">Perfect For You</h3>
                  </div>
                </div>
                <ul className="space-y-4">
                  {suitableForHighlights.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-700">
                      <div className="flex-shrink-0 mt-2">
                        <Flower2 className="h-4 w-4 text-rose-500" />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="max-w-4xl mx-auto">
            <div className="rounded-3xl border-2 border-rose-100 bg-gradient-to-br from-white via-rose-50/20 to-pink-50/30 p-8 sm:p-12 shadow-xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-rose-100 border border-rose-200 text-xs font-semibold uppercase tracking-[0.4em] text-rose-700 mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Frequently Asked
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                  Your questions answered
                </h2>
                <p className="text-lg text-slate-600">Holistic answers for your wellness journey</p>
              </div>
              
              <div className="space-y-4">
                {product.faqs.split('.').filter(Boolean).map((answer, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border-2 border-rose-100 bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <button
                      onClick={() => toggleSection(`faq-${idx}`)}
                      className="flex w-full items-center justify-between p-5 text-left hover:bg-rose-50/50 transition-colors duration-200"
                    >
                      <span className="text-base font-bold text-slate-900">
                        {idx === 0 ? 'How long until I see results?' : `Question ${idx + 1}`}
                      </span>
                      {expandedSection === `faq-${idx}` ? (
                        <Minus className="h-5 w-5 text-rose-600 flex-shrink-0" />
                      ) : (
                        <Plus className="h-5 w-5 text-rose-600 flex-shrink-0" />
                      )}
                    </button>
                    {expandedSection === `faq-${idx}` && (
                      <div className="px-5 pb-5">
                        <p className="text-base text-slate-700 leading-relaxed">{answer.trim()}.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative max-w-6xl mx-auto">
            <div className="relative rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-100 via-pink-100/80 to-rose-50 p-12 sm:p-16 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-rose-300/20 rounded-full blur-3xl -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-300/30 to-pink-300/20 rounded-full blur-3xl -ml-48 -mb-48" />
              
              <div className="relative text-center space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-white/80 backdrop-blur-sm border border-rose-200 text-xs font-semibold uppercase tracking-[0.4em] text-rose-700">
                  <Heart className="h-3.5 w-3.5" />
                  Daily Devotion
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  {product.heroTagline}
                </h2>
                <p className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
                  Build a mindful ritual and experience how consistent nourishment transforms the way you move, feel, and glow.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.3em] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Talk to a specialist
                  <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">You may also love</h3>
                  <p className="text-lg text-slate-600 mt-2">Complete your wellness routine</p>
                </div>
                <Link
                  to="/product"
                  className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.3em] text-rose-600 hover:text-rose-700 transition-colors"
                >
                  View all products →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/product/${related.id}`}
                    className="group flex flex-col gap-5 overflow-hidden rounded-3xl border-2 border-rose-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-200"
                  >
                    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-4">
                      <ResponsiveProductImage
                        image={related.image}
                        className="aspect-square overflow-hidden rounded-xl"
                        imgClassName="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                        {related.headline}
                      </p>
                      <h4 className="text-xl font-bold text-slate-900">{related.name}</h4>
                      <div className="flex items-baseline gap-3 text-slate-900">
                        <span className="text-lg font-bold text-rose-600">₹{related.price}</span>
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

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseZoom}
        >
          <div
            className="relative z-[1250] flex w-full max-w-[860px] flex-col gap-4 rounded-3xl bg-white p-4 sm:p-5 lg:p-6 shadow-2xl border-2 border-rose-100"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-rose-100 pb-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">
                <ZoomIn className="h-4 w-4" />
                Product Detail View
              </div>
              <button
                type="button"
                onClick={handleCloseZoom}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50"
                aria-label="Close zoomed image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center max-h-[70vh]">
              <ResponsiveProductImage
                image={heroImage}
                className="w-full"
                imgClassName="object-contain w-full max-h-[65vh] p-4 sm:p-6"
              />
            </div>
            <div className="text-center text-xs font-medium uppercase tracking-[0.3em] text-rose-600">
              Pinch or scroll to inspect every detail
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WomensHealthPlus;
