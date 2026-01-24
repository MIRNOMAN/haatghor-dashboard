export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  productCount?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}
