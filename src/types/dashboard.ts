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
  overview?: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalUsers: number;
  };
  monthlySales?: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus?: Record<string, number>;
  topProducts?: Array<{
    product: {
      name: string;
    };
    totalSold: number;
  }>;
}
