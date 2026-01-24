export interface Review {
  id: string;
  userId: string;
  productId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
    thumbnail?: string;
  };
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReviewStatusInput {
  id: string;
  status: 'APPROVED' | 'REJECTED';
}
