"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, LogOut, Settings } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/layanan", label: "Layanan" },
  { href: "/berita", label: "Berita" },
  { href: "/katalog", label: "Katalog" },
  { href: "/kelas-quantum", label: "Kelas Instapro" },
  { href: "/analytics", label: "Analytics" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const navRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Sembunyikan navbar di halaman admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-navy-500/5 shadow-glass"
          : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo-landscape.png"
              alt="InstaPro Logo"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                  pathname === link.href
                    ? "text-brand-500"
                    : "text-navy-500/70 hover:text-navy-500 hover:bg-navy-500/5"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-500 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              href="/keranjang"
              className="relative p-2 rounded-xl text-navy-500/70 hover:text-navy-500 hover:bg-navy-500/5 transition-all"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* Login */}
            {status === "authenticated" && session?.user ? (
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border border-brand-500/10 bg-brand-500/5 text-navy-500 hover:bg-brand-500/10 transition-all cursor-pointer"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-extrabold uppercase shrink-0">
                      {session.user.name ? session.user.name[0] : "U"}
                    </div>
                  )}
                  <span className="max-w-[80px] truncate text-xs">
                    {session.user.name?.split(" ")[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-navy-500/5 shadow-glass p-2 z-50 flex flex-col gap-1"
                    >
                      <div className="px-3 py-2 border-b border-navy-500/5 mb-1">
                        <p className="text-xs font-extrabold text-navy-500 truncate">
                          {session.user.name}
                        </p>
                        <p className="text-[10px] font-bold text-navy-500/40 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-navy-500/70 hover:text-navy-500 hover:bg-navy-500/5 rounded-xl transition-all"
                      >
                        <User size={14} className="text-brand-500" />
                        Profil Saya
                      </Link>
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-navy-500/70 hover:text-navy-500 hover:bg-navy-500/5 rounded-xl transition-all"
                        >
                          <Settings size={14} className="text-brand-500" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all text-left w-full cursor-pointer"
                      >
                        <LogOut size={14} />
                        Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-navy-100 bg-white text-navy-500 hover:bg-navy-50 transition-all"
              >
                <User size={16} />
                Login
              </Link>
            )}

            {/* Request Quote */}
            <Link
              href="/kontak"
              className="hidden md:flex btn-primary text-xs px-4 py-2"
            >
              Request Quote
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-navy-500/70 hover:text-navy-500 hover:bg-navy-500/5 transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-b border-navy-500/5"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      pathname === link.href
                        ? "bg-brand-500/10 text-brand-500"
                        : "text-navy-500/70 hover:text-navy-500 hover:bg-navy-500/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 border-t border-navy-500/5 flex flex-col gap-2">
                {status === "authenticated" && session?.user ? (
                  <div className="bg-navy-50/50 rounded-2xl p-3 flex flex-col gap-2.5">
                    <div className="flex items-center gap-3">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-extrabold uppercase shrink-0">
                          {session.user.name ? session.user.name[0] : "U"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-navy-500 truncate">{session.user.name}</p>
                        <p className="text-[10px] font-bold text-navy-500/40 truncate">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/dashboard"
                        className="flex-1 btn-secondary text-[10px] py-2 justify-center"
                      >
                        <User size={12} /> Profil
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex-1 px-4 py-2 rounded-xl text-[10px] font-bold bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut size={12} /> Keluar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1 btn-secondary text-xs justify-center py-2.5">
                      <User size={14} /> Login
                    </Link>
                    <Link href="/kontak" className="flex-1 btn-primary text-xs justify-center py-2.5">
                      Request Quote
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
