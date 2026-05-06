import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Product, Category } from "@/types";

const CATEGORY_EMOJIS: Record<string, string> = {
  snacks: "🍿",
  candy: "🍬",
  beverages: "🥤",
  grocery: "🛒",
  vapes: "💨",
  "health-beauty": "🧴",
  household: "🧹",
  "frozen-dairy": "🧊",
};

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*), supplier:suppliers(*)")
    .eq("is_active", true)
    .gt("stock_quantity", 0)
    .order("created_at", { ascending: false })
    .limit(8);
  return (data as Product[]) || [];
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  return (data as Category[]) || [];
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-300 text-sm font-medium mb-6">
              <ShoppingBag className="h-4 w-4" />
              Stocked fresh from NJ wholesalers
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Your Corner Store,
              <br />
              <span className="text-orange-400">Online.</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-lg">
              Snacks, drinks, candy, vapes, and everyday essentials — all in one
              place. Order online and we&apos;ll pick it fresh and ship it straight
              to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2 text-base px-8">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products?category=snacks">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent text-base px-8"
                >
                  Browse Snacks
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: "500+", label: "Products In Stock" },
                { value: "Same Day", label: "Order Processing" },
                { value: "Fast Ship", label: "To Your Door" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 transition-all text-center group"
              >
                <span className="text-3xl leading-none">
                  {CATEGORY_EMOJIS[cat.slug] ?? "🛍️"}
                </span>
                <span className="font-semibold text-sm text-slate-800 group-hover:text-orange-700 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <h2 className="text-2xl font-bold text-slate-900">Just Stocked</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Products coming soon</p>
            <p className="text-sm mt-1">
              We&apos;re stocking the shelves — check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trust section */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Why Shop My Corner Store?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Stocked Like a Real Store",
                body: "We carry what corner stores actually sell — snacks, drinks, candy, vapes, household items. No random imports or mystery pallets.",
              },
              {
                title: "We Pick It Fresh",
                body: "Every order is hand-picked from our local NJ wholesale suppliers the same day you order. You get it fresh, not from a dusty shelf.",
              },
              {
                title: "Wholesale Prices, No Markup Games",
                body: "We buy direct from wholesalers and keep our margins honest. Real prices on real products — that's the corner store way.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-slate-200"
              >
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
