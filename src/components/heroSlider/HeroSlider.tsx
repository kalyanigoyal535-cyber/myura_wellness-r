import React, { useEffect, useState } from "react";
import images from "../../images/images";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides = isMobile ? mobileSlides : desktopSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      id="hero-carousel"
      className="relative w-[90%] mx-[5%] md:mx-0 md:w-full"
    >
      <div className="relative h-[80vh] overflow-hidden rounded-lg">
        {slides.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="block w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* === Indicators === */}
      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 bottom-5 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-400/70"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* === Controls === */}
      <button
        onClick={prevSlide}
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        aria-label="Previous Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
          <ChevronLeft className="w-5 h-5 text-white" />
        </span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        aria-label="Next Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
          <ChevronRight className="w-5 h-5 text-white" />
        </span>
      </button>
    </div>
  );
};

export default HeroSlider;
