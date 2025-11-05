import React from 'react';

type ResponsiveImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
};

// Lightweight <picture> wrapper that tries AVIF/WebP first, falls back to the original src.
// If alternate formats don't exist, the browser will simply load the <img> fallback.
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  style,
  loading = 'lazy',
  decoding = 'async',
}) => {
  const isRaster = /\.(png|jpe?g)$/i.test(src);
  const to = (ext: string) => src.replace(/\.(png|jpe?g)$/i, `.${ext}`);

  return (
    <picture>
      {isRaster && (
        <>
          {/* Try modern formats first if the file naming follows the same basename convention */}
          <source type="image/avif" srcSet={to('avif')} sizes={sizes} />
          <source type="image/webp" srcSet={to('webp')} sizes={sizes} />
        </>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        className={className}
        style={style}
      />
    </picture>
  );
};

export default ResponsiveImage;
