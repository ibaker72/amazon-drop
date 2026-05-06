import { Store, Truck, ShieldCheck, Clock, Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      {/* Trust bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Fast Shipping",
                desc: "Orders processed same day",
              },
              {
                icon: Zap,
                title: "Fresh Stock",
                desc: "Picked from NJ wholesalers",
              },
              {
                icon: ShieldCheck,
                title: "Hand Inspected",
                desc: "Every item checked before ship",
              },
              {
                icon: Clock,
                title: "Order by 2pm",
                desc: "Ships out the same day",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{title}</p>
                  <p className="text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-orange-500 flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">My Corner Store</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Your neighborhood store, online. Snacks, drinks, candy, vapes,
              and everyday essentials picked fresh from NJ wholesalers and
              shipped straight to you.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Shop
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { label: "All Products", href: "/products" },
                { label: "Snacks & Chips", href: "/products?category=snacks" },
                { label: "Beverages", href: "/products?category=beverages" },
                { label: "Candy & Gum", href: "/products?category=candy" },
                { label: "Vapes & Tobacco", href: "/products?category=vapes" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Info
            </p>
            <ul className="space-y-2 text-sm">
              {["Shipping Policy", "Returns", "Contact Us", "About"].map((item) => (
                <li key={item}>
                  <Link href="/" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()} My Corner Store. All rights reserved.</p>
          <p>mycornerstore.app</p>
        </div>
      </div>
    </footer>
  );
}
