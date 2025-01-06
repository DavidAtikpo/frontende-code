import Image from 'next/image';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface ProductImageProps {
  images: string | string[];
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) return "/placeholder.jpg";
  const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads")) return `${BASE_URL}${path}`;
  if (path.startsWith("uploads/")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}/uploads/${path}`;
};

const ProductImage = ({ images, alt, width = 300, height = 300, className = "" }: ProductImageProps) => {
  return (
    <Image
      src={getImageUrl(images)}
      alt={alt || "Product image"}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/placeholder.jpg";
      }}
      priority={true}
      unoptimized={process.env.NODE_ENV === 'development'}
    />
  );
};

export default ProductImage; 