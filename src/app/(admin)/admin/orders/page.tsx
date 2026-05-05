import { createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { Order, OrderStatus } from "@/types";

const statusColors: Record<OrderStatus, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  pending: "secondary",
  paid: "warning",
  picking: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
};

export default async function AdminOrdersPage() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (data as Order[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          {orders.length} total orders
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3.5 font-semibold text-slate-600">
                Order #
              </th>
              <th className="text-left px-6 py-3.5 font-semibold text-slate-600">
                Customer
              </th>
              <th className="text-left px-6 py-3.5 font-semibold text-slate-600">
                Date
              </th>
              <th className="text-center px-6 py-3.5 font-semibold text-slate-600">
                Status
              </th>
              <th className="text-right px-6 py-3.5 font-semibold text-slate-600">
                Total
              </th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-400">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No orders yet</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900 text-xs">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {order.customer_email}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
