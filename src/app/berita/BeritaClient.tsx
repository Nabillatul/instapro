"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowRight, Search } from "lucide-react";

interface BeritaClientProps {
  articles: Article[];
  categories: string[];
}

export default function BeritaClient({ articles, categories }: BeritaClientProps) {
  const allCategories = ["Semua", ...categories];
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === "Semua" || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
          Warta & Insight
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-navy-500 mb-6"
        >
          Berita & <span className="text-gradient">Artikel Terkini</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-navy-500/70 max-w-2xl mx-auto font-medium"
        >
          Baca ulasan mendalam tentang digitalisasi desa, pengembangan tata kelola birokrasi, dan metode peningkatan kualitas SDM.
        </motion.p>
      </section>

      <section className="relative z-10 pb-8 section-container">
        <div className="max-w-md mx-auto mb-8 relative">
          <input
            type="text"
            placeholder="Cari berita atau artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-navy-100 text-navy-900 placeholder:text-navy-900/30 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-900/30" />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
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
      </section>

      <section className="relative z-10 py-6 section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              layout
            >
              <div className="glass rounded-2xl bg-white overflow-hidden card-hover h-full flex flex-col border border-navy-500/5 shadow-sm">
                <Link href={`/berita/${article.slug}`} className="aspect-[21/9] max-h-40 bg-brand-50/20 relative overflow-hidden shrink-0 block group">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-dots opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-extrabold text-navy-500/10 group-hover:scale-110 transition-transform duration-500">
                          {article.title.charAt(0)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-500 text-white uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-navy-500/40 text-xs mb-3 font-semibold">
                    <Calendar size={12} />
                    {formatDate(article.date)}
                  </div>
                  <Link href={`/berita/${article.slug}`}>
                    <h3 className="text-navy-500 font-extrabold text-base mb-2 hover:text-brand-500 transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-navy-500/60 text-xs font-semibold leading-relaxed flex-1 text-justify mb-4">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/berita/${article.slug}`}
                    className="flex items-center gap-1 text-brand-500 text-xs font-bold hover:gap-2 transition-all mt-auto"
                  >
                    Baca Selengkapnya <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50/50 flex items-center justify-center mb-4">
              <Search size={28} className="text-brand-500/40" />
            </div>
            <h3 className="text-navy-500/60 font-bold text-base mb-2">
              {articles.length === 0 ? "Belum Ada Artikel" : "Artikel Tidak Ditemukan"}
            </h3>
            <p className="text-navy-500/40 text-xs font-semibold max-w-xs mx-auto">
              {articles.length === 0
                ? "Konten sedang disiapkan oleh tim kami. Pantau terus untuk update terbaru!"
                : "Coba ubah kata kunci atau kategori pencarian Anda."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
