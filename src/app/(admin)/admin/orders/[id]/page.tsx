import { createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from "@/components/admin/order-actions";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Order, OrderStatus } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const statusColors: Record<OrderStatus, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  pending: "secondary",
  paid: "warning",
  picking: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const order = data as Order;

  const profit = order.order_items?.reduce(
    (sum, item) => sum + (item.unit_price - item.unit_cost) * item.quantity,
    0
  ) ?? 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-mono">
            {order.order_number}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Placed{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge variant={statusColors[order.status]} className="text-sm px-3 py-1">
          {order.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Customer</h2>
          <div className="space-y-1 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{order.customer_name}</p>
            <p>{order.customer_email}</p>
            {order.shipping_address && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="font-medium text-slate-900 mb-1">
                  Ship to:
                </p>
                <p>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && (
                  <p>{order.shipping_address.line2}</p>
                )}
                <p>
                  {order.shipping_address.city},{" "}
                  {order.shipping_address.state}{" "}
                  {order.shipping_address.zip}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Financials */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Financials</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping</span>
              <span>{formatCurrency(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t border-slate-200 pt-2 mt-2">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-2">
              <span>Your Profit</span>
              <span>{formatCurrency(profit)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Order Items</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-3 font-medium text-slate-500">
                Product
              </th>
              <th className="text-right px-6 py-3 font-medium text-slate-500">
                Cost
              </th>
              <th className="text-right px-6 py-3 font-medium text-slate-500">
                Price
              </th>
              <th className="text-right px-6 py-3 font-medium text-slate-500">
                Qty
              </th>
              <th className="text-right px-6 py-3 font-medium text-slate-500">
                Total
              </th>
              <th className="text-right px-6 py-3 font-medium text-slate-500">
                Profit
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.order_items?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3.5">
                  <p className="font-medium text-slate-900">
                    {item.product_name}
                  </p>
                  {item.product_sku && (
                    <p className="text-xs text-slate-400">{item.product_sku}</p>
                  )}
                </td>
                <td className="px-6 py-3.5 text-right text-slate-500">
                  {formatCurrency(item.unit_cost)}
                </td>
                <td className="px-6 py-3.5 text-right text-slate-900">
                  {formatCurrency(item.unit_price)}
                </td>
                <td className="px-6 py-3.5 text-right text-slate-900">
                  {item.quantity}
                </td>
                <td className="px-6 py-3.5 text-right font-semibold">
                  {formatCurrency(item.total_price)}
                </td>
                <td className="px-6 py-3.5 text-right text-green-600 font-semibold">
                  {formatCurrency(
                    (item.unit_price - item.unit_cost) * item.quantity
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fulfillment Actions */}
      <OrderActions order={order} />
    </div>
  );
}
