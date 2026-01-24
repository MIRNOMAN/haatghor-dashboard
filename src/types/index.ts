import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const userRole = {
  admin: "admin",
  user: "user",
} as const;

export type TUserRole = keyof typeof userRole;

export type TUser = {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  address?: string
  status?: string
  isDeleted?: boolean
}


export type T_Login = {
  _id: string;
  name: string;
  accessToken: string;
  photos: { thumbnail: string; cover: string };
  category: string;
  quantity: number;
  price: number;
  stock: number;
  discount: number;
  isDeleted: boolean;
  ratings: number[];
  createdAt: Date;
  updatedAt: Date;
};

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};
export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

export type T_ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type T_ApiResponseMeta = {
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};
export type T_ApiResponseForPagination<T> = {
  success: boolean;
  message: string;
  data: {
    meta: T_ApiResponseMeta;
    result: T;
  };
};

export type T_ErrorSource = {
  path: string;
  message: string;
};

export interface I_ErrorResponse {
  data: {
    success: boolean;
    message: string;
    stack?: string;
    errorSources: T_ErrorSource[];
  };
  status: number;
}
