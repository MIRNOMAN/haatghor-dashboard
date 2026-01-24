/**
 * API Proxy Configuration
 * Centralized configuration for all API endpoints and base URLs
 */

import { BASEAPI } from "./baseApi";

// Get base API URL
const getBaseURL = () => BASEAPI();

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyOTP: "/auth/verify-otp",
    resendOTP: "/auth/resend-otp",
  },

  // User Management
  users: {
    base: "/users",
    me: "/users/me",
    byId: (id: string) => `/users/${id}`,
    updateProfile: "/users/update-profile",
    updateProfileImage: "/users/update-profile-image",
    updateRole: (id: string) => `/users/user-role/${id}`,
    updateStatus: (id: string) => `/users/user-status/${id}`,
    deleteProfile: "/users/delete-my-profile",
    undelete: (id: string) => `/users/undelete-user/${id}`,
  },

  // Products
  products: {
    base: "/products",
    byId: (id: string) => `/products/${id}`,
    bySlug: (slug: string) => `/products/slug/${slug}`,
  },

  // Categories
  categories: {
    base: "/categories",
    byId: (id: string) => `/categories/${id}`,
  },

  // Orders
  orders: {
    base: "/orders",
    byId: (id: string) => `/orders/${id}`,
    myOrders: "/orders/me",
    adminAll: "/orders/admin/all",
    updateStatus: (id: string) => `/orders/admin/${id}/status`,
  },

  // Banners
  banners: {
    base: "/banners",
    byId: (id: string) => `/banners/${id}`,
  },

  // Reviews
  reviews: {
    base: "/reviews",
    byId: (id: string) => `/reviews/${id}`,
    byProduct: (productId: string) => `/reviews/product/${productId}`,
  },

  // Cart
  cart: {
    base: "/cart",
    addItem: "/cart/add",
    updateItem: (id: string) => `/cart/${id}`,
    removeItem: (id: string) => `/cart/${id}`,
    clear: "/cart/clear",
  },

  // Wishlist
  wishlist: {
    base: "/wishlist",
    toggle: "/wishlist/toggle",
  },

  // Addresses
  addresses: {
    base: "/addresses",
    byId: (id: string) => `/addresses/${id}`,
  },

  // Payments
  payments: {
    base: "/payments",
    byId: (id: string) => `/payments/${id}`,
    initiate: "/payments/initiate",
    verify: "/payments/verify",
  },

  // Subscriptions
  subscriptions: {
    base: "/subscriptions",
    byId: (id: string) => `/subscriptions/${id}`,
  },

  // Notifications
  notifications: {
    base: "/notifications",
    byId: (id: string) => `/notifications/${id}`,
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: "/notifications/read-all",
  },

  // Assets (File Upload)
  assets: {
    upload: "/assets/upload",
    uploadMultiple: "/assets/upload-multiple",
  },

  // Admin Dashboard
  admin: {
    stats: "/admin/dashboard/stats",
  },

  // FAQ (Future implementation)
  faq: {
    base: "/faq",
    byId: (id: string) => `/faq/${id}`,
  },

  // Contact Us (Future implementation)
  contact: {
    base: "/contact",
    byId: (id: string) => `/contact/${id}`,
  },

  // Privacy Policy (Future implementation)
  privacy: {
    base: "/privacy-policy",
    byId: (id: string) => `/privacy-policy/${id}`,
  },
} as const;

/**
 * Build full URL with base API
 */
export const buildURL = (endpoint: string): string => {
  const base = getBaseURL();
  return `${base}${endpoint}`;
};

/**
 * Proxy configuration for development
 */
export const PROXY_CONFIG = {
  development: {
    target: process.env.NEXT_PUBLIC_BASEURL_DEV || "http://localhost:5000",
    changeOrigin: true,
    secure: false,
  },
  production: {
    target: process.env.NEXT_PUBLIC_BASEURL_PROD || "https://api.haatghor.com",
    changeOrigin: true,
    secure: true,
  },
};

/**
 * Get proxy configuration based on environment
 */
export const getProxyConfig = () => {
  const isDev = process.env.NODE_ENV === "development";
  return isDev ? PROXY_CONFIG.development : PROXY_CONFIG.production;
};

/**
 * API Headers configuration
 */
export const API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Upload headers for multipart/form-data
 */
export const UPLOAD_HEADERS = {
  Accept: "application/json",
  // Content-Type is auto-set by browser for FormData
};

export default {
  API_ENDPOINTS,
  buildURL,
  getProxyConfig,
  API_HEADERS,
  UPLOAD_HEADERS,
};
