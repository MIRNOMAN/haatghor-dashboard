'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { Pagination } from '@/components/dashboard/Pagination';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useGetPaymentsQuery,
  useDeletePaymentMutation,
  useRefundPaymentMutation,
} from '@/store/features/payments/paymentsApi';
import { DollarSign, Trash2, RefreshCw, AlertCircle, Download } from 'lucide-react';
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

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [refundId, setRefundId] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading } = useGetPaymentsQuery({
    page,
    limit,
    searchTerm,
  });

  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();
  const [refundPayment, { isLoading: isRefunding }] = useRefundPaymentMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePayment(deleteId).unwrap();
      toast.success('Payment deleted successfully');
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete payment');
    }
  };

  const handleRefund = async () => {
    if (!refundId) return;

    try {
      await refundPayment(refundId).unwrap();
      toast.success('Payment refunded successfully');
      setRefundId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to refund payment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500 hover:bg-green-600';
      case 'PENDING':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'FAILED':
        return 'bg-red-500 hover:bg-red-600';
      case 'REFUNDED':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Payments"
          description="Manage payment transactions"
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
        title="Payments"
        description="Manage payment transactions and refunds"
        action={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      <div className="mt-6 space-y-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by transaction ID, user, or order..."
        />

        {!data?.data || data.data.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No payments found"
            description="Payment transactions will appear here"
          />
        ) : (
          <>
            <div className="grid gap-4">
              {data.data.map((payment) => (
                <Card key={payment.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                        <Badge variant="outline">{payment.paymentMethod}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="text-xl font-bold">
                            {payment.currency} {payment.amount.toFixed(2)}
                          </p>
                        </div>
                        {payment.transactionId && (
                          <div>
                            <p className="text-sm text-muted-foreground">Transaction ID</p>
                            <p className="font-mono text-sm">{payment.transactionId}</p>
                          </div>
                        )}
                      </div>

                      {payment.user && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Customer: {payment.user.firstName} {payment.user.lastName} •{' '}
                          {payment.user.email}
                        </p>
                      )}

                      {payment.order && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Order: #{payment.order.orderNumber}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(payment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {payment.status === 'COMPLETED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRefundId(payment.id)}
                          disabled={isRefunding}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refund
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(payment.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
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
              Delete Payment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment? This action cannot be undone.
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

      <AlertDialog open={!!refundId} onOpenChange={() => setRefundId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Refund Payment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to refund this payment? The amount will be returned to the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRefund}>
              {isRefunding ? 'Processing...' : 'Confirm Refund'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
