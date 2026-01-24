"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} from "@/store/features/reviews/reviewsApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Trash2, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetAllReviewsQuery({
    page,
    limit: 10,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });
  const [updateReviewStatus] = useUpdateReviewStatusMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const reviews = data?.data?.result || [];
  const meta = data?.data?.meta;

  const handleStatusChange = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await updateReviewStatus({ id, status }).unwrap();
      toast.success("Review status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReview(deleteId).unwrap();
      toast.success("Review deleted");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      APPROVED: "default",
      PENDING: "secondary",
      REJECTED: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Manage product reviews and ratings" />

      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar placeholder="Search reviews..." onSearch={() => {}} />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No reviews found" description="Reviews will appear here" />
      ) : (
        <>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="font-medium">{review.product?.name || "N/A"}</div>
                    </TableCell>
                    <TableCell>{review.user?.name || "Anonymous"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{review.comment}</TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {review.status !== "APPROVED" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(review.id, "APPROVED")}>
                              Approve
                            </DropdownMenuItem>
                          )}
                          {review.status !== "REJECTED" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(review.id, "REJECTED")}>
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => setDeleteId(review.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {meta && meta.totalPages > 1 && <Pagination currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} />}
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the review.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
