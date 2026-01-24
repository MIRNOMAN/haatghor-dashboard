"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/store/features/categories/categoriesApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Edit, Trash2, FolderOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Category, CreateCategoryInput } from "@/types/category";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<CreateCategoryInput>>({
    name: "",
    description: "",
    image: "",
  });

  const { data, isLoading } = useGetAllCategoriesQuery({ page, limit: 10, search });
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const categories = data?.data?.result || [];
  const meta = data?.data?.meta;

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCategory(deleteId).unwrap();
      toast.success("Category deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        image: category.image || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "", image: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          ...formData,
        } as any).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData as CreateCategoryInput).unwrap();
        toast.success("Category created successfully");
      }
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories"
        action={{
          label: "Add Category",
          onClick: () => handleOpenDialog(),
        }}
      />

      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Search categories..."
          onSearch={setSearch}
        />
      </div>

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No categories found"
          description="Get started by creating your first category."
          action={{
            label: "Add Category",
            onClick: () => handleOpenDialog(),
          }}
        />
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FolderOpen className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {category.description || "—"}
                    </TableCell>
                    <TableCell>{category.productCount || 0}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(category.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category information"
                : "Add a new category to organize your products"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
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
                {editingCategory ? "Update" : "Create"}
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
              category and may affect associated products.
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
