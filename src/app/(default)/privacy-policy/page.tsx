"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useGetAllPoliciesQuery, useCreatePolicyMutation, useUpdatePolicyMutation, useDeletePolicyMutation } from "@/store/features/policy/policyApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PrivacyPolicy, CreatePolicyInput } from "@/types/policy";

export default function PrivacyPolicyPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PrivacyPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<CreatePolicyInput>>({
    title: "",
    content: "",
    version: "1.0",
    isActive: true,
  });

  const { data, isLoading } = useGetAllPoliciesQuery({ page, limit: 10 });
  const [deletePolicy, { isLoading: isDeleting }] = useDeletePolicyMutation();
  const [createPolicy, { isLoading: isCreating }] = useCreatePolicyMutation();
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();

  const policies = data?.data?.result || [];
  const meta = data?.data?.meta;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePolicy(deleteId).unwrap();
      toast.success("Policy deleted");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete policy");
    }
  };

  const handleOpenDialog = (policy?: PrivacyPolicy) => {
    if (policy) {
      setEditingPolicy(policy);
      setFormData({ title: policy.title, content: policy.content, version: policy.version, isActive: policy.isActive });
    } else {
      setEditingPolicy(null);
      setFormData({ title: "", content: "", version: "1.0", isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      if (editingPolicy) {
        await updatePolicy({ id: editingPolicy.id, ...formData }).unwrap();
        toast.success("Policy updated");
      } else {
        await createPolicy(formData as CreatePolicyInput).unwrap();
        toast.success("Policy created");
      }
      setIsDialogOpen(false);
      setEditingPolicy(null);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Privacy Policy" description="Manage privacy policy documents" action={{ label: "Add Policy", onClick: () => handleOpenDialog() }} />

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : policies.length === 0 ? (
        <EmptyState icon={FileText} title="No policies found" description="Create your first privacy policy" action={{ label: "Add Policy", onClick: () => handleOpenDialog() }} />
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.title}</TableCell>
                    <TableCell>{policy.version}</TableCell>
                    <TableCell>
                      <Badge variant={policy.isActive ? "default" : "secondary"}>{policy.isActive ? "Active" : "Inactive"}</Badge>
                    </TableCell>
                    <TableCell>{new Date(policy.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(policy)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(policy.id)} className="text-red-600">
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

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? "Edit Policy" : "Create Policy"}</DialogTitle>
            <DialogDescription>Manage privacy policy content</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
              <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={15} required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingPolicy ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the policy.</AlertDialogDescription>
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
