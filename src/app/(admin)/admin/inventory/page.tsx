import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, calculateMargin } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import type { Product, OrderItem } from "@/types";

async function getInventoryData() {
  const supabase = await createServiceClient();

  const [productsRes, orderItemsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(*), supplier:suppliers(*)")
      .order("stock_quantity", { ascending: true }),
    supabase
      .from("order_items")
      .select("*")
      .not("order_id", "is", null),
  ]);

  const products = (productsRes.data as Product[]) || [];
  const orderItems = (orderItemsRes.data as OrderItem[]) || [];

  // Aggregate sold quantities and profit per product
  const salesMap = new Map<
    string,
    { unitsSold: number; revenue: number; profit: number }
  >();
  for (const item of orderItems) {
    if (!item.product_id) continue;
    const existing = salesMap.get(item.product_id) || {
      unitsSold: 0,
      revenue: 0,
      profit: 0,
    };
    salesMap.set(item.product_id, {
      unitsSold: existing.unitsSold + item.quantity,
      revenue: existing.revenue + item.total_price,
      profit:
        existing.profit +
        (item.unit_price - item.unit_cost) * item.quantity,
    });
  }

  const totalRevenue = orderItems.reduce((s, i) => s + i.total_price, 0);
  const totalCogs = orderItems.reduce(
    (s, i) => s + i.unit_cost * i.quantity,
    0
  );
  const totalProfit = totalRevenue - totalCogs;
  const totalInventoryValue = products.reduce(
    (s, p) => s + p.cost_price * p.stock_quantity,
    0
  );

  return {
    products,
    salesMap,
    totalRevenue,
    totalCogs,
    totalProfit,
    totalInventoryValue,
  };
}

export default async function InventoryPage() {
  const {
    products,
    salesMap,
    totalRevenue,
    totalCogs,
    totalProfit,
    totalInventoryValue,
  } = await getInventoryData();

  const overallMargin = totalRevenue > 0
    ? ((totalProfit / totalRevenue) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Inventory & P&L
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time profit tracking across all products
        </p>
      </div>

      {/* P&L Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            icon: DollarSign,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            title: "Total COGS",
            value: formatCurrency(totalCogs),
            icon: ShoppingCart,
            color: "text-red-500",
            bg: "bg-red-50",
          },
          {
            title: "Gross Profit",
            value: formatCurrency(totalProfit),
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            title: "Inventory Value",
            value: formatCurrency(totalInventoryValue),
            icon: Package,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map(({ title, value, icon: Icon, color, bg }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div
                  className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall margin */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">
                Overall Gross Margin
              </p>
              <p className="text-4xl font-extrabold text-white mt-1">
                {overallMargin}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">
                {formatCurrency(totalProfit)} profit on{" "}
                {formatCurrency(totalRevenue)} revenue
              </p>
              <p className="text-slate-500 text-xs mt-1">
                All time, all products
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product P&L Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product P&L Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">
                    Product
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
                  <th className="text-right px-6 py-3.5 font-semibold text-slate-600">
                    Units Sold
                  </th>
                  <th className="text-right px-6 py-3.5 font-semibold text-slate-600">
                    Revenue
                  </th>
                  <th className="text-right px-6 py-3.5 font-semibold text-slate-600">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const margin = calculateMargin(
                    product.cost_price,
                    product.sell_price
                  );
                  const sales = salesMap.get(product.id);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-slate-900 max-w-[180px] truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {product.supplier?.name || "No supplier"}
                        </p>
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-500">
                        {formatCurrency(product.cost_price)}
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-900 font-medium">
                        {formatCurrency(product.sell_price)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span
                          className={`font-semibold ${
                            margin >= 30
                              ? "text-green-600"
                              : margin >= 15
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {margin.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Badge
                          variant={
                            product.stock_quantity === 0
                              ? "destructive"
                              : product.stock_quantity <= 5
                              ? "warning"
                              : "success"
                          }
                        >
                          {product.stock_quantity}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-600">
                        {sales?.unitsSold ?? 0}
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-900 font-medium">
                        {formatCurrency(sales?.revenue ?? 0)}
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-green-600">
                        {formatCurrency(sales?.profit ?? 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
