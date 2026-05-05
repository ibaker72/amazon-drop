import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NJ Drop | Quality Wholesale Products — Paterson, NJ",
  description:
    "Shop quality products sourced directly from North Jersey wholesalers. Faster shipping, better prices, local accountability.",
  openGraph: {
    title: "NJ Drop",
    description: "Quality wholesale products from Paterson, NJ",
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
