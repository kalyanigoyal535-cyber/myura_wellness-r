import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Droplets,
  ShieldCheck,
  Leaf,
  ArrowRight,
} from 'lucide-react';
import ResponsiveProductImage, { type ResponsiveImageDescriptor } from './ResponsiveProductImage';

type LuxuryProduct = {
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  spotlight?: {
    badge?: string;
    headline: string;
    subheadline?: string;
    highlights: string[];
    callouts?: Array<{
      text: string;
      position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    }>;
  };
};

type LuxuryModalContext = {
  product: LuxuryProduct;
  image: ResponsiveImageDescriptor;
  spotlightImage?: string;
};

type ProductLuxuryModalProps = {
  context: LuxuryModalContext | null;
  onClose: () => void;
};

const ProductLuxuryModal: React.FC<ProductLuxuryModalProps> = ({ context, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!context) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      style.overflow = prevOverflow;
    };
  }, [context, onClose]);

  useEffect(() => {
    if (!context || !panelRef.current) return;
    panelRef.current.focus();
  }, [context]);

  if (!context) return null;

  const { product, image, spotlightImage } = context;
  const spotlight = product.spotlight ?? {
    headline: product.name,
    highlights: [],
  };
  const headline = spotlight.headline ?? product.name;
  const subheadline = spotlight.subheadline ?? 'Formulated to amplify your daily ritual with clinical-grade botanicals.';
  const highlights = spotlight.highlights?.length ? spotlight.highlights : [
    'Premium botanicals sourced from certified farms',
    'Lab-tested for purity and heavy metal safety',
    'Crafted in small batches for maximum potency',
  ];

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 sm:px-8">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-[18px] transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} spotlight modal`}
        tabIndex={-1}
        ref={panelRef}
        className="relative w-full max-w-[min(90vw,1080px)] max-h-[92vh] overflow-hidden rounded-[2.75rem] border border-white/12 bg-gradient-to-br from-white/90 via-white/96 to-slate-50/92 shadow-[0_48px_120px_-40px_rgba(15,23,42,0.55)] outline-none"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-br from-rose-200/40 via-white/0 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-52 bg-gradient-to-tr from-emerald-200/40 via-white/0 to-transparent blur-3xl" />

        <div className="relative flex max-h-[92vh] flex-col items-center gap-8 overflow-y-auto p-6 sm:p-10 lg:px-14 lg:py-12 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-500 transition-all duration-200 hover:border-rose-200 hover:text-rose-500"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center gap-0">
            <h2 className="text-[1.95rem] sm:text-[2.15rem] font-sharp font-semibold leading-snug tracking-tight text-slate-900">
              {headline}
            </h2>
            <p className="mt-2 max-w-[520px] text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
              {subheadline}
            </p>
          </div>

          <div className="relative w-full max-w-[820px]">
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div className="flex flex-col items-start gap-3 lg:items-start lg:text-left">
                <div className="flex flex-col items-start gap-1 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-500">
                    Exclusive Launch
                  </span>
                  <span className="text-[1.75rem] font-display font-semibold text-slate-900">
                    ₹{product.price}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    MRP ₹{product.originalPrice} · Save {product.discountPercent}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-full border border-emerald-200/60 bg-emerald-50 p-2 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full border border-lime-200/60 bg-lime-50 p-2 text-lime-600">
                    <Leaf className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-4 flex w-full max-w-[240px] flex-col gap-4">
                  {highlights.slice(0, Math.ceil(highlights.length / 2)).map((item) => (
                    <div
                      key={`left-${item}`}
                      className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-3.5 shadow-[0_28px_60px_-38px_rgba(15,23,42,0.35)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-50/40 via-transparent to-emerald-50/40 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                      <div className="relative flex items-start justify-center gap-2 text-slate-700 lg:justify-end">
                        <Droplets className="mt-0.5 h-5 w-5 text-rose-400" />
                        <span className="text-sm font-medium leading-relaxed lg:text-right">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto flex items-center justify-center">
                <div className="relative overflow-hidden rounded-[2.4rem] border border-white/25 bg-gradient-to-br from-slate-50 via-white to-rose-50 shadow-[0_36px_80px_-40px_rgba(236,72,153,0.45)]">
                  <div className="absolute -top-16 -left-16 h-36 w-36 rounded-full bg-rose-400/20 blur-3xl" />
                  <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-teal-300/25 blur-3xl" />
                  <div className="relative">
                    {spotlightImage ? (
                      <img
                        src={spotlightImage}
                        alt={`${product.name} ritual spotlight`}
                        className="block h-[320px] w-[min(320px,68vw)] object-cover object-[center_45%] drop-shadow-[0_30px_55px_rgba(236,72,153,0.38)]"
                      />
                    ) : (
                      <ResponsiveProductImage
                        image={image}
                        className="w-[min(320px,68vw)]"
                        imgClassName="h-[320px] w-full object-cover object-[center_45%] drop-shadow-[0_30px_55px_rgba(236,72,153,0.38)]"
                      />
                    )}
                  </div>
                  {spotlight.badge && (
                    <span className="absolute top-6 right-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-800 backdrop-blur">
                      <Sparkles className="h-4 w-4 text-rose-500" />
                      {spotlight.badge}
                    </span>
                  )}
                </div>

                {spotlight.callouts && spotlight.callouts.length > 0 && (
                  <div className="pointer-events-none absolute inset-0">
                    {spotlight.callouts.map((callout) => (
                      <span
                        key={callout.text}
                        className="absolute max-w-[200px] rounded-2xl bg-gradient-to-r from-[#ff6fbe] via-[#f354b3] to-[#f051ac] px-3.5 py-2.5 text-[12px] font-semibold leading-tight text-white shadow-[0_32px_72px_-40px_rgba(236,72,153,0.55)]"
                        style={(() => {
                          switch (callout.position) {
                            case 'top-left':
                              return { top: '6%', left: '-18%' };
                            case 'top-right':
                              return { top: '4%', right: '-18%' };
                            case 'bottom-left':
                              return { bottom: '6%', left: '-20%' };
                            case 'bottom-right':
                              return { bottom: '4%', right: '-18%' };
                            default:
                              return {};
                          }
                        })()}
                      >
                        {callout.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-4 lg:items-start lg:text-left">
                <div className="mt-[70px] flex w-full max-w-[260px] flex-col gap-4">
                  {highlights.slice(Math.ceil(highlights.length / 2)).map((item) => (
                    <div
                      key={`right-${item}`}
                      className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-3.5 shadow-[0_28px_60px_-38px_rgba(15,23,42,0.35)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/40 via-transparent to-rose-50/40 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                      <div className="relative flex items-start gap-2 text-slate-700">
                        <Droplets className="mt-0.5 h-5 w-5 text-rose-400" />
                        <span className="text-sm font-medium leading-relaxed">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_32px_64px_-28px_rgba(15,23,42,0.6)] transition-all duration-300 hover:shadow-[0_40px_70px_-25px_rgba(15,23,42,0.7)]"
            >
              Add To Ritual
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200/70 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-[0_28px_54px_-32px_rgba(15,23,42,0.4)] transition-all duration-300 hover:border-rose-200 hover:text-rose-500"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export type { LuxuryModalContext };
export default ProductLuxuryModal;
