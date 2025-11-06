import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let minTimer: NodeJS.Timeout;
    let maxTimer: NodeJS.Timeout;
    
    const hideLoading = () => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    };

    // Minimum display time for logo animation
    const minDisplayTime = 2000;

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      // If already loaded, show for minimum time
      minTimer = setTimeout(hideLoading, minDisplayTime);
    } else {
      // Wait for page to load, then show for minimum time
      const handleLoad = () => {
        minTimer = setTimeout(hideLoading, minDisplayTime);
      };
      window.addEventListener('load', handleLoad);
      
      // Fallback - hide after max time (allow extra time for safety)
      maxTimer = setTimeout(hideLoading, minDisplayTime + 2000);
      
      return () => {
        if (minTimer) clearTimeout(minTimer);
        if (maxTimer) clearTimeout(maxTimer);
        window.removeEventListener('load', handleLoad);
      };
    }

    // Fallback timer if already loaded
    maxTimer = setTimeout(hideLoading, minDisplayTime + 1500);

    return () => {
      if (minTimer) clearTimeout(minTimer);
      if (maxTimer) clearTimeout(maxTimer);
    };
  }, []);


  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100 flex items-center justify-center px-4 transition-opacity duration-500 overflow-hidden ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ width: '100vw', height: '100vh', maxWidth: '100%', maxHeight: '100%' }}
    >
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/40 via-stone-100/40 to-neutral-100/40 animate-[gradientShift_12s_ease-in-out_infinite]"></div>
      
      {/* Floating subtle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-[floatParticle_8s_ease-in-out_infinite] opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-1.5 sm:h-1.5 bg-stone-400 rounded-full animate-[floatParticle_9s_ease-in-out_infinite_1.5s] opacity-35"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-slate-300 rounded-full animate-[floatParticle_10s_ease-in-out_infinite_2.5s] opacity-38"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-1.5 sm:h-1.5 bg-neutral-400 rounded-full animate-[floatParticle_8s_ease-in-out_infinite_2s] opacity-32"></div>
        <div className="absolute top-1/2 left-1/5 w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1 sm:h-1 bg-slate-500 rounded-full animate-[floatParticle_7s_ease-in-out_infinite_1s] opacity-30"></div>
        <div className="absolute top-1/2 right-1/5 w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1 sm:h-1 bg-stone-500 rounded-full animate-[floatParticle_9s_ease-in-out_infinite_3s] opacity-28"></div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 max-w-full w-full relative z-10 px-4">
        {/* Enhanced Logo Animation with rotating orbital system */}
        <div className="relative flex items-center justify-center w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[65vw]">
          {/* Rotating orbital ring system */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer rotating ring */}
            <div className="absolute w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-56 lg:h-56 xl:w-64 xl:h-64 2xl:w-72 2xl:h-72 border border-slate-300/40 rounded-full animate-[rotate360_20s_linear_infinite]"></div>
            
            {/* Middle rotating ring (counter-clockwise) */}
            <div className="absolute w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 border border-stone-300/35 rounded-full animate-[rotate360Reverse_15s_linear_infinite]"></div>
            
            {/* Inner rotating ring */}
            <div className="absolute w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 2xl:w-56 2xl:h-56 border border-slate-400/30 rounded-full animate-[rotate360_12s_linear_infinite]"></div>
            
            {/* Orbiting decorative dots */}
            <div className="absolute w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-56 lg:h-56 xl:w-64 xl:h-64 2xl:w-72 2xl:h-72 animate-[rotate360_20s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-slate-500 rounded-full shadow-sm"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-stone-500 rounded-full shadow-sm"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-slate-400 rounded-full shadow-sm"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-stone-400 rounded-full shadow-sm"></div>
            </div>
            
            {/* Counter-rotating dots on middle ring */}
            <div className="absolute w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 animate-[rotate360Reverse_15s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-slate-600 rounded-full shadow-sm"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-stone-600 rounded-full shadow-sm"></div>
            </div>
          </div>
          
          {/* Logo with enhanced entrance animation */}
          <div className="relative z-10">
            <div className="relative">
              <img
                src="/Logo-02.png"
                alt="MYURA Logo"
                className="h-12 xs:h-14 sm:h-20 md:h-28 lg:h-32 xl:h-36 2xl:h-40 w-auto object-contain filter brightness-0 drop-shadow-2xl animate-[logoEntrance_2s_ease-out] max-w-[85vw] sm:max-w-[75vw] md:max-w-[65vw] lg:max-w-[55vw]"
              />
              
              {/* Multi-layered glow effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 2xl:w-56 2xl:h-56 bg-gradient-to-r from-slate-400/30 via-stone-400/30 to-slate-400/30 rounded-full blur-2xl animate-[glowPulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-60 2xl:h-60 bg-gradient-to-r from-slate-300/20 via-stone-300/20 to-slate-300/20 rounded-full blur-3xl animate-[glowPulse_5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
          
          {/* Subtle pulsing background circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-20">
            <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 bg-slate-100/20 rounded-full animate-[softPulse_3s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Theme-colored Loading Spinner */}
        <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 md:space-x-2.5">
          <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0s' }}></div>
          <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

