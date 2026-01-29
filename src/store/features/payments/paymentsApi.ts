import { baseApi } from '@/store/api';

export interface Payment {
  id: string;
  userId: string;
  orderId?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  order?: {
    id: string;
    orderNumber: string;
  };
}

export interface CreatePaymentInput {
  userId: string;
  orderId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface UpdatePaymentInput {
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all payments with pagination and filters
    getPayments: builder.query<
      { data: Payment[]; meta: { total: number; page: number; limit: number } },
      { page?: number; limit?: number; status?: string; searchTerm?: string }
    >({
      query: ({ page = 1, limit = 10, status, searchTerm }) => ({
        url: '/payments',
        params: { page, limit, status, searchTerm },
      }),
      transformResponse: (response: { data: { data: Payment[]; meta: any } }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Payments' as const, id })),
              { type: 'Payments', id: 'LIST' },
            ]
          : [{ type: 'Payments', id: 'LIST' }],
    }),

    // Get single payment by ID
    getPayment: builder.query<Payment, string>({
      query: (id) => `/payments/${id}`,
      transformResponse: (response: { data: Payment }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Payments', id }],
    }),

    // Get user's payments
    getUserPayments: builder.query<Payment[], string>({
      query: (userId) => `/payments/user/${userId}`,
      transformResponse: (response: { data: Payment[] }) => response.data,
      providesTags: (result, error, userId) => [{ type: 'Payments', id: `user-${userId}` }],
    }),

    // Get order's payments
    getOrderPayments: builder.query<Payment[], string>({
      query: (orderId) => `/payments/order/${orderId}`,
      transformResponse: (response: { data: Payment[] }) => response.data,
      providesTags: (result, error, orderId) => [{ type: 'Payments', id: `order-${orderId}` }],
    }),

    // Create payment
    createPayment: builder.mutation<Payment, CreatePaymentInput>({
      query: (body) => ({
        url: '/payments',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: Payment }) => response.data,
      invalidatesTags: [{ type: 'Payments', id: 'LIST' }],
    }),

    // Update payment
    updatePayment: builder.mutation<Payment, { id: string; data: UpdatePaymentInput }>({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: Payment }) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Payments', id },
        { type: 'Payments', id: 'LIST' },
      ],
    }),

    // Refund payment
    refundPayment: builder.mutation<Payment, string>({
      query: (id) => ({
        url: `/payments/${id}/refund`,
        method: 'POST',
      }),
      transformResponse: (response: { data: Payment }) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: 'Payments', id },
        { type: 'Payments', id: 'LIST' },
      ],
    }),

    // Delete payment
    deletePayment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Payments', id },
        { type: 'Payments', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useGetUserPaymentsQuery,
  useGetOrderPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useRefundPaymentMutation,
  useDeletePaymentMutation,
} = paymentsApi;
