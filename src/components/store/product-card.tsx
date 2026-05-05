"use client";

import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-200">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block">
        <div className="aspect-square bg-slate-100 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
          )}
        </div>
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 left-3">
            <Badge variant="warning">Only {product.stock_quantity} left</Badge>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm px-3 py-1">Out of Stock</Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {product.category && (
          <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">
            {product.category.name}
          </span>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-orange-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(product.sell_price)}
          </span>
          <Button
            size="sm"
            onClick={() => addItem(product)}
            disabled={isOutOfStock}
            className="gap-1.5"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
