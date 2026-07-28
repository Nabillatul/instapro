"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Coach {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  skills: string[];
}

export default function AdminCoachPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [skillsStr, setSkillsStr] = useState("");

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/coaches");
      const data = await res.json();
      if (data.success && Array.isArray(data.coaches)) {
        setCoaches(data.coaches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setTitle("");
    setBio("");
    setImage("/images/Setyo Irawan, S.IP.jpg");
    setSkillsStr("Transformasi Digital, Tata Kelola Daerah, SDM Leadership");
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (c: Coach) => {
    setEditingId(c.id);
    setName(c.name);
    setTitle(c.title);
    setBio(c.bio);
    setImage(c.image);
    setSkillsStr(Array.isArray(c.skills) ? c.skills.join(", ") : "");
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) {
      setError("Nama dan Jabatan Coach wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      id: editingId,
      name,
      title,
      bio,
      image: image || "/images/Setyo Irawan, S.IP.jpg",
      skills: skillsStr.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/coaches", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(editingId ? "Coach berhasil diperbarui!" : "Coach baru berhasil ditambahkan!");
        setShowModal(false);
        fetchCoaches();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || "Gagal menyimpan coach.");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, coachName: string) => {
    if (!confirm(`Yakin ingin menghapus Coach ${coachName}?`)) return;

    try {
      const res = await fetch(`/api/coaches?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Coach ${coachName} berhasil dihapus.`);
        fetchCoaches();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        alert(data.message || "Gagal menghapus coach.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
      } else {
        alert("Upload foto gagal.");
      }
    } catch (err) {
      alert("Error upload foto.");
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
          <div className="w-13 h-13 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-extrabold shrink-0 shadow-xs">
            <UserCheck size={26} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-navy-500">Manajemen Coach & Mentor</h1>
            <p className="text-navy-500/60 text-xs font-semibold">
              Tambah, edit, atau hapus instruktur utama Kelas Instapro.
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-xs py-3 px-5 justify-center shadow-xs"
        >
          <Plus size={16} /> Tambah Coach Baru
        </button>
      </motion.div>

      {/* Notifications */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 size={16} /> {success}
        </motion.div>
      )}

      {/* Coaches Grid */}
      {loading ? (
        <div className="text-center py-16 text-navy-500/50 font-bold text-xs">Memuat data Coach...</div>
      ) : coaches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-3xl border border-navy-500/5 p-8"
        >
          <UserCheck size={44} className="text-navy-500/20 mx-auto mb-3" />
          <p className="text-navy-500/60 font-bold text-sm">Belum Ada Coach Ditambahkan</p>
          <button onClick={openAddModal} className="btn-primary text-xs py-2.5 px-4 mt-4 inline-flex items-center gap-1.5">
            <Plus size={15} /> Tambah Coach Pertama
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {coaches.map((c) => (
            <motion.div
              key={c.id}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-3xl border border-navy-500/5 p-6 md:p-8 shadow-sm flex flex-col justify-between transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex gap-4 items-start mb-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-500/20 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-500 text-[10px] font-extrabold uppercase mb-1">
                    Mentor Utama
                  </span>
                  <h3 className="text-navy-500 font-extrabold text-base truncate">{c.name}</h3>
                  <p className="text-brand-500 font-bold text-xs truncate">{c.title}</p>
                </div>
              </div>

              <p className="text-navy-500/70 text-xs font-medium leading-relaxed line-clamp-3 mb-4 bg-blush-50/40 p-3.5 rounded-2xl border border-navy-500/5">
                &ldquo;{c.bio}&rdquo;
              </p>

              {c.skills && c.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {c.skills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-brand-50/70 text-brand-600 text-[10px] font-bold border border-brand-500/10">
                      {sk}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-navy-500/5 flex items-center justify-between mt-auto">
                <span className="text-[10px] text-navy-500/40 font-mono font-semibold">ID: {c.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-2 rounded-xl bg-navy-50 text-navy-500 hover:text-brand-500 hover:bg-brand-50 transition-colors cursor-pointer"
                    title="Edit Coach"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                    title="Hapus Coach"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
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
                <UserCheck className="text-brand-500" size={20} />
                <h3 className="text-navy-500 font-extrabold text-lg">
                  {editingId ? "Edit Data Coach" : "Tambah Coach Baru"}
                </h3>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center gap-2 border border-red-200">
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Setyo Irawan, S.IP"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    Jabatan / Posisi Mentor *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Head Coach & Institutional Strategy"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    Bio Singkat & Deskripsi *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsi pengalaman dan spesialisasi coach..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    URL Foto Profil Coach
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="/images/Setyo Irawan, S.IP.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                    <label className="px-3.5 py-2.5 rounded-xl bg-navy-50 text-navy-500 font-bold text-xs hover:bg-navy-100 transition-colors cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload size={14} /> Upload
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-navy-500 uppercase mb-1">
                    Keahlian Utama (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Transformasi Digital, Tata Kelola Daerah, SDM Leadership"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
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
                    disabled={saving}
                    className="btn-primary text-xs py-2.5 px-5"
                  >
                    {saving ? "Menyimpan..." : editingId ? "Update Coach" : "Simpan Coach"}
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
