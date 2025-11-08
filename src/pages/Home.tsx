import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { KeenSliderInstance } from 'keen-slider';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Truck, Shield, Headphones, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'entering'>('idle');
  const manualResumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const heroSlides = useMemo(() => (
    [
      {
        id: 'winter-sale',
        desktopSrc: '/banners/winter-sale-desktop.jpg',
        mobileSrc: '/banners/winter-sale-mobile.jpg',
        alt: 'Winter sale announcement with Myura wellness product range and 50% discount offer',
      },
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
    }, 5000);

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

  const products = useMemo(() => (
    [
      {
        id: 1,
        name: "Dia Care",
        price: 1190,
        originalPrice: 1499,
        images: [
          '/Final Images/Dia Care/main.png',
          '/Final Images/Dia Care/1.png',
          '/Final Images/Dia Care/3.png',
          '/Final Images/Dia Care/4.png',
        ],
        pedestalColor: 'from-rose-100 via-rose-50 to-white',
        borderClass: 'border-rose-200',
        rating: 5
      },
      {
        id: 2,
        name: "Liver Detox",
        price: 1320,
        originalPrice: 1990,
        images: [
          '/Final Images/Liver Detox/main.png',
          '/Final Images/Liver Detox/1.png',
          '/Final Images/Liver Detox/2.png',
          '/Final Images/Liver Detox/4.png',
        ],
        pedestalColor: 'from-teal-100 via-white to-teal-50',
        borderClass: 'border-emerald-200',
        rating: 5
      },
      {
        id: 3,
        name: "Bones & Joints",
        price: 1299,
        originalPrice: 1499,
        images: [
          '/Final Images/Bons &  Joints/main.png',
          '/Final Images/Bons &  Joints/1.png',
          '/Final Images/Bons &  Joints/3.png',
          '/Final Images/Bons &  Joints/4.png',
        ],
        pedestalColor: 'from-blue-100 via-white to-indigo-50',
        borderClass: 'border-indigo-200',
        rating: 5
      },
      {
        id: 4,
        name: "Gut & Digestion",
        price: 980,
        originalPrice: 1199,
        images: [
          '/Final Images/Gut & Digestions/main.png',
          '/Final Images/Gut & Digestions/1.png',
          '/Final Images/Gut & Digestions/2.png',
          '/Final Images/Gut & Digestions/3.png',
        ],
        pedestalColor: 'from-amber-50 via-white to-emerald-50',
        borderClass: 'border-amber-200',
        rating: 5
      },
      {
        id: 5,
        name: "Women's Health Plus",
        price: 1260,
        originalPrice: 1699,
        images: [
          '/Final Images/Women_s Health Plus/main.png',
          '/Final Images/Women_s Health Plus/2.png',
          '/Final Images/Women_s Health Plus/3.png',
          '/Final Images/Women_s Health Plus/4.png',
        ],
        pedestalColor: 'from-pink-100 via-white to-rose-50',
        borderClass: 'border-rose-200',
        rating: 5
      },
      {
        id: 6,
        name: "Men's Vitality Boost",
        price: 1599,
        originalPrice: 2150,
        images: [
          '/Final Images/Men_s Vitalty Boost/main.jpg',
          '/Final Images/Men_s Vitalty Boost/1.jpg',
          '/Final Images/Men_s Vitalty Boost/2.jpg',
          '/Final Images/Men_s Vitalty Boost/4.jpg',
        ],
        pedestalColor: 'from-slate-100 via-white to-blue-50',
        borderClass: 'border-slate-200',
        rating: 5
      }
    ]
  ), []);

  const [productSliderRef, productSlider] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      renderMode: 'precision',
      drag: true,
      slides: {
        perView: 1.1,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 640px)': {
          slides: {
            perView: 1.6,
            spacing: 20,
          },
        },
        '(min-width: 768px)': {
          slides: {
            perView: 2.2,
            spacing: 24,
          },
        },
        '(min-width: 1024px)': {
          slides: {
            perView: 3.1,
            spacing: 28,
          },
        },
        '(min-width: 1280px)': {
          slides: {
            perView: 3.3,
            spacing: 32,
          },
        },
      },
    },
    [
      (slider: KeenSliderInstance) => {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        let mouseOver = false;

        const clearNextTimeout = () => {
          if (timeout) {
            clearTimeout(timeout);
          }
        };

        const nextTimeout = () => {
          clearNextTimeout();
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 3600);
        };

        slider.on('created', () => {
          slider.container.addEventListener('mouseenter', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseleave', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ]
  );

  const slideToPrevProduct = useCallback(() => {
    productSlider.current?.prev();
  }, [productSlider]);

  const slideToNextProduct = useCallback(() => {
    productSlider.current?.next();
  }, [productSlider]);

  const [productImageIndices, setProductImageIndices] = useState<number[]>(
    () => products.map(() => 0)
  );

  const handleProductImageNav = useCallback(
    (productIndex: number, delta: number) => {
      setProductImageIndices((prev) =>
        prev.map((frameIndex, index) => {
          if (index !== productIndex) return frameIndex;
          const images = products[productIndex].images;
          if (!images.length) return frameIndex;
          const next = (frameIndex + delta + images.length) % images.length;
          return next;
        })
      );
    },
    [products]
  );

  return (
    <>
      <div className="min-h-screen">
      {/* Premium Hero Slider */}
      <section
        className="relative bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-2 sm:pt-4 pb-12 sm:pb-16"
      >
        <div className="w-full mx-auto px-2 sm:px-4 lg:px-5">
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
                  className="absolute inset-0 transition-all duration-[820ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] flex items-center justify-center bg-slate-950"
                  style={{
                    opacity: index === activeSlide ? 1 : 0,
                    transform:
                      index === activeSlide
                        ? transitionStage === 'entering'
                          ? 'translate3d(0,-14px,0) scale(1.022)'
                          : 'translate3d(0,0,0) scale(1)'
                        : 'translate3d(0,22px,0) scale(0.972)',
                    filter: index === activeSlide ? 'brightness(1.08) saturate(1.05)' : 'brightness(0.9) saturate(0.92)',
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
            <div className="space-y-5 sm:space-y-6 text-center lg:text-left" data-aos="fade-up">
              <h1
                className="font-display font-semibold text-slate-900 leading-[1.08] tracking-tight text-2xl sm:text-3xl lg:text-[3rem] xl:text-[3.25rem]"
                data-aos="fade-up"
                data-aos-delay="50"
              >
                <span className="block text-slate-800">Ayurveda. Simplified.</span>
                <span className="block mt-1">
                  <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-slate-900 bg-clip-text text-transparent drop-shadow-[0_12px_32px_rgba(16,185,129,0.18)]">
                    Wellness That Works.
                  </span>
                </span>
              </h1>

              <div className="flex justify-center lg:justify-start" data-aos="fade-up" data-aos-delay="120">
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-slate-800 shadow-[0_10px_30px_rgba(45,212,191,0.35)]"></div>
              </div>

              <p
                className="text-sm sm:text-base lg:text-lg text-slate-700/90 leading-relaxed font-minimal max-w-2xl mx-auto lg:mx-0"
                data-aos="fade-up"
                data-aos-delay="180"
              >
                Thoughtfully made Ayurvedic solutions to energize, restore, and support your natural balance at every stage of life. Your wellness deserves the best.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-4" data-aos="fade-up" data-aos-delay="240">
              <Link
                to="/product"
                className="group relative inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-base font-semibold text-white shadow-[0_24px_48px_-20px_rgba(15,23,42,0.75)] transition-all duration-300 hover:bg-slate-800"
                data-aos="zoom-in"
                data-aos-delay="260"
              >
                <span className="absolute inset-[1px] rounded-full bg-slate-900 blur-[0.5px] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="relative inline-flex items-center gap-2">
                  Shop The Collection
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <button
                type="button"
                onClick={handleNext}
                className="group relative inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-900/15 bg-white/90 px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-base font-semibold text-slate-900 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.65)] backdrop-blur transition-all duration-300 hover:border-emerald-500/60 hover:shadow-[0_28px_50px_-24px_rgba(16,185,129,0.45)]"
                data-aos="zoom-in"
                data-aos-delay="320"
              >
                <span className="absolute inset-[1px] rounded-full bg-gradient-to-r from-white/70 via-white/55 to-emerald-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <span className="relative inline-flex items-center gap-2">
                  Next Highlight
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Text Strip */}
      <section className="relative py-8 sm:py-12">
        <div className="absolute inset-0 bg-[#112c3b]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(87,133,122,0.45),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(164,63,134,0.35),transparent_55%)] opacity-75"></div>
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8" data-aos="zoom-in" data-aos-delay="90">
          <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-white/12 bg-white/10 backdrop-blur-2xl shadow-[0_42px_85px_-40px_rgba(17,44,59,0.85)] px-5 sm:px-8 lg:px-12 py-10 sm:py-12 text-center">
            <div className="absolute -top-10 -left-8 h-28 w-28 rounded-full bg-[#3e8]/22 blur-3xl animate-[softPulse_7s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-[#a43f86]/22 blur-3xl animate-[softPulse_5.5s_ease-in-out_infinite]" style={{ animationDelay: '2.2s' }}></div>
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_60%)] opacity-55"></div>

            <div className="relative flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3.5 py-1 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80" data-aos="fade-up" data-aos-delay="120">
                <Sparkles className="h-4 w-4 text-emerald-200" />
                Signature Ritual
              </div>

              <h2
                className="whitespace-nowrap text-[1.35rem] xs:text-[1.5rem] sm:text-[2.05rem] lg:text-[2.5rem] font-sharp font-semibold leading-tight tracking-[0.002em] text-white drop-shadow-[0_14px_28px_rgba(17,44,59,0.35)] text-center lg:text-left"
                data-aos="fade-up"
                data-aos-delay="160"
              >
                Your Wellness, Our Promise.
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Products Section */}
      <section className="py-20 bg-stone-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12 text-center lg:text-left">
            <div className="w-full text-center lg:text-left">
              <h2 className="relative inline-flex flex-col gap-2 text-[2.45rem] sm:text-[2.85rem] font-display font-semibold tracking-tight leading-tight text-slate-900">
                <span className="absolute inset-x-0 -inset-y-3 rounded-[3rem] bg-gradient-to-r from-emerald-100/70 via-white to-emerald-50/60 blur-2xl"></span>
                <span className="relative z-10">Explore Products</span>
                <span className="relative mx-auto lg:mx-0 h-[3px] w-20 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-slate-900"></span>
              </h2>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={slideToPrevProduct}
                aria-label="Previous product"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:text-slate-900"
              >
                <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>
              <button
                onClick={slideToNextProduct}
                aria-label="Next product"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:text-slate-900"
              >
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <div className="relative" data-aos="fade-up" data-aos-delay="140">
            <div className="absolute inset-y-6 left-0 w-24 bg-gradient-to-r from-stone-50 via-stone-50/90 to-transparent pointer-events-none hidden sm:block rounded-l-3xl"></div>
            <div className="absolute inset-y-6 right-0 w-24 bg-gradient-to-l from-stone-50 via-stone-50/90 to-transparent pointer-events-none hidden sm:block rounded-r-3xl"></div>

            <div ref={productSliderRef} className="keen-slider">
            {products.map((product, productIndex) => (
                <div
                  key={product.id}
                  className="keen-slider__slide"
                >
                  <div
                    className={`group relative h-full overflow-hidden rounded-3xl border-[1.5px] bg-white transition-transform duration-500 ease-out hover:-translate-y-2 ${product.borderClass}`}
                  >
                    <div className={`relative flex flex-col items-center gap-4 p-5 sm:p-6 pb-6 sm:pb-7 rounded-[2.25rem] m-2 sm:m-3 bg-gradient-to-br ${product.pedestalColor}`}>
                      <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/60 bg-white flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleProductImageNav(productIndex, -1);
                          }}
                          className="absolute -left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300"
                          aria-label="Previous product image"
                        >
                          <ChevronLeft className="h-4 w-4 text-slate-700" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleProductImageNav(productIndex, 1);
                          }}
                          className="absolute -right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300"
                          aria-label="Next product image"
                        >
                          <ChevronRight className="h-4 w-4 text-slate-700" />
                        </button>
                        <img
                          key={productImageIndices[productIndex]}
                          src={product.images[productImageIndices[productIndex]]}
                          alt={product.name}
                          className="w-full h-auto max-h-[22rem] object-contain animate-[productFade_1.1s_cubic-bezier(0.22,1,0.36,1)_forwards] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        {product.images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                            {product.images.map((_, imageIndex) => (
                              <button
                                key={imageIndex}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleProductImageNav(
                                    productIndex,
                                    imageIndex - productImageIndices[productIndex]
                                  );
                                }}
                                className={`h-1.5 w-1.5 rounded-full transition ${
                                  productImageIndices[productIndex] === imageIndex
                                    ? 'bg-slate-900'
                                    : 'bg-slate-300 hover:bg-slate-400'
                                }`}
                                aria-label={`Show image ${imageIndex + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-center space-y-1.5">
                        <h3 className="text-lg font-bold text-slate-900 font-sharp">{product.name}</h3>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-bold text-slate-900 font-sharp">₹{product.price}</span>
                        <span className="text-lg text-slate-400 line-through font-minimal">₹{product.originalPrice}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <button className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_26px_48px_-22px_rgba(15,23,42,0.65)] transition-all duration-300 hover:shadow-[0_32px_58px_-22px_rgba(15,23,42,0.75)]">
                          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                          <span className="relative inline-flex items-center gap-2">
                            Add to cart
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </button>
                        <button className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/60 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_20px_42px_-26px_rgba(15,23,42,0.35)] transition-all duration-300 hover:border-slate-400/60 hover:bg-white">
                          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/80 via-white/70 to-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                          <span className="relative inline-flex items-center gap-2">
                            View details
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
              <button
                onClick={slideToPrevProduct}
                aria-label="Previous product"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:text-slate-900"
              >
                <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>
              <button
                onClick={slideToNextProduct}
                aria-label="Next product"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:text-slate-900"
              >
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Guarantees */}
      <section className="py-16 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-left xs:text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 xs:mx-auto">
                <Truck className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2 font-sharp">FREE SHIPPING</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-minimal max-w-xs xs:mx-auto">On all orders above ₹699, No hidden charges</p>
            </div>
            
            <div className="text-left xs:text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 xs:mx-auto">
                <Shield className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2 font-sharp">SECURE PAYMENT</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-minimal max-w-xs xs:mx-auto">Safe & encrypted</p>
            </div>
            
            <div className="text-left xs:text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 xs:mx-auto">
                <CheckCircle className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2 font-sharp">GUARANTEE</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-minimal max-w-xs xs:mx-auto">Easy replacements</p>
            </div>
            
            <div className="text-left xs:text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 xs:mx-auto">
                <Headphones className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2 font-sharp">24/7 SERVICE</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-minimal max-w-xs xs:mx-auto">Need help? Our team is always here to assist you</p>
            </div>
          </div>
        </div>
      </section>

      {/* At Myura Wellness Section */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] gap-10 items-start">
            <div className="relative flex flex-col items-center gap-4 mt-6 sm:mt-8 lg:mt-10" data-aos="zoom-in" data-aos-delay="90" data-aos-duration="650">
              <div className="bg-white rounded-[2rem] shadow-[0_28px_55px_-38px_rgba(15,23,42,0.18)] border border-slate-100/70 overflow-hidden mx-auto max-w-[11.5rem] sm:max-w-[13rem]">
                <div className="absolute inset-0 bg-white"></div>
                <div className="relative flex items-center justify-center">
                  <img
                    src="/wellness.png"
                    alt="Myura wellness illustration"
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5" data-aos="fade-up" data-aos-delay="160">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[1.95rem] sm:text-[2.25rem] font-display font-semibold tracking-tight leading-snug">
                  <span className="bg-gradient-to-r from-[#112c3b] via-[#421335] to-[#537790] bg-clip-text text-transparent">At Myura Wellness</span>
                </h2>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-[0_22px_40px_-18px_rgba(15,23,42,0.55)] transition-all duration-300 hover:bg-slate-800 sm:self-start"
                  data-aos="zoom-in"
                  data-aos-delay="260"
                >
                  EXPLORE PRODUCTS
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed font-premium bg-gradient-to-r from-white via-[#f8fafc] to-white border border-slate-100 rounded-2xl px-4 sm:px-5 py-4 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.25)]">
                We believe true well-being comes from nature. Our thoughtfully crafted Ayurvedic supplements blend ancient wisdom with modern science to help you feel your best, naturally. Experience everyday balance, energy, and restoration.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2.5" data-aos="fade-up" data-aos-delay="200">
                <div className="flex flex-1 items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70 shadow-[0_18px_32px_-30px_rgba(17,44,59,0.3)]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#537790] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-slate-700 font-minimal text-[0.65rem] sm:text-xs">Clean Ingredients</span>
                </div>
                <div className="flex flex-1 items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-br from-[#f9f4fb] to-white border border-slate-100/70 shadow-[0_18px_32px_-30px_rgba(66,19,53,0.3)]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#421335] to-[#a43f86] text-white shadow-[0_10px_18px_rgba(164,63,134,0.3)]">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-slate-700 font-minimal text-[0.65rem] sm:text-xs">Traditionally Trusted Herbs</span>
                </div>
                <div className="flex flex-1 items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-br from-[#f2f9f7] to-white border border-slate-100/70 shadow-[0_18px_32px_-30px_rgba(87,133,122,0.3)]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#57857a] to-[#20396d] text-white shadow-[0_10px_18px_rgba(87,133,122,0.3)]">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-slate-700 font-minimal text-[0.65rem] sm:text-xs">No Harmful Additives</span>
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

    </>
  );
};

export default Home;

