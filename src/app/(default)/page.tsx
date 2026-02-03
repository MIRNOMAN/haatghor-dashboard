"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStatsQuery } from "@/store/features/dashboard/dashboardApi";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Prepare Recharts data
  const monthlyData =
    stats?.monthlySales?.map((m) => {
      const date = new Date(`${m.month}-01`);
      const label = date.toLocaleString(undefined, { month: "short", year: "numeric" });
      return { month: label, revenue: m.revenue, orders: m.orders };
    }) || [];

  const statusData =
    stats?.ordersByStatus
      ? Object.entries(stats.ordersByStatus).map(([name, value]) => ({ name, value }))
      : [];

  const statusColors = ["#f59e0b", "#ef4444", "#06b6d4", "#10b981", "#6366f1"];

  const topProductsData =
    stats?.topProducts?.map((tp) => ({ name: tp.product.name, totalSold: tp.totalSold })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.overview?.totalRevenue?.toLocaleString() || 0}`}
          description="Total revenue generated"
          icon={DollarSign}
          iconClassName="text-green-600"
          trend={
            stats?.revenueGrowth
              ? {
                  value: stats.revenueGrowth,
                  isPositive: stats.revenueGrowth > 0,
                }
              : undefined
          }
        />
        <StatsCard
          title="Total Orders"
          value={stats?.overview?.totalOrders?.toLocaleString() || 0}
          description="Total orders placed"
          icon={ShoppingCart}
          iconClassName="text-blue-600"
          trend={
            stats?.ordersGrowth
              ? {
                  value: stats.ordersGrowth,
                  isPositive: stats.ordersGrowth > 0,
                }
              : undefined
          }
        />
        <StatsCard
          title="Average Order Value"
          value={stats?.overview?.averageOrderValue?.toLocaleString() || 0}
          description="Average order value"
          icon={Package}
          iconClassName="text-purple-600"
        />
        <StatsCard
          title="Customers"
          value={stats?.overview?.totalUsers?.toLocaleString() || 0}
          description="Total registered users"
          icon={Users}
          iconClassName="text-orange-600"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Orders awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.todayRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Revenue generated today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Revenue this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders By Status</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products (Sold)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} margin={{ left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSold" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="/products"
              className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <Package className="h-8 w-8 mb-2" />
              <span className="font-medium">Manage Products</span>
            </a>
            <a
              href="/orders"
              className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <ShoppingCart className="h-8 w-8 mb-2" />
              <span className="font-medium">View Orders</span>
            </a>
            <a
              href="/categories"
              className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <Package className="h-8 w-8 mb-2" />
              <span className="font-medium">Categories</span>
            </a>
            <a
              href="/users"
              className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <Users className="h-8 w-8 mb-2" />
              <span className="font-medium">Manage Users</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}