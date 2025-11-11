import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { KeenSliderInstance } from 'keen-slider';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Truck, Shield, Headphones, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ResponsiveProductImage, { type ResponsiveImageDescriptor } from '../components/ResponsiveProductImage';

const PRODUCT_IMAGE_WIDTHS = [320, 640, 960] as const;

type ProductDefinition = {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  folder: string;
  pedestalColor: string;
  borderClass: string;
  rating: number;
  imageFiles: string[];
  discountPercent: number;
  priceTagClass: string;
};

type Product = Omit<ProductDefinition, 'folder' | 'imageFiles'> & {
  images: ResponsiveImageDescriptor[];
};

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

  const products = useMemo<Product[]>(() => {
    const baseProducts: ProductDefinition[] = [
      {
        id: 1,
        name: "Dia Care",
        price: 1190,
        originalPrice: 1499,
        pedestalColor: 'from-rose-100 via-rose-50 to-white',
        priceTagClass: 'from-rose-200/80 via-rose-100/75 to-white/70',
        borderClass: 'border-rose-200',
        rating: 5,
        folder: 'Dia Care',
        imageFiles: ['main.png', '1.png', '3.png', '4.png'],
        discountPercent: Math.round(((1499 - 1190) / 1499) * 100),
      },
      {
        id: 2,
        name: "Liver Detox",
        price: 1320,
        originalPrice: 1990,
        pedestalColor: 'from-teal-100 via-white to-teal-50',
        priceTagClass: 'from-emerald-200/80 via-emerald-100/75 to-white/70',
        borderClass: 'border-emerald-200',
        rating: 5,
        folder: 'Liver Detox',
        imageFiles: ['main.png', '1.png', '2.png', '4.png'],
        discountPercent: Math.round(((1990 - 1320) / 1990) * 100),
      },
      {
        id: 3,
        name: "Bones & Joints",
        price: 1299,
        originalPrice: 1499,
        pedestalColor: 'from-blue-100 via-white to-indigo-50',
        priceTagClass: 'from-indigo-200/80 via-indigo-100/75 to-white/70',
        borderClass: 'border-indigo-200',
        rating: 5,
        folder: 'Bons &  Joints',
        imageFiles: ['main.png', '1.png', '3.png', '4.png'],
        discountPercent: Math.round(((1499 - 1299) / 1499) * 100),
      },
      {
        id: 4,
        name: "Gut & Digestion",
        price: 980,
        originalPrice: 1199,
        pedestalColor: 'from-amber-50 via-white to-emerald-50',
        priceTagClass: 'from-amber-200/80 via-amber-100/75 to-white/70',
        borderClass: 'border-amber-200',
        rating: 5,
        folder: 'Gut & Digestions',
        imageFiles: ['main.png', '1.png', '2.png', '3.png'],
        discountPercent: Math.round(((1199 - 980) / 1199) * 100),
      },
      {
        id: 5,
        name: "Women's Health Plus",
        price: 1260,
        originalPrice: 1699,
        pedestalColor: 'from-pink-100 via-white to-rose-50',
        priceTagClass: 'from-pink-200/80 via-rose-100/75 to-white/70',
        borderClass: 'border-rose-200',
        rating: 5,
        folder: "Women_s Health Plus",
        imageFiles: ['main.png', '2.png', '3.png', '4.png'],
        discountPercent: Math.round(((1699 - 1260) / 1699) * 100),
      },
      {
        id: 6,
        name: "Men's Vitality Boost",
        price: 1599,
        originalPrice: 2150,
        pedestalColor: 'from-slate-100 via-white to-blue-50',
        priceTagClass: 'from-slate-200/80 via-slate-100/75 to-white/70',
        borderClass: 'border-slate-200',
        rating: 5,
        folder: "Men_s Vitalty Boost",
        imageFiles: ['main.jpg', '1.jpg', '2.jpg', '4.jpg'],
        discountPercent: Math.round(((2150 - 1599) / 2150) * 100),
      },
    ];

    const buildImageDescriptor = (folder: string, fileName: string, alt: string): ResponsiveImageDescriptor => {
      const fileExtIndex = fileName.lastIndexOf('.');
      const baseName = fileExtIndex >= 0 ? fileName.slice(0, fileExtIndex) : fileName;
      const fallback = `/Final Images/${folder}/${fileName}`;
      const optimizedBasePath = `/Final Images/${folder}/optimized/${baseName}`;

      const avifSrcSet = PRODUCT_IMAGE_WIDTHS.map((width) => `${optimizedBasePath}-${width}w.avif ${width}w`).join(', ');
      const webpSrcSet = PRODUCT_IMAGE_WIDTHS.map((width) => `${optimizedBasePath}-${width}w.webp ${width}w`).join(', ');

      return {
        alt,
        fallback,
        placeholder: `${optimizedBasePath}-placeholder.jpg`,
        width: 400,
        height: 400,
        sources: [
          { type: 'image/avif', srcSet: avifSrcSet },
          { type: 'image/webp', srcSet: webpSrcSet },
        ],
      };
    };

    return baseProducts.map(({ imageFiles, folder, priceTagClass, originalPrice, price, ...rest }) => ({
      ...rest,
      priceTagClass,
      originalPrice,
      price,
      discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
      images: imageFiles.map((fileName, index) =>
        buildImageDescriptor(folder, fileName, `${rest.name} product image ${index + 1}`)
      ),
    }));
  }, []);

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
                      className="w-full h-full object-cover object-center"
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
              {products.map((product, productIndex) => {
                const currentImage =
                  product.images[productImageIndices[productIndex]] ?? product.images[0];

                if (!currentImage) {
                  return null;
                }

                return (
                  <div
                    key={product.id}
                    className="keen-slider__slide"
                  >
                    <div
                      className={`group relative h-full overflow-hidden rounded-3xl border-[1.5px] bg-white transition-transform duration-500 ease-out hover:-translate-y-2 ${product.borderClass}`}
                    >
                      <div className="pointer-events-none absolute right-5 top-3 z-30">
                        <div className="relative">
                          <div className="absolute -right-2 top-1 h-2 w-2 rounded-full bg-amber-300 shadow-[0_6px_12px_rgba(234,179,8,0.35)]" />
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-900 shadow-[0_14px_28px_-18px_rgba(251,191,36,0.65)] ring-1 ring-amber-200/70">
                            Sale
                          </span>
                          <div className="absolute -bottom-1 right-0 h-3 w-3 rotate-45 rounded-sm bg-amber-200" />
                        </div>
                      </div>
                      <div className={`relative flex flex-col items-center gap-4 p-5 sm:p-6 pb-6 sm:pb-7 rounded-[2.25rem] m-2 sm:m-3 bg-gradient-to-br ${product.pedestalColor}`}>
                        <div className="relative w-full">
                          <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white">
                            <ResponsiveProductImage
                              key={`${product.id}-${productImageIndices[productIndex]}`}
                              image={currentImage}
                              className="w-full"
                              imgClassName="w-full h-full object-cover animate-[productFade_1.1s_cubic-bezier(0.22,1,0.36,1)_forwards] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                            />
                          </div>
                          {product.images.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleProductImageNav(productIndex, -1);
                                }}
                                className="absolute -left-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300"
                                aria-label={`Show previous ${product.name} image`}
                              >
                                <ChevronLeft className="h-4 w-4 text-slate-700" />
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleProductImageNav(productIndex, 1);
                                }}
                                className="absolute -right-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300"
                                aria-label={`Show next ${product.name} image`}
                              >
                                <ChevronRight className="h-4 w-4 text-slate-700" />
                              </button>
                            </>
                          )}
                        </div>
                        <div className="flex w-full flex-col gap-3 text-center sm:text-left">
                          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="w-full sm:w-auto">
                              <span className="inline-flex w-full items-center justify-center sm:justify-start rounded-full border border-white/60 bg-white/90 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.45)]">
                                {product.name}
                              </span>
                            </h3>
                            {product.images.length > 1 && (
                              <div className="flex items-center justify-center gap-1.5">
                                {product.images.map((image, imageIndex) => (
                                  <button
                                    key={`${product.id}-${imageIndex}`}
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
                                    aria-label={`Show ${product.name} image ${imageIndex + 1}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                          <div
                            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.25)] bg-gradient-to-r ${product.priceTagClass}`}
                          >
                            <span className="inline-flex items-center justify-center rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-900">
                              Deal
                            </span>
                            <span className="font-display text-[1.35rem] font-semibold tracking-tight text-slate-900 drop-shadow-sm">
                              ₹{product.price}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                            Save {product.discountPercent}%
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            MRP ₹{product.originalPrice}
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-2 w-full">
                          <button className="group relative inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_36px_-18px_rgba(15,23,42,0.55)] transition-all duration-300 hover:shadow-[0_24px_44px_-18px_rgba(15,23,42,0.65)] max-w-[220px] whitespace-nowrap">
                            <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                            <span className="relative inline-flex items-center gap-2">
                              Add to cart
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                          </button>
                          <button className="group relative inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200/60 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 shadow-[0_18px_36px_-20px_rgba(15,23,42,0.3)] transition-all duration-300 hover:border-slate-400/60 hover:bg-white max-w-[220px] whitespace-nowrap">
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
                );
              })}
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
      <section className="relative py-14 sm:py-16 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-emerald-100/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-20 right-24 h-40 w-40 rounded-full bg-emerald-200/20 blur-[100px]" />
        <div className="absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-sky-200/25 blur-[90px]" />
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/70 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700 shadow-[0_16px_40px_-34px_rgba(16,185,129,0.65)]">
              Myura Advantages
            </span>
            <h2 className="mt-3 text-xl sm:text-2xl font-display font-semibold text-slate-900">
              Concierge Care For Every Order
            </h2>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                id: 'shipping',
                label: 'Free Shipping',
                sublabel: '₹699+ orders',
                icon: Truck,
                halo: 'from-emerald-400/70 to-emerald-500/40',
                ring: 'ring-emerald-200/60',
              },
              {
                id: 'secure',
                label: 'Secure Payment',
                sublabel: '256-bit',
                icon: Shield,
                halo: 'from-sky-400/70 to-blue-500/40',
                ring: 'ring-sky-200/60',
              },
              {
                id: 'guarantee',
                label: '30-Day Guarantee',
                sublabel: 'Easy exchange',
                icon: CheckCircle,
                halo: 'from-amber-400/70 to-amber-500/40',
                ring: 'ring-amber-200/60',
              },
              {
                id: 'support',
                label: '24/7 Support',
                sublabel: 'Concierge help',
                icon: Headphones,
                halo: 'from-rose-400/70 to-rose-500/40',
                ring: 'ring-rose-200/60',
              },
            ].map(({ id, label, sublabel, icon: Icon, halo, ring }, index) => (
              <div
                key={id}
                className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/[0.9] shadow-[0_20px_55px_-42px_rgba(15,23,42,0.28)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-48px_rgba(15,23,42,0.38)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex flex-col gap-3 p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${halo} ring-4 ${ring} shadow-[0_18px_28px_-18px_rgba(16,185,129,0.35)] transition-transform duration-500 group-hover:scale-105`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400/80">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-base font-semibold text-slate-900 font-sharp">
                      {label}
                    </h3>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{sublabel}</p>
                  </div>
                </div>
                <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-emerald-200/35 blur-[70px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2.5" data-aos="fade-up" data-aos-delay="200">
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f3f6f8] to-white border border-slate-100/70 shadow-[0_18px_32px_-30px_rgba(17,44,59,0.3)] px-3 py-2 sm:px-4">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#112c3b] to-[#537790] text-white shadow-[0_10px_18px_rgba(17,44,59,0.3)]">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">Clean Ingredients</span>
                </div>
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f9f4fb] to-white border border-slate-100/70 shadow-[0_18px_32px_-30px_rgba(66,19,53,0.3)] px-3 py-2 sm:px-4">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#421335] to-[#a43f86] text-white shadow-[0_10px_18px_rgba(164,63,134,0.3)]">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">Traditionally Trusted Herbs</span>
                </div>
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#f2f9f7] to-white border border-slate-100/70 shadow-[0_18px_32px_-30px_rgba(87,133,122,0.3)] px-3 py-2 sm:px-4">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#57857a] to-[#20396d] text-white shadow-[0_10px_18px_rgba(87,133,122,0.3)]">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="text-slate-700 font-minimal text-[0.6rem] sm:text-xs">No Harmful Additives</span>
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

