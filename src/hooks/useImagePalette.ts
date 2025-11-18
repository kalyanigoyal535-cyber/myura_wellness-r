import { useEffect, useMemo, useState } from 'react';
import type { ResponsiveImageDescriptor } from '../components/ResponsiveProductImage';

type RGB = {
  r: number;
  g: number;
  b: number;
};

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };

const clamp = (value: number) => Math.max(0, Math.min(255, value));

const mix = (color: RGB, target: RGB, amount: number): RGB => ({
  r: clamp(Math.round(color.r + (target.r - color.r) * amount)),
  g: clamp(Math.round(color.g + (target.g - color.g) * amount)),
  b: clamp(Math.round(color.b + (target.b - color.b) * amount)),
});

const lighten = (color: RGB, amount: number) => mix(color, WHITE, amount);
const darken = (color: RGB, amount: number) => mix(color, BLACK, amount);

const componentToHex = (value: number) => value.toString(16).padStart(2, '0');
const toHex = (color: RGB) =>
  `#${componentToHex(color.r)}${componentToHex(color.g)}${componentToHex(color.b)}`;
const toRgb = (color: RGB) => `${color.r}, ${color.g}, ${color.b}`;
const toRgba = (color: RGB, alpha: number) => `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

const luminance = (color: RGB) => {
  const normalize = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const r = normalize(color.r);
  const g = normalize(color.g);
  const b = normalize(color.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export type ImagePalette = {
  base: string;
  dark: string;
  darker: string;
  light: string;
  lighter: string;
  muted: string;
  border: string;
  borderStrong: string;
  contrastText: string;
  rgbString: string;
  accentRgb: string;
  heroGradient: string;
  softGradient: string;
  cardGradient: string;
  ctaGradient: string;
  pageBackground: string;
  chipBg: string;
  chipText: string;
  shadow: string;
  glow: string;
  highlight: string;
};

const buildPalette = (color: RGB): ImagePalette => {
  const dark = darken(color, 0.2);
  const darker = darken(color, 0.35);
  const light = lighten(color, 0.25);
  const lighter = lighten(color, 0.45);
  const muted = lighten(color, 0.75);
  const accent = lighten(color, 0.1);

  return {
    base: toHex(color),
    dark: toHex(dark),
    darker: toHex(darker),
    light: toHex(light),
    lighter: toHex(lighter),
    muted: toHex(muted),
    border: toRgba(color, 0.35),
    borderStrong: toRgba(dark, 0.55),
    contrastText: luminance(color) > 0.62 ? '#0f172a' : '#ffffff',
    rgbString: toRgb(color),
    accentRgb: toRgb(accent),
    heroGradient: `linear-gradient(135deg, ${toRgba(lighter, 0.95)} 0%, ${toRgba(
      light,
      0.9,
    )} 48%, ${toRgba(dark, 0.95)} 100%)`,
    softGradient: `linear-gradient(130deg, ${toRgba(lighter, 0.75)} 0%, #ffffff 65%, ${toRgba(
      muted,
      0.7,
    )} 100%)`,
    cardGradient: `linear-gradient(140deg, ${toRgba(lighten(color, 0.6), 0.7)} 0%, #ffffff 80%)`,
    ctaGradient: `linear-gradient(90deg, ${toHex(darken(color, 0.05))} 0%, ${toHex(
      color,
    )} 50%, ${toHex(darken(color, 0.12))} 100%)`,
    pageBackground: `linear-gradient(180deg, ${toRgba(lighten(color, 0.85), 0.55)} 0%, #ffffff 45%, ${toRgba(
      lighten(color, 0.75),
      0.35,
    )} 100%)`,
    chipBg: toRgba(lighter, 0.4),
    chipText: toHex(dark),
    shadow: `0 35px 85px -45px ${toRgba(darker, 0.55)}`,
    glow: `radial-gradient(circle, ${toRgba(light, 0.35)} 0%, transparent 70%)`,
    highlight: toRgba(light, 0.3),
  };
};

// Product-specific default colors based on their accent gradients
const PRODUCT_DEFAULT_COLORS: Record<string, RGB> = {
  'dia-care': { r: 244, g: 114, b: 182 }, // rose-400
  'liver-detox': { r: 45, g: 212, b: 191 }, // teal-400
  'bone-joint-support': { r: 99, g: 102, b: 241 }, // indigo-500
  'gut-and-digestion': { r: 251, g: 191, b: 36 }, // amber-400
  'womens-health-plus': { r: 236, g: 72, b: 153 }, // pink-500
  'mens-vitality-booster': { r: 14, g: 165, b: 233 }, // sky-500
};

const DEFAULT_COLOR: RGB = { r: 236, g: 120, b: 155 };
const DEFAULT_PALETTE = buildPalette(DEFAULT_COLOR);

const extractAverageColor = (img: HTMLImageElement): RGB => {
  const canvas = document.createElement('canvas');
  const size = 32;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return DEFAULT_COLOR;
  }

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  let r = 0;
  let g = 0;
  let b = 0;
  let total = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    if (alpha < 0.1) continue;
    r += data[i] * alpha;
    g += data[i + 1] * alpha;
    b += data[i + 2] * alpha;
    total += alpha;
  }

  if (total === 0) {
    return DEFAULT_COLOR;
  }

  return {
    r: Math.round(r / total),
    g: Math.round(g / total),
    b: Math.round(b / total),
  };
};

const useImagePalette = (image?: ResponsiveImageDescriptor | null, productId?: string): ImagePalette => {
  // Use product-specific default color if available, otherwise use generic default
  const defaultColor = productId && PRODUCT_DEFAULT_COLORS[productId] 
    ? PRODUCT_DEFAULT_COLORS[productId] 
    : DEFAULT_COLOR;
  const [palette, setPalette] = useState<ImagePalette>(buildPalette(defaultColor));

  useEffect(() => {
    if (!image?.fallback) {
      setPalette(buildPalette(defaultColor));
      return;
    }

    let isActive = true;
    
    // Preload image immediately with eager loading
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'sync'; // Sync decoding for faster processing
    img.loading = 'eager'; // Eager loading priority
    
    // Set src after setting up handlers
    img.onload = () => {
      if (!isActive) return;
      try {
        const average = extractAverageColor(img);
        setPalette(buildPalette(average));
      } catch {
        setPalette(buildPalette(defaultColor));
      }
    };

    img.onerror = () => {
      if (isActive) {
        setPalette(buildPalette(defaultColor));
      }
    };

    // Start loading immediately
    img.src = image.fallback;

    return () => {
      isActive = false;
    };
  }, [image?.fallback, defaultColor]);

  return useMemo(() => palette, [palette]);
};

export default useImagePalette;
