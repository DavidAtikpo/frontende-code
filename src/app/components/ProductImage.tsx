import Image from 'next/image';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

type ProductImageProps = {
  images: string | string[];
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

function ProductImage({ images, alt, width = 300, height = 300, className = '' }: ProductImageProps) {
  const getImageUrl = (imagePath: string | string[]) => {
    if (!imagePath) return '/images/default-product.jpg';
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return '/images/default-product.jpg';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/uploads/${path}`;
  };

  return (
    <Image
      src={getImageUrl(images)}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

export default ProductImage; 