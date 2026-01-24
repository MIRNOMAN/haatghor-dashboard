import { baseApi } from "@/store/api";
import { DashboardStats } from "@/types/dashboard";
import { T_ApiResponse } from "@/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard statistics
    getDashboardStats: builder.query<T_ApiResponse<DashboardStats>, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
} = dashboardApi;
