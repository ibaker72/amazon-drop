import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/product-card";
import { Package } from "lucide-react";
import type { Product, Category } from "@/types";

interface SearchParams {
  category?: string;
  q?: string;
  sort?: string;
}

async function getProducts(params: SearchParams): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(*), supplier:suppliers(*)")
    .eq("is_active", true)
    .gt("stock_quantity", 0);

  if (params.category) {
    query = query.eq("categories.slug", params.category);
  }
  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  const sort = params.sort || "newest";
  if (sort === "price-asc") query = query.order("sell_price", { ascending: true });
  else if (sort === "price-desc") query = query.order("sell_price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data } = await query.limit(48);
  return (data as Product[]) || [];
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data as Category[]) || [];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Categories
              </p>
              <div className="space-y-1">
                <a
                  href="/products"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !params.category
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All Products
                </a>
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      params.category === cat.slug
                        ? "bg-orange-50 text-orange-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Sort By
              </p>
              <div className="space-y-1">
                {[
                  { value: "newest", label: "Newest First" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                ].map((option) => (
                  <a
                    key={option.value}
                    href={`/products?${params.category ? `category=${params.category}&` : ""}sort=${option.value}`}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      (params.sort || "newest") === option.value
                        ? "bg-orange-50 text-orange-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-slate-900">
              {params.category
                ? categories.find((c) => c.slug === params.category)?.name ||
                  "Products"
                : "All Products"}
            </h1>
            <span className="text-sm text-slate-400">{products.length} items</span>
          </div>

          {/* Search bar */}
          <form method="GET" action="/products" className="mb-6">
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            <input
              type="search"
              name="q"
              defaultValue={params.q}
              placeholder="Search products..."
              className="w-full h-10 px-4 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </form>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Package className="h-14 w-14 mb-4 opacity-30" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">
                Try a different search or browse all categories
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
