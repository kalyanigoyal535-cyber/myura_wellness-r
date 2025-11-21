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

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ isOpen, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
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

  // Particle animation effect
  useEffect(() => {
    if (!isSpinning) return;

    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      return {
        id: Math.random(),
        x: 50,
        y: 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: DISCOUNT_SEGMENTS[Math.floor(Math.random() * DISCOUNT_SEGMENTS.length)].accent,
        life: 1,
      };
    };

    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = [...prev, createParticle(), createParticle()];
        return newParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.5,
            y: p.y + p.vy * 0.5,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
          .slice(-50);
      });
    }, 50);

    return () => {
      clearInterval(interval);
      setParticles([]);
    };
  }, [isSpinning]);

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
    // The wheel rotates with: rotate(rot - POINTER_ROTATION_OFFSET)
    // The pointer is fixed at 0 degrees (top)
    const visualRotation = ((rot - POINTER_ROTATION_OFFSET) % 360 + 360) % 360;
    
    // Find which segment center is closest to 0 degrees (pointer position) after rotation
    // After clockwise rotation by 'r', a point at angle 'a' is now at (a - r) mod 360
    // We want to find which segment center, after rotation, is closest to 0 degrees
    
    let minDistance = Infinity;
    let closestIndex = 0;
    
    for (let i = 0; i < DISCOUNT_SEGMENTS.length; i++) {
      // Each segment center is at: i * segmentAngle + segmentAngle / 2
      const segmentCenter = i * segmentAngle + segmentAngle / 2;
      
      // After rotation, this center is at: (segmentCenter - visualRotation) mod 360
      let rotatedCenter = (segmentCenter - visualRotation) % 360;
      if (rotatedCenter < 0) rotatedCenter += 360;
      
      // Calculate angular distance from pointer (0 degrees)
      // Consider both clockwise and counter-clockwise distances
      let distance = Math.min(rotatedCenter, 360 - rotatedCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedIndex(null);
    setHasSpun(true);

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
        // Calculate which segment the pointer is pointing to after spin stops
        const finalSegmentIndex = getSegmentFromRotation(currentRotation);
        setSelectedIndex(finalSegmentIndex);
        setIsSpinning(false);
        // Create celebration particles
        setParticles([]);
        setTimeout(() => {
          for (let i = 0; i < 30; i++) {
            setTimeout(() => {
              setParticles((prev) => [
                ...prev,
                {
                  id: Math.random(),
                  x: 50,
                  y: 50,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  size: 4 + Math.random() * 6,
                  color: DISCOUNT_SEGMENTS[finalSegmentIndex].accent,
                  life: 1,
                },
              ]);
            }, i * 20);
          }
        }, 100);
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
      className="fixed z-[9998] flex items-center justify-center px-2 sm:px-3 py-2 sm:py-4 overflow-hidden"
      style={{
        top: 'var(--header-height, 0px)',
        left: '0',
        right: '0',
        bottom: '0',
        height: 'calc(100vh - var(--header-height, 0px))',
        maxHeight: 'calc(100vh - var(--header-height, 0px))',
      }}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={() => !isSpinning && onClose()}
      />

      <div className="relative max-w-6xl w-full bg-gradient-to-br from-slate-50/95 via-white/90 to-blue-50/95 border border-slate-300/70 shadow-[0px_20px_80px_rgba(15,36,57,0.15)] rounded-2xl sm:rounded-[32px] p-3 sm:p-4 md:p-6 lg:p-7 overflow-hidden max-h-[95vh] sm:max-h-[92vh]">
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

        {/* Particles overlay */}
        {particles.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  opacity: particle.life,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-center">
            <div className="relative flex items-center justify-center w-full md:w-auto flex-shrink-0">
              <div className="relative w-[240px] h-[240px] xs:w-[260px] xs:h-[260px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px]">
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
                
                {/* Main wheel with enhanced shadows */}
                <div
                  ref={wheelRef}
                  className="absolute inset-2 rounded-full overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.15),0_0_50px_rgba(0,0,0,0.2)]"
                  style={{
                    backgroundImage: `conic-gradient(${gradientString})`,
                    transform: `rotate(${rotation - POINTER_ROTATION_OFFSET}deg)`,
                    transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
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
                          <div className="text-[10px] xs:text-[11px] sm:text-[13px] md:text-[14px] font-bold text-white mb-0.5 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            {segment.label}
                          </div>
                          <div className="text-[8px] xs:text-[8.5px] sm:text-[9px] md:text-[10px] font-medium text-white whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
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
                    className={`relative w-24 h-24 xs:w-26 xs:h-26 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white uppercase tracking-[0.25em] text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] font-bold shadow-[0_20px_50px_rgba(15,36,57,0.4),0_0_0_3px_rgba(255,255,255,0.3)] sm:shadow-[0_20px_50px_rgba(15,36,57,0.4),0_0_0_4px_rgba(255,255,255,0.3)] transition-all duration-300 pointer-events-auto ${
                      isSpinning 
                        ? 'scale-95' 
                        : 'hover:scale-110 hover:shadow-[0_25px_60px_rgba(15,36,57,0.5)] active:scale-95'
                    } disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group z-20`}
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

              <div className="bg-white/80 border border-slate-300 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 space-y-2 sm:space-y-2.5 shadow-[0_10px_30px_rgba(15,36,57,0.1)]">
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
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SpinWheelModal;

