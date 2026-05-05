"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { CheckCircle, Truck, Package } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
        Order Confirmed!
      </h1>
      <p className="text-slate-500 mb-2 text-lg">
        Thank you for your order. We&apos;re on it.
      </p>
      <p className="text-sm text-slate-400 mb-10">
        You&apos;ll receive a confirmation email shortly. Orders typically ship
        within 24 hours from our Paterson warehouse.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          {
            icon: Package,
            title: "We&apos;re Picking Your Order",
            desc: "Our team is pulling your items now.",
          },
          {
            icon: Truck,
            title: "Ships in ~24 Hours",
            desc: "From our warehouse in Paterson, NJ.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-slate-50 rounded-xl p-4 border border-slate-200"
          >
            <Icon className="h-6 w-6 text-orange-500 mb-2" />
            <p
              className="text-sm font-semibold text-slate-900"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="outline">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
