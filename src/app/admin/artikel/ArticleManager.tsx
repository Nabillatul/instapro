"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { createArticle, updateArticle, deleteArticle } from "@/app/admin/actions";
import type { Article } from "@/lib/articles";
import { Plus, Pencil, Trash2, X, Save, Upload, Image as ImageIcon, Loader2, FileText } from "lucide-react";

interface ArticleManagerProps {
  articles: Article[];
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  category: "",
  author: "Admin Instapro",
  published: true,
  date: "",
};

export default function ArticleManager({ articles }: ArticleManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (article: Article) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      category: article.category,
      author: article.author,
      published: article.published,
      date: article.date ? article.date.split("T")[0] : "",
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        setError(data.error || "Gagal mengunggah gambar");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Terjadi kesalahan koneksi saat mengunggah");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.image) {
      setError("Gambar artikel wajib diunggah.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "published") {
        if (value) formData.append(key, "on");
      } else {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      const result = editingId
        ? await updateArticle(editingId, formData)
        : await createArticle(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      closeForm();
      router.refresh();
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;

    startTransition(async () => {
      const result = await deleteArticle(id);
      if (result.error) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-navy-500/5 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-extrabold shrink-0 shadow-xs">
            <FileText size={26} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-navy-500">Artikel & Berita</h1>
            <p className="text-navy-500/60 text-xs font-semibold">
              Kelola publikasi berita, pengumuman, dan artikel wawasan Instapro.
            </p>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="btn-primary text-xs py-3 px-5 justify-center shadow-xs"
          disabled={isPending}
        >
          <Plus size={16} />
          Tulis Artikel Baru
        </button>
      </motion.div>

      {/* FORM EXPANDABLE */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-3xl bg-white p-6 md:p-8 border border-brand-500/20 shadow-xl mb-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-navy-500/5">
                <div>
                  <h3 className="text-navy-500 font-extrabold text-sm">
                    {editingId ? "Edit Artikel" : "Tulis Artikel Baru"}
                  </h3>
                  <p className="text-[10px] text-navy-500/40 font-semibold mt-0.5">Isi semua detail di bawah untuk mempublikasikan</p>
                </div>
                <button onClick={closeForm} className="text-navy-500/40 hover:text-navy-500 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* IMAGE UPLOAD DROPZONE */}
                  <div className="md:col-span-1 space-y-2">
                    <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Gambar Utama *</label>
                    
                    <div className="relative aspect-video md:aspect-square w-full rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/10 flex flex-col items-center justify-center p-4 text-center overflow-hidden hover:border-brand-500/50 transition-colors">
                      {form.image ? (
                        <>
                          <img src={form.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                            <label className="p-2 bg-white/95 text-navy-500 rounded-xl cursor-pointer hover:bg-white text-xs font-bold shadow-sm transition-transform hover:scale-105 relative">
                              Ubah Gambar
                              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, image: "" })}
                              className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-xs font-bold shadow-sm transition-transform hover:scale-105"
                            >
                              Hapus
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          {uploading ? (
                            <Loader2 className="animate-spin text-brand-500" size={24} />
                          ) : (
                            <ImageIcon className="text-navy-500/30" size={28} />
                          )}
                          <div className="text-[11px] font-bold text-navy-500/60">
                            {uploading ? "Mengunggah..." : "Pilih foto atau drag & drop di sini"}
                          </div>
                          <label className="btn-secondary text-[10px] py-1.5 px-3 border-navy-200 cursor-pointer hover:bg-navy-50 mt-1">
                            Browse File
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Judul Artikel *</label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Slug URL</label>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Kategori</label>
                        <input
                          type="text"
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Penulis</label>
                        <input
                          type="text"
                          value={form.author}
                          onChange={(e) => setForm({ ...form, author: e.target.value })}
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Tanggal Publikasi</label>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Ringkasan (Excerpt)</label>
                      <textarea
                        rows={2}
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        className="w-full p-3 rounded-xl border border-navy-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Isi Lengkap Artikel *</label>
                  <textarea
                    rows={8}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Tuliskan isi berita atau artikel di sini. Gunakan ## atau Subjudul: Judul Anda untuk membuat subjudul."
                    className="w-full p-4 rounded-xl border border-navy-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5 leading-relaxed"
                    required
                  />
                  <p className="text-[11px] text-navy-500/50 font-medium mt-1">
                    💡 <strong>Tips Subjudul:</strong> Ketik <code className="bg-navy-50 px-1 py-0.5 rounded border text-brand-600 font-bold">## Judul Subjudul Anda</code> atau <code className="bg-navy-50 px-1 py-0.5 rounded border text-brand-600 font-bold">Subjudul: Teks Anda</code> untuk menjadikan teks sebagai subjudul artikel.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-navy-500/5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-navy-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="rounded border-navy-200 text-brand-500 focus:ring-brand-500/20 w-4 h-4"
                    />
                    Publikasikan artikel ini agar langsung dapat dibaca oleh pengunjung
                  </label>

                  <div className="flex gap-2">
                    <button type="button" onClick={closeForm} className="btn-secondary text-xs px-5 py-2.5">
                      Batal
                    </button>
                    <button type="submit" className="btn-primary text-xs px-5 py-2.5" disabled={isPending || uploading}>
                      <Save size={14} />
                      {isPending ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Publikasikan Artikel"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ARTICLES LIST */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid md:grid-cols-2 gap-6"
      >
        {articles.map((article) => (
          <motion.div
            key={article.id}
            variants={{
              hidden: { opacity: 0, y: 24, scale: 0.96 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
            }}
            whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
            className="glass rounded-3xl bg-white p-6 border border-navy-500/5 shadow-sm flex gap-4 transition-all duration-300 relative group overflow-hidden"
          >
            {article.image && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-navy-100 bg-white shrink-0 shadow-xs">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-50 text-brand-500 uppercase tracking-wider">
                    {article.category}
                  </span>
                  {!article.published && (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-600 uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="text-navy-500 font-extrabold text-sm truncate leading-snug group-hover:text-brand-500 transition-colors">{article.title}</h3>
                <p className="text-navy-500/40 text-[10px] font-semibold mt-1">
                  {formatDate(article.date)} · oleh {article.author}
                </p>
              </div>
              
              <div className="flex justify-end gap-1.5 mt-3 pt-3 border-t border-navy-500/5">
                <button
                  onClick={() => openEdit(article)}
                  className="p-2 rounded-xl border border-navy-100 bg-white flex items-center justify-center text-navy-500 hover:text-brand-500 hover:bg-navy-50 transition-all cursor-pointer"
                  disabled={isPending}
                  title="Edit Artikel"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(article.id, article.title)}
                  className="p-2 rounded-xl border border-red-100 bg-white flex items-center justify-center text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  disabled={isPending}
                  title="Hapus Artikel"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {articles.length === 0 && (
          <div className="col-span-2 text-center py-16 text-navy-500/40 text-xs font-semibold">
            Belum ada artikel. Klik &quot;Tulis Artikel Baru&quot; untuk memulai.
          </div>
        )}
      </motion.div>
    </div>
  );
}
