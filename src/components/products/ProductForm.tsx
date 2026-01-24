"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/features/products/productsApi";
import { useGetAllCategoriesQuery } from "@/store/features/categories/categoriesApi";
import { Product, CreateProductInput } from "@/types/product";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export function ProductForm({ product, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<CreateProductInput>>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    discountPrice: product?.discountPrice || 0,
    stock: product?.stock || 0,
    categoryId: product?.categoryId || "",
    images: product?.images || [],
    thumbnail: product?.thumbnail || "",
    tags: product?.tags || [],
    status: product?.status || "ACTIVE",
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery({ page: 1, limit: 100 });

  const categories = categoriesData?.data?.result || [];
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (isEdit && product) {
        await updateProduct({
          id: product.id,
          ...formData,
        } as any).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData as CreateProductInput).unwrap();
        toast.success("Product created successfully");
      }
      router.push("/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit Product" : "Create Product"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEdit
              ? "Update product information"
              : "Add a new product to your catalog"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleChange("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter product description"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    handleChange("price", parseFloat(e.target.value))
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountPrice || ""}
                  onChange={(e) =>
                    handleChange(
                      "discountPrice",
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  Stock <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    handleChange("stock", parseInt(e.target.value))
                  }
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail || ""}
                onChange={(e) => handleChange("thumbnail", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">
                Image URLs (comma-separated)
              </Label>
              <Textarea
                id="images"
                value={formData.images?.join(", ") || ""}
                onChange={(e) =>
                  handleChange(
                    "images",
                    e.target.value.split(",").map((url) => url.trim())
                  )
                }
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-full md:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
