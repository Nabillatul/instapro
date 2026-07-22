"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProductItem } from "@/lib/products";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Plus, Eye, Search } from "lucide-react";

interface KatalogClientProps {
  products: ProductItem[];
  categories: string[];
}

export default function KatalogClient({ products, categories }: KatalogClientProps) {
  const allCategories = ["Semua", ...categories];
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();

  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="pt-28 pb-20 bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <section className="relative z-10 section-container text-center mb-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 glass border border-brand-500/10 text-brand-500"
        >
          Katalog Sistem
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-navy-500 mb-6"
        >
          Paket Produk & <span className="text-gradient">Sistem Administrasi</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-navy-500/70 max-w-2xl mx-auto font-medium"
        >
          Pilih paket sistem digital mandiri yang sudah dirancang khusus untuk mempermudah tata kelola administrasi desa, sekolah, dan organisasi Anda.
        </motion.p>
      </section>

      <section className="relative z-10 pb-8 section-container">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-900/30" />
            <input
              type="text"
              placeholder="Cari sistem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-navy-100 text-navy-900 placeholder:text-navy-900/30 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-brand-500 text-white shadow-sm"
                    : "bg-white border border-navy-100 text-navy-500/70 hover:bg-navy-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-6 pb-24 section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              layout
              className="group glass rounded-3xl bg-white overflow-hidden card-hover flex flex-col border border-navy-500/5 shadow-sm"
            >
              <div className="aspect-video bg-white relative overflow-hidden flex items-center justify-center border-b border-navy-500/5">
                <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ShoppingCart size={40} className="text-navy-500/10 group-hover:scale-110 transition-transform duration-500" />
                )}
                {product.featured && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-bold bg-gold-500 text-navy-900 uppercase tracking-wider">
                    ⭐ Populer
                  </span>
                )}
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-bold bg-navy-500 text-white uppercase tracking-wider">
                  {product.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-navy-500 font-extrabold text-base mb-2 group-hover:text-brand-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-navy-500/60 text-xs font-semibold leading-relaxed line-clamp-3 flex-1 mb-6">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-brand-500 font-extrabold text-base">
                    {formatRupiah(product.price)}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/katalog/${product.slug}`}
                      className="w-10 h-10 rounded-xl border border-navy-100 bg-white flex items-center justify-center text-navy-500/70 hover:text-brand-500 hover:bg-navy-50 transition-all cursor-pointer"
                      title="Detail"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        })
                      }
                      className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white hover:bg-brand-600 transition-all hover:scale-105 cursor-pointer shadow-sm"
                      title="Tambah ke Keranjang"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50/50 flex items-center justify-center mb-4">
              <ShoppingCart size={28} className="text-brand-500/40" />
            </div>
            <h3 className="text-navy-500/60 font-bold text-base mb-2">
              {products.length === 0 ? "Belum Ada Produk" : "Produk Tidak Ditemukan"}
            </h3>
            <p className="text-navy-500/40 text-xs font-semibold max-w-xs mx-auto">
              {products.length === 0
                ? "Katalog produk sedang disiapkan. Hubungi kami untuk informasi lebih lanjut."
                : "Coba ubah kata kunci atau kategori pencarian Anda."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
