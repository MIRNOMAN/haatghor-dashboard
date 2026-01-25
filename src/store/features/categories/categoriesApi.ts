import { baseApi } from "@/store/api";
import { Category, CreateCategoryInput } from "@/types/category";
import { TApiResponse, T_ApiResponseForPagination } from "@/types";

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
    getCategoryById: builder.query<TApiResponse<Category>, string>({
      query: (id) => `/categories/${id}`,
      providesTags: ['Categories'],
    }),

    // Create category
    createCategory: builder.mutation<TApiResponse<Category>, CreateCategoryInput>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),

    // Update category
    updateCategory: builder.mutation<TApiResponse<Category>, { id: string; body: Partial<CreateCategoryInput> }>({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),

    // Delete category
    deleteCategory: builder.mutation<TApiResponse<null>, string>({
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
