import { createServiceClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import type { Category, Supplier } from "@/types";

export default async function NewProductPage() {
  const supabase = await createServiceClient();
  const [{ data: categories }, { data: suppliers }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("suppliers").select("*").order("name"),
  ]);

  return (
    <ProductForm
      categories={(categories as Category[]) || []}
      suppliers={(suppliers as Supplier[]) || []}
    />
  );
}
