"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Image as ImageIcon, Loader2, RefreshCw, CheckCircle2, Sparkles, X, Upload } from "lucide-react";

interface ClassPhoto {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  authorName: string;
  authorRole: string;
  category: string;
  createdAt: string;
}

export default function AdminKelasFotoPage() {
  const [photos, setPhotos] = useState<ClassPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<ClassPhoto | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    caption: "",
    authorName: "",
    authorRole: "",
    category: "Testimoni Alumni",
  });

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/kelas-photos");
      const data = await res.json();
      if (data.success) {
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error("Gagal mengambil foto kelas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        alert(data.error || "Gagal mengunggah gambar");
      }
    } catch (err) {
      alert("Gagal mengunggah gambar ke server");
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingPhoto(null);
    setFormData({
      title: "",
      imageUrl: "",
      caption: "",
      authorName: "",
      authorRole: "",
      category: "Testimoni Alumni",
    });
    setShowModal(true);
  };

  const openEditModal = (photo: ClassPhoto) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      imageUrl: photo.imageUrl,
      caption: photo.caption,
      authorName: photo.authorName,
      authorRole: photo.authorRole,
      category: photo.category,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editingPhoto ? "PUT" : "POST";
      const payload = editingPhoto ? { id: editingPhoto.id, ...formData } : formData;

      const res = await fetch("/api/admin/kelas-photos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchPhotos();
      } else {
        alert(data.error || "Gagal menyimpan foto kelas");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus foto kegiatan ini?")) return;

    try {
      const res = await fetch(`/api/admin/kelas-photos?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchPhotos();
      } else {
        alert(data.error || "Gagal menghapus foto");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi");
    }
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
          <div className="w-13 h-13 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold shrink-0 shadow-xs">
            <ImageIcon size={26} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-navy-500">Manajemen Foto Galeri Kelas</h1>
            <p className="text-navy-500/60 text-xs font-semibold">
              Kelola dokumentasi foto kegiatan pelatihan dan testimoni alumni Instapro Learning Academy.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchPhotos}
            className="p-3 rounded-2xl border border-navy-100 bg-white text-navy-500 hover:bg-navy-50 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openAddModal}
            className="btn-primary text-xs py-3 px-5 justify-center shadow-xs"
          >
            <Plus size={16} /> Tambah Foto Baru
          </button>
        </div>
      </motion.div>

      {/* Photos Grid */}
      {loading ? (
        <div className="text-center py-16 text-navy-500/50 font-bold text-xs">Memuat galeri foto...</div>
      ) : photos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-3xl border border-navy-500/5 p-8"
        >
          <ImageIcon size={44} className="text-navy-500/20 mx-auto mb-3" />
          <p className="text-navy-500/60 font-bold text-sm">Belum ada foto kelas ditambahkan</p>
          <button onClick={openAddModal} className="btn-primary text-xs py-2.5 px-4 mt-4 inline-flex items-center gap-1.5">
            <Plus size={15} /> Tambah Foto Pertama
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-3xl border border-navy-500/5 overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-300 group"
            >
              <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-brand-500 text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                  {photo.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-navy-500 font-extrabold text-base mb-2 group-hover:text-brand-500 transition-colors line-clamp-2">
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="text-navy-500/60 text-xs font-semibold italic leading-relaxed line-clamp-3 mb-4">
                      &ldquo;{photo.caption}&rdquo;
                    </p>
                  )}
                </div>

                {photo.authorName && (
                  <div className="pt-4 border-t border-navy-500/5 flex items-center justify-between mt-auto">
                    <div className="min-w-0">
                      <p className="text-navy-500 font-extrabold text-xs truncate">{photo.authorName}</p>
                      <p className="text-navy-500/40 text-[10px] font-semibold truncate">{photo.authorRole}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditModal(photo)}
                        className="p-2 rounded-xl bg-navy-50 text-navy-500 hover:text-brand-500 hover:bg-brand-50 transition-colors cursor-pointer"
                        title="Edit Foto"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                        title="Hapus Foto"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal Add / Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-500 hover:bg-navy-100"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="text-brand-500" size={20} />
                <h3 className="text-navy-500 font-extrabold text-lg">
                  {editingPhoto ? "Edit Foto Kegiatan" : "Tambah Foto Kegiatan Baru"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    Judul Kegiatan / Acara *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pelatihan Digitalisasi Administrasi Desa"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    Kategori Dokumentasi
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Pelatihan Aparatur">Pelatihan Aparatur</option>
                    <option value="Testimoni Alumni">Testimoni Alumni</option>
                    <option value="In-House Training">In-House Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    URL Foto / Unggah Foto *
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="/images/gambarbg2.jpeg atau https://..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      required
                    />
                    <label className="px-3.5 py-2.5 rounded-xl bg-navy-50 text-navy-500 font-bold text-xs hover:bg-navy-100 transition-colors cursor-pointer flex items-center gap-1 shrink-0">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      Upload
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    Keterangan / Testimoni Peserta
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Testimoni atau deskripsi singkat foto..."
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                      Nama Peserta / Tokoh
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Drs. Ahmad Subakti"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                      Jabatan / Asal Instansi
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kepala Dinas PMD"
                      value={formData.authorRole}
                      onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-navy-500/5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary text-xs py-2.5 px-4 border-navy-100 text-navy-500 hover:bg-navy-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs py-2.5 px-5"
                  >
                    {submitting ? "Menyimpan..." : editingPhoto ? "Update Foto" : "Simpan Foto"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
