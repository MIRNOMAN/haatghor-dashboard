import { baseApi } from '@/store/api';

export interface FlashSale {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  discount: number;
  products: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlashSaleInput {
  name: string;
  startTime: string;
  endTime: string;
  discount: number;
  products: string[];
}

export interface UpdateFlashSaleInput extends Partial<CreateFlashSaleInput> {
  isActive?: boolean;
}

export const flashSalesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all flash sales with pagination and search
    getFlashSales: builder.query<
      { data: FlashSale[]; meta: { total: number; page: number; limit: number } },
      { page?: number; limit?: number; searchTerm?: string }
    >({
      query: ({ page = 1, limit = 10, searchTerm }) => ({
        url: '/flash-sales',
        params: { page, limit, searchTerm },
      }),
      transformResponse: (response: { data: { data: FlashSale[]; meta: any } }) => response.data,
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

    // Get active flash sales
    getActiveFlashSales: builder.query<FlashSale[], void>({
      query: () => '/flash-sales/active',
      transformResponse: (response: { data: FlashSale[] }) => response.data,
      providesTags: [{ type: 'FlashSales', id: 'ACTIVE' }],
    }),

    // Create flash sale
    createFlashSale: builder.mutation<FlashSale, CreateFlashSaleInput>({
      query: (body) => ({
        url: '/flash-sales',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: FlashSale }) => response.data,
      invalidatesTags: [{ type: 'FlashSales', id: 'LIST' }],
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
        { type: 'FlashSales', id: 'ACTIVE' },
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
      ],
    }),

    // Toggle flash sale status
    toggleFlashSaleStatus: builder.mutation<FlashSale, string>({
      query: (id) => ({
        url: `/flash-sales/${id}/toggle`,
        method: 'PATCH',
      }),
      transformResponse: (response: { data: FlashSale }) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: 'FlashSales', id },
        { type: 'FlashSales', id: 'LIST' },
        { type: 'FlashSales', id: 'ACTIVE' },
      ],
    }),
  }),
});

export const {
  useGetFlashSalesQuery,
  useGetFlashSaleQuery,
  useGetActiveFlashSalesQuery,
  useCreateFlashSaleMutation,
  useUpdateFlashSaleMutation,
  useDeleteFlashSaleMutation,
  useToggleFlashSaleStatusMutation,
} = flashSalesApi;
