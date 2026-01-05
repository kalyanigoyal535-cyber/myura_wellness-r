import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { KeenSliderInstance } from "keen-slider";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  Truck,
  Shield,
  Headphones,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import ResponsiveProductImage, {
  type ResponsiveImageDescriptor,
} from "../components/ResponsiveProductImage";
import { useCart } from "../context/CartContext";
import AboutMyuraWellness from "@/components/aboutMyuraWellness/AboutMyuraWellness";
// import VideoSectionAboutPage from "@/components/videoSectionAboutPage";
import VideoSectionAboutPage from "@/components/VideoSectionAboutPage";

const PRODUCT_IMAGE_WIDTHS = [320, 640, 960] as const;

type SpotlightCalloutPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

type ProductSpotlight = {
  image: string;
  badge?: string;
  headline: string;
  subheadline?: string;
  highlights: string[];
  accentGradient?: string;
  chipClassName?: string;
  glowClassName?: string;
  callouts?: Array<{
    text: string;
    position: SpotlightCalloutPosition;
  }>;
  calloutClassName?: string;
  showActions?: boolean;
};

type ProductDefinition = {
  id: number;
  slug: string;
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
  spotlight: ProductSpotlight;
};

export type Product = Omit<ProductDefinition, "folder" | "imageFiles"> & {
  images: ResponsiveImageDescriptor[];
};

