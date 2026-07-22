import React from "react";
import Link from "next/link";
import { requireAdmin, getAdminUser } from "@/lib/admin-auth";
import { FileText, Package, LayoutDashboard, ShoppingBag, ShieldCheck, Home } from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";
import AdminProfileEditor from "./AdminProfileEditor";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const admin = await getAdminUser();

  const adminName = admin?.name ?? "Admin Instapro";
  const adminEmail = admin?.email ?? "admin@instapro.co.id";
  const adminInitial = adminName.charAt(0).toUpperCase();

  const adminProfile = {
    name: adminName,
    email: adminEmail,
    phone: admin?.phone ?? null,
    image: admin?.image ?? null,
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { href: "/admin/artikel", label: "Artikel", icon: <FileText size={15} /> },
    { href: "/admin/produk", label: "Produk", icon: <Package size={15} /> },
    { href: "/admin/pesanan", label: "Pesanan", icon: <ShoppingBag size={15} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-blush">
      {/* ── TOP BAR ADMIN ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-navy-500/8 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo + Badge */}
            <div className="flex items-center gap-4">
              <img
                src="/logo-landscape.png"
                alt="InstaPro Logo"
                className="h-9 w-auto object-contain"
              />
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-extrabold uppercase tracking-widest">
                <ShieldCheck size={11} />
                Admin Panel
              </span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-navy-500 hover:bg-brand-50 hover:text-brand-500 transition-all duration-200"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Profile + Actions */}
            <div className="flex items-center gap-3">
              {/* Link ke halaman utama */}
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-navy-500/60 hover:text-navy-500 hover:bg-navy-50 transition-all"
                target="_blank"
                title="Lihat Situs"
              >
                <Home size={13} />
                Situs
              </Link>

              {/* Admin Profile Editor (Client Component) */}
              <AdminProfileEditor admin={adminProfile} adminInitial={adminInitial} />

              <AdminLogoutButton />
            </div>
          </div>

          {/* Mobile nav */}
          <div className="lg:hidden flex gap-1.5 pb-3 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold text-navy-500 hover:bg-brand-50 hover:text-brand-500 whitespace-nowrap border border-navy-100 bg-white transition-all"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-5 sm:px-8 py-8">
        {children}
      </main>

      {/* ── FOOTER ADMIN ── */}
      <footer className="border-t border-navy-500/5 py-5 text-center">
        <p className="text-[11px] font-bold text-navy-500/30">
          © {new Date().getFullYear()} PT. Insta Pro Solution — Admin Panel
        </p>
      </footer>
    </div>
  );
}
