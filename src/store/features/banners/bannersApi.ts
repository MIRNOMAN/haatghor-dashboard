import { baseApi } from "@/store/api";
import { Banner, CreateBannerInput, UpdateBannerInput } from "@/types/banner";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";

export const bannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all banners
    getAllBanners: builder.query<
      T_ApiResponseForPagination<Banner[]>,
      { page?: number; limit?: number; position?: string }
    >({
      query: ({ page = 1, limit = 10, position }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (position) params.append('position', position);
        
        return `/banners?${params.toString()}`;
      },
      providesTags: ['Banners'],
    }),

    // Get banner by ID
    getBannerById: builder.query<T_ApiResponse<Banner>, string>({
      query: (id) => `/banners/${id}`,
      providesTags: ['Banners'],
    }),

    // Create banner
    createBanner: builder.mutation<T_ApiResponse<Banner>, FormData>({
      query: (formData) => ({
        url: '/banners',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Banners'],
    }),

    // Update banner
    updateBanner: builder.mutation<T_ApiResponse<Banner>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/banners/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Banners'],
    }),

    // Delete banner
    deleteBanner: builder.mutation<T_ApiResponse<null>, string>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banners'],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApi;
