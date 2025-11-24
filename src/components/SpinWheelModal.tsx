import React, { useEffect, useMemo, useState, useRef } from 'react';

type DiscountSegment = {
  code: string;
  label: string;
  description: string;
  accent: string;
  detail: string;
};

const DISCOUNT_SEGMENTS: DiscountSegment[] = [
  {
    code: 'FEST30',
    label: '30% OFF',
    description: 'Festive Essentials',
    accent: '#d97706', // amber/orange
    detail: 'Signature adaptogenic blends for daily rituals.',
  },
  {
    code: 'Myura30',
    label: '30% OFF',
    description: 'Ritual Kits',
    accent: '#45576f',
    detail: 'Hydrating care duos curated by Ayurvedic doctors.',
  },
  {
    code: 'MyuraWellness31',
    label: '31% OFF',
    description: 'Wellness Lab',
    accent: '#5f2454',
    detail: 'Lab-tested botanicals for holistic immunity.',
  },
  {
    code: 'MyuraOffer35',
    label: '35% OFF',
    description: 'Curated Combos',
    accent: '#8e3421',
    detail: 'Layered nourishment for skin, gut & mind.',
  },
  {
    code: 'MyuraMagic40',
    label: '40% OFF',
    description: 'Limited Drops',
    accent: '#57857a',
    detail: 'Rare seasonal creations straight from the atelier.',
  },
  {
    code: 'MyuraGlow31',
    label: '31% OFF',
    description: 'Luminous Care',
    accent: '#616262',
    detail: 'Phyto-active glow routines with micro-ferments.',
  },
  {
    code: 'MyuraZen34',
    label: '34% OFF',
    description: 'Mindful Picks',
    accent: '#a43f86',
    detail: 'Daily calm essentials to restore inner balance.',
  },
  {
    code: 'MyuraHeals40',
    label: '40% OFF',
    description: 'Immune Shield',
    accent: '#537790',
    detail: 'Clinically dosed botanicals for rapid recovery.',
  },
];

