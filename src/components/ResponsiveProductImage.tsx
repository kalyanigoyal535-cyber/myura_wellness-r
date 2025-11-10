import React, { useMemo, useState } from 'react';

export type ResponsiveImageSource = {
  srcSet: string;
  type?: string;
  media?: string;
};

export type ResponsiveImageDescriptor = {
  alt: string;
  fallback: string;
  placeholder?: string;
  sources: ResponsiveImageSource[];
  width?: number;
  height?: number;
  fallbackSrcSet?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
};

type ResponsiveProductImageProps = {
  image: ResponsiveImageDescriptor;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
};

const combineClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const ResponsiveProductImage: React.FC<ResponsiveProductImageProps> = ({
  image,
  className,
  imgClassName,
  loading,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const placeholderStyles = useMemo(() => {
    if (!image.placeholder) {
      return undefined;
    }

    return {
      backgroundImage: `url(${image.placeholder})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(20px)',
      transform: 'scale(1.05)',
    } as React.CSSProperties;
  }, [image.placeholder]);

  const resolvedLoading = loading ?? (image.fetchPriority === 'high' ? 'eager' : 'lazy');

  return (
    <div className={combineClasses('relative overflow-hidden', className)}>
      <div
        className={combineClasses(
          'pointer-events-none absolute inset-0 bg-slate-100 transition-opacity duration-500 ease-out',
          isLoaded ? 'opacity-0' : 'opacity-100'
        )}
        aria-hidden="true"
        style={placeholderStyles}
      />
      <picture className="relative z-10 block h-full w-full">
        {image.sources.map((source) => (
          <source
            key={`${source.type ?? 'default'}-${source.media ?? 'all'}-${source.srcSet}`}
            srcSet={source.srcSet}
            type={source.type}
            media={source.media}
          />
        ))}
        <img
          src={image.fallback}
          srcSet={image.fallbackSrcSet}
          alt={image.alt}
          loading={resolvedLoading}
          decoding="async"
          width={image.width}
          height={image.height}
          className={combineClasses(
            'block h-full w-full object-cover transition-opacity duration-500 ease-out',
            isLoaded ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
          onLoad={() => setIsLoaded(true)}
          fetchPriority={image.fetchPriority}
        />
      </picture>
    </div>
  );
};

export default ResponsiveProductImage;

