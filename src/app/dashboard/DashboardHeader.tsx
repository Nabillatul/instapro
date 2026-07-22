"use client";

import { useState } from "react";
import { User, Phone, Camera, Loader, Settings, Check, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface UserProfile {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: string;
}

export default function DashboardHeader({ initialUser }: { initialUser: UserProfile }) {
  const { update } = useSession();
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [image, setImage] = useState(user.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 2MB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
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
        setUser({
          ...user,
          name,
          phone,
          image,
        });
        setIsEditing(false);
        await update({ name, image, phone });
        router.refresh();
      } else {
        alert(data.error || "Gagal memperbarui profil.");
      }
    } catch {
      alert("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="glass rounded-3xl bg-white p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-navy-500/5 shadow-sm">
        <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left w-full md:w-auto">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-navy-500/10 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white flex items-center justify-center text-2xl font-extrabold shadow-sm uppercase shrink-0">
              {user.name.charAt(0)}
            </div>
          )}
          <div>
            <span className="text-[10px] font-bold text-brand-500 bg-brand-50/50 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              {user.role}
            </span>
            <h1 className="text-xl font-extrabold text-navy-500 mt-1">{user.name}</h1>
            <p className="text-navy-500/50 text-xs font-semibold">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end flex-wrap">
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary text-brand-500 hover:bg-brand-50 hover:border-brand-200 text-xs px-4 py-2.5 cursor-pointer"
          >
            <Settings size={14} />
            Edit Profil
          </button>
          {user.role === "admin" && (
            <a href="/admin" className="btn-primary text-xs px-4 py-2.5">
              Panel Admin
            </a>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl bg-white p-6 md:p-8 w-full max-w-md border border-navy-500/5 shadow-2xl relative">
            <h2 className="text-base font-extrabold text-navy-500 mb-6 flex items-center gap-2">
              <Settings className="text-brand-500" size={20} />
              Edit Profil Pengguna
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-2 pb-2">
                <div className="relative group cursor-pointer">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-20 h-20 rounded-2xl object-cover border border-navy-500/10 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-brand-100 text-brand-500 flex items-center justify-center text-3xl font-extrabold uppercase">
                      {name.charAt(0)}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-navy-950/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[9px] font-bold text-navy-500/40 uppercase">
                  {uploading ? "Membaca file..." : "Klik foto untuk ganti (Maks 2MB)"}
                </span>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Nama Lengkap</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="input-glass pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">No. WhatsApp</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 0812xxxxxxxx"
                    className="input-glass pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                    setPhone(user.phone || "");
                    setImage(user.image || "");
                  }}
                  className="flex-1 btn-secondary text-xs py-3 justify-center cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 btn-primary text-xs py-3 justify-center cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader className="animate-spin" size={14} />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
