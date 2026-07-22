"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/lib/articles";
import { formatDate, renderMarkdown } from "@/lib/utils";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";

interface ArticleDetailClientProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleDetailClient({ article, relatedArticles }: ArticleDetailClientProps) {

  return (
    <div className="pt-28 pb-20 bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <section className="relative z-10 section-container mb-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-brand-500 text-xs font-bold uppercase tracking-wider mb-6 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Berita
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-500 text-white uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-navy-500/40 text-xs font-bold">
              <Calendar size={12} /> {formatDate(article.date)}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy-500 mb-4 max-w-3xl leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 text-navy-500/60 text-xs font-bold uppercase tracking-wider">
            <User size={14} className="text-brand-500" />
            Ditulis oleh {article.author}
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 pb-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-3xl overflow-hidden border border-navy-500/5 shadow-sm"
            >
              {/* Hero Image */}
              {article.image && (
                <div className="aspect-[21/9] max-h-72 w-full overflow-hidden bg-brand-50/20">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 md:p-10">
                <div className="prose prose-lg max-w-none">
                  <div className="max-h-[550px] overflow-y-auto pr-3 custom-scrollbar">
                    <div
                      className="text-navy-500/80 leading-relaxed text-sm font-medium space-y-5 text-justify [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-navy-500 [&_h1]:mt-6 [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-navy-500 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-navy-500 [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:space-y-2 [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:text-navy-500/70 [&_strong]:text-navy-500 [&_strong]:font-bold [&_p]:mb-4"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-navy-500/5">
                  <div className="flex items-center gap-3">
                    <Share2 size={16} className="text-navy-500/40" />
                    <span className="text-navy-500/40 text-xs font-bold uppercase tracking-wider">
                      Bagikan artikel ini
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              {/* Box Konsultasi */}
              <div className="glass rounded-3xl p-6 bg-white border border-brand-500/10 shadow-sm">
                <h3 className="text-navy-500 font-extrabold text-sm uppercase tracking-wider mb-2">
                  Ingin Berkonsultasi?
                </h3>
                <p className="text-navy-500/60 text-xs font-semibold leading-relaxed mb-6">
                  Tim ahli tata kelola Instapro Solution siap membantu mengatasi kendala birokrasi dan administrasi daerah Anda.
                </p>
                <Link href="/kontak" className="btn-primary text-xs w-full justify-center">
                  Hubungi Hubungan Pelanggan
                </Link>
              </div>

              {/* Daftar Berita (Menampilkan 5 Berita Terbaru/Terkait) */}
              {relatedArticles.length > 0 && (
                <div className="glass rounded-3xl p-6 bg-white border border-navy-500/5 shadow-sm">
                  <h3 className="text-navy-500 font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Berita & Artikel Lainnya</span>
                    <span className="text-[10px] text-brand-500 font-bold bg-brand-50 px-2 py-0.5 rounded-full">
                      {relatedArticles.length} Berita
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/berita/${related.slug}`}
                        className="flex items-center gap-3 group border-b border-navy-500/5 pb-3 last:border-0 last:pb-0"
                      >
                        {/* Thumbnail Gambar Artikel */}
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-brand-50/20 relative shrink-0 border border-navy-500/5">
                          {related.image ? (
                            <img
                              src={related.image}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-navy-500/20 font-bold text-xs">
                              {related.title.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Judul & Tanggal */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-navy-500 text-xs font-bold group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug">
                            {related.title}
                          </h4>
                          <p className="text-navy-500/40 text-[10px] font-bold uppercase tracking-wider mt-1 flex items-center justify-between">
                            <span>{formatDate(related.date)}</span>
                            <span className="text-brand-500 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                              Baca →
                            </span>
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
