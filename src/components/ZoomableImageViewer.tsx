import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef, ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import ResponsiveProductImage, { ResponsiveImageDescriptor } from './ResponsiveProductImage';

type ZoomableImageViewerProps = {
  image?: ResponsiveImageDescriptor;
  frameClassName?: string;
  imageClassName?: string;
  onClose?: () => void;
};

const combineClasses = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(' ');

const ZoomableImageViewer: React.FC<ZoomableImageViewerProps> = ({
  image,
  frameClassName,
  imageClassName,
  onClose,
}) => {
  const [currentScale, setCurrentScale] = useState(1);

  if (!image) {
    return null;
  }

  const frameClasses = combineClasses('w-full max-w-2xl lg:max-w-3xl', frameClassName);
  const resolvedImageClasses = combineClasses(
    'object-contain w-full max-h-[80vh] rounded-[1.75rem] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.65)]',
    imageClassName
  );

  return (
    <TransformWrapper
      initialScale={1}
      minScale={1}
      maxScale={4}
      doubleClick={{ disabled: true }}
      panning={{ velocityDisabled: true }}
      centerOnInit
      limitToBounds
      onTransformed={(ref: ReactZoomPanPinchRef) => {
        setCurrentScale(ref.state.scale);
      }}
    >
      {(controls: ReactZoomPanPinchContentRef) => {
        const { zoomIn, zoomOut, resetTransform } = controls;
        return (
          <div className="relative h-full w-full" style={{ touchAction: 'none' }}>
            <TransformComponent
              wrapperClass="w-full h-full flex items-center justify-center"
              contentClass="w-full h-full flex items-center justify-center"
            >
              <ResponsiveProductImage
                image={image}
                className={frameClasses}
                imgClassName={resolvedImageClasses}
                loading="eager"
              />
            </TransformComponent>
            <div className="pointer-events-auto absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/25 bg-slate-950/70 px-3 py-1 text-white shadow-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => zoomOut()}
                aria-label="Zoom out"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
                disabled={currentScale <= 1.05}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex min-w-[70px] flex-col text-center">
                <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/70">Zoom</span>
                <span className="text-base font-semibold">{currentScale.toFixed(1)}×</span>
              </div>
              <button
                type="button"
                onClick={() => zoomIn()}
                aria-label="Zoom in"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => resetTransform()}
                aria-label="Reset zoom"
                className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/5 transition hover:bg-white/15"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="pointer-events-auto absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-slate-950/70 text-white shadow-md backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              aria-label="Close zoom preview"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          </div>
        );
      }}
    </TransformWrapper>
  );
};

export default ZoomableImageViewer;


