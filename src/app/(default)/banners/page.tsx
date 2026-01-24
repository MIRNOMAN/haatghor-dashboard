"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  useGetAllBannersQuery,
  useDeleteBannerMutation,
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/store/features/banners/bannersApi";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Banner, CreateBannerInput } from "@/types/banner";

export default function BannersPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Partial<CreateBannerInput>>({
    title: "",
    description: "",
    image: "",
    link: "",
    position: "TOP",
    status: "ACTIVE",
    order: 0,
  });

  const { data, isLoading } = useGetAllBannersQuery({ page, limit: 10 });
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

  const banners = data?.data?.result || [];
  const meta = data?.data?.meta;

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBanner(deleteId).unwrap();
      toast.success("Banner deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete banner");
      console.error(error);
    }
  };

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        description: banner.description || "",
        image: banner.image,
        link: banner.link || "",
        position: banner.position,
        status: banner.status,
        order: banner.order,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        link: "",
        position: "TOP",
        status: "ACTIVE",
        order: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBanner(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      link: "",
      position: "TOP",
      status: "ACTIVE",
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.image) {
      toast.error("Title and image are required");
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner({
          id: editingBanner.id,
          ...formData,
        }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner(formData as CreateBannerInput).unwrap();
        toast.success("Banner created successfully");
      }
      handleCloseDialog();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
        {status}
      </Badge>
    );
  };

  const getPositionBadge = (position: string) => {
    const colors: Record<string, string> = {
      TOP: "bg-blue-500",
      MIDDLE: "bg-purple-500",
      BOTTOM: "bg-orange-500",
      SIDEBAR: "bg-green-500",
    };

    return (
      <Badge className={colors[position] || "bg-gray-500"}>
        {position}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        description="Manage promotional banners and advertisements"
        action={{
          label: "Add Banner",
          onClick: () => handleOpenDialog(),
        }}
      />

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-20 rounded" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : banners.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No banners found"
          description="Get started by creating your first banner."
          action={{
            label: "Add Banner",
            onClick: () => handleOpenDialog(),
          }}
        />
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banner</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-20 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {banner.image ? (
                            <img
                              src={banner.image}
                              alt={banner.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{banner.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {banner.description || "No description"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getPositionBadge(banner.position)}</TableCell>
                    <TableCell>{banner.order}</TableCell>
                    <TableCell>{getStatusBadge(banner.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(banner)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(banner.id)}
                            className="text-red-600"
                          >
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

          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "Create Banner"}
            </DialogTitle>
            <DialogDescription>
              {editingBanner
                ? "Update banner information"
                : "Add a new promotional banner"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter banner title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link URL</Label>
                <Input
                  id="link"
                  value={formData.link || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter banner description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">
                Image URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/banner.jpg"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) =>
                    setFormData({ ...formData, position: value as 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOP">Top</SelectItem>
                    <SelectItem value="MIDDLE">Middle</SelectItem>
                    <SelectItem value="BOTTOM">Bottom</SelectItem>
                    <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as 'ACTIVE' | 'INACTIVE' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingBanner ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
