"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Camera,
  Loader,
  Settings,
  Check,
  LogOut,
  KeyRound,
  ShieldCheck,
  ShoppingBag,
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: string;
}

interface DashboardHeaderProps {
  initialUser: UserProfile;
  ordersCount?: number;
  classesCount?: number;
}

export default function DashboardHeader({
  initialUser,
  ordersCount = 0,
  classesCount = 0,
}: DashboardHeaderProps) {
  const { update } = useSession();
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile Form state
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [image, setImage] = useState(user.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Password Form state
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

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        alert(data.error || "Gagal mengunggah foto profil.");
      }
    } catch {
      alert("Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, image, isAdminUpdate: false }),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedImage = data.user?.image ?? image;
        setUser({
          ...user,
          name,
          phone,
          image: updatedImage,
        });
        setImage(updatedImage || "");
        setIsEditing(false);

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("profile-updated", { detail: { image: updatedImage } })
          );
        }

        await update({ name, phone });
        router.refresh();
      } else {
        alert(data.error || "Gagal memperbarui profil.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("Password minimal harus 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordSuccess("Password baru berhasil disimpan!");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsEditing(false);
          setPasswordSuccess("");
        }, 1500);
      } else {
        setPasswordError(data.error || "Gagal mengubah password.");
      }
    } catch {
      setPasswordError("Terjadi kesalahan sistem saat mengubah password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      {/* Main Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-navy-500/10 shadow-xl mb-8">
        {/* Decorative Top Hero Banner */}
        <div className="h-32 md:h-40 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm uppercase tracking-wider">
              <Sparkles size={12} className="text-yellow-300 animate-pulse" />
              {user.role === "admin" ? "Super Admin" : "Member VIP"}
            </span>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="px-6 pb-6 pt-0 md:px-8 md:pb-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 md:-mt-20">
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left w-full md:w-auto">
              {/* Profile Avatar Container */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl p-1 bg-white shadow-2xl border-2 border-brand-500/20 relative">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center text-3xl md:text-4xl font-black shadow-inner uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  {/* Online Status Badge */}
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400/30" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("profile");
                    setIsEditing(true);
                  }}
                  className="absolute inset-0 bg-navy-950/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] cursor-pointer"
                  title="Ganti Foto Profil"
                >
                  <Camera className="text-white drop-shadow-md" size={24} />
                </button>
              </div>

              {/* User Text Meta */}
              <div className="space-y-1 pb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black text-navy-500 tracking-tight">
                    {user.name}
                  </h1>
                  <span title="Akun Terverifikasi">
                    <ShieldCheck size={20} className="text-brand-500" />
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-navy-500/60 text-xs font-semibold flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail size={13} className="text-brand-500" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={13} className="text-emerald-500" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-center sm:justify-end flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("profile");
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-50 text-navy-600 hover:bg-brand-50 hover:text-brand-600 border border-navy-100 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                <Settings size={15} className="text-brand-500" />
                Edit Profil
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("password");
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-50 text-navy-600 hover:bg-brand-50 hover:text-brand-600 border border-navy-100 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                <KeyRound size={15} className="text-amber-500" />
                Ubah Password
              </button>

              {user.role === "admin" && (
                <a
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-200 active:scale-95"
                >
                  <ShieldCheck size={15} />
                  Admin Panel
                </a>
              )}

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          </div>

          {/* Quick Overview Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8 pt-6 border-t border-navy-500/10">
            <div className="bg-gradient-to-br from-navy-50/60 to-slate-50/60 p-3.5 rounded-2xl border border-navy-500/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-navy-500/40 tracking-wider">
                  Total Pesanan
                </p>
                <p className="text-lg font-black text-navy-500">{ordersCount} Pesanan</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy-50/60 to-slate-50/60 p-3.5 rounded-2xl border border-navy-500/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-navy-500/40 tracking-wider">
                  Kelas Quantum
                </p>
                <p className="text-lg font-black text-navy-500">{classesCount} Terdaftar</p>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-emerald-50/60 to-teal-50/60 p-3.5 rounded-2xl border border-emerald-500/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-emerald-700/50 tracking-wider">
                  Status Akun
                </p>
                <p className="text-sm font-black text-emerald-700">Aktif & Terverifikasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile & Ubah Password Modern Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg border border-navy-500/10 shadow-2xl relative overflow-hidden"
            >
              {/* Top Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-navy-500/10 mb-5">
                <div className="flex items-center gap-2">
                  {activeTab === "profile" ? (
                    <Settings className="text-brand-500" size={22} />
                  ) : (
                    <KeyRound className="text-amber-500" size={22} />
                  )}
                  <h2 className="text-lg font-black text-navy-500">Pengaturan Akun</h2>
                </div>

                {/* Tabs Switcher */}
                <div className="flex bg-navy-50 p-1 rounded-xl border border-navy-100">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("profile");
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "profile"
                        ? "bg-white text-brand-600 shadow-sm"
                        : "text-navy-500/50 hover:text-navy-500"
                    }`}
                  >
                    Profil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("password");
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "password"
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-navy-500/50 hover:text-navy-500"
                    }`}
                  >
                    Password
                  </button>
                </div>
              </div>

              {/* Tab 1: Profile Editor */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Photo Upload Section */}
                  <div className="flex flex-col items-center gap-2 pb-2">
                    <div className="relative group cursor-pointer">
                      {image ? (
                        <img
                          src={image}
                          alt="Preview"
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-500/20 shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-black uppercase shadow-inner">
                          {name.charAt(0)}
                        </div>
                      )}
                      <label className="absolute inset-0 bg-navy-950/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[1px]">
                        <Camera className="text-white drop-shadow-md" size={22} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <span className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">
                      {uploading ? "Mengunggah..." : "Klik foto di atas untuk mengubah"}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-navy-500 uppercase tracking-wider">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan Nama Anda"
                        className="w-full pl-10 pr-4 py-3 bg-navy-50/50 border border-navy-500/10 rounded-xl text-xs font-bold text-navy-500 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-navy-500 uppercase tracking-wider">
                      No. WhatsApp / HP
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 0812xxxxxxxx"
                        className="w-full pl-10 pr-4 py-3 bg-navy-50/50 border border-navy-500/10 rounded-xl text-xs font-bold text-navy-500 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex gap-2.5 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-3 rounded-xl text-xs font-bold bg-navy-50 text-navy-600 hover:bg-navy-100 border border-navy-100 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="flex-1 px-4 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader className="animate-spin" size={16} />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 2: Password Changer */}
              {activeTab === "password" && (
                <form onSubmit={handleSavePassword} className="space-y-4">
                  {passwordError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                      ❌ {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> {passwordSuccess}
                    </div>
                  )}

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-navy-500 uppercase tracking-wider">
                      Password Baru
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-10 pr-10 py-3 bg-navy-50/50 border border-navy-500/10 rounded-xl text-xs font-bold text-navy-500 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-navy-500 uppercase tracking-wider">
                      Ulangi Password Baru
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ketik ulang password baru"
                        className="w-full pl-10 pr-10 py-3 bg-navy-50/50 border border-navy-500/10 rounded-xl text-xs font-bold text-navy-500 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Hint */}
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-[11px] text-amber-800 font-medium">
                    💡 <strong>Tips:</strong> Gunakan kombinasi huruf dan angka agar password akun Anda lebih aman.
                  </div>

                  {/* Submit Actions */}
                  <div className="flex gap-2.5 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-3 rounded-xl text-xs font-bold bg-navy-50 text-navy-600 hover:bg-navy-100 border border-navy-100 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="flex-1 px-4 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {savingPassword ? (
                        <>
                          <Loader className="animate-spin" size={16} />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Simpan Password Baru
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