const POINTER_ROTATION_OFFSET = 90; // Align gradient start to top pointer

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ isOpen, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const segmentAngle = 360 / DISCOUNT_SEGMENTS.length;

  const gradientString = useMemo(() => {
    return DISCOUNT_SEGMENTS.map((segment, index) => {
      const start = index * segmentAngle;
      const end = (index + 1) * segmentAngle;
      return `${segment.accent} ${start}deg ${end}deg`;
    }).join(', ');
  }, [segmentAngle]);


  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalOverflowY = document.body.style.overflowY;
    const originalHeight = document.body.style.height;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.body.style.overflowY = 'hidden';
    document.body.style.height = '100vh';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overflowY = originalOverflowY;
      document.body.style.height = originalHeight;
    };
  }, [isOpen]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  // Ultra-smooth easing function for very gradual deceleration
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  // Calculate which segment the pointer is pointing to based on rotation
  const getSegmentFromRotation = (rot: number): number => {
    const cssRotation = ((rot - POINTER_ROTATION_OFFSET) % 360 + 360) % 360;
    // Wheel rotates clockwise; pointer sees the opposite angle
    const pointerAngle = (360 - cssRotation) % 360;
    let segmentIndex = Math.floor(pointerAngle / segmentAngle);
    if (segmentIndex < 0) segmentIndex += DISCOUNT_SEGMENTS.length;
    return segmentIndex % DISCOUNT_SEGMENTS.length;
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedIndex(null);
    setHasSpun(true);
    setShowOffer(false);

    // Random target rotation - let it land wherever it lands
    const randomExtra = Math.random() * segmentAngle * 0.6;
    const baseRotations = 360 * 6;
    const randomSegmentOffset = Math.random() * 360;
    const targetRotation = baseRotations + randomSegmentOffset + randomExtra;

    // Animate with ultra-smooth easing for gradual slowdown
    const startRotation = rotation;
    const startTime = performance.now(); // Use performance.now() for better precision
    const duration = 4000; // Reduced duration for faster but still smooth stop

    const animate = (currentTime?: number) => {
      const elapsed = (currentTime || performance.now()) - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ultra-smooth easing for gradual deceleration
      const easedProgress = easeOutQuart(progress);
      const currentRotation = startRotation + (targetRotation - startRotation) * easedProgress;
      
      setRotation(currentRotation);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        const bestIdx = getSegmentFromRotation(currentRotation);
        setSelectedIndex(bestIdx);
        setIsSpinning(false);
        // Show premium offer display after a brief delay
        setTimeout(() => {
          setShowOffer(true);
        }, 500);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const selectedDiscount =
    selectedIndex !== null ? DISCOUNT_SEGMENTS[selectedIndex] : null;

  const handleCopy = async () => {
    if (!selectedDiscount) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(selectedDiscount.code);
      } catch {
        // Clipboard support may vary; fail silently
      }
    }
  };

  return (
    <div 
      className="fixed z-[9998] flex items-center justify-center px-2 sm:px-3 md:px-4 py-2 sm:py-4 md:py-6 overflow-hidden"
      style={{
        top: 'var(--header-height, 0px)',
        left: '0',
        right: '0',
        bottom: '0',
        height: 'calc(100vh - var(--header-height, 0px))',
        maxHeight: 'calc(100vh - var(--header-height, 0px))',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500 ease-out"
        onClick={() => !isSpinning && onClose()}
      />

      <div className="relative max-w-6xl w-full bg-gradient-to-br from-slate-50/95 via-white/90 to-blue-50/95 border border-slate-300/70 shadow-[0px_20px_80px_rgba(15,36,57,0.15)] rounded-2xl sm:rounded-[32px] p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8 overflow-hidden max-h-[95vh] sm:max-h-[92vh] transition-all duration-500 ease-out transform animate-modal-entrance">
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white border border-slate-300/70 shadow-md hover:shadow-lg transition-all text-slate-700 hover:text-slate-900"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-10 -right-4 w-40 h-40 bg-slate-300/40 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-4 w-32 h-32 bg-blue-200/30 blur-3xl rounded-full" />
        </div>

        {/* Premium Offer Overlay - Full Modal Display */}
        {showOffer && selectedDiscount && (
          <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in max-h-[95vh] sm:max-h-[92vh]">
            <div 
              className="relative w-full h-full bg-gradient-to-br from-white via-slate-50/95 to-white overflow-hidden rounded-2xl sm:rounded-[32px]"
              style={{
                background: `linear-gradient(135deg, ${selectedDiscount.accent}08 0%, white 30%, white 70%, ${selectedDiscount.accent}08 100%)`,
              }}
            >
              {/* Animated background glow */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${selectedDiscount.accent}20 0%, transparent 70%)`,
                  animation: 'pulse-glow 3s ease-in-out infinite',
                }}
              />
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div 
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: selectedDiscount.accent }}
                />
                <div 
                  className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: selectedDiscount.accent }}
                />
              </div>

              {/* Creative Myura Brand Celebration */}
              {showOffer && (() => {
                // Myura brand colors
                const myuraColors = [
                  '#22c55e', '#16a34a', // Myura Green
                  '#a855f7', '#9333ea', // Myura Purple
                  '#ec4899', '#db2777', // Myura Pink
                  '#f43f5e', '#e11d48', // Myura Rose
                  '#fbbf24', '#f59e0b', // Myura Amber
                  selectedDiscount.accent
                ];
                
                return (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
                    {/* Corner firecracker bursts with Myura colors */}
                  {[
                    { top: '8%', left: '8%', delay: 0, colorSet: 0 },
                    { top: '8%', right: '8%', delay: 0.15, colorSet: 1 },
                    { bottom: '8%', left: '8%', delay: 0.3, colorSet: 2 },
                    { bottom: '8%', right: '8%', delay: 0.45, colorSet: 3 },
                  ].map((position, idx) => {
                    const baseColors = [
                      ['#22c55e', '#16a34a', '#fbbf24'],
                      ['#a855f7', '#9333ea', '#ec4899'],
                      ['#f43f5e', '#e11d48', '#fbbf24'],
                      ['#ec4899', '#db2777', '#22c55e'],
                    ];
                    const colors = baseColors[position.colorSet];
                    return (
                      <div
                        key={`firecracker-${idx}`}
                        className="absolute"
                        style={{
                          top: position.top,
                          left: position.left,
                          right: position.right,
                          bottom: position.bottom,
                        }}
                      >
                        {/* Outer ring particles */}
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30) * (Math.PI / 180);
                          const distance = 50;
                          const x = Math.cos(angle) * distance;
                          const y = Math.sin(angle) * distance;
                          const color = colors[i % colors.length];
                          const size = 2 + (i % 2) * 1;
                          return (
                            <div
                              key={`outer-${idx}-${i}`}
                              className="absolute rounded-full animate-firecracker"
                              style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                                transform: 'translate(-50%, -50%)',
                                animationDelay: `${position.delay + i * 0.03}s`,
                                boxShadow: `0 0 10px ${color}, 0 0 15px ${color}80`,
                                '--x': `${x}px`,
                                '--y': `${y}px`,
                              } as React.CSSProperties}
                            />
                          );
                        })}
                        {/* Inner sparkles */}
                        {[...Array(6)].map((_, i) => {
                          const angle = (i * 60) * (Math.PI / 180);
                          const distance = 25;
                          const x = Math.cos(angle) * distance;
                          const y = Math.sin(angle) * distance;
                          const color = colors[(i + 1) % colors.length];
                          return (
                            <div
                              key={`inner-${idx}-${i}`}
                              className="absolute w-1 h-1 rounded-full animate-firecracker-slow"
                              style={{
                                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                                transform: 'translate(-50%, -50%)',
                                animationDelay: `${position.delay + 0.2 + i * 0.05}s`,
                                boxShadow: `0 0 8px ${color}`,
                                '--x': `${x}px`,
                                '--y': `${y}px`,
                              } as React.CSSProperties}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                  
                  {/* Center celebration burst with Myura colors */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {/* Main burst */}
                    {[...Array(16)].map((_, i) => {
                      const angle = (i * 22.5) * (Math.PI / 180);
                      const distance = 70;
                      const x = Math.cos(angle) * distance;
                      const y = Math.sin(angle) * distance;
                      const centerColors = ['#22c55e', '#a855f7', '#ec4899', '#f43f5e', '#fbbf24', selectedDiscount.accent];
                      const color = centerColors[i % centerColors.length];
                      const size = 2.5 + (i % 3) * 0.5;
                      return (
                        <div
                          key={`center-main-${i}`}
                          className="absolute rounded-full animate-firecracker"
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                            transform: 'translate(-50%, -50%)',
                            animationDelay: `${0.2 + i * 0.02}s`,
                            boxShadow: `0 0 12px ${color}, 0 0 20px ${color}60`,
                            '--x': `${x}px`,
                            '--y': `${y}px`,
                          } as React.CSSProperties}
                        />
                      );
                    })}
                    {/* Secondary sparkles */}
                    {[...Array(8)].map((_, i) => {
                      const angle = (i * 45) * (Math.PI / 180);
                      const distance = 35;
                      const x = Math.cos(angle) * distance;
                      const y = Math.sin(angle) * distance;
                      const sparkleColors = ['#fbbf24', '#22c55e', '#a855f7'];
                      const color = sparkleColors[i % sparkleColors.length];
                      return (
                        <div
                          key={`center-sparkle-${i}`}
                          className="absolute w-1.5 h-1.5 rounded-full animate-firecracker-slow"
                          style={{
                            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                            transform: 'translate(-50%, -50%)',
                            animationDelay: `${0.4 + i * 0.04}s`,
                            boxShadow: `0 0 10px ${color}`,
                            '--x': `${x}px`,
                            '--y': `${y}px`,
                          } as React.CSSProperties}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Floating particles with trailing effect */}
                  {[...Array(20)].map((_, i) => {
                    const colors = ['#22c55e', '#a855f7', '#ec4899', '#fbbf24', selectedDiscount.accent];
                    const color = colors[i % colors.length];
                    const startX = 20 + (i * 3.5);
                    const startY = 15 + (i * 4);
                    return (
                      <div
                        key={`float-${i}`}
                        className="absolute animate-float-particle"
                        style={{
                          left: `${startX}%`,
                          top: `${startY}%`,
                          width: '2px',
                          height: '2px',
                          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                          animationDelay: `${0.5 + i * 0.1}s`,
                          boxShadow: `0 0 8px ${color}`,
                          borderRadius: '50%',
                        }}
                      />
                    );
                  })}
                  </div>
                );
              })()}

              {/* Content */}
              <div className="relative z-10 p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 h-full flex flex-col justify-center overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Row 1: Success icon and Congratulations */}
                <div className="flex flex-row items-center justify-center gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-5">
                  <div 
                    className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl flex-shrink-0 transition-all duration-500 ease-out"
                    style={{
                      background: `linear-gradient(135deg, ${selectedDiscount.accent} 0%, ${selectedDiscount.accent}dd 100%)`,
                      transform: 'scale(0)',
                      animation: 'scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards',
                    }}
                  >
                    <svg className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] font-semibold transition-all duration-300" style={{ color: selectedDiscount.accent }}>
                    Congratulations
                  </p>
                </div>

                {/* Row 2: Discount label */}
                <div className="text-center mb-2 xs:mb-3 sm:mb-4">
                  <h2 
                    className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight inline-block transition-all duration-500 ease-out"
                    style={{ 
                      color: selectedDiscount.accent,
                      textShadow: `0 4px 20px ${selectedDiscount.accent}40`,
                      opacity: 0,
                      transform: 'translateY(20px)',
                      animation: 'fade-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards',
                    }}
                  >
                    {selectedDiscount.label}
                  </h2>
                </div>

                {/* Row 3: Description */}
                <div className="text-center mb-2 xs:mb-2.5 sm:mb-3">
                  <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 inline-block transition-all duration-500 ease-out" style={{
                    opacity: 0,
                    transform: 'translateY(15px)',
                    animation: 'fade-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards',
                  }}>
                    {selectedDiscount.description}
                  </h3>
                </div>

                {/* Row 4: Detail text */}
                <div className="text-center mb-3 xs:mb-4 sm:mb-5">
                  <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed inline-block transition-all duration-500 ease-out" style={{
                    opacity: 0,
                    transform: 'translateY(10px)',
                    animation: 'fade-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s forwards',
                  }}>
                    {selectedDiscount.detail}
                  </p>
                </div>

                {/* Row 5: Code label and code */}
                <div className="flex flex-row items-center justify-center gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-6 flex-wrap transition-all duration-500 ease-out" style={{
                  opacity: 0,
                  transform: 'translateY(15px)',
                  animation: 'fade-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s forwards',
                }}>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] text-slate-500 font-medium whitespace-nowrap">
                    Your Exclusive Code
                  </p>
                  <div 
                    className="inline-flex items-center gap-2 xs:gap-2.5 sm:gap-3 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg border-2 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${selectedDiscount.accent}15 0%, white 50%, ${selectedDiscount.accent}15 100%)`,
                      borderColor: `${selectedDiscount.accent}40`,
                    }}
                  >
                    <span className="text-sm xs:text-base sm:text-lg md:text-xl font-black tracking-wider transition-all duration-300" style={{ color: selectedDiscount.accent }}>
                      {selectedDiscount.code}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-1 xs:p-1.5 sm:p-2 rounded-lg hover:bg-white/50 active:scale-95 transition-all touch-manipulation"
                      style={{ color: selectedDiscount.accent }}
                      aria-label="Copy code"
                    >
                      <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Row 6: Action buttons */}
                <div className="flex flex-row gap-2 xs:gap-2.5 sm:gap-3 justify-center items-center flex-wrap transition-all duration-500 ease-out" style={{
                  opacity: 0,
                  transform: 'translateY(15px)',
                  animation: 'fade-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards',
                }}>
                  <button
                    onClick={handleCopy}
                    className="px-5 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-full text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
                    style={{
                      background: `linear-gradient(135deg, ${selectedDiscount.accent} 0%, ${selectedDiscount.accent}dd 100%)`,
                    }}
                  >
                    Copy Code
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-full text-[10px] xs:text-xs sm:text-sm font-semibold uppercase tracking-wider bg-white text-slate-700 border-2 border-slate-300 hover:border-slate-400 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <div className="flex flex-col md:flex-row gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-center justify-center">
            <div className="relative flex items-center justify-center w-full md:w-auto flex-shrink-0">
              <div className="relative w-[220px] h-[220px] xs:w-[240px] xs:h-[240px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] xl:w-[400px] xl:h-[400px] transition-all duration-300 ease-out">
                {/* Outer decorative ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-slate-300/20 via-blue-300/20 to-indigo-300/20 blur-2xl" />
                
                {/* Animated glow effect during spin */}
                {isSpinning && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-400/40 via-blue-400/40 via-indigo-400/40 to-slate-400/40 blur-2xl animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-4 border-slate-500/30 animate-spin-slow" style={{ animationDuration: '3s' }} />
                  </>
                )}
                
                {/* Outer ring with decorative pattern */}
                <div className="absolute inset-0 rounded-full border-4 border-white/90 shadow-[0_0_60px_rgba(0,0,0,0.2)]">
                  <div className="absolute inset-0 rounded-full border border-white/50" />
                </div>

                {/* Fixed pointer arrow at top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                  <div className="relative">
                    {/* Arrow triangle */}
                    <div className="w-0 h-0 border-l-[10px] xs:border-l-[12px] sm:border-l-[14px] md:border-l-[16px] border-l-transparent border-r-[10px] xs:border-r-[12px] sm:border-r-[14px] md:border-r-[16px] border-r-transparent border-t-[18px] xs:border-t-[22px] sm:border-t-[26px] md:border-t-[30px] border-t-slate-800 drop-shadow-lg" />
                    {/* Arrow stem */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 xs:w-1.5 sm:w-2 h-6 xs:h-8 sm:h-10 md:h-12 bg-gradient-to-b from-slate-800 via-slate-700 to-transparent" />
                    {/* Highlight on arrow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 xs:w-1 h-4 xs:h-5 sm:h-6 bg-white/40 rounded-full" />
                  </div>
                </div>
                
                {/* Main wheel with enhanced shadows */}
                <div
                  ref={wheelRef}
                  className="absolute inset-2 rounded-full overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.15),0_0_50px_rgba(0,0,0,0.2)]"
                  style={{
                    backgroundImage: `conic-gradient(${gradientString})`,
                    transform: `rotate(${rotation - POINTER_ROTATION_OFFSET}deg)`,
                    transition: isSpinning ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    willChange: isSpinning ? 'transform' : 'auto',
                  }}
                >
                  {/* Segment dividers */}
                  {DISCOUNT_SEGMENTS.map((segment, index) => {
                    const dividerRotation = index * segmentAngle;
                    return (
                      <div
                        key={`divider-${index}`}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform: `rotate(${dividerRotation}deg)`,
                        }}
                      >
                        <div className="w-[2px] h-full bg-gradient-to-b from-white/80 via-white/40 to-transparent" />
                      </div>
                    );
                  })}
                  
                  {/* Segment labels - clean and simple, facing outward radially */}
                  {DISCOUNT_SEGMENTS.map((segment, index) => {
                    const labelRotation = index * segmentAngle + segmentAngle / 2;
                    return (
                      <div
                        key={segment.code}
                        className="absolute inset-0 flex items-start justify-center"
                        style={{
                          transform: `rotate(${labelRotation}deg)`,
                        }}
                      >
                        <div
                          className="flex flex-col items-center text-center"
                          style={{
                            transform: `translateY(15px)`,
                          }}
                        >
                          <div className="text-[9px] xs:text-[10px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-bold text-white mb-0.5 xs:mb-1 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300">
                            {segment.label}
                          </div>
                          <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[9.5px] lg:text-[10px] font-medium text-white whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-all duration-300">
                            {segment.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Spin button - floating on wheel without white background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className={`relative w-20 h-20 xs:w-24 xs:h-24 sm:w-26 sm:h-26 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white uppercase tracking-[0.25em] text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-bold shadow-[0_20px_50px_rgba(15,36,57,0.4),0_0_0_3px_rgba(255,255,255,0.3)] sm:shadow-[0_20px_50px_rgba(15,36,57,0.4),0_0_0_4px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out pointer-events-auto touch-manipulation ${
                      isSpinning 
                        ? 'scale-95' 
                        : 'hover:scale-110 active:scale-95 hover:shadow-[0_25px_60px_rgba(15,36,57,0.5)]'
                    } disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group z-20`}
                    style={{
                      willChange: 'transform',
                    }}
                  >
                    {/* Button inner glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                    
                    {/* Animated ring during spin */}
                    {isSpinning && (
                      <div className="absolute -inset-2 rounded-full border-2 border-slate-500/50 animate-spin-slow" style={{ animationDuration: '2s' }} />
                    )}
                    
                    {/* Button content */}
                    <span className="relative z-10 flex items-center justify-center h-full">
                      {isSpinning ? (
                        <div className="flex gap-0.5 sm:gap-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <span className="group-hover:scale-110 transition-transform">SPIN</span>
                      )}
                    </span>
                    
                    {/* Shimmer effect during spin */}
                    {isSpinning && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
                    )}
                    
                    {/* Hover glow effect */}
                    {!isSpinning && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/20 group-hover:to-blue-500/20 transition-all duration-300 blur-xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 sm:space-y-4 text-slate-800 text-center md:text-left w-full">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-600">
                  Myura Atelier Exclusive
                </p>
                <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
                  Spin to unlock your ritual
                </h2>
                <p className="hidden sm:block text-xs xs:text-sm sm:text-sm md:text-base text-slate-700 leading-relaxed">
                  A bespoke wheel of limited discount codes curated from our current ritual lab. Spin once to reveal your indulgence — each code is valid on select blends, sets, and seasonal edits.
                </p>
              </div>

              <div className={`bg-white/80 border border-slate-300 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 space-y-2 sm:space-y-2.5 shadow-[0_10px_30px_rgba(15,36,57,0.1)] transition-opacity duration-300 ${showOffer ? 'opacity-0 pointer-events-none' : ''}`}>
                {selectedDiscount ? (
                  <>
                    <p className="text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-500">
                      Awarded Ritual
                    </p>
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="text-base xs:text-lg sm:text-xl font-semibold text-slate-900">
                          {selectedDiscount.description}
                        </div>
                        <p className="text-xs xs:text-sm text-slate-500">
                          {selectedDiscount.detail}
                        </p>
                      </div>
                      <div className="text-left xs:text-right flex-shrink-0">
                        <p className="text-[10px] xs:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-400">
                          Code
                        </p>
                        <p className="text-lg xs:text-xl font-semibold tracking-wider text-slate-900">
                          {selectedDiscount.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={handleCopy}
                        className="px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white text-[10px] xs:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:from-slate-800 hover:to-slate-900 transition-colors shadow-md"
                      >
                        Copy Code
                      </button>
                      <button
                        onClick={onClose}
                        className="px-3 xs:px-4 py-1.5 xs:py-2 rounded-full border border-slate-400 text-[10px] xs:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-600">
                      How it works
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2 text-xs xs:text-sm text-slate-700">
                      <li>• One spin per visit unlocks an atelier-exclusive code</li>
                      <li>• Codes apply to curated collections across the store</li>
                      <li>
                        • Savings range between 30% and 40% on limited rituals
                      </li>
                    </ul>
                    <button
                      onClick={handleSpin}
                      disabled={isSpinning}
                      className="w-full xs:w-auto px-4 xs:px-5 py-2 xs:py-2.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white text-[10px] xs:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] shadow-lg hover:shadow-xl hover:from-slate-800 hover:to-slate-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {hasSpun ? 'Spin Again' : 'Begin Spin'}
                    </button>
                  </>
                )}
              </div>

              {!selectedDiscount && (
                <p className="text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-600/70">
                  Limited stocks · Authentic ayurvedic craft
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-50%);
          }
          100% {
            transform: translateX(100%) translateY(-50%);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes modal-entrance {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes firecracker {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateX(0) translateY(0) scale(1);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) translateX(calc(var(--x) * 0.6)) translateY(calc(var(--y) * 0.6)) scale(1.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateX(var(--x)) translateY(var(--y)) scale(0);
          }
        }
        @keyframes firecracker-slow {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateX(0) translateY(0) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) translateX(calc(var(--x) * 0.5)) translateY(calc(var(--y) * 0.5)) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateX(var(--x)) translateY(var(--y)) scale(0);
          }
        }
        @keyframes float-particle {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translateY(-30px) scale(1) rotate(90deg);
          }
          80% {
            opacity: 0.8;
            transform: translateY(-80px) scale(1) rotate(270deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-120px) scale(0.5) rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-modal-entrance {
          animation: modal-entrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-firecracker {
          animation: firecracker 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-firecracker-slow {
          animation: firecracker-slow 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-float-particle {
          animation: float-particle 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SpinWheelModal;

