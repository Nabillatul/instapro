"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { createArticle, updateArticle, deleteArticle } from "@/app/admin/actions";
import type { Article } from "@/lib/articles";
import { Plus, Pencil, Trash2, X, Save, Upload, Image as ImageIcon, Loader2 } from "lucide-react";

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
      e.target.value = ""; // Reset input
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
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-navy-500/5">
        <div>
          <h2 className="text-sm font-extrabold text-navy-500">Artikel & Berita</h2>
          <p className="text-[10px] text-navy-500/40 font-semibold">Kelola konten berita dan wawasan Instapro</p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary text-xs px-4 py-2"
          disabled={isPending}
        >
          <Plus size={14} />
          Tulis Artikel
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-3xl bg-white p-6 md:p-8 border border-brand-500/20 shadow-md">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-navy-500/5">
            <div>
              <h3 className="text-navy-500 font-extrabold text-sm">
                {editingId ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h3>
              <p className="text-[10px] text-navy-500/40 font-semibold mt-0.5">Isi semua detail di bawah untuk mempublikasikan</p>
            </div>
            <button onClick={closeForm} className="text-navy-500/40 hover:text-navy-500">
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
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
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-brand-500" size={24} />
                          <span className="text-[10px] font-bold text-navy-500/40">Mengunggah...</span>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-10 h-10 rounded-xl bg-brand-500/5 flex items-center justify-center text-brand-500 mx-auto mb-3">
                            <Upload size={18} />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-brand-500 block">
                              Tarik & lepas atau klik untuk unggah
                            </span>
                            <span className="text-[9px] font-medium text-navy-500/30 block mt-1">Format PNG, JPG, WebP. Maks 5MB</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ARTICLE METADATA */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Judul Artikel *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Masukkan judul artikel yang menarik..."
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Kategori *</label>
                    <input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. Digital Strategy, Tech Tips"
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Penulis / Author</label>
                    <input
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Tanggal Artikel</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Ringkasan Singkat (Excerpt) *</label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                    placeholder="Tulis ringkasan singkat artikel yang akan muncul di daftar berita..."
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Isi Konten Lengkap * (Markdown Didukung)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                placeholder="Gunakan formatting markdown: ## Judul, - List item, **Tebal**, dll."
                className="w-full p-4 rounded-xl border border-navy-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5 leading-relaxed"
                required
              />
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
      )}

      {/* ARTICLES LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="glass rounded-2xl bg-white p-5 border border-navy-500/5 shadow-sm flex gap-4 hover:border-brand-500/10 transition-colors"
          >
            {article.image && (
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-navy-100 bg-white shrink-0">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-brand-50 text-brand-500 uppercase">
                    {article.category}
                  </span>
                  {!article.published && (
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-50 text-amber-600 uppercase">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="text-navy-500 font-extrabold text-xs truncate leading-snug">{article.title}</h3>
                <p className="text-navy-500/40 text-[10px] font-semibold mt-1">
                  {formatDate(article.date)} · oleh {article.author}
                </p>
              </div>
              
              <div className="flex justify-end gap-1.5 mt-3 pt-2 border-t border-navy-500/5">
                <button
                  onClick={() => openEdit(article)}
                  className="w-8 h-8 rounded-lg border border-navy-100 flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-all"
                  disabled={isPending}
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(article.id, article.title)}
                  className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
                  disabled={isPending}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="col-span-2 text-center py-16 text-navy-500/40 text-xs font-semibold">
            Belum ada artikel. Klik &quot;Tulis Artikel&quot; untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
}
