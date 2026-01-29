import { baseApi } from '@/store/api';

export interface Subscription {
  id: string;
  userId: string;
  planName: string;
  planType: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateSubscriptionInput {
  userId: string;
  planName: string;
  planType: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  amount: number;
  startDate: string;
  endDate: string;
}

export interface UpdateSubscriptionInput extends Partial<CreateSubscriptionInput> {
  status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all subscriptions with pagination and filters
    getSubscriptions: builder.query<
      { data: Subscription[]; meta: { total: number; page: number; limit: number } },
      { page?: number; limit?: number; status?: string; searchTerm?: string }
    >({
      query: ({ page = 1, limit = 10, status, searchTerm }) => ({
        url: '/subscriptions',
        params: { page, limit, status, searchTerm },
      }),
      transformResponse: (response: { data: { data: Subscription[]; meta: any } }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Subscriptions' as const, id })),
              { type: 'Subscriptions', id: 'LIST' },
            ]
          : [{ type: 'Subscriptions', id: 'LIST' }],
    }),

    // Get single subscription by ID
    getSubscription: builder.query<Subscription, string>({
      query: (id) => `/subscriptions/${id}`,
      transformResponse: (response: { data: Subscription }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Subscriptions', id }],
    }),

    // Get user's subscription
    getUserSubscription: builder.query<Subscription, string>({
      query: (userId) => `/subscriptions/user/${userId}`,
      transformResponse: (response: { data: Subscription }) => response.data,
      providesTags: (result, error, userId) => [{ type: 'Subscriptions', id: userId }],
    }),

    // Create subscription
    createSubscription: builder.mutation<Subscription, CreateSubscriptionInput>({
      query: (body) => ({
        url: '/subscriptions',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: Subscription }) => response.data,
      invalidatesTags: [{ type: 'Subscriptions', id: 'LIST' }],
    }),

    // Update subscription
    updateSubscription: builder.mutation<Subscription, { id: string; data: UpdateSubscriptionInput }>({
      query: ({ id, data }) => ({
        url: `/subscriptions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: Subscription }) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Subscriptions', id },
        { type: 'Subscriptions', id: 'LIST' },
      ],
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation<Subscription, string>({
      query: (id) => ({
        url: `/subscriptions/${id}/cancel`,
        method: 'PATCH',
      }),
      transformResponse: (response: { data: Subscription }) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: 'Subscriptions', id },
        { type: 'Subscriptions', id: 'LIST' },
      ],
    }),

    // Delete subscription
    deleteSubscription: builder.mutation<void, string>({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Subscriptions', id },
        { type: 'Subscriptions', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useGetUserSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionsApi;
