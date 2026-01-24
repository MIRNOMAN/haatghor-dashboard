import { SVGProps } from "react";

/* ---------- Icon Props ---------- */
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/* ---------- User Roles ---------- */
export const userRole = {
  admin: "admin",
  user: "user",
  superadmin: "SUPERADMIN",
} as const;

export type TUserRole = keyof typeof userRole;

/* ---------- User Type ---------- */
export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  name?: string; // optional combined name
  email: string;
  role: TUserRole | string;
  phoneNumber?: string;
  address?: string;
  status?: "ACTIVE" | "INACTIVE";
  isDeleted?: boolean;
  profilePhoto?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

/* ---------- Login Type ---------- */
export type TLogin = {
  _id: string;
  name: string;
  accessToken: string;
  photos?: { thumbnail: string; cover: string };
  category?: string;
  quantity?: number;
  price?: number;
  stock?: number;
  discount?: number;
  isDeleted?: boolean;
  ratings?: number[];
  createdAt?: Date;
  updatedAt?: Date;
};

/* ---------- Query Param ---------- */
export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};

/* ---------- Error Type ---------- */
export type TError = {
  data: {
    message: string;
    stack?: string;
    success: boolean;
  };
  status: number;
};

/* ---------- Meta Info ---------- */
export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

/* ---------- Generic API Response ---------- */
export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

/* ---------- API Response ---------- */
export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/* ---------- API Response with Pagination ---------- */
export type TApiResponseMeta = {
  total: number;
  totalPage: number;
  page: number;
  limit: number;
};

export type TApiResponseWithPagination<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta: TApiResponseMeta;
};

/* ---------- Error Response ---------- */
export type TErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  data: {
    success: boolean;
    message: string;
    stack?: string;
    errorSources: TErrorSource[];
  };
  status: number;
}
