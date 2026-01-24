import { SVGProps } from "react";

/* ---------- Icon Props ---------- */
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/* ---------- User Role ---------- */
export const userRole = {
  admin: "admin",
  user: "user",
} as const;

export type TUserRole = keyof typeof userRole;

/* ---------- User Type ---------- */
export type TUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  status?: string;
  isDeleted?: boolean;
};

/* ---------- Login Type ---------- */
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

/* ---------- Query Param ---------- */
export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};

/* ---------- Error Type ---------- */
export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

/* ---------- Meta ---------- */
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

export type T_ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/* ---------- API Response with Pagination ---------- */
export type T_ApiResponseMeta = {
  total: number;
  totalPage: number;
  page: number;
  limit: number;
};

export type T_ApiResponseForPagination<T> = {
  success: boolean;
  message: string;
  data: {
    meta: T_ApiResponseMeta;
    data?: T;
  };
};

/* ---------- Error Response ---------- */
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

/* ---------- Example Usage ---------- */
const exampleResponse: T_ApiResponseForPagination<TUser[]> = {
  success: true,
  message: "Users fetched",
  data: {
    meta: { total: 100, totalPage: 10, page: 1, limit: 10 },
    data: [
      { id: "1", name: "Alice", email: "alice@example.com", role: "admin" },
      { id: "2", name: "Bob", email: "bob@example.com", role: "user" },
    ],
  },
};

console.log("Users array length:", exampleResponse.data?.data?.length);
console.log("Meta info:", exampleResponse.data.meta);
