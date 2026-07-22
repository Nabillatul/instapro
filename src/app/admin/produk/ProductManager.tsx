"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah, slugify } from "@/lib/utils";
import { createProduct, updateProduct, deleteProduct } from "@/app/admin/actions";
import type { ProductItem } from "@/lib/products";
import { Plus, Pencil, Trash2, X, Save, Star, Upload, Image as ImageIcon, Loader2 } from "lucide-react";

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

    // Auto-generate slug from name if empty
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
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-navy-500/5">
        <div>
          <h2 className="text-sm font-extrabold text-navy-500">Katalog Produk & Layanan</h2>
          <p className="text-[10px] text-navy-500/40 font-semibold">Kelola daftar layanan dan produk PT. Insta Pro</p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary text-xs px-4 py-2"
          disabled={isPending}
        >
          <Plus size={14} />
          Tambah Produk
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-3xl bg-white p-6 md:p-8 border border-brand-500/20 shadow-md">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-navy-500/5">
            <div>
              <h3 className="text-navy-500 font-extrabold text-sm">
                {editingId ? "Edit Produk & Layanan" : "Tambah Produk Baru"}
              </h3>
              <p className="text-[10px] text-navy-500/40 font-semibold mt-0.5">Isi spesifikasi produk di bawah</p>
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

              {/* PRODUCT DETAILS */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Nama Produk / Layanan *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Website Desa Mandiri, Pembuatan Aplikasi POS"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Harga (Rp) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="e.g. 5000000"
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Stok / Kapasitas</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Kategori *</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Website, Aplikasi, UI/UX"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Deskripsi Produk *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Spesifikasi lengkap, kegunaan, dan info detail produk..."
                className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>

            {/* ADDITIONAL GALLERY PHOTOS (NO URL INPUT FIELD) */}
            <div className="border border-navy-100 rounded-2xl p-5 bg-navy-50/10">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Galeri Foto Tambahan</label>
                  <p className="text-[9px] text-navy-500/30 font-semibold mt-0.5">Maksimum 6 foto pendukung</p>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-navy-100 bg-white text-[11px] font-bold text-navy-500 hover:bg-navy-50 cursor-pointer transition-colors shadow-sm">
                  <Upload size={12} />
                  {uploading ? "Mengunggah..." : "Tambah Foto"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "gallery")}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {form.gallery.trim() ? (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {form.gallery.split("\n").map((url, idx) => {
                    const trimmed = url.trim();
                    if (!trimmed) return null;
                    return (
                      <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-navy-100 bg-white">
                        <img src={trimmed} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const list = form.gallery.split("\n").map(s => s.trim()).filter(Boolean);
                            list.splice(idx, 1);
                            setForm({ ...form, gallery: list.join("\n") });
                          }}
                          className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold"
                        >
                          Hapus
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-navy-500/30 text-[10px] font-semibold">
                  Belum ada foto galeri tambahan. Klik tombol di atas untuk mengunggah.
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-navy-500/50 uppercase tracking-wider mb-1.5">Fitur / Lingkup Pekerjaan (Satu fitur per baris)</label>
              <textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={4}
                placeholder="e.g.&#10;Gratis Hosting & Domain 1 Tahun&#10;Halaman Landing Page Modern&#10;SEO & Integrasi WhatsApp"
                className="w-full p-4 rounded-xl border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-navy-50/5 leading-relaxed"
              />
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
      )}

      {/* PRODUCTS LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="glass rounded-2xl bg-white p-5 border border-navy-500/5 shadow-sm flex gap-4 hover:border-brand-500/10 transition-colors"
          >
            {product.image && (
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-navy-100 bg-white shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-brand-50 text-brand-500 uppercase">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-50 text-amber-600 uppercase flex items-center gap-1">
                      <Star size={8} /> Populer
                    </span>
                  )}
                </div>
                <h3 className="text-navy-500 font-extrabold text-xs truncate leading-snug">{product.name}</h3>
                <p className="text-brand-500 text-xs font-bold mt-1">
                  {formatRupiah(product.price)}
                </p>
              </div>
              
              <div className="flex justify-end gap-1.5 mt-3 pt-2 border-t border-navy-500/5">
                <button
                  onClick={() => openEdit(product)}
                  className="w-8 h-8 rounded-lg border border-navy-100 flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-all"
                  disabled={isPending}
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
                  disabled={isPending}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-2 text-center py-16 text-navy-500/40 text-xs font-semibold">
            Belum ada produk. Klik &quot;Tambah Produk&quot; untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
}
