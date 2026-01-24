export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders?: number;
  pendingOrders?: number;
  todayRevenue?: number;
  monthlyRevenue?: number;
  revenueGrowth?: number;
  ordersGrowth?: number;
}
