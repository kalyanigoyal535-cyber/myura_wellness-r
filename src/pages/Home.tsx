import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Truck, Shield, Headphones, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'entering'>('idle');
  const manualResumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const heroSlides = useMemo(() => (
    [
      {
        id: 'rethink-wellness-1',
        desktopSrc: '/banners/Banner1Main.webp',
        mobileSrc: '/banners/Banner12.jpg',
        alt: 'Myura wellness collection showcased on stone pedestal against lush mountainscape',
      },
      {
        id: 'rethink-wellness-2',
        desktopSrc: '/banners/BannerImage.png',
        mobileSrc: '/banners/Banner11.jpg',
        alt: 'Myura wellness bottles with premium lighting in sunlit forest ambience',
      },
      {
        id: 'pro-series',
        desktopSrc: '/banners/BannerImage2.jpg',
        mobileSrc: '/banners/BannerImageMobile1.png',
        alt: 'Introducing the Myura Pro Series premium product lineup',
      },
    ]
  ), []);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = setTimeout(() => {
      setTransitionStage('entering');
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [activeSlide, heroSlides.length, isPaused]);

  const pauseAutoplay = useCallback(() => {
    setIsPaused(true);
    if (manualResumeRef.current) {
      clearTimeout(manualResumeRef.current);
    }
  }, []);

  const resumeAutoplay = useCallback(() => {
    if (manualResumeRef.current) {
      clearTimeout(manualResumeRef.current);
    }

    manualResumeRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  }, []);

  const handlePrev = useCallback(() => {
    pauseAutoplay();
    setTransitionStage('entering');
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    resumeAutoplay();
  }, [heroSlides.length, pauseAutoplay, resumeAutoplay]);

  const handleNext = useCallback(() => {
    pauseAutoplay();
    setTransitionStage('entering');
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    resumeAutoplay();
  }, [heroSlides.length, pauseAutoplay, resumeAutoplay]);

  const handleDotClick = useCallback((index: number) => {
    pauseAutoplay();
    setTransitionStage('entering');
    setActiveSlide(index);
    resumeAutoplay();
  }, [pauseAutoplay, resumeAutoplay]);

  useEffect(() => {
    return () => {
      if (manualResumeRef.current) {
        clearTimeout(manualResumeRef.current);
      }
    };
  }, []);

  const products = [
    {
      id: 1,
      name: "DIA CARE",
      price: 799,
      originalPrice: 999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-purple-500",
      rating: 5
    },
    {
      id: 2,
      name: "LIVER DETOX FORMULA",
      price: 699,
      originalPrice: 999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-teal-500",
      rating: 5
    },
    {
      id: 3,
      name: "BONE & JOINT SUPPORT",
      price: 4543,
      originalPrice: 5999,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-blue-600",
      rating: 5
    },
    {
      id: 4,
      name: "GUT AND DIGESTION",
      price: 999,
      originalPrice: 1299,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-amber-600",
      rating: 5
    },
    {
      id: 5,
      name: "WOMEN'S HEALTH PLUS",
      price: 499,
      originalPrice: 699,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-pink-500",
      rating: 5
    },
    {
      id: 6,
      name: "MEN'S VITALITY BOOSTER",
      price: 899,
      originalPrice: 1199,
      image: "/api/placeholder/200/200",
      pedestalColor: "bg-blue-800",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Premium Hero Slider */}
      <section
        className="relative bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-2 sm:pt-4 pb-12 sm:pb-16"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-5">
          <div
            className="relative overflow-hidden rounded-3xl shadow-[0_40px_120px_-40px_rgba(15,23,42,0.6)] ring-1 ring-white/10 bg-slate-900/60"
            role="region"
            aria-label="Featured wellness collections"
            aria-roledescription="carousel"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                handleNext();
              }
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                handlePrev();
              }
            }}
          >
            <div className="relative h-[460px] xs:h-[520px] sm:h-[580px] lg:h-[72vh] xl:h-[78vh] 2xl:h-[84vh]">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] flex items-center justify-center bg-slate-950"
                  style={{
                    opacity: index === activeSlide ? 1 : 0,
                    transform: index === activeSlide
                      ? transitionStage === 'entering'
                        ? 'scale(1) translateY(0)'
                        : 'scale(1) translateY(0)'
                      : 'scale(1.08) translateY(18px)',
                    filter: index === activeSlide ? 'brightness(1.15)' : 'brightness(0.92)',
                  }}
                  onTransitionEnd={() => {
                    if (index === activeSlide) {
                      setTransitionStage('idle');
                    }
                  }}
                  aria-hidden={index !== activeSlide}
                >
                  <picture>
                    <source media="(min-width: 768px)" srcSet={slide.desktopSrc} />
                    <img
                      src={slide.mobileSrc}
                      alt={slide.alt}
                      className="w-full h-full object-cover xl:object-contain object-center"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>
                </div>
              ))}

              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/25 via-slate-900/10 to-slate-950/40 pointer-events-none mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,210,189,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(147,197,253,0.12),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(244,114,182,0.1),transparent_55%)]"></div>
              <div className="absolute -top-24 sm:-top-32 lg:-top-40 right-10 sm:right-16 w-52 sm:w-64 lg:w-72 h-52 sm:h-64 lg:h-72 bg-emerald-400/18 blur-[120px] rounded-full animate-[softPulse_6s_ease-in-out_infinite]"></div>
              <div className="absolute top-16 sm:top-20 left-6 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-300/12 rounded-full blur-3xl animate-[floatParticle_12s_linear_infinite]" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-20 sm:bottom-24 right-8 sm:right-12 w-32 sm:w-40 h-32 sm:h-40 bg-teal-200/12 rounded-full blur-3xl animate-[floatParticle_14s_linear_infinite]" style={{ animationDelay: '2s' }}></div>
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_45%,rgba(255,255,255,0)_55%,rgba(255,255,255,0.1)_100%)] animate-[shimmer_5s_linear_infinite] opacity-0.5 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>

              <div className="absolute inset-x-6 sm:inset-x-8 lg:inset-x-10 top-6 sm:top-8 flex items-center justify-between text-white/90">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
                    Premium Wellness
                  </span>
                  <span className="hidden sm:inline-flex h-px w-12 sm:w-16 bg-gradient-to-r from-white/30 to-transparent"></span>
                  <span className="hidden sm:inline text-xs font-medium text-white/70">
                    Curated visuals from the Myura collection
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-all duration-300 text-white backdrop-blur border border-white/10 shadow-[0_12px_30px_-12px_rgba(255,255,255,0.45)]"
                    aria-label="Show previous banner"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-all duration-300 text-white backdrop-blur border border-white/10 shadow-[0_12px_30px_-12px_rgba(255,255,255,0.45)]"
                    aria-label="Show next banner"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-6 sm:bottom-8 flex justify-center">
                <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur border border-white/15 pointer-events-auto">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => handleDotClick(index)}
                      className={`relative h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out ${
                        index === activeSlide
                          ? 'w-6 sm:w-8 bg-white shadow-[0_10px_30px_rgba(255,255,255,0.35)]'
                          : 'w-2.5 sm:w-3 bg-white/40 hover:bg-white/70'
                      }`}
                    >
                      <span className="sr-only">Go to banner {index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-6 sm:space-y-7 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight font-display">
                Rethink Daily Wellness
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-minimal max-w-2xl mx-auto lg:mx-0">
                Sustainable. Smart. Simple. Discover premium Ayurvedic nutrition designed for modern rhythms, crafted to help you feel energised, balanced, and truly well.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 sm:gap-4">
              <Link
                to="/product"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.6)] transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.65)] font-sharp"
              >
                Shop The Collection
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-900/15 bg-white px-6 py-3 text-sm sm:text-base font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:border-slate-900/40 hover:shadow-lg font-sharp"
              >
                Next Highlight
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Text Strip */}
      <section className="py-8 bg-gradient-to-r from-stone-100 via-neutral-50 to-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-slate-700 font-minimal">
            Ayurvedic wellness made simple. Myura offers honest, natural supplements for daily vitality, balance, and better living—no shortcuts, just nature.
          </p>
        </div>
      </section>

      {/* At Myura Wellness Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">MYURA</h3>
                  <p className="text-slate-600 font-minimal">Women's Health Plus</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900 font-display">At Myura Wellness</h2>
              <p className="text-lg text-slate-700 leading-relaxed font-minimal">
                We believe in the power of nature to heal, restore, and energize. Our carefully crafted supplements blend ancient Ayurvedic wisdom with modern science to bring you the best of both worlds.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-slate-900" />
                  <span className="text-slate-700 font-minimal">Clean Ingredients</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-slate-900" />
                  <span className="text-slate-700 font-minimal">Traditionally Trusted Herbs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-slate-900" />
                  <span className="text-slate-700 font-minimal">No Harmful Additives</span>
                </div>
              </div>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors font-sharp"
              >
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Products Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display">EXPLORE PRODUCTS</h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto font-minimal">
              Pure, effective, and made for you - explore the MYURA collection for everyday health and vitality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative mb-6">
                  <div className={`w-24 h-24 ${product.pedestalColor} rounded-full mx-auto flex items-center justify-center mb-4`}>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-500 mb-1 font-minimal">MYURA</p>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 font-sharp">{product.name}</h3>
                    <div className="flex justify-center space-x-1 mb-3">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="flex justify-center items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-slate-900 font-sharp">₹{product.price}</span>
                      <span className="text-lg text-slate-400 line-through font-minimal">₹{product.originalPrice}</span>
                    </div>
                    <button className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors font-sharp">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Guarantees */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-sharp">FREE SHIPPING</h3>
              <p className="text-sm text-slate-600 font-minimal">On all orders above ₹699, No hidden charges</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-sharp">SECURE PAYMENT</h3>
              <p className="text-sm text-slate-600 font-minimal">Safe & encrypted</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-sharp">GUARANTEE</h3>
              <p className="text-sm text-slate-600 font-minimal">Easy replacements</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-sharp">24/7 SERVICE</h3>
              <p className="text-sm text-slate-600 font-minimal">Need help? Our team is always here to assist you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your best health is waiting section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">MYURA</h3>
                  <p className="text-slate-600 font-minimal">DIA CARE</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-sm text-slate-700 font-medium font-sharp">Discover now Magical benefits of nature.</p>
              <h2 className="text-4xl font-bold text-slate-900 font-display">Your best health is waiting - are you?</h2>
              <p className="text-lg text-slate-700 leading-relaxed font-minimal">
                Experience the power of carefully selected herbs and botanicals that have been used for centuries in Ayurvedic medicine. Our products are designed to work with your body's natural processes, providing gentle yet effective support for your wellness journey.
              </p>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors font-sharp"
              >
                Explore Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Awaken Your Energy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900 font-display">Awaken Your Energy</h2>
              <p className="text-xl text-slate-700 font-medium font-sharp">Nature's Pure Power In Every Bite</p>
              <p className="text-lg text-slate-700 leading-relaxed font-minimal">
                Our microgreens are harvested at peak freshness to deliver maximum nutritional value. Packed with enzymes, antioxidants, and live nutrients that your body thrives on.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-slate-900" />
                  <span className="text-slate-700 font-minimal">Harvested at peak freshness for maximum potency</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-slate-900" />
                  <span className="text-slate-700 font-minimal">Packed with enzymes, antioxidants & live nutrients your body thrives on</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-slate-900" />
                  <span className="text-slate-700 font-minimal">Zero chemicals, 100% purity - inspired by ancient nourishment rituals</span>
                </div>
              </div>
              <Link
                to="/product"
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors font-sharp"
              >
                Explore Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">Microgreens</h3>
                  <p className="text-slate-600 font-minimal">Nature's Superfood</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                </div>
                <p className="text-lg font-semibold font-sharp">Watch Our Story</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

