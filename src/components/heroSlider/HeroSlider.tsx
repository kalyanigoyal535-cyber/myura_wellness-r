import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import images from "../../images/images";

const HeroSlider = () => {
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        const slides = isMobile ? mobileSlides : desktopSlides;
        return (prev + 1) % slides.length;
      });
    }, isMobile ? 5000 : 7000);
    return () => clearInterval(interval);
  }, [isMobile]);

  const slides = isMobile ? mobileSlides : desktopSlides;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full mx-auto overflow-hidden rounded-xl bg-[#F0F4EB]">
      {/* ===== Desktop Version ===== */}
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

          {/* Navigation Buttons */}
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

      {/* ===== Mobile Version ===== */}
      {isMobile && (
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * 100}%)`,
              width: `${slides.length * 100}%`,
            }}
          >
            {slides.map((src, index) => (
              <div key={index} className="flex-shrink-0 w-full">
                <img
                  src={src}
                  alt={`Mobile Slide ${index + 1}`}
                  className="w-full h-auto object-contain bg-[#F0F4EB] rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === current ? "bg-black" : "bg-gray-400"
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
