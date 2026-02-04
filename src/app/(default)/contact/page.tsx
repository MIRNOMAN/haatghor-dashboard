"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useGetAllContactMessagesQuery, useReplyToContactMutation, useUpdateContactStatusMutation, useDeleteContactMessageMutation } from "@/store/features/contact/contactApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Trash2, Mail, Reply, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import { ContactMessage } from "@/types/contact";

export type ContactStatusFilter = "ALL" | "PENDING" | "READ" | "REPLIED" | "RESOLVED";

export default function ContactPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContactStatusFilter>("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState("");

  const backendStatus =
  statusFilter === "ALL" ? undefined : statusFilter;


  const { data, isLoading } = useGetAllContactMessagesQuery({
  page,
  limit: 10,
  status: backendStatus,
});

  const [replyToContact, { isLoading: isReplying }] = useReplyToContactMutation();
  const [updateStatus] = useUpdateContactStatusMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteContactMessageMutation();

  const messages = data?.data ?? [];
  const meta = data?.meta;

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !reply.trim()) return;

    try {
      await replyToContact({ id: replyingTo.id, reply }).unwrap();
      toast.success("Reply sent successfully");
      setReplyingTo(null);
      setReply("");
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMessage(deleteId).unwrap();
      toast.success("Message deleted");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING: "outline",
      READ: "secondary",
      REPLIED: "default",
      RESOLVED: "default",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Messages" description="Manage customer inquiries and messages" />

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="READ">Read</SelectItem>
            <SelectItem value="REPLIED">Replied</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages found" description="Contact messages will appear here" />
      ) : (
        <>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell className="max-w-md truncate">{message.message}</TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewMessage(message)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setReplyingTo(message)}>
                            <Reply className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(message.id, "READ")}>
                            Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(message.id, "RESOLVED")}>
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(message.id)} className="text-red-600">
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

      <Dialog open={!!replyingTo} onOpenChange={() => setReplyingTo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>From: {replyingTo?.name} ({replyingTo?.email})</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReply} className="space-y-4">
            <div className="space-y-2">
              <Label>Original Message</Label>
              <div className="p-3 bg-muted rounded-md text-sm">{replyingTo?.message}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply">Your Reply</Label>
              <Textarea id="reply" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Enter your reply" rows={5} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReplyingTo(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isReplying}>
                {isReplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reply
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={!!viewMessage} onOpenChange={() => setViewMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>
              Received on {viewMessage && new Date(viewMessage.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{viewMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{viewMessage.email}</p>
                </div>
                {viewMessage.phone && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-base">{viewMessage.phone}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-base font-medium">{viewMessage.subject}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Message</p>
                  <p className="text-base whitespace-pre-wrap">{viewMessage.message}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(viewMessage.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-base">{new Date(viewMessage.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {viewMessage.response && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Response</p>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-base whitespace-pre-wrap">{viewMessage.response}</p>
                    {viewMessage.respondedBy && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Responded by {viewMessage.respondedBy} on{" "}
                        {viewMessage.respondedAt && new Date(viewMessage.respondedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewMessage(null)}>
              Close
            </Button>
            {viewMessage && !viewMessage.response && (
              <Button
                onClick={() => {
                  setReplyingTo(viewMessage);
                  setViewMessage(null);
                }}
              >
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the message.</AlertDialogDescription>
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
