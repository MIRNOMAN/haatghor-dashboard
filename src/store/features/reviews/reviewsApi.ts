import { baseApi } from "@/store/api";
import { Review, UpdateReviewStatusInput } from "@/types/review";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews (admin)
    getAllReviews: builder.query<
      T_ApiResponseForPagination<Review[]>,
      { page?: number; limit?: number; status?: string; productId?: string }
    >({
      query: ({ page = 1, limit = 10, status, productId }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append('status', status);
        if (productId) params.append('productId', productId);
        
        return `/reviews?${params.toString()}`;
      },
      providesTags: ['Reviews'],
    }),

    // Get review by ID
    getReviewById: builder.query<T_ApiResponse<Review>, string>({
      query: (id) => `/reviews/${id}`,
      providesTags: ['Reviews'],
    }),

    // Update review status
    updateReviewStatus: builder.mutation<T_ApiResponse<Review>, UpdateReviewStatusInput>({
      query: ({ id, status }) => ({
        url: `/reviews/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Delete review
    deleteReview: builder.mutation<T_ApiResponse<null>, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewsApi;
