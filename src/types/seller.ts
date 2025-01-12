interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  status: string;
  location: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
}

interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessInfo: any;
  verificationStatus: string;
  subscriptionStatus: string;
  subscriptionEndsAt?: string;
  trialEndsAt?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  shop: Shop | null;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageRating: number;
    pendingOrders: number;
    monthlyRevenue: number;
    totalProducts: number;
    viewsCount: number;
  };
}

export type { SellerProfile, Shop }; 