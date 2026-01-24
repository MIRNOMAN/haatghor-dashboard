export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQInput {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateFAQInput extends Partial<CreateFAQInput> {
  id: string;
}
