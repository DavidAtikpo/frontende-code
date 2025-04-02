export interface OrderItem {
  _id: string;
  name: string;
  image: string | null;
  quantity: number;
  price: number;
  sellerId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
} 