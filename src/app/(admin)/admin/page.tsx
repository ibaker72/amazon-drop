import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type { Order, Product } from "@/types";

async function getDashboardData() {
  const supabase = await createServiceClient();

  const [ordersRes, productsRes, recentOrdersRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total, status, created_at")
      .neq("status", "cancelled"),
    supabase
      .from("products")
      .select("id, name, stock_quantity, sell_price, cost_price, is_active"),
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const orders = (ordersRes.data || []) as Pick<Order, "total" | "status" | "created_at">[];
  const products = (productsRes.data || []) as Pick<
    Product,
    "id" | "name" | "stock_quantity" | "sell_price" | "cost_price" | "is_active"
  >[];
  const recentOrders = (recentOrdersRes.data || []) as Order[];

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    ["paid", "picking"].includes(o.status)
  ).length;
  const lowStockProducts = products.filter(
    (p) => p.is_active && p.stock_quantity <= 5
  );

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  };
}

const statusColors: Record<string, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  pending: "secondary",
  paid: "warning",
  picking: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
};

export default async function AdminDashboard() {
  const {
    totalRevenue,
    totalOrders,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  } = await getDashboardData();

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending Fulfillment",
      value: pendingOrders.toString(),
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Low Stock Items",
      value: lowStockProducts.length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, color, bg }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link
              href="/admin/orders"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No orders yet
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {order.customer_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColors[order.status] || "secondary"}>
                        {order.status}
                      </Badge>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Low Stock Alert
            </CardTitle>
            <Link
              href="/admin/inventory"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                All products have healthy stock
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-900 truncate max-w-[60%]">
                      {product.name}
                    </p>
                    <Badge
                      variant={
                        product.stock_quantity === 0
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {product.stock_quantity === 0
                        ? "Out of stock"
                        : `${product.stock_quantity} left`}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
              <Package className="h-4 w-4" />
              Add Product
            </button>
          </Link>
          <Link href="/admin/orders">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors">
              <ShoppingCart className="h-4 w-4" />
              Manage Orders
            </button>
          </Link>
          <Link href="/admin/inventory">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors">
              <TrendingUp className="h-4 w-4" />
              View P&L
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
