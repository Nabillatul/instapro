"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Camera,
  Loader,
  Check,
  X,
  KeyRound,
  ShieldCheck,
  Settings,
  Mail,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Home,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminProfile {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
}

export default function AdminProfilePage({ admin }: { admin: AdminProfile }) {
  const [profile, setProfile] = useState(admin);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const [name, setName] = useState(admin.name);
  const [phone, setPhone] = useState(admin.phone || "");
  const [image, setImage] = useState(admin.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Ukuran file terlalu besar. Maksimal 5MB."); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) setImage(data.url);
      else alert(data.error || "Gagal mengunggah foto.");
    } catch { alert("Terjadi kesalahan saat mengunggah foto."); }
    finally { setUploading(false); }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, image, email: profile.email, isAdminUpdate: true }),
      });
      const data = await res.json();
      if (res.ok) { setProfile({ ...profile, name, phone, image }); setIsEditing(false); router.refresh(); }
      else alert(data.error || "Gagal memperbarui profil.");
    } catch { alert("Terjadi kesalahan jaringan."); }
    finally { setSaving(false); }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 6) { setPasswordError("Password baru minimal 6 karakter."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Konfirmasi password tidak cocok."); return; }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess("Password berhasil diperbarui!");
        setNewPassword(""); setConfirmPassword("");
        setTimeout(() => { setIsEditing(false); setPasswordSuccess(""); }, 1500);
      } else setPasswordError(data.error || "Gagal mengubah password.");
    } catch { setPasswordError("Terjadi kesalahan sistem."); }
    finally { setSavingPassword(false); }
  };

  return (
    <div className="pb-20">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── JUDUL HALAMAN ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-xl font-black text-navy-500 flex items-center gap-2">
            <User size={20} className="text-amber-500" />
            Profil Admin
          </h1>
          <p className="text-xs text-navy-500/50 font-medium mt-0.5">
            Kelola informasi akun dan kredensial administrator sistem.
          </p>
        </motion.div>

        {/* ── KARTU PROFIL UTAMA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-white border border-navy-500/10 shadow-lg"
        >
          {/* Hero Banner */}
          <div className="h-32 md:h-40 bg-gradient-to-r from-navy-800 via-brand-600 to-indigo-700 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_65%)]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-12 -left-12 w-44 h-44 bg-white/8 rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.3, 1], x: [0, 18, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Super Admin Badge */}
            <div className="absolute top-5 right-6">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 text-white shadow-md overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.25, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles size={12} className="text-white/90" />
                </motion.div>
                <span className="relative z-10 uppercase tracking-widest">Super Admin</span>
              </motion.div>
            </div>
          </div>

          {/* Konten Profil */}
          <div className="px-6 pb-7 pt-0 md:px-8 md:pb-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-14 md:-mt-18">

              {/* Avatar + Nama */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left w-full md:w-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.06, rotate: 2 }}
                  className="relative group shrink-0"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl p-1 bg-white shadow-2xl border-2 border-amber-400/20 relative">
                    {profile.image ? (
                      <img src={profile.image} alt={profile.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center text-3xl md:text-4xl font-black shadow-inner uppercase">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400/30"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("profile"); setIsEditing(true); }}
                    className="absolute inset-0 bg-navy-950/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] cursor-pointer"
                    title="Ganti foto profil"
                  >
                    <Camera className="text-white drop-shadow" size={24} />
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                  className="space-y-1 pb-1"
                >
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h2 className="text-2xl md:text-3xl font-black text-navy-500 tracking-tight">{profile.name}</h2>
                    <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                      <ShieldCheck size={20} className="text-amber-500" />
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-navy-500/55 text-xs font-semibold flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} className="text-brand-500" />
                      {profile.email}
                    </span>
                    {profile.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} className="text-emerald-500" />
                        {profile.phone}
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Tombol Aksi */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 }}
                className="flex items-center gap-2 w-full md:w-auto justify-center sm:justify-end flex-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => { setActiveTab("profile"); setIsEditing(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-50 text-navy-600 hover:bg-brand-50 hover:text-brand-600 border border-navy-100 transition-colors shadow-sm cursor-pointer"
                >
                  <Settings size={14} className="text-brand-500" />
                  Edit Profil
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => { setActiveTab("password"); setIsEditing(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors shadow-sm cursor-pointer"
                >
                  <Lock size={14} className="text-amber-500" />
                  Ubah Password
                </motion.button>

                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-sm"
                  >
                    <Home size={14} className="text-emerald-500" />
                    Lihat Situs
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Statistik Ringkasan */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7 pt-6 border-t border-navy-500/8"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/50 flex items-center gap-3 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-amber-600/70 tracking-widest mb-0.5">Hak Akses</p>
                  <p className="text-sm font-black text-amber-700">Super Administrator</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/50 flex items-center gap-3 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-emerald-600/70 tracking-widest mb-0.5">Status Akun</p>
                  <p className="text-sm font-black text-emerald-700">Aktif & Terverifikasi</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── INFORMASI AKUN ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          className="bg-white rounded-3xl border border-navy-500/8 shadow-sm p-6 md:p-8 space-y-5"
        >
          <h3 className="text-sm font-extrabold text-navy-500 flex items-center gap-2">
            <User size={16} className="text-brand-500" />
            Informasi Akun
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nama Lengkap", value: profile.name, icon: <User size={14} className="text-brand-500" /> },
              { label: "Alamat Email", value: profile.email, icon: <Mail size={14} className="text-brand-500" /> },
              { label: "Nomor WhatsApp", value: profile.phone || "Belum diisi", icon: <Phone size={14} className="text-emerald-500" />, muted: !profile.phone },
              { label: "Level Akses", value: "Super Admin", icon: <ShieldCheck size={14} className="text-amber-500" /> },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="bg-navy-50/50 rounded-2xl px-4 py-3.5 border border-navy-500/5"
              >
                <p className="text-[10px] font-extrabold uppercase text-navy-500/40 tracking-widest mb-1.5 flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </p>
                <p className={`text-sm font-bold ${item.muted ? "text-navy-500/35 italic" : "text-navy-500"}`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── KEAMANAN ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55 }}
          className="bg-white rounded-3xl border border-navy-500/8 shadow-sm p-6 md:p-8 space-y-4"
        >
          <h3 className="text-sm font-extrabold text-navy-500 flex items-center gap-2">
            <Lock size={16} className="text-amber-500" />
            Keamanan Akun
          </h3>

          <div className="flex items-start gap-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/40">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-amber-700">Rekomendasi Keamanan</p>
              <p className="text-xs text-amber-700/70 font-medium leading-relaxed">
                Gunakan password yang kuat dengan minimal 8 karakter, kombinasi huruf besar, kecil, angka, dan simbol. Perbarui password secara berkala untuk menjaga keamanan akun admin.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => { setActiveTab("password"); setIsEditing(true); }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm cursor-pointer"
          >
            <KeyRound size={14} />
            Perbarui Password Sekarang
          </motion.button>
        </motion.div>

      </div>

      {/* ── MODAL EDIT ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl w-full max-w-md border border-navy-500/5 shadow-2xl overflow-hidden"
            >
              {/* Tab Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-navy-500/8">
                <div className="flex gap-2">
                  {(["profile", "password"] as const).map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        activeTab === tab
                          ? tab === "profile" ? "bg-brand-500 text-white shadow-sm" : "bg-amber-500 text-white shadow-sm"
                          : "bg-navy-50 text-navy-400 hover:text-navy-600"
                      }`}
                    >
                      {tab === "profile" ? "Edit Profil" : "Ubah Password"}
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-xl text-navy-400 hover:bg-navy-50 hover:text-navy-600 transition-all cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Konten Form */}
              <div className="px-6 py-6">
                <AnimatePresence mode="wait">
                  {activeTab === "profile" ? (
                    <motion.form
                      key="profile"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.18 }}
                      onSubmit={handleSaveProfile} className="space-y-5"
                    >
                      {/* Upload Foto */}
                      <div className="flex flex-col items-center gap-2.5">
                        <motion.div whileHover={{ scale: 1.05 }} className="relative group cursor-pointer">
                          {image ? (
                            <img src={image} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-300/30 shadow-sm" />
                          ) : (
                            <div className="w-20 h-20 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl font-black uppercase shadow-sm">
                              {name.charAt(0)}
                            </div>
                          )}
                          <label className="absolute inset-0 bg-navy-950/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            {uploading ? <Loader className="animate-spin text-white" size={20} /> : <Camera className="text-white" size={20} />}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                          </label>
                        </motion.div>
                        <p className="text-[9px] font-semibold text-navy-500/40 uppercase tracking-wider">
                          {uploading ? "Mengunggah..." : "Klik untuk ganti foto · Maks 5MB"}
                        </p>
                      </div>

                      {/* Nama */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Nama Lengkap</label>
                        <div className="relative">
                          <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama admin" className="input-glass pl-10 text-xs font-semibold" />
                        </div>
                      </div>

                      {/* Telepon */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Nomor WhatsApp</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 08123456789" className="input-glass pl-10 text-xs font-semibold" />
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-1">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => setIsEditing(false)} className="flex-1 btn-secondary text-xs py-3 justify-center cursor-pointer">
                          Batal
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={saving || uploading} className="flex-1 btn-primary text-xs py-3 justify-center cursor-pointer">
                          {saving ? <><Loader className="animate-spin" size={13} /> Menyimpan...</> : <><Check size={13} /> Simpan Perubahan</>}
                        </motion.button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="password"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}
                      onSubmit={handleSavePassword} className="space-y-5"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Password Baru</label>
                        <div className="relative">
                          <KeyRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            className="input-glass pl-10 pr-11 text-xs font-semibold"
                          />
                          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-500/40 hover:text-navy-500">
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Konfirmasi Password Baru</label>
                        <div className="relative">
                          <KeyRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ulangi password baru"
                            className="input-glass pl-10 text-xs font-semibold"
                          />
                        </div>
                      </div>

                      {passwordError && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-2.5 rounded-xl border border-rose-200/60">
                          <AlertCircle size={13} /> {passwordError}
                        </motion.div>
                      )}
                      {passwordSuccess && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-200/60">
                          <CheckCircle2 size={13} /> {passwordSuccess}
                        </motion.div>
                      )}

                      <div className="flex gap-2.5 pt-1">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => setIsEditing(false)} className="flex-1 btn-secondary text-xs py-3 justify-center cursor-pointer">
                          Batal
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          type="submit" disabled={savingPassword}
                          className="flex-1 btn-primary text-xs py-3 justify-center cursor-pointer"
                          style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)" }}
                        >
                          {savingPassword ? <><Loader className="animate-spin" size={13} /> Menyimpan...</> : <><Check size={13} /> Simpan Password</>}
                        </motion.button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
