"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  useGetAllImagesQuery,
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} from "@/store/features/images/imagesApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit,
  Copy,
  Check,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Image as ImageType } from "@/types/image";

export default function ImagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState<ImageType | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageType | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"single" | "multiple">("single");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadData, setUploadData] = useState({
    category: "",
    alt: "",
    description: "",
  });

  const { data, isLoading } = useGetAllImagesQuery({
    page,
    limit: 20,
    search,
    category: categoryFilter === "ALL" ? undefined : categoryFilter,
  });

  const [uploadSingle, { isLoading: isUploadingSingle }] =
    useUploadSingleImageMutation();
  const [uploadMultiple, { isLoading: isUploadingMultiple }] =
    useUploadMultipleImagesMutation();
  const [updateImage, { isLoading: isUpdating }] = useUpdateImageMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();

  const images = data?.data?.result || [];
  const meta = data?.data?.meta;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();

    if (uploadMode === "single") {
      formData.append("image", files[0]);
    } else {
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
    }

    if (uploadData.category) formData.append("category", uploadData.category);
    if (uploadData.alt) formData.append("alt", uploadData.alt);
    if (uploadData.description)
      formData.append("description", uploadData.description);

    try {
      if (uploadMode === "single") {
        const result = await uploadSingle(formData).unwrap();
        toast.success("Image uploaded successfully");
        toast.success(`Image URL: ${result.data.url}`, {
          duration: 5000,
          action: {
            label: "Copy",
            onClick: () => copyToClipboard(result.data.url),
          },
        });
      } else {
        const result = await uploadMultiple(formData).unwrap();
        toast.success(
          `${Array.isArray(result.data) ? result.data.length : 0} images uploaded successfully`
        );
      }

      setIsUploadDialogOpen(false);
      setUploadData({ category: "", alt: "", description: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to upload image");
      console.error(error);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      await updateImage({
        id: editingImage.id,
        category: uploadData.category,
        alt: uploadData.alt,
        description: uploadData.description,
        isActive: editingImage.isActive,
      }).unwrap();

      toast.success("Image updated successfully");
      setIsEditDialogOpen(false);
      setEditingImage(null);
      setUploadData({ category: "", alt: "", description: "" });
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update image");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteImage(deleteId).unwrap();
      toast.success("Image deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete image");
      console.error(error);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const openEditDialog = (image: ImageType) => {
    setEditingImage(image);
    setUploadData({
      category: image.category || "",
      alt: image.alt || "",
      description: image.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Image Gallery"
        description="Manage uploaded images and media"
        action={{
          label: "Upload Images",
          onClick: () => setIsUploadDialogOpen(true),
        }}
      />

      <div className="flex items-center gap-4">
        <SearchBar placeholder="Search images..." onSearch={setSearch} />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="products">Products</SelectItem>
            <SelectItem value="banners">Banners</SelectItem>
            <SelectItem value="profiles">Profiles</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images found"
          description="Upload your first image to get started."
          action={{
            label: "Upload Image",
            onClick: () => setIsUploadDialogOpen(true),
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-muted relative">
                  <img
                    src={image.url}
                    alt={image.alt || image.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setViewImage(image)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => openEditDialog(image)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => copyToClipboard(image.url)}
                    >
                      {copiedUrl === image.url ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeleteId(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium truncate" title={image.originalName}>
                    {image.originalName}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(image.size)}</span>
                    {image.category && (
                      <Badge variant="outline" className="text-xs">
                        {image.category}
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant={image.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {image.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            ))}
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

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Images</DialogTitle>
            <DialogDescription>
              Upload single or multiple images to your gallery
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Mode</Label>
              <Select
                value={uploadMode}
                onValueChange={(value) =>
                  setUploadMode(value as "single" | "multiple")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Image</SelectItem>
                  <SelectItem value="multiple">Multiple Images</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">
                {uploadMode === "single" ? "Select Image" : "Select Images"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple={uploadMode === "multiple"}
                ref={fileInputRef}
                required
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF, WebP (Max 10MB per image)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={uploadData.category}
                onChange={(e) =>
                  setUploadData({ ...uploadData, category: e.target.value })
                }
                placeholder="e.g., products, banners"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={uploadData.alt}
                onChange={(e) =>
                  setUploadData({ ...uploadData, alt: e.target.value })
                }
                placeholder="Alternative text for accessibility"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData({ ...uploadData, description: e.target.value })
                }
                placeholder="Image description"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploadingSingle || isUploadingMultiple}
              >
                {(isUploadingSingle || isUploadingMultiple) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>Update image metadata</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {editingImage && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={editingImage.url}
                  alt={editingImage.alt || editingImage.originalName}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={uploadData.category}
                onChange={(e) =>
                  setUploadData({ ...uploadData, category: e.target.value })
                }
                placeholder="e.g., products, banners"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-alt">Alt Text</Label>
              <Input
                id="edit-alt"
                value={uploadData.alt}
                onChange={(e) =>
                  setUploadData({ ...uploadData, alt: e.target.value })
                }
                placeholder="Alternative text for accessibility"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData({ ...uploadData, description: e.target.value })
                }
                placeholder="Image description"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={editingImage?.isActive}
                onCheckedChange={(checked) =>
                  editingImage &&
                  setEditingImage({ ...editingImage, isActive: checked })
                }
              />
              <Label htmlFor="is-active">Active</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewImage?.originalName}</DialogTitle>
            <DialogDescription>
              {viewImage?.category && `Category: ${viewImage.category}`}
            </DialogDescription>
          </DialogHeader>
          {viewImage && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={viewImage.url}
                  alt={viewImage.alt || viewImage.originalName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">File Size</p>
                  <p className="text-muted-foreground">
                    {formatFileSize(viewImage.size)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">MIME Type</p>
                  <p className="text-muted-foreground">{viewImage.mimetype}</p>
                </div>
                {viewImage.alt && (
                  <div className="col-span-2">
                    <p className="font-medium">Alt Text</p>
                    <p className="text-muted-foreground">{viewImage.alt}</p>
                  </div>
                )}
                {viewImage.description && (
                  <div className="col-span-2">
                    <p className="font-medium">Description</p>
                    <p className="text-muted-foreground">
                      {viewImage.description}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="font-medium">URL</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={viewImage.url}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(viewImage.url)}
                    >
                      {copiedUrl === viewImage.url ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewImage(null)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              image from the server.
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
