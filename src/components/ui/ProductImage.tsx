import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProductImage = ({ src, alt, className = '' }: ProductImageProps) => {
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Image
        src={error ? '/no-image.png' : src}
        alt={alt}
        width={100}
        height={100}
        className="object-cover"
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default ProductImage;
