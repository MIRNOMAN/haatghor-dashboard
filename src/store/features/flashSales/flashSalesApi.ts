import { baseApi } from '@/store/api';

export interface FlashSale {
  id: string;
  title: string;
  description?: string;
  productId: string;
  originalPrice: number;
  flashPrice: number;
  discount: number;
  totalStock: number;
  soldCount: number;
  remainingStock: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    stock: number;
    category: {
      id: string;
      name: string;
    };
  };
}

export interface CreateFlashSaleInput {
  title: string;
  description?: string;
  productId: string;
  flashPrice: number;
  totalStock: number;
  startTime: string;
  endTime: string;
  isFeatured?: boolean;
}

export interface UpdateFlashSaleInput {
  title?: string;
  description?: string;
  flashPrice?: number;
  totalStock?: number;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export const flashSalesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all flash sales with pagination and search
    getFlashSales: builder.query<
      { data: FlashSale[]; meta: { total: number; page: number; limit: number } },
      { page?: number; limit?: number; searchTerm?: string; status?: 'UPCOMING' | 'LIVE' | 'ENDED'; isActive?: boolean }
    >({
      query: ({ page = 1, limit = 10, searchTerm, status, isActive }) => ({
        url: '/flash-sales',
        params: { page, limit, searchTerm, status, isActive },
      }),
      transformResponse: (response: { data: FlashSale[]; meta: any }) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'FlashSales' as const, id })),
              { type: 'FlashSales', id: 'LIST' },
            ]
          : [{ type: 'FlashSales', id: 'LIST' }],
    }),

    // Get single flash sale by ID
    getFlashSale: builder.query<FlashSale, string>({
      query: (id) => `/flash-sales/${id}`,
      transformResponse: (response: { data: FlashSale }) => response.data,
      providesTags: (result, error, id) => [{ type: 'FlashSales', id }],
    }),

    // Get live flash sales (public endpoint)
    getLiveFlashSales: builder.query<FlashSale[], void>({
      query: () => '/flash-sales/live',
      transformResponse: (response: { data: FlashSale[] }) => response.data,
      providesTags: [{ type: 'FlashSales', id: 'LIVE' }],
    }),

    // Create flash sale
    createFlashSale: builder.mutation<FlashSale, CreateFlashSaleInput>({
      query: (body) => ({
        url: '/flash-sales',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: FlashSale }) => response.data,
      invalidatesTags: [{ type: 'FlashSales', id: 'LIST' }, { type: 'FlashSales', id: 'LIVE' }],
    }),

    // Update flash sale
    updateFlashSale: builder.mutation<FlashSale, { id: string; data: UpdateFlashSaleInput }>({
      query: ({ id, data }) => ({
        url: `/flash-sales/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: FlashSale }) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: 'FlashSales', id },
        { type: 'FlashSales', id: 'LIST' },
        { type: 'FlashSales', id: 'LIVE' },
      ],
    }),

    // Delete flash sale
    deleteFlashSale: builder.mutation<void, string>({
      query: (id) => ({
        url: `/flash-sales/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'FlashSales', id },
        { type: 'FlashSales', id: 'LIST' },
        { type: 'FlashSales', id: 'LIVE' },
      ],
    }),
  }),
});

export const {
  useGetFlashSalesQuery,
  useGetFlashSaleQuery,
  useGetLiveFlashSalesQuery,
  useCreateFlashSaleMutation,
  useUpdateFlashSaleMutation,
  useDeleteFlashSaleMutation,
} = flashSalesApi;
