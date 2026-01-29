'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { Pagination } from '@/components/dashboard/Pagination';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useSendBroadcastNotificationMutation,
} from '@/store/features/notifications/notificationsApi';
import { Bell, Trash2, Plus, CheckCheck, AlertCircle } from 'lucide-react';
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

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading } = useGetNotificationsQuery({
    page,
    limit,
  });

  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteNotification(deleteId).unwrap();
      toast.success('Notification deleted successfully');
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete notification');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to mark all as read');
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ERROR':
        return 'bg-red-500 hover:bg-red-600';
      case 'WARNING':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'SUCCESS':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Notifications"
          description="Manage system notifications"
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
        title="Notifications"
        description="Manage system notifications and broadcasts"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Send Broadcast
            </Button>
          </div>
        }
      />

      <div className="mt-6 space-y-6">
        {!data?.data || data.data.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications found"
            description="All notifications will appear here"
          />
        ) : (
          <>
            <div className="grid gap-4">
              {data.data.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-6 transition-all ${
                    !notification.isRead ? 'bg-accent/50 border-primary/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getNotificationColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        {!notification.isRead && (
                          <Badge variant="outline">New</Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold mb-2">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {notification.userId && (
                          <span>• User Specific</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(notification.id)}
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
              Delete Notification
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
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
