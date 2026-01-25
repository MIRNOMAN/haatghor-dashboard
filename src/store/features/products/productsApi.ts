import { baseApi } from "@/store/api";
import { Product, CreateProductInput, UpdateProductInput } from "@/types/product";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with pagination
    getAllProducts: builder.query<
      T_ApiResponseForPagination<Product[]>,
      { page?: number; limit?: number; search?: string; categoryId?: string }
    >({
      query: ({ page = 1, limit = 10, search, categoryId }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append('search', search);
        if (categoryId) params.append('categoryId', categoryId);
        
        return `/products?${params.toString()}`;
      },
      providesTags: ['Products'],
    }),

    // Get product by ID
    getProductById: builder.query<T_ApiResponse<Product>, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),

    // Create product
    createProduct: builder.mutation<T_ApiResponse<Product>, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),

    // Update product
    updateProduct: builder.mutation<T_ApiResponse<Product>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),

    // Delete product
    deleteProduct: builder.mutation<T_ApiResponse<null>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
