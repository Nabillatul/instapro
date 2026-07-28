"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatRupiah, slugify } from "@/lib/utils";
import { createProduct, updateProduct, deleteProduct } from "@/app/admin/actions";
import type { ProductItem } from "@/lib/products";
import { Plus, Pencil, Trash2, X, Save, Star, Upload, Image as ImageIcon, Loader2, Package } from "lucide-react";

interface ProductManagerProps {
  products: ProductItem[];
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  image: "",
  gallery: "",
  features: "",
  category: "",
  stock: "99",
  featured: false,
};

export default function ProductManager({ products }: ProductManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "image" | "gallery") => {
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
        if (target === "image") {
          setForm((prev) => ({ ...prev, image: data.url }));
        } else {
          setForm((prev) => {
            const currentGallery = prev.gallery.trim();
            const newGallery = currentGallery
              ? `${currentGallery}\n${data.url}`
              : data.url;
            return { ...prev, gallery: newGallery };
          });
        }
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

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (product: ProductItem) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      image: product.image,
      gallery: product.gallery.join("\n"),
      features: product.features.join("\n"),
      category: product.category,
      stock: String(product.stock),
      featured: product.featured,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.image) {
      setError("Gambar utama produk wajib diunggah.");
      return;
    }

    const finalSlug = form.slug.trim() || slugify(form.name);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "featured") {
        if (value) formData.append(key, "on");
      } else if (key === "slug") {
        formData.append(key, finalSlug);
      } else {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      const result = editingId
        ? await updateProduct(editingId, formData)
        : await createProduct(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      closeForm();
      router.refresh();
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"?`)) return;

    startTransition(async () => {
      const result = await deleteProduct(id);
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
          <div className="w-13 h-13 rounded-2xl bg-navy-500/10 text-navy-500 flex items-center justify-center font-extrabold shrink-0 shadow-xs">
            <Package size={26} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-navy-500">Katalog Produk & Sistem</h1>
            <p className="text-navy-500/60 text-xs font-semibold">
              Kelola daftar produk aplikasi, paket sistem informasi, dan deskripsi fitur.
            </p>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="btn-primary text-xs py-3 px-5 justify-center shadow-xs"
          disabled={isPending}
        >
          <Plus size={16} />
          Tambah Produk Baru
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
                    {editingId ? "Edit Produk & Layanan" : "Tambah Produk Baru"}
                  </h3>
                  <p className="text-[10px] text-navy-500/40 font-semibold mt-0.5">Isi spesifikasi produk di bawah</p>
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
                    
                    <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/10 flex flex-col items-center justify-center p-4 text-center overflow-hidden hover:border-brand-500/50 transition-colors">
                      {form.image ? (
                        <>
                          <img src={form.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                            <label className="p-2 bg-white/95 text-navy-500 rounded-xl cursor-pointer hover:bg-white text-xs font-bold shadow-sm transition-transform hover:scale-105 relative">
                              Ubah Gambar
                              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} className="hidden" />
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
                                onChange={(e) => handleFileUpload(e, "image")}
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

                  {/* FORM FIELDS */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Nama Sistem / Produk *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                          placeholder="Otomatis jika dikosongkan"
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Harga Investasi (Rp) *</label>
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Kategori Produk</label>
                        <input
                          type="text"
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Stok Paket</label>
                        <input
                          type="number"
                          value={form.stock}
                          onChange={(e) => setForm({ ...form, stock: e.target.value })}
                          className="w-full p-3 rounded-xl border border-navy-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Deskripsi Singkat *</label>
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full p-3 rounded-xl border border-navy-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1">Daftar Fitur Unggulan (Satu per baris)</label>
                      <textarea
                        rows={3}
                        value={form.features}
                        onChange={(e) => setForm({ ...form, features: e.target.value })}
                        placeholder="Dashboard Administrasi&#10;Manajemen Data Penduduk&#10;Laporan Otomatis Export PDF"
                        className="w-full p-3 rounded-xl border border-navy-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-navy-500/5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-navy-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded border-navy-200 text-brand-500 focus:ring-brand-500/20 w-4 h-4"
                    />
                    Tampilkan sebagai produk populer / direkomendasikan
                  </label>

                  <div className="flex gap-2">
                    <button type="button" onClick={closeForm} className="btn-secondary text-xs px-5 py-2.5">
                      Batal
                    </button>
                    <button type="submit" className="btn-primary text-xs px-5 py-2.5" disabled={isPending || uploading}>
                      <Save size={14} />
                      {isPending ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Produk"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCTS LIST */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid md:grid-cols-2 gap-6"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 24, scale: 0.96 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
            }}
            whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
            className="glass rounded-3xl bg-white p-6 border border-navy-500/5 shadow-sm flex gap-4 transition-all duration-300 relative group overflow-hidden"
          >
            {product.image && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-navy-100 bg-white shrink-0 p-2 flex items-center justify-center shadow-xs">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-50 text-brand-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-600 uppercase tracking-wider flex items-center gap-1">
                      <Star size={8} /> Unggulan
                    </span>
                  )}
                </div>
                <h3 className="text-navy-500 font-extrabold text-sm truncate leading-snug group-hover:text-brand-500 transition-colors">{product.name}</h3>
                <p className="text-brand-500 font-extrabold text-sm mt-1">
                  {formatRupiah(product.price)}
                </p>
              </div>
              
              <div className="flex justify-end gap-1.5 mt-3 pt-3 border-t border-navy-500/5">
                <button
                  onClick={() => openEdit(product)}
                  className="p-2 rounded-xl border border-navy-100 bg-white flex items-center justify-center text-navy-500 hover:text-brand-500 hover:bg-navy-50 transition-all cursor-pointer"
                  disabled={isPending}
                  title="Edit Produk"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="p-2 rounded-xl border border-red-100 bg-white flex items-center justify-center text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  disabled={isPending}
                  title="Hapus Produk"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {products.length === 0 && (
          <div className="col-span-2 text-center py-16 text-navy-500/40 text-xs font-semibold">
            Belum ada produk. Klik &quot;Tambah Produk Baru&quot; untuk memulai.
          </div>
        )}
      </motion.div>
    </div>
  );
}
