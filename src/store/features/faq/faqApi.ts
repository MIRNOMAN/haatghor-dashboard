import { baseApi } from "@/store/api";
import { FAQ, CreateFAQInput, UpdateFAQInput } from "@/types/faq";
import { T_ApiResponseForPagination } from "@/types";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all FAQs
    getAllFAQs: builder.query<
      T_ApiResponseForPagination<FAQ[]>,
      { page?: number; limit?: number; search?: string; category?: string }
    >({
      query: ({ page = 1, limit = 10, search, category }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);
        if (category) params.append("category", category);

        return `/faqs?${params.toString()}`;
      },
      providesTags: ["FAQ"],
    }),

    // Get FAQ by ID
    getFAQById: builder.query<T_ApiResponse<FAQ>, string>({
      query: (id) => `/faqs/${id}`,
      providesTags: ["FAQ"],
    }),

    // Create FAQ
    createFAQ: builder.mutation<T_ApiResponse<FAQ>, CreateFAQInput>({
      query: (data) => ({
        url: "/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),

    // Update FAQ
    updateFAQ: builder.mutation<T_ApiResponse<FAQ>, UpdateFAQInput>({
      query: ({ id, ...data }) => ({
        url: `/faqs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),

    // Delete FAQ
    deleteFAQ: builder.mutation<T_ApiResponse<null>, string>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetAllFAQsQuery,
  useGetFAQByIdQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqApi;
