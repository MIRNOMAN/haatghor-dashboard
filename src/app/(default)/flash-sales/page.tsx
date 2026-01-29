'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { Pagination } from '@/components/dashboard/Pagination';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useGetFlashSalesQuery,
  useDeleteFlashSaleMutation,
  useUpdateFlashSaleMutation,
} from '@/store/features/flashSales/flashSalesApi';
import { Pencil, Trash2, Plus, Calendar, Zap, AlertCircle, Package, DollarSign, Box } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FlashSaleDialog } from '@/components/dashboard/FlashSaleDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

export default function FlashSalesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'UPCOMING' | 'LIVE' | 'ENDED'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const limit = 10;

  const { data, isLoading } = useGetFlashSalesQuery({
    page,
    limit,
    searchTerm,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const [deleteFlashSale, { isLoading: isDeleting }] = useDeleteFlashSaleMutation();
  const [updateFlashSale] = useUpdateFlashSaleMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteFlashSale(deleteId).unwrap();
      toast.success('Flash sale deleted successfully');
      setDeleteId(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to delete flash sale');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateFlashSale({ id, data: { isActive: !currentStatus } }).unwrap();
      toast.success(`Flash sale ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const handleCreateClick = () => {
    setDialogMode('create');
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEditClick = (id: string) => {
    setDialogMode('edit');
    setEditingId(id);
    setDialogOpen(true);
  };

  const getFlashSaleStatus = (startTime: string, endTime: string, isActive: boolean) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (!isActive) return 'inactive';
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'ended';
  };

  const getRemainingTime = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    }
    if (hours > 0) return `${hours}h ${minutes}m left`;
    if (minutes > 0) return `${minutes}m ${seconds}s left`;
    return `${seconds}s left`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Flash Sales</h1>
            <p className="text-muted-foreground mt-1">Manage flash sales and limited-time offers</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flash Sales</h1>
          <p className="text-muted-foreground mt-1">Manage flash sales and limited-time offers</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Flash Sale
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search flash sales..."
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="LIVE">Live</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
              <SelectItem value="ENDED">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!data?.data || data.data.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="No flash sales found"
            description="Create your first flash sale to boost sales with limited-time offers"
          />
        ) : (
          <>
            <div className="grid gap-4">
              {data.data.map((sale) => {
                const status = getFlashSaleStatus(sale.startTime, sale.endTime, sale.isActive);

                return (
                  <Card key={sale.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      {/* Product Image */}
                      <div className="flex gap-4 flex-1">
                        {sale.product?.images?.[0] && (
                          <div className="relative w-20 h-20 shrink-0">
                            <Image
                              src={sale.product.images[0]}
                              alt={sale.product.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex-1 space-y-3">
                          {/* Title and Status */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold">{sale.title}</h3>
                            {status === 'live' && (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                <Zap className="mr-1 h-3 w-3" />
                                Live
                              </Badge>
                            )}
                            {status === 'upcoming' && (
                              <Badge className="bg-blue-500 hover:bg-blue-600">
                                Upcoming
                              </Badge>
                            )}
                            {status === 'ended' && (
                              <Badge variant="secondary">Ended</Badge>
                            )}
                            {status === 'inactive' && (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                            {sale.isFeatured && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                Featured
                              </Badge>
                            )}
                          </div>

                          {/* Product Info */}
                          {sale.product && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Package className="h-4 w-4" />
                              <span className="font-medium">{sale.product.name}</span>
                              {sale.product.category && (
                                <>
                                  <span>•</span>
                                  <span>{sale.product.category.name}</span>
                                </>
                              )}
                            </div>
                          )}

                          {/* Pricing Info */}
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground line-through">
                                ${sale.originalPrice}
                              </span>
                              <span className="text-lg font-bold text-primary">
                                ${sale.flashPrice}
                              </span>
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                                {sale.discount.toFixed(0)}% OFF
                              </Badge>
                            </div>
                          </div>

                          {/* Stock Info */}
                          <div className="flex items-center gap-2 text-sm">
                            <Box className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {sale.remainingStock} / {sale.totalStock} remaining
                            </span>
                            {sale.soldCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 font-medium">
                                  {sale.soldCount} sold
                                </span>
                              </>
                            )}
                          </div>

                          {/* Time Info */}
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Starts: {new Date(sale.startTime).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Ends: {new Date(sale.endTime).toLocaleString()}
                              </span>
                              {status === 'live' && (
                                <Badge variant="outline" className="ml-2">
                                  {getRemainingTime(sale.endTime)}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          {sale.description && (
                            <p className="text-sm text-muted-foreground">
                              {sale.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={sale.isActive ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => handleToggleStatus(sale.id, sale.isActive)}
                          className="min-w-[100px]"
                        >
                          {sale.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(sale.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(sale.id)}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {data.meta && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(data.meta.total / limit)}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <FlashSaleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        flashSaleId={editingId}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Flash Sale
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flash sale? This action cannot be undone.
              Any customers who have this item in their cart will lose the flash sale price.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
