import { baseApi } from "@/store/api";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getAllCategories: builder.query<
      T_ApiResponseForPagination<Category[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append('search', search);
        
        return `/categories?${params.toString()}`;
      },
      providesTags: ['Categories'],
    }),

    // Get category by ID
    getCategoryById: builder.query<T_ApiResponse<Category>, string>({
      query: (id) => `/categories/${id}`,
      providesTags: ['Categories'],
    }),

    // Create category
    createCategory: builder.mutation<T_ApiResponse<Category>, FormData>({
      query: (formData) => ({
        url: '/categories',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Categories'],
    }),

    // Update category
    updateCategory: builder.mutation<T_ApiResponse<Category>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Categories'],
    }),

    // Delete category
    deleteCategory: builder.mutation<T_ApiResponse<null>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
