"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Qty:</span>
        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 transition-colors"
            disabled={disabled}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold border-x border-slate-300">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(product.stock_quantity, quantity + 1))
            }
            className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 transition-colors"
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full gap-2 text-base"
        onClick={handleAdd}
        disabled={disabled}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            {disabled ? "Out of Stock" : "Add to Cart"}
          </>
        )}
      </Button>
    </div>
  );
}
