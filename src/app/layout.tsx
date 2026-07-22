import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ConditionalShell from "@/components/layout/ConditionalShell";
import { CartProvider } from "@/lib/cart";
import AuthProvider from "@/providers/AuthProvider";


export const metadata: Metadata = {
  title: {
    default: "InstaPro - Mitra Transformasi Digital",
    template: "%s | InstaPro",
  },
  description:
    "PT Insta Pro Solution — Mitra transformasi digital untuk organisasi dan bisnis. Membangun sistem digital sekaligus meningkatkan kapasitas SDM.",
  keywords: [
    "instapro",
    "transformasi digital",
    "web development",
    "digital agency",
    "Pekanbaru",
    "Riau",
    "Indonesia",
    "UI/UX design",
    "system development",
  ],
  authors: [{ name: "PT Insta Pro Solution" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://instapro.co.id",
    siteName: "InstaPro",
    title: "InstaPro - Mitra Transformasi Digital",
    description:
      "Membantu organisasi membangun sistem digital sekaligus meningkatkan kapasitas SDM.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-blush antialiased text-navy-500 font-sans">
        <AuthProvider>
          <CartProvider>

            <Navbar />
            <main className="min-h-screen">{children}</main>
            <ConditionalShell />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
