import { createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, calculateMargin } from "@/lib/utils";
import { Package, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";

export default async function AdminProductsPage() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*), supplier:suppliers(*)")
    .order("created_at", { ascending: false });

  const products = (data as Product[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} products in your catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3.5 font-semibold text-slate-600">
                Product
              </th>
              <th className="text-left px-6 py-3.5 font-semibold text-slate-600">
                Category
              </th>
              <th className="text-right px-6 py-3.5 font-semibold text-slate-600">
                Cost
              </th>
              <th className="text-right px-6 py-3.5 font-semibold text-slate-600">
                Price
              </th>
              <th className="text-right px-6 py-3.5 font-semibold text-slate-600">
                Margin
              </th>
              <th className="text-right px-6 py-3.5 font-semibold text-slate-600">
                Stock
              </th>
              <th className="text-center px-6 py-3.5 font-semibold text-slate-600">
                Status
              </th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-slate-400">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No products yet</p>
                  <p className="text-xs mt-1">
                    <Link
                      href="/admin/products/new"
                      className="text-orange-600 hover:underline"
                    >
                      Add your first product
                    </Link>
                  </p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const margin = calculateMargin(
                  product.cost_price,
                  product.sell_price
                );
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 max-w-[200px] truncate">
                        {product.name}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {product.sku}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      {formatCurrency(product.cost_price)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(product.sell_price)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          margin >= 30
                            ? "text-green-600"
                            : margin >= 15
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        {margin.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-medium ${
                          product.stock_quantity === 0
                            ? "text-red-600"
                            : product.stock_quantity <= 5
                            ? "text-yellow-600"
                            : "text-slate-900"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant={product.is_active ? "success" : "secondary"}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sm font-medium text-orange-600 hover:text-orange-700"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
