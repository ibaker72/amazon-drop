import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/product-card";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Package, Truck, ShieldCheck, ArrowLeft, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*), supplier:suppliers(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as Product | null;
}

async function getRelated(categoryId: string, excludeId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(4);
  return (data as Product[]) || [];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = product.category_id
    ? await getRelated(product.category_id, product.id)
    : [];

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-slate-900 transition-colors">
          Products
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-slate-900 transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden relative">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="h-20 w-20 text-slate-300" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-slate-100 overflow-hidden relative"
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
            {product.name}
          </h1>

          {product.sku && (
            <p className="text-xs text-slate-400">SKU: {product.sku}</p>
          )}

          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-slate-900">
              {formatCurrency(product.sell_price)}
            </span>
            {isOutOfStock ? (
              <Badge variant="secondary">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="warning">Only {product.stock_quantity} left!</Badge>
            ) : (
              <Badge variant="success">In Stock</Badge>
            )}
          </div>

          {product.description && (
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          )}

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <AddToCartButton product={product} disabled={isOutOfStock} />

          {/* Trust badges */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            {[
              { icon: Truck, text: "Ships within 24 hours from Paterson, NJ" },
              { icon: ShieldCheck, text: "Hand-inspected before shipping" },
              { icon: MapPin, text: "Locally sourced from NJ wholesalers" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                <Icon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all products
        </Link>
      </div>
    </div>
  );
}
