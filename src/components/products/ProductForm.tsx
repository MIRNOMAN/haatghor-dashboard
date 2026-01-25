/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
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
import { ArrowLeft, Loader2, X, Plus, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/features/products/productsApi";
import { useGetAllCategoriesQuery } from "@/store/features/categories/categoriesApi";
import {
  useUploadMultipleImagesMutation,

  useDeleteImageMutation,
} from "@/store/features/images/imagesApi";
import { Product } from "@/types/product";
import Image from "next/image";

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

interface Specifications {
  processor: string;
  ram: string;
  [key: string]: string;
}

interface Variant {
  name: string;
  options: string[];
}

export function ProductForm({ product, isEdit }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ _id: string; url: string }[]>(() => {
    if (product?.images) {
      return product.images.map((img: any) => ({
        _id: img._id || img.id || '',
        url: img.url || img
      }));
    }
    return [];
  });

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    price: number;
    discount: number;
    stock: number;
    categoryId: string;
    status: "ACTIVE" | "INACTIVE";
    specifications: Specifications;
    variants: Variant[];
  }>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    discount: product?.discount || 0,
    stock: product?.stock || 0,
    categoryId: product?.categoryId || "",
    status: product?.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    specifications: (product?.specifications as Specifications) || { processor: "", ram: "" },
    variants: (product?.variants as Variant[]) || [{ name: "", options: [""] }],
  });

  // RTK Query hooks
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadMultipleImagesMutation();
  const [deleteImages, { isLoading: isDeleting }] = useDeleteImageMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery({ page: 1, limit: 100 });

  const categories = categoriesData?.data || [];

  // Auto-generate slug
  useEffect(() => {
    if (!isEdit && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, isEdit]);

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
  };

  // Upload images
  const handleUploadImages = async () => {
    if (imageFiles.length === 0) return toast.error("Please select images first");

    const formDataToUpload = new FormData();
    imageFiles.forEach((file) => formDataToUpload.append("images", file));

    try {
      const res = await uploadImages(formDataToUpload).unwrap();

      const newUrls: string[] = Array.isArray(res?.data)
        ? res.data.map((img: any) => img.url)
        : [];

      if (newUrls.length === 0) return toast.error("No images returned from server");

      setUploadedImages((prev) => [...prev, ...newUrls]);
      setImageFiles([]);
      toast.success("Images uploaded successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Image upload failed");
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required validations
    if (!formData.name) return toast.error("Product name is required");
    if (!formData.slug) return toast.error("Product slug cannot be empty");
    if (!formData.categoryId) return toast.error("Please select a category");
    if (uploadedImages.length === 0) return toast.error("Please upload at least one image");

    // Ensure all string fields are defined
    const safeSpecifications: Specifications = {};
    Object.keys(formData.specifications).forEach((key) => {
      safeSpecifications[key] = formData.specifications[key] || "";
    });

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || "",
      price: Number(formData.price) || 0,
      discount: Number(formData.discount) || 0,
      stock: Number(formData.stock) || 0,
      categoryId: formData.categoryId,
      images: uploadedImages,
      status: formData.status || "ACTIVE",
      specifications: safeSpecifications,
      variants: formData.variants
    .filter((v) => v.name.trim() !== "" && v.options.length > 0) 
    .map((v) => ({
      name: v.name,
      // Ensure options is an array of non-empty strings
      options: v.options.filter(opt => opt.trim() !== "")
    })),
    };

    try {
      if (isEdit) {
        await updateProduct({ id: product?.id as string, body: payload }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully!");
      }
      router.push("/products");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save product");
    }
  };

  return (
    <div className=" mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{isEdit ? "Edit Product" : "Publish Product"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Discount</Label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Processor</Label>
                <Input
                  value={formData.specifications.processor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        processor: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>RAM</Label>
                <Input
                  value={formData.specifications.ram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        ram: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
        {/* Variants */}
<Card>
  <CardHeader className="flex items-center justify-between">
    <CardTitle>Variants</CardTitle>
    <Button
      type="button"
      size="sm"
      onClick={() =>
        setFormData({
          ...formData,
          variants: [...formData.variants, { name: "", options: [""] }],
        })
      }
    >
      <Plus className="w-4 h-4" /> Add
    </Button>
  </CardHeader>
  <CardContent className="space-y-4">
    {formData.variants.map((v, idx) => (
      <div
        key={idx}
        className="flex gap-4 items-end border p-4 rounded bg-gray-50 relative"
      >
        <div className="flex-1">
          <Label>Name</Label>
          <Input
            value={v.name}
            onChange={(e) => {
              const newVariants = [...formData.variants];
              newVariants[idx].name = e.target.value;
              setFormData({ ...formData, variants: newVariants });
            }}
            placeholder="Color"
          />
        </div>
        <div className="flex-1">
          <Label>Options (comma separated)</Label>
          <Input
            value={v.options}
            onChange={(e) => {
              const newVariants = [...formData.variants];
              newVariants[idx].options = e.target.value
                .split(",")
                .map((opt) => opt.trim());
              setFormData({ ...formData, variants: newVariants });
            }}
            placeholder="Red, Blue"
          />
        </div>
        {/* Delete button */}
        {formData.variants.length > 1 && (
          <button
            type="button"
            onClick={() => {
              const newVariants = formData.variants.filter((_, i) => i !== idx);
              setFormData({ ...formData, variants: newVariants });
            }}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        )}
      </div>
    ))}
  </CardContent>
</Card>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: "ACTIVE" | "INACTIVE") =>
                    setFormData({ ...formData, status: val })
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
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed p-4 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm">Click to select images</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              {imageFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {imageFiles.map((f, i) => (
                      <div key={i} className="h-16 w-16 bg-gray-100 rounded relative">
                        <Image
                          fill
                          src={URL.createObjectURL(f)}
                          alt="preview"
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleUploadImages}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Images Now"}
                  </Button>
                </div>
              )}

{uploadedImages.map((img) => (
  <div key={img._id} className="relative group flex aspect-square">
    <Image
  
      src={img.url}
      width={800}
      height={800}
      alt="product"
      className="object-cover rounded w-full h-full"
    />
    <button
      type="button"
      onClick={async () => {
        const id = img._id;
        try {
          await deleteImages(id).unwrap();
          setUploadedImages((prev) => prev.filter((i) => i._id !== img._id));
          toast.success("Image deleted successfully!");
        } catch (err: any) {
          toast.error(err?.data?.message || "Failed to delete image");
        }
      }}
      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
    >
      <X size={12} />
    </button>
  </div>
))}

            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={isCreating || isUpdating || isUploading || isDeleting}
          >
            {(isCreating || isUpdating) && <Loader2 className="mr-2 animate-spin" />}
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
