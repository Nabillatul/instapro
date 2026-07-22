"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function ConditionalShell() {
  const pathname = usePathname();

  // Jangan tampilkan footer & WA button di halaman admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
