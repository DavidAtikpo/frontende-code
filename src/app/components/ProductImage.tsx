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
    if (!imagePath) return "/placeholder.jpg";
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) {
      return path;
    }
    return `${BASE_URL}/${path.replace(/^\/+/, '')}`;
  };

  return (
    <img
      src={getImageUrl(images)}
      alt={alt}
      width={width}
      height={height}
      className={`${className} object-cover w-16 h-16 rounded-md`}
      onError={(e) => {
        console.error('Erreur de chargement image:', e);
        const target = e.target as HTMLImageElement;
        target.src = "/placeholder.jpg";
      }}
    />
  );
}

export default ProductImage;