export type OrderStatus = 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    thumbnail?: string;
  };
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
