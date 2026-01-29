'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { Pagination } from '@/components/dashboard/Pagination';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useGetFlashSalesQuery,
  useDeleteFlashSaleMutation,
  useToggleFlashSaleStatusMutation,
} from '@/store/features/flashSales/flashSalesApi';
import { Pencil, Trash2, Plus, Calendar, Zap, AlertCircle } from 'lucide-react';
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
import { formatDistanceToNow } from 'date-fns';

export default function FlashSalesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetFlashSalesQuery({
    page,
    limit,
    searchTerm,
  });

  const [deleteFlashSale, { isLoading: isDeleting }] = useDeleteFlashSaleMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleFlashSaleStatusMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteFlashSale(deleteId).unwrap();
      toast.success('Flash sale deleted successfully');
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete flash sale');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success('Flash sale status updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  const isFlashSaleActive = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Flash Sales"
          description="Manage flash sales and limited-time offers"
        />
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
      <PageHeader
        title="Flash Sales"
        description="Manage flash sales and limited-time offers"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Flash Sale
          </Button>
        }
      />

      <div className="mt-6 space-y-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search flash sales..."
        />

        {!data?.data || data.data.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="No flash sales found"
            description="Create your first flash sale to boost sales"
          />
        ) : (
          <>
            <div className="grid gap-4">
              {data.data.map((sale) => {
                const isActive = sale.isActive && isFlashSaleActive(sale.startTime, sale.endTime);
                const hasEnded = new Date(sale.endTime) < new Date();

                return (
                  <Card key={sale.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{sale.name}</h3>
                          {isActive && (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <Zap className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          )}
                          {hasEnded && (
                            <Badge variant="secondary">Ended</Badge>
                          )}
                          {!sale.isActive && !hasEnded && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
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
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-primary">
                              {sale.discount}% OFF
                            </span>
                            <span>•</span>
                            <span>{sale.products.length} products</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(sale.id)}
                          disabled={isToggling}
                        >
                          {sale.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(sale.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Flash Sale
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flash sale? This action cannot be undone.
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