const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitionStage, setTransitionStage] = useState<"idle" | "entering">(
    "idle"
  );
  const manualResumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [productImageIndices, setProductImageIndices] = useState<number[]>(() =>
    new Array(6).fill(0)
  );
  const [proSeriesImageIndices, setProSeriesImageIndices] = useState<number[]>(
    () => new Array(4).fill(0)
  );



  const heroSlides = useMemo(
    () => [
      {
        id: "rethink-wellness-1",
        desktopSrc: "/banners/Banner1Main.webp",
        mobileSrc: "/banners/Banner12.jpg",
        alt: "Myura wellness collection showcased on stone pedestal against lush mountainscape",
      },
      {
        id: "rethink-wellness-2",
        desktopSrc: "/banners/BannerImage.png",
        mobileSrc: "/banners/Banner11.jpg",
        alt: "Myura wellness bottles with premium lighting in sunlit forest ambience",
      },
      {
        id: "pro-series",
        desktopSrc: "/banners/BannerImage2.jpg",
        mobileSrc: "/banners/BannerImageMobile1.png",
        alt: "Introducing the Myura Pro Series premium product lineup",
      },
      {
        id: "serene-nights",
        desktopSrc: "/banners/desktop1.png",
        mobileSrc: "/banners/mobile1.png",
        alt: "Calming Myura supplement display with moonlit sky promoting restful sleep",
      },
      {
        id: "radiant-morning",
        desktopSrc: "/banners/desktop2.png",
        mobileSrc: "/banners/mobile2.png",
        alt: "Bright morning scene featuring Myura immunity boosters with citrus accents",
      },
      {
        id: "urban-energize",
        desktopSrc: "/banners/desktop3.png",
        mobileSrc: "/banners/mobile3.png",
        alt: "Dynamic city-inspired Myura wellness lineup highlighting active lifestyle support",
      },
    ],
    []
  );

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = setTimeout(() => {
      setTransitionStage("entering");
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
    setTransitionStage("entering");
    setActiveSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    resumeAutoplay();
  }, [heroSlides.length, pauseAutoplay, resumeAutoplay]);

  const handleNext = useCallback(() => {
    pauseAutoplay();
    setTransitionStage("entering");
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    resumeAutoplay();
  }, [heroSlides.length, pauseAutoplay, resumeAutoplay]);

  const handleDotClick = useCallback(
    (index: number) => {
      pauseAutoplay();
      setTransitionStage("entering");
      setActiveSlide(index);
      resumeAutoplay();
    },
    [pauseAutoplay, resumeAutoplay]
  );

  useEffect(() => {
    return () => {
      if (manualResumeRef.current) {
        clearTimeout(manualResumeRef.current);
      }
    };
  }, []);

  const { addItem } = useCart();
  const [addingProduct, setAddingProduct] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);

  const products = useMemo<Product[]>(() => {
    const baseProducts: ProductDefinition[] = [
      {
        id: 1,
        slug: "dia-care",
        name: "Dia Care",
        price: 1190,
        originalPrice: 1499,
        pedestalColor: "from-rose-100 via-rose-50 to-white",
        priceTagClass: "from-rose-200/80 via-rose-100/75 to-white/70",
        borderClass: "border-rose-200",
        rating: 5,
        folder: "Dia Care",
        imageFiles: ["main.png", "1.png", "3.png", "4.png"],
        discountPercent: Math.round(((1499 - 1190) / 1499) * 100),
        spotlight: {
          image: "/products/DiaCare/main.png",
          badge: "New",
          headline: "Your Daily Wellness Companion",
          subheadline: "Experience the power of Ayurveda in every bottle",
          highlights: [
            "Natural ingredients",
            "No artificial colors",
            "Easy to digest",
          ],
          accentGradient: "from-rose-500/50 to-rose-400/50",
          chipClassName: "bg-rose-100/70 text-rose-800",
          glowClassName: "glow-rose",
          callouts: [
            { text: "100% Natural", position: "top-left" },
            { text: "No Artificial Colors", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
      {
        id: 2,
        slug: "liver-detox",
        name: "Liver Detox",
        price: 1320,
        originalPrice: 1990,
        pedestalColor: "from-teal-100 via-white to-teal-50",
        priceTagClass: "from-emerald-200/80 via-emerald-100/75 to-white/70",
        borderClass: "border-emerald-200",
        rating: 5,
        folder: "Liver Detox",
        imageFiles: ["main.png", "1.png", "2.png", "4.png"],
        discountPercent: Math.round(((1990 - 1320) / 1990) * 100),
        spotlight: {
          image: "/products/LiverDetox/main.png",
          headline: "Detoxify Your Body",
          subheadline: "Support your liver with powerful Ayurvedic herbs",
          highlights: ["Herbal detox", "Improved digestion", "Better skin"],
          accentGradient: "from-teal-500/50 to-teal-400/50",
          chipClassName: "bg-teal-100/70 text-teal-800",
          glowClassName: "glow-teal",
          callouts: [
            { text: "Herbal Detox", position: "top-left" },
            { text: "Improved Digestion", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
      {
        id: 3,
        slug: "bone-joint-support",
        name: "Bones & Joints",
        price: 1299,
        originalPrice: 1499,
        pedestalColor: "from-blue-100 via-white to-indigo-50",
        priceTagClass: "from-indigo-200/80 via-indigo-100/75 to-white/70",
        borderClass: "border-indigo-200",
        rating: 5,
        folder: "Bons &  Joints",
        imageFiles: ["main.png", "1.png", "3.png", "4.png"],
        discountPercent: Math.round(((1499 - 1299) / 1499) * 100),
        spotlight: {
          image: "/products/BonesJoints/main.png",
          headline: "Stronger Bones, Better Joints",
          subheadline: "Support your skeletal system with Ayurvedic remedies",
          highlights: ["Bone health", "Joint support", "Anti-inflammatory"],
          accentGradient: "from-indigo-500/50 to-indigo-400/50",
          chipClassName: "bg-indigo-100/70 text-indigo-800",
          glowClassName: "glow-indigo",
          callouts: [
            { text: "Bone Health", position: "top-left" },
            { text: "Joint Support", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
      {
        id: 4,
        slug: "gut-and-digestion",
        name: "Gut & Digestion",
        price: 980,
        originalPrice: 1199,
        pedestalColor: "from-amber-50 via-white to-emerald-50",
        priceTagClass: "from-amber-200/80 via-amber-100/75 to-white/70",
        borderClass: "border-amber-200",
        rating: 5,
        folder: "Gut & Digestions",
        imageFiles: ["main.png", "1.png", "2.png", "3.png"],
        discountPercent: Math.round(((1199 - 980) / 1199) * 100),
        spotlight: {
          image: "/products/GutDigestion/main.png",
          headline: "Healthy Gut, Happy Life",
          subheadline: "Support your digestive system with natural remedies",
          highlights: [
            "Digestive health",
            "Better absorption",
            "Anti-inflammatory",
          ],
          accentGradient: "from-amber-500/50 to-amber-400/50",
          chipClassName: "bg-amber-100/70 text-amber-800",
          glowClassName: "glow-amber",
          callouts: [
            { text: "Digestive Health", position: "top-left" },
            { text: "Better Absorption", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
      {
        id: 5,
        slug: "womens-health-plus",
        name: "Women's Health Plus",
        price: 1260,
        originalPrice: 1699,
        pedestalColor: "from-pink-100 via-white to-rose-50",
        priceTagClass: "from-pink-200/80 via-rose-100/75 to-white/70",
        borderClass: "border-rose-200",
        rating: 5,
        folder: "Women_s Health Plus",
        imageFiles: ["main.png", "2.png", "3.png", "4.png"],
        discountPercent: Math.round(((1699 - 1260) / 1699) * 100),
        spotlight: {
          image: "/spotlights/womens-health-plus-hand.png",
          headline: "TIRED OF THE IMBALANCE?",
          highlights: [
            "Irregular periods & PMS discomfort",
            "Unexplained fatigue & low energy",
            "Hormonal stress and mood swings",
            "You deserve holistic wellness",
          ],
          accentGradient: "from-pink-500 via-rose-500 to-pink-400",
          chipClassName: "bg-pink-50 border border-pink-200 text-pink-600",
          glowClassName: "bg-pink-400/35",
          callouts: [
            {
              text: "Irregular periods & PMS discomfort",
              position: "top-left",
            },
            {
              text: "Unexplained fatigue & low energy",
              position: "bottom-right",
            },
          ],
          showActions: true,
        },
      },
      {
        id: 6,
        slug: "mens-vitality-booster",
        name: "Men's Vitality Boost",
        price: 1599,
        originalPrice: 2150,
        pedestalColor: "from-slate-100 via-white to-blue-50",
        priceTagClass: "from-slate-200/80 via-slate-100/75 to-white/70",
        borderClass: "border-slate-200",
        rating: 5,
        folder: "Men_s Vitalty Boost",
        imageFiles: ["main.jpg", "1.jpg", "2.jpg", "4.jpg"],
        discountPercent: Math.round(((2150 - 1599) / 2150) * 100),
        spotlight: {
          image: "/products/MensVitalityBoost/main.jpg",
          headline: "Your Natural Energy Source",
          subheadline: "Support your vitality with Ayurvedic herbs",
          highlights: ["Energy boost", "Immune support", "Anti-inflammatory"],
          accentGradient: "from-slate-500/50 to-slate-400/50",
          chipClassName: "bg-slate-100/70 text-slate-800",
          glowClassName: "glow-slate",
          callouts: [
            { text: "Energy Boost", position: "top-left" },
            { text: "Immune Support", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
    ];

    const buildImageDescriptor = (
      folder: string,
      fileName: string,
      alt: string
    ): ResponsiveImageDescriptor => {
      const fileExtIndex = fileName.lastIndexOf(".");
      const baseName =
        fileExtIndex >= 0 ? fileName.slice(0, fileExtIndex) : fileName;
      const fallback = `/Final Images/${folder}/${fileName}`;
      const optimizedBasePath = `/Final Images/${folder}/optimized/${baseName}`;

      const avifSrcSet = PRODUCT_IMAGE_WIDTHS.map(
        (width) => `${optimizedBasePath}-${width}w.avif ${width}w`
      ).join(", ");
      const webpSrcSet = PRODUCT_IMAGE_WIDTHS.map(
        (width) => `${optimizedBasePath}-${width}w.webp ${width}w`
      ).join(", ");

      return {
        alt,
        fallback,
        placeholder: `${optimizedBasePath}-placeholder.jpg`,
        width: 400,
        height: 400,
        sources: [
          { type: "image/avif", srcSet: avifSrcSet },
          { type: "image/webp", srcSet: webpSrcSet },
        ],
      };
    };

    return baseProducts.map(
      ({
        imageFiles,
        folder,
        priceTagClass,
        originalPrice,
        price,
        ...rest
      }) => ({
        ...rest,
        priceTagClass,
        originalPrice,
        price,
        discountPercent: Math.round(
          ((originalPrice - price) / originalPrice) * 100
        ),
        images: imageFiles.map((fileName, index) =>
          buildImageDescriptor(
            folder,
            fileName,
            `${rest.name} product image ${index + 1}`
          )
        ),
      })
    );
  }, []);

  const proSeriesProducts = useMemo<Product[]>(() => {
    const baseProSeriesProducts: ProductDefinition[] = [
      {
        id: 101,
        slug: "pro-omega-3-softgel-capsules",
        name: "PRO OMEGA-3 SOFTGEL CAPSULES",
        price: 1199,
        originalPrice: 1599,
        pedestalColor: "from-amber-100 via-white to-yellow-50",
        priceTagClass: "from-amber-200/80 via-yellow-100/75 to-white/70",
        borderClass: "border-amber-200",
        rating: 5,
        folder: "ProSeries/PRO OMEGA-3 SOFTGEL CAPSULES",
        imageFiles: ["main.png", "1.png", "2.png", "4.png"],
        discountPercent: Math.round(((1599 - 1199) / 1599) * 100),
        spotlight: {
          image:
            "/Final Images/ProSeries/PRO OMEGA-3 SOFTGEL CAPSULES/main.png",
          badge: "ProSeries",
          headline: "Premium Omega-3 Support",
          subheadline: "Advanced softgel formulation for optimal health",
          highlights: ["High potency", "Premium quality", "Easy absorption"],
          accentGradient: "from-amber-500/50 to-yellow-400/50",
          chipClassName: "bg-amber-100/70 text-amber-800",
          glowClassName: "glow-amber",
          callouts: [
            { text: "Premium Quality", position: "top-left" },
            { text: "High Potency", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
      {
        id: 102,
        slug: "pro-mens-vitality-booster-gold",
        name: "PRO MEN'S VITALITY BOOSTER GOLD",
        price: 2499,
        originalPrice: 3799,
        pedestalColor: "from-amber-100 via-white to-yellow-50",
        priceTagClass: "from-amber-200/80 via-yellow-100/75 to-white/70",
        borderClass: "border-amber-200",
        rating: 5,
        folder: "ProSeries/PRO MEN'S VITALITY BOOSTER GOLD",
        imageFiles: ["main.png", "1.png", "2.png", "3.png"],
        discountPercent: Math.round(((3799 - 2499) / 3799) * 100),
        spotlight: {
          image:
            "/Final Images/ProSeries/PRO MEN'S VITALITY BOOSTER GOLD/main.png",
          badge: "ProSeries",
          headline: "Premium Vitality Support",
          subheadline: "Gold formulation for enhanced performance",
          highlights: ["Premium blend", "Enhanced energy", "Optimal support"],
          accentGradient: "from-amber-500/50 to-yellow-400/50",
          chipClassName: "bg-amber-100/70 text-amber-800",
          glowClassName: "glow-amber",
          callouts: [
            { text: "Gold Formula", position: "top-left" },
            { text: "Premium Blend", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
      {
        id: 103,
        slug: "pro-womens-health-plus",
        name: "PRO WOMEN'S HEALTH PLUS",
        price: 2599,
        originalPrice: 2599,
        pedestalColor: "from-amber-100 via-white to-yellow-50",
        priceTagClass: "from-amber-200/80 via-yellow-100/75 to-white/70",
        borderClass: "border-amber-200",
        rating: 5,
        folder: "ProSeries/PRO WOMEN'S HEALTH PLUS",
        imageFiles: ["main.png", "2.png", "3.png", "4.png"],
        discountPercent: 0,
        spotlight: {
          image: "/Final Images/ProSeries/PRO WOMEN'S HEALTH PLUS/main.png",
          badge: "ProSeries",
          headline: "Premium Women's Wellness",
          subheadline: "Advanced formulation for women's health",
          highlights: [
            "Premium quality",
            "Advanced formula",
            "Holistic support",
          ],
          accentGradient: "from-amber-500/50 to-yellow-400/50",
          chipClassName: "bg-amber-100/70 text-amber-800",
          glowClassName: "glow-amber",
          callouts: [
            { text: "Premium Formula", position: "top-left" },
            { text: "Advanced Support", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
      {
        id: 104,
        slug: "pro-mens-multivitamin",
        name: "PRO MEN'S MULTIVITAMIN",
        price: 1449,
        originalPrice: 1899,
        pedestalColor: "from-amber-100 via-white to-yellow-50",
        priceTagClass: "from-amber-200/80 via-yellow-100/75 to-white/70",
        borderClass: "border-amber-200",
        rating: 5,
        folder: "ProSeries/PRO MEN'S MULTIVITAMIN",
        imageFiles: ["main.png", "2.png", "3.png", "4.png"],
        discountPercent: Math.round(((1899 - 1449) / 1899) * 100),
        spotlight: {
          image: "/Final Images/ProSeries/PRO MEN'S MULTIVITAMIN/main.png",
          badge: "ProSeries",
          headline: "Premium Multivitamin",
          subheadline: "Comprehensive nutritional support",
          highlights: ["Complete formula", "Premium quality", "Daily support"],
          accentGradient: "from-amber-500/50 to-yellow-400/50",
          chipClassName: "bg-amber-100/70 text-amber-800",
          glowClassName: "glow-amber",
          callouts: [
            { text: "Complete Formula", position: "top-left" },
            { text: "Daily Support", position: "bottom-right" },
          ],
          showActions: true,
        },
      },
    ];

    const buildImageDescriptor = (
      folder: string,
      fileName: string,
      alt: string,
      useOptimizedAsFallback: boolean = false
    ): ResponsiveImageDescriptor => {
      const fileExtIndex = fileName.lastIndexOf(".");
      const baseName =
        fileExtIndex >= 0 ? fileName.slice(0, fileExtIndex) : fileName;
      const fallback = useOptimizedAsFallback
        ? `/Final Images/${folder}/optimized/${fileName}`
        : `/Final Images/${folder}/${fileName}`;
      const optimizedBasePath = `/Final Images/${folder}/optimized/${baseName}`;

      const avifSrcSet = PRODUCT_IMAGE_WIDTHS.map(
        (width) => `${optimizedBasePath}-${width}w.avif ${width}w`
      ).join(", ");
      const webpSrcSet = PRODUCT_IMAGE_WIDTHS.map(
        (width) => `${optimizedBasePath}-${width}w.webp ${width}w`
      ).join(", ");

      return {
        alt,
        fallback,
        placeholder: `${optimizedBasePath}-placeholder.jpg`,
        width: 400,
        height: 400,
        sources: [
          { type: "image/avif", srcSet: avifSrcSet },
          { type: "image/webp", srcSet: webpSrcSet },
        ],
      };
    };

    return baseProSeriesProducts.map(
      ({
        imageFiles,
        folder,
        priceTagClass,
        originalPrice,
        price,
        ...rest
      }) => {
        const useOptimizedFallback =
          folder.includes("PRO WOMEN'S HEALTH PLUS") ||
          folder.includes("PRO MEN'S MULTIVITAMIN");

        return {
          ...rest,
          priceTagClass,
          originalPrice,
          price,
          discountPercent: Math.round(
            ((originalPrice - price) / originalPrice) * 100
          ),
          images: imageFiles.map((fileName, index) =>
            buildImageDescriptor(
              folder,
              fileName,
              `${rest.name} product image ${index + 1}`,
              useOptimizedFallback
            )
          ),
        };
      }
    );
  }, []);

  const handleProSeriesImageNav = useCallback(
    (productIndex: number, delta: number) => {
      setProSeriesImageIndices((prev) =>
        prev.map((frameIndex, index) => {
          if (index !== productIndex) return frameIndex;
          const images = proSeriesProducts[productIndex].images;
          if (!images.length) return frameIndex;
          const next = (frameIndex + delta + images.length) % images.length;
          return next;
        })
      );
    },
    [proSeriesProducts]
  );

  const [productSliderRef, productSlider] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      renderMode: "precision",
      drag: true,
      slides: {
        perView: 1.1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: {
            perView: 1.6,
            spacing: 20,
          },
        },
        "(min-width: 768px)": {
          slides: {
            perView: 2.2,
            spacing: 24,
          },
        },
        "(min-width: 1024px)": {
          slides: {
            perView: 3.1,
            spacing: 28,
          },
        },
        "(min-width: 1280px)": {
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

        slider.on("created", () => {
          slider.container.addEventListener("mouseenter", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseleave", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const [proSeriesSliderRef, proSeriesSlider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "precision",
    drag: true,
    slides: {
      perView: 1.1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 1.5,
          spacing: 20,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 24,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 2.5,
          spacing: 28,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 4,
          spacing: 32,
        },
      },
    },
  });

  const slideToPrevProduct = useCallback(() => {
    productSlider.current?.prev();
  }, [productSlider]);

  const slideToNextProduct = useCallback(() => {
    productSlider.current?.next();
  }, [productSlider]);

  const slideToPrevProSeries = useCallback(() => {
    proSeriesSlider.current?.prev();
  }, [proSeriesSlider]);

  const slideToNextProSeries = useCallback(() => {
    proSeriesSlider.current?.next();
  }, [proSeriesSlider]);

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

  const renderProSeriesProductCard = useCallback(
    (product: Product, index: number, isCarousel: boolean = false) => {
      const currentImage =
        product.images[proSeriesImageIndices[index]] ?? product.images[0];

      if (!currentImage) {
        return null;
      }

      return (
        <div
          key={product.id}
          className={isCarousel ? "keen-slider__slide" : ""}
        >
          <div
            className="group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border-2 bg-white transition-all duration-700 ease-out hover:-translate-y-2 sm:hover:-translate-y-3 border-amber-200/70 shadow-[0_25px_70px_-35px_rgba(217,119,6,0.2)] hover:shadow-[0_40px_100px_-40px_rgba(217,119,6,0.35)] hover:border-amber-300/80"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="pointer-events-none absolute right-2 top-2 sm:right-2.5 sm:top-2.5 z-30 group-hover:scale-105 transition-all duration-500">
              <div className="relative">
                <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-amber-400/30 via-yellow-400/40 to-amber-500/30 blur-xl animate-[softPulse_3s_ease-in-out_infinite]"></div>
                <div
                  className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-amber-300/20 via-yellow-300/30 to-amber-400/20 blur-lg animate-[softPulse_2.5s_ease-in-out_infinite]"
                  style={{ animationDelay: "0.3s" }}
                ></div>

                <div className="relative">
                  <span className="relative inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-gradient-to-r from-amber-700 via-yellow-500 via-amber-600 via-yellow-500 to-amber-700 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[7px] sm:text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white shadow-[0_4px_16px_-4px_rgba(217,119,6,0.7),0_2px_8px_-2px_rgba(251,191,36,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] ring-1 ring-amber-300/60 ring-offset-1 ring-offset-white/50 backdrop-blur-sm border border-amber-200/30">
                    <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] font-display font-extrabold">
                      ProSeries
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-transparent to-yellow-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="relative flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 lg:p-5 pb-4 sm:pb-5 lg:pb-6 rounded-xl sm:rounded-2xl lg:rounded-[2rem] m-1.5 sm:m-2 lg:m-3 bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/40">
              <div className="relative w-full">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[1.75rem] border-2 border-amber-100/80 bg-white shadow-[0_20px_50px_-30px_rgba(217,119,6,0.15)] group-hover:border-amber-200/90 transition-all duration-500">
                  <Link
                    to={`/product/${product.slug}`}
                    className="relative block w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                    aria-label={`View details for ${product.name}`}
                  >
                    <ResponsiveProductImage
                      key={`proseries-${product.id}-${proSeriesImageIndices[index]}`}
                      image={currentImage}
                      className="w-full"
                      imgClassName="w-full h-full object-cover animate-[productFade_1.1s_cubic-bezier(0.22,1,0.36,1)_forwards] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <span className="pointer-events-none absolute bottom-3 sm:bottom-4 lg:bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 text-center text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-white shadow-[0_30px_70px_-35px_rgba(217,119,6,0.65)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-sm">
                      Discover Premium
                    </span>
                  </Link>
                </div>
                {product.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleProSeriesImageNav(index, -1);
                      }}
                      className="absolute -left-2 sm:-left-3 lg:-left-5 top-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-amber-200/60 transition-all duration-300 hover:ring-amber-300/80 hover:scale-110 active:scale-95"
                      aria-label={`Show previous ${product.name} image`}
                    >
                      <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-amber-700" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleProSeriesImageNav(index, 1);
                      }}
                      className="absolute -right-2 sm:-right-3 lg:-right-5 top-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-amber-200/60 transition-all duration-300 hover:ring-amber-300/80 hover:scale-110 active:scale-95"
                      aria-label={`Show next ${product.name} image`}
                    >
                      <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-amber-700" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex w-full flex-col gap-2 text-center">
                <div className="flex flex-col items-center gap-2">
                  <h3 className="w-full">
                    <span className="inline-flex w-full items-center justify-center rounded-full border border-amber-200/60 bg-gradient-to-r from-amber-50/95 via-white to-yellow-50/95 px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 text-[10px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] lg:tracking-[0.15em] text-slate-800 shadow-[0_16px_32px_-24px_rgba(217,119,6,0.25)]">
                      {product.name}
                    </span>
                  </h3>
                  {product.images.length > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      {product.images.map((image, imageIndex) => (
                        <button
                          key={`proseries-${product.id}-${imageIndex}`}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleProSeriesImageNav(
                              index,
                              imageIndex - proSeriesImageIndices[index]
                            );
                          }}
                          className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            proSeriesImageIndices[index] === imageIndex
                              ? "bg-amber-600 w-6 shadow-[0_4px_12px_rgba(217,119,6,0.5)]"
                              : "bg-amber-300 hover:bg-amber-400"
                          }`}
                          aria-label={`Show ${product.name} image ${
                            imageIndex + 1
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 shadow-[0_16px_36px_-24px_rgba(217,119,6,0.25)] bg-gradient-to-r from-amber-200/90 via-yellow-100/85 to-amber-200/90 border border-amber-200/60">
                  <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white shadow-[0_6px_12px_rgba(217,119,6,0.35)]">
                    Deal
                  </span>
                  <span className="font-display text-base sm:text-lg lg:text-xl font-semibold tracking-tight text-slate-900">
                    ₹{product.price}
                  </span>
                </div>
                {product.originalPrice > product.price && (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-gradient-to-r from-amber-100/90 to-yellow-100/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-amber-800 shadow-[0_10px_20px_-16px_rgba(217,119,6,0.3)]">
                      Save {product.discountPercent}%
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 line-through">
                      MRP ₹{product.originalPrice}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 w-full mt-2">
                <button
                  onClick={async () => {
                    if (addingProduct === product.slug) return;
                    setAddingProduct(product.slug);
                    setCartError(null);
                    try {
                      await addItem(
                        {
                          id: product.slug,
                          name: product.name,
                          price: product.price,
                          image: currentImage?.fallback || "",
                        },
                        1
                      );
                    } catch (error) {
                      console.error("Failed to add to cart:", error);
                      setCartError(
                        error instanceof Error
                          ? error.message
                          : "Failed to add product to cart"
                      );
                      // Clear error after 5 seconds
                      setTimeout(() => setCartError(null), 5000);
                    } finally {
                      setTimeout(() => setAddingProduct(null), 800);
                    }
                  }}
                  disabled={addingProduct === product.slug}
                  className="group relative inline-flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-amber-600 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(217,119,6,0.5)] transition-all duration-300 hover:bg-amber-700 hover:shadow-[0_16px_36px_-12px_rgba(217,119,6,0.6)] hover:scale-[1.01] active:scale-95 max-w-full sm:max-w-[200px] whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative inline-flex items-center gap-1 sm:gap-1.5">
                    {addingProduct === product.slug ? "Added!" : "Add to cart"}
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
                <Link
                  to={`/product/${product.slug}`}
                  className="group relative inline-flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-full border border-amber-300/60 bg-white/95 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-semibold text-amber-700 shadow-[0_12px_28px_-18px_rgba(217,119,6,0.3)] transition-all duration-300 hover:border-amber-400/80 hover:bg-white hover:shadow-[0_16px_36px_-18px_rgba(217,119,6,0.4)] active:scale-95 max-w-full sm:max-w-[200px] whitespace-nowrap overflow-hidden w-full sm:w-auto"
                  aria-label={`View details for ${product.name}`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-50/90 via-white/95 to-yellow-50/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <span className="relative inline-flex items-center gap-1 sm:gap-1.5">
                    View details
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [
      proSeriesProducts,
      proSeriesImageIndices,
      handleProSeriesImageNav,
      addingProduct,
      addItem,
    ]
  );

  return (
    <>
      <div className="min-h-screen">
        {/* Premium Hero Slider */}
        <section className="relative bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-2 sm:pt-4 pb-12 sm:pb-16">
          <div className="w-full mx-auto px-2 sm:px-4 lg:px-5">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-nowrap items-center justify-between gap-2 sm:gap-3 text-white/90 px-2 sm:px-3 lg:px-4">
                <div className="flex flex-nowrap items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
                  <span className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm shadow-[0_10px_28px_-18px_rgba(15,23,42,0.75)]">
                    Premium Wellness
                  </span>
                  <span className="hidden sm:inline-flex h-px w-12 sm:w-16 flex-shrink-0 bg-gradient-to-r from-white/40 to-transparent"></span>
                  <span className="hidden sm:inline text-xs font-medium text-white/75 truncate">
                    Curated visuals from the Myura collection
                  </span>
                  <span className="sm:hidden text-[11px] font-medium text-white/75 truncate">
                    Curated Myura highlights
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-shrink-0">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-transparent transition-colors duration-200 text-slate-900 border border-slate-900/30 hover:border-slate-900/60"
                    aria-label="Show previous banner"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-transparent transition-colors duration-200 text-slate-900 border border-slate-900/30 hover:border-slate-900/60"
                    aria-label="Show next banner"
                  >
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-3xl shadow-[0_40px_120px_-40px_rgba(15,23,42,0.6)] ring-1 ring-white/10 bg-slate-900/60"
                role="region"
                aria-label="Featured wellness collections"
                aria-roledescription="carousel"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    handleNext();
                  }
                  if (event.key === "ArrowLeft") {
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
                            ? transitionStage === "entering"
                              ? "translate3d(0,-14px,0) scale(1.022)"
                              : "translate3d(0,0,0) scale(1)"
                            : "translate3d(0,22px,0) scale(0.972)",
                        filter:
                          index === activeSlide
                            ? "brightness(1.08) saturate(1.05)"
                            : "brightness(0.9) saturate(0.92)",
                      }}
                      onTransitionEnd={() => {
                        if (index === activeSlide) {
                          setTransitionStage("idle");
                        }
                      }}
                      aria-hidden={index !== activeSlide}
                    >
                      <picture className="flex h-full w-full">
                        <source
                          media="(min-width: 768px)"
                          srcSet={slide.desktopSrc}
                        />
                        <img
                          src={slide.mobileSrc}
                          alt={slide.alt}
                          className="w-full h-full object-cover object-center"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </picture>
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/25 via-slate-900/10 to-slate-950/40 pointer-events-none mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,210,189,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(147,197,253,0.12),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(244,114,182,0.1),transparent_55%)]"></div>
                <div className="absolute -top-24 sm:-top-32 lg:-top-40 right-10 sm:right-16 w-52 sm:w-64 lg:w-72 h-52 sm:h-64 lg:h-72 bg-emerald-400/18 blur-[120px] rounded-full animate-[softPulse_6s_ease-in-out_infinite]"></div>
                <div
                  className="absolute top-16 sm:top-20 left-6 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-300/12 rounded-full blur-3xl animate-[floatParticle_12s_linear_infinite]"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-20 sm:bottom-24 right-8 sm:right-12 w-32 sm:w-40 h-32 sm:h-40 bg-teal-200/12 rounded-full blur-3xl animate-[floatParticle_14s_linear_infinite]"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_45%,rgba(255,255,255,0)_55%,rgba(255,255,255,0.1)_100%)] animate-[shimmer_5s_linear_infinite] opacity-0.5 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>

                <div className="absolute inset-x-0 bottom-6 sm:bottom-8 flex justify-center">
                  <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur border border-white/15 pointer-events-auto">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => handleDotClick(index)}
                        className={`relative h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out ${
                          index === activeSlide
                            ? "w-6 sm:w-8 bg-white shadow-[0_10px_30px_rgba(255,255,255,0.35)]"
                            : "w-2.5 sm:w-3 bg-white/40 hover:bg-white/70"
                        }`}
                      >
                        <span className="sr-only">
                          Go to banner {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div
                className="space-y-5 sm:space-y-6 text-center lg:text-left"
                data-aos="fade-up"
              >
                <h1
                  className="font-display font-semibold text-slate-900 leading-[1.08] tracking-tight text-2xl sm:text-3xl lg:text-[3rem] xl:text-[3.25rem]"
                  data-aos="fade-up"
                  data-aos-delay="50"
                >
                  <span className="block text-slate-800">
                    Ayurveda. Simplified.
                  </span>
                  <span className="block mt-1">
                    <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-slate-900 bg-clip-text text-transparent drop-shadow-[0_12px_32px_rgba(16,185,129,0.18)]">
                      Wellness That Works.
                    </span>
                  </span>
                </h1>

                <div
                  className="flex justify-center lg:justify-start"
                  data-aos="fade-up"
                  data-aos-delay="120"
                >
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-slate-800 shadow-[0_10px_30px_rgba(45,212,191,0.35)]"></div>
                </div>

                <p
                  className="text-sm sm:text-base lg:text-lg text-slate-700/90 leading-relaxed font-minimal max-w-2xl mx-auto lg:mx-0"
                  data-aos="fade-up"
                  data-aos-delay="180"
                >
                  Thoughtfully made Ayurvedic solutions to energize, restore,
                  and support your natural balance at every stage of life. Your
                  wellness deserves the best.
                </p>
              </div>
              <div
                className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-4"
                data-aos="fade-up"
                data-aos-delay="240"
              >
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

        {/* ProSeries Section - Premium Golden Theme */}
        <section className="relative py-4 sm:py-6 border-t border-b border-amber-300/50 bg-gradient-to-b from-amber-50/40 via-white to-yellow-50/30 overflow-hidden">
          {/* Premium Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.12),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(217,119,6,0.08),transparent_55%),radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.06),transparent_60%)]"></div>
          <div className="absolute -top-24 right-16 h-48 w-48 rounded-full bg-amber-300/25 blur-[120px] animate-[softPulse_8s_ease-in-out_infinite]"></div>
          <div
            className="absolute -bottom-20 left-12 h-40 w-40 rounded-full bg-yellow-200/30 blur-[100px] animate-[softPulse_10s_ease-in-out_infinite]"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-200/15 blur-[140px]"></div>

          <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
            {/* Premium Header */}
            <div className="text-center mb-8" data-aos="fade-up">
              <h2 className="text-[1.875rem] sm:text-[2.25rem] lg:text-[2.5rem] font-display font-semibold tracking-tight leading-[1.1]">
                <span className="bg-gradient-to-r from-amber-700 via-yellow-600 via-amber-700 to-yellow-700 bg-clip-text text-transparent drop-shadow-[0_6px_20px_rgba(217,119,6,0.2)]">
                  ProSeries
                </span>
              </h2>
              <div className="mt-2 flex justify-center">
                <div className="h-0.5 w-20 rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_3px_10px_rgba(217,119,6,0.35)]"></div>
              </div>
              <p className="mt-3 text-xs sm:text-sm font-medium tracking-wide text-slate-600/85 max-w-4xl mx-auto leading-relaxed">
                <span className="bg-gradient-to-r from-slate-700 via-amber-700 to-slate-700 bg-clip-text text-transparent">
                  Our most exclusive wellness collection. Crafted with the
                  finest ingredients, advanced formulations, and uncompromising
                  quality for those who demand excellence.
                </span>
              </p>
            </div>

            {/* Mobile Carousel - Hidden on Desktop */}
            <div
              className="lg:hidden relative"
              data-aos="fade-up"
              data-aos-delay="140"
            >
              <div className="absolute inset-y-6 left-0 w-24 bg-gradient-to-r from-amber-50/90 via-amber-50/80 to-transparent pointer-events-none hidden sm:block rounded-l-3xl z-10"></div>
              <div className="absolute inset-y-6 right-0 w-24 bg-gradient-to-l from-amber-50/90 via-amber-50/80 to-transparent pointer-events-none hidden sm:block rounded-r-3xl z-10"></div>

              <div ref={proSeriesSliderRef} className="keen-slider">
                {proSeriesProducts.map((product, index) =>
                  renderProSeriesProductCard(product, index, true)
                )}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={slideToPrevProSeries}
                  aria-label="Previous ProSeries product"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/60 bg-white/90 text-amber-700 shadow-sm transition-all duration-300 hover:border-amber-300/80 hover:text-amber-800 hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>
                <button
                  onClick={slideToNextProSeries}
                  aria-label="Next ProSeries product"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/60 bg-white/90 text-amber-700 shadow-sm transition-all duration-300 hover:border-amber-300/80 hover:text-amber-800 hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Desktop Static Grid - Hidden on Mobile */}
            <div
              className="hidden lg:grid lg:grid-cols-4 gap-6 sm:gap-7 mt-10"
              data-aos="fade-up"
              data-aos-delay="140"
            >
              {proSeriesProducts.map((product, index) =>
                renderProSeriesProductCard(product, index, false)
              )}
            </div>

            {/* Premium CTA */}
            <div
              className="mt-8 text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Link
                to="/product"
                className="group relative inline-flex items-center gap-3 rounded-full
bg-[#D97708]
px-10 py-4 text-base sm:text-lg font-bold text-white
shadow-[0_28px_60px_-20px_rgba(217,119,8,0.55)]
transition-all duration-300
hover:bg-[#C66A07]
hover:shadow-[0_36px_80px_-20px_rgba(217,119,8,0.7)]
hover:scale-[1.02]
overflow-hidden"
              >
                <span className=""></span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative inline-flex items-center gap-3">
                  Explore ProSeries Collection
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Intro Text Strip */}
        <section className="relative py-8 sm:py-12">
          <div className="absolute inset-0 bg-[#112c3b]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(87,133,122,0.45),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(164,63,134,0.35),transparent_55%)] opacity-75"></div>
          <div
            className="relative w-full mx-auto px-4 sm:px-6 lg:px-8"
            data-aos="zoom-in"
            data-aos-delay="90"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-white/12 bg-white/10 backdrop-blur-2xl shadow-[0_42px_85px_-40px_rgba(17,44,59,0.85)] px-5 sm:px-8 lg:px-12 py-10 sm:py-12 text-center">
              <div
                className="absolute -top-10 -left-8 h-28 w-28 rounded-full bg-[#3e8]/22 blur-3xl animate-[softPulse_7s_ease-in-out_infinite]"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-[#a43f86]/22 blur-3xl animate-[softPulse_5.5s_ease-in-out_infinite]"
                style={{ animationDelay: "2.2s" }}
              ></div>
              <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_60%)] opacity-55"></div>

              <div className="relative flex flex-col items-center gap-4">
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3.5 py-1 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80"
                  data-aos="fade-up"
                  data-aos-delay="120"
                >
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
                    product.images[productImageIndices[productIndex]] ??
                    product.images[0];

                  if (!currentImage) {
                    return null;
                  }

                  return (
                    <div key={product.id} className="keen-slider__slide">
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
                        <div
                          className={`relative flex flex-col items-center gap-4 p-5 sm:p-6 pb-6 sm:pb-7 rounded-[2.25rem] m-2 sm:m-3 bg-gradient-to-br ${product.pedestalColor}`}
                        >
                          <div className="relative w-full">
                            <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white">
                              <Link
                                to={`/product/${product.slug}`}
                                className="relative block w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200/70 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                                aria-label={`View details for ${product.name}`}
                              >
                                <ResponsiveProductImage
                                  key={`${product.id}-${productImageIndices[productIndex]}`}
                                  image={currentImage}
                                  className="w-full"
                                  imgClassName="w-full h-full object-cover animate-[productFade_1.1s_cubic-bezier(0.22,1,0.36,1)_forwards] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                />
                                <span className="pointer-events-none absolute bottom-4 left-1/2 w-[82%] -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_26px_58px_-30px_rgba(236,72,153,0.55)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                  Discover Ritual
                                </span>
                              </Link>
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
                                          imageIndex -
                                            productImageIndices[productIndex]
                                        );
                                      }}
                                      className={`h-1.5 w-1.5 rounded-full transition ${
                                        productImageIndices[productIndex] ===
                                        imageIndex
                                          ? "bg-slate-900"
                                          : "bg-slate-300 hover:bg-slate-400"
                                      }`}
                                      aria-label={`Show ${product.name} image ${
                                        imageIndex + 1
                                      }`}
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
                            <button
                              onClick={async () => {
                                if (addingProduct === product.slug) return;
                                setAddingProduct(product.slug);
                                setCartError(null);
                                try {
                                  await addItem(
                                    {
                                      id: product.slug,
                                      name: product.name,
                                      price: product.price,
                                      image: currentImage?.fallback || "",
                                    },
                                    1
                                  );
                                } catch (error) {
                                  console.error(
                                    "Failed to add to cart:",
                                    error
                                  );
                                  setCartError(
                                    error instanceof Error
                                      ? error.message
                                      : "Failed to add product to cart"
                                  );
                                  setTimeout(() => setCartError(null), 5000);
                                } finally {
                                  setTimeout(() => setAddingProduct(null), 800);
                                }
                              }}
                              disabled={addingProduct === product.slug}
                              className="group relative inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_36px_-18px_rgba(15,23,42,0.55)] transition-all duration-300 hover:shadow-[0_24px_44px_-18px_rgba(15,23,42,0.65)] max-w-[220px] whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                              <span className="relative inline-flex items-center gap-2">
                                {addingProduct === product.slug
                                  ? "Added!"
                                  : "Add to cart"}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </span>
                            </button>
                            <Link
                              to={`/product/${product.slug}`}
                              className="group relative inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200/60 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 shadow-[0_18px_36px_-20px_rgba(15,23,42,0.3)] transition-all duration-300 hover:border-slate-400/60 hover:bg-white max-w-[220px] whitespace-nowrap"
                              aria-label={`View details for ${product.name}`}
                            >
                              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/80 via-white/70 to-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                              <span className="relative inline-flex items-center gap-2">
                                View details
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </span>
                            </Link>
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
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  id: "shipping",
                  label: "Free Shipping",
                  sublabel: "₹699+ orders",
                  icon: Truck,
                  halo: "from-[#0F2A44]/85 to-[#0F2A44]/40",
                  ring: "ring-[#0F2A44]/30",
                },
                {
                  id: "secure",
                  label: "Secure Payment",
                  sublabel: "256-bit",
                  icon: Shield,
                  halo: "from-[#0F2A44]/85 to-[#0F2A44]/40",
                  ring: "ring-[#0F2A44]/30",
                },
                {
                  id: "guarantee",
                  label: "30-Day Guarantee",
                  sublabel: "Easy exchange",
                  icon: CheckCircle,
                  halo: "from-[#0F2A44]/85 to-[#0F2A44]/40",
                  ring: "ring-[#0F2A44]/30",
                },
                {
                  id: "support",
                  label: "24/7 Support",
                  sublabel: "Concierge help",
                  icon: Headphones,
                  halo: "from-[#0F2A44]/85 to-[#0F2A44]/40",
                  ring: "ring-[#0F2A44]/30",
                },
              ].map(
                ({ id, label, sublabel, icon: Icon, halo, ring }, index) => (
                  <div
                    key={id}
                    className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/[0.9] shadow-[0_20px_55px_-42px_rgba(15,23,42,0.28)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-48px_rgba(15,23,42,0.38)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex flex-col gap-3 p-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div
                          className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${halo} ring-4 ${ring} shadow-[0_18px_28px_-18px_rgba(16,185,129,0.35)] transition-transform duration-500 group-hover:scale-105`}
                        >
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
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                          {sublabel}
                        </p>
                      </div>
                    </div>
                    <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-emerald-200/35 blur-[70px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* At Myura Wellness Section */}
              <AboutMyuraWellness/>
        {/* Video Section */}
                <VideoSectionAboutPage/>

        {/* Cart Error Toast */}
        {cartError && (
          <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Unable to Add to Cart
                  </h3>
                  <p className="text-sm text-red-800">{cartError}</p>
                </div>
                <button
                  onClick={() => setCartError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
