import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Corner Store | Snacks, Drinks, Candy, Vapes & More",
  description:
    "Your corner store, online. Shop snacks, beverages, candy, vapes, and everyday essentials — picked fresh from NJ wholesalers and shipped to your door.",
  openGraph: {
    title: "My Corner Store",
    description:
      "Snacks, drinks, candy, vapes, and everyday essentials — ordered online and shipped fresh.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
