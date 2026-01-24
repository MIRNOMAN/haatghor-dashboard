"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";
import { useGetProductByIdQuery } from "@/store/features/products/productsApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!data?.data) {
    return <div>Product not found</div>;
  }

  return <ProductForm product={data.data} isEdit />;
}
