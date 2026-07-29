export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount?: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  images: string[];
  thumbnail?: string;
  tags?: string[];
  specifications?: Record<string, string>;
  variants?: Array<{
    name: string;
    value?: string;
    price?: number | null;
    stock?: number | null;
  }>;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  ratings?: number;
  reviewCount?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  images: string[];
  thumbnail?: string;
  tags?: string[];
  status?: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}
