import { createServiceClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";
import type { Category, Product, Supplier } from "@/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const [{ data: product }, { data: categories }, { data: suppliers }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(*), supplier:suppliers(*)")
        .eq("id", id)
        .single(),
      supabase.from("categories").select("*").order("name"),
      supabase.from("suppliers").select("*").order("name"),
    ]);

  if (!product) notFound();

  return (
    <ProductForm
      product={product as Product}
      categories={(categories as Category[]) || []}
      suppliers={(suppliers as Supplier[]) || []}
    />
  );
}
