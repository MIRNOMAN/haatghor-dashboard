import { baseApi } from "@/store/api";
import { Order, OrderStatus } from "@/types/order";
import { T_ApiResponse, T_ApiResponseForPagination } from "@/types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders (admin)
    getAllOrders: builder.query<
      T_ApiResponseForPagination<Order[]>,
      { page?: number; limit?: number; status?: OrderStatus; search?: string }
    >({
      query: ({ page = 1, limit = 10, status, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        
        return `/orders/admin/all?${params.toString()}`;
      },
      providesTags: ['Orders'],
    }),

    // Get order by ID
    getOrderById: builder.query<T_ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<
      T_ApiResponse<Order>,
      { id: string; status: OrderStatus }
    >({
      query: ({ id, status }) => ({
        url: `/orders/admin/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
