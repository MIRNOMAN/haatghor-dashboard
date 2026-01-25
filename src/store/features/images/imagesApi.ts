import { baseApi } from "@/store/api";
import { Image, UpdateImageInput } from "@/types/image";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";

export const imagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all images
    getAllImages: builder.query<
      T_ApiResponseForPagination<Image[]>,
      { page?: number; limit?: number; search?: string; category?: string; isActive?: boolean }
    >({
      query: ({ page = 1, limit = 20, search, category, isActive }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append('searchTerm', search);
        if (category) params.append('category', category);
        if (isActive !== undefined) params.append('isActive', isActive.toString());
        
        return `/images?${params.toString()}`;
      },
      providesTags: ['Images'],
    }),

    // Get image by ID
    getImageById: builder.query<T_ApiResponse<Image>, string>({
      query: (id) => `/images/${id}`,
      providesTags: ['Images'],
    }),

    // Upload single image
    uploadSingleImage: builder.mutation<T_ApiResponse<Image>, FormData>({
      query: (formData) => ({
        url: '/images/upload/single',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Images'],
    }),

    // Upload multiple images
    uploadMultipleImages: builder.mutation<T_ApiResponse<Image[]>, FormData>({
      query: (formData) => ({
        url: '/images/upload/multiple',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Images'],
    }),

    // Update image metadata
    updateImage: builder.mutation<T_ApiResponse<Image>, UpdateImageInput>({
      query: ({ id, ...data }) => ({
        url: `/images/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Images'],
    }),

    // Delete image
    deleteImage: builder.mutation<T_ApiResponse<null>, string>({
      query: (id) => ({
        url: `/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Images'],
    }),

    // Delete multiple images
    deleteMultipleImages: builder.mutation<T_ApiResponse<null>, string[]>({
      query: (ids) => ({
        url: '/images/delete/multiple',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Images'],
    }),
  }),
});

export const {
  useGetAllImagesQuery,
  useGetImageByIdQuery,
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
  useDeleteMultipleImagesMutation,
} = imagesApi;
