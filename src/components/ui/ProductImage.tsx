import { API_CONFIG } from "@/utils/config";
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
  
  if (path.startsWith("http")) {
    return path.replace("http://localhost:5000", BASE_URL);
  }
  return `${BASE_URL}/uploads/products/${path.replace(/^\/+/, '')}`;
};

export default function ProductImage({
  images,
  alt,
  width = 300,
  height = 300,
  className = ""
}: ProductImageProps) {
  return (
    <img
      src={getImageUrl(images)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        console.error('Erreur de chargement image:', e);
        const target = e.target as HTMLImageElement;
        target.src = "/placeholder.jpg";
      }}
    />
  );
} 