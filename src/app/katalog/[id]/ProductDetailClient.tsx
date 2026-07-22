"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductItem } from "@/lib/products";
import { formatRupiah, getWhatsAppLink } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  CheckCircle2,
  Package,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Headphones,
  Check,
} from "lucide-react";

interface ProductDetailClientProps {
  product: ProductItem;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Combine main image + gallery
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...product.gallery.filter((g) => g && g !== product.image),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = allImages[activeIndex] ?? null;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-28 pb-24 bg-slate-50/50 min-h-screen">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-500/5 to-transparent blur-3xl pointer-events-none" />

      <section className="relative z-10 section-container">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-500 text-xs font-semibold uppercase tracking-wider mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Kembali ke Katalog
          </Link>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* ── LEFT: IMAGE GALLERY (5 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 flex flex-col justify-between h-full"
          >
            {/* Main Showcase Box */}
            <div className="relative aspect-[4/3] w-full rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden flex items-center justify-center p-8 group shrink-0">
              <div className="absolute inset-0 bg-dots opacity-15 pointer-events-none" />

              {activeImage ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={activeImage}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-contain max-h-[380px] z-10 drop-shadow-sm"
                  />
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300">
                  <Package size={72} strokeWidth={1.5} />
                  <span className="text-xs font-medium mt-2">Tidak ada pratinjau foto</span>
                </div>
              )}

              {/* Tag Category & Featured */}
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900 text-white uppercase tracking-wider shadow-sm">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles size={11} /> Populer
                  </span>
                )}
              </div>

              {/* Arrows for multi-images */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveIndex((i) => (i + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {allImages.length > 1 ? (
              <div className="flex gap-2.5 overflow-x-auto pb-1 mt-4 shrink-0">
                {allImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-16 h-14 rounded-xl overflow-hidden border-2 bg-white transition-all shrink-0 p-1 ${
                      idx === activeIndex
                        ? "border-brand-500 ring-2 ring-brand-500/10 scale-105"
                        : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            ) : (
              /* Filler Card when no thumbnails to keep bottom aligned */
              <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Sistem Siap Pakai</h4>
                  <p className="text-[11px] font-medium text-slate-400">Garansi penuh & pendampingan instalasi</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* ── RIGHT: PRODUCT DETAILS & ACTIONS (7 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-between gap-6"
          >
            {/* Header info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price card */}
              <div className="inline-flex items-baseline gap-2 bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm my-1">
                <span className="text-2xl sm:text-3xl font-black text-brand-500">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">/ Lisensi Sistem</span>
              </div>
            </div>

            {/* Deskripsi Minimalis */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ringkasan Sistem</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Features Checklist Grid */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Zap size={14} className="text-brand-500" /> Fitur & Layanan Termasuk
                </h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Value Highlights Chips */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-center flex flex-col items-center justify-center">
                <ShieldCheck size={16} className="text-brand-500 mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">Garansi & Backup</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-center flex flex-col items-center justify-center">
                <Zap size={16} className="text-brand-500 mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">Deployment Cepat</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-center flex flex-col items-center justify-center">
                <Headphones size={16} className="text-brand-500 mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">Support Teknis</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className={`btn-primary flex-1 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                  added ? "bg-emerald-600 hover:bg-emerald-700" : ""
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle2 size={16} /> Berhasil Ditambahkan!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> Tambah ke Keranjang
                  </>
                )}
              </button>

              <a
                href={getWhatsAppLink(`Halo Instapro, saya ingin menanyakan detail paket: ${product.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 py-3.5 rounded-2xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 justify-center"
              >
                <MessageCircle size={16} className="text-emerald-500" />
                Konsultasi WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
