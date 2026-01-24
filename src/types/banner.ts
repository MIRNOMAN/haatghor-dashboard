export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  position: 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR';
  status: 'ACTIVE' | 'INACTIVE';
  startDate?: string;
  endDate?: string;
  order: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerInput {
  title: string;
  description?: string;
  image: string;
  link?: string;
  position: 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR';
  status?: 'ACTIVE' | 'INACTIVE';
  startDate?: string;
  endDate?: string;
  order?: number;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {
  id: string;
}
