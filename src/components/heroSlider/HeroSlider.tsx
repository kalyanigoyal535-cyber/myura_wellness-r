import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import images from "../../images/images";

const HeroSlider: React.FC = () => {
  const desktopSlides = [
    images.BannerImageDesktop1,
    images.BannerImageDesktop2,
    images.BannerImageDesktop3,
  ];

  const mobileSlides = [
    images.BannerImageMobile1,
    images.BannerImageMobile2,
    images.BannerImageMobile3,
  ];

  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // ✅ Detect mobile instantly before first paint
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      console.log("📱 isMobile:", e.matches ? "MOBILE" : "DESKTOP");
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Don’t derive `slides` until we know mobile/desktop
  const slides = isMobile ? mobileSlides : desktopSlides;

  // ✅ Auto slide
  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // ✅ Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // ✅ Render placeholder safely *after* all hooks
  if (isMobile === null) {
    return (
      <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-xl" />
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#F0F4EB] rounded-xl">
      {/* Desktop Version */}
      {!isMobile && (
        <div className="relative aspect-[1500/625]">
          {desktopSlides.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Desktop Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <button
            onClick={prevSlide}
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Mobile Version */}
      {isMobile && (
        <div
          className="relative w-full h-[300px] sm:h-[350px] overflow-hidden rounded-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * 100}%)`,
              width: `${slides.length * 100}%`,
            }}
          >
            {slides.map((src, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img
                  src={src}
                  alt={`Mobile Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === current ? "bg-black scale-110" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
