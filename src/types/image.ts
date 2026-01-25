export interface Image {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  url: string;
  mimetype: string;
  size: number;
  category?: string;
  alt?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImageInput {
  category?: string;
  alt?: string;
  description?: string;
}

export interface UpdateImageInput {
  id: string;
  category?: string;
  alt?: string;
  description?: string;
  isActive?: boolean;
}

export interface UploadImageResponse {
  success: boolean;
  data: Image | Image[];
  message: string;
}
