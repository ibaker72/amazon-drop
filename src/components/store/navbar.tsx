"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { totalItems, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = totalItems();

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-slate-900 text-base">NJ Drop</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest">
                Paterson, NJ
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/products?category=electronics"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Electronics
            </Link>
            <Link
              href="/products?category=apparel"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Apparel
            </Link>
            <Link
              href="/products?category=home"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className="relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Button>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-1">
            {[
              { href: "/products", label: "Shop All" },
              { href: "/products?category=electronics", label: "Electronics" },
              { href: "/products?category=apparel", label: "Apparel" },
              { href: "/products?category=home", label: "Home" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
