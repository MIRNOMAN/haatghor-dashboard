"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/store/features/orders/ordersApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Eye, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/types/order";
import { format } from "date-fns";

function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit: 10,
    search,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders = data?.data?.result || [];
  const meta = data?.data?.meta;

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status }).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
      PENDING: { variant: "outline", className: "border-yellow-500 text-yellow-700" },
      PROCESSING: { variant: "default", className: "bg-blue-500" },
      SHIPPED: { variant: "default", className: "bg-purple-500" },
      DELIVERED: { variant: "default", className: "bg-green-500" },
      CANCELLED: { variant: "destructive" },
    };

    const config = variants[status] || { variant: "default" as const };

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; className?: string }> = {
      PAID: { variant: "default", className: "bg-green-500" },
      PENDING: { variant: "secondary" },
      FAILED: { variant: "destructive" },
      REFUNDED: { variant: "secondary", className: "bg-orange-500" },
    };

    const config = variants[status] || { variant: "default" as const };

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage customer orders and fulfillment"
      />

      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar
          placeholder="Search orders..."
          onSearch={setSearch}
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as OrderStatus | "ALL")}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders found"
          description="Orders will appear here once customers start placing them."
        />
      ) : (
        <>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items?.length || 0} items
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {order.user?.name || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.user?.email || ""}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                            <>
                              {order.status === "PENDING" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(order.id, "PROCESSING")}
                                >
                                  Mark as Processing
                                </DropdownMenuItem>
                              )}
                              {order.status === "PROCESSING" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(order.id, "SHIPPED")}
                                >
                                  Mark as Shipped
                                </DropdownMenuItem>
                              )}
                              {order.status === "SHIPPED" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(order.id, "DELIVERED")}
                                >
                                  Mark as Delivered
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                className="text-red-600"
                              >
                                Cancel Order
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
