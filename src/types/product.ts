export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  subCategory?: string;
  discount?: {
    percentage: number;
    startDate: string;
    endDate: string;
  };
  metadata?: {
    keywords: string[];
    brand?: string;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  };
  videoUrl?: string;
} 