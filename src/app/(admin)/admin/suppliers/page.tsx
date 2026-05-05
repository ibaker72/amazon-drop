import { createServiceClient } from "@/lib/supabase/server";
import { SuppliersClient } from "@/components/admin/suppliers-client";
import type { Supplier } from "@/types";

export default async function SuppliersPage() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  return <SuppliersClient suppliers={(data as Supplier[]) || []} />;
}
