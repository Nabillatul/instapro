"use client";

import { useState } from "react";
import { User, Phone, Camera, Loader, Check, X, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminProfile {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
}

export default function AdminProfileEditor({
  admin,
  adminInitial,
}: {
  admin: AdminProfile;
  adminInitial: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(admin);
  const [name, setName] = useState(admin.name);
  const [phone, setPhone] = useState(admin.phone || "");
  const [image, setImage] = useState(admin.image || "");
  const [password, setPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB.");
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
      const bodyData: any = { name, phone, image, email: profile.email, isAdminUpdate: true };
      if (password.trim() !== "") {
        bodyData.password = password.trim();
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile({ ...profile, name, phone, image });
        setIsEditing(false);
        setPassword("");
        router.refresh();
      } else {
        alert(data.error || "Gagal memperbarui profil.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Avatar + info */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsEditing(true)} title="Edit Profil">
        <div className="relative group shrink-0">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-brand-500/20 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-extrabold">
              {adminInitial}
            </div>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
        </div>
        <div className="hidden sm:block text-right leading-tight">
          <p className="text-xs font-extrabold text-navy-500 truncate max-w-[120px]">{profile.name}</p>
          <p className="text-[9px] font-bold text-navy-500/40 truncate max-w-[120px]">{profile.email}</p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-navy-500/5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-extrabold text-navy-500 flex items-center gap-2">
                <User className="text-brand-500" size={18} />
                Edit Profil Admin
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl text-navy-500/40 hover:bg-navy-50 hover:text-navy-500 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group cursor-pointer">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-500/20 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-brand-100 text-brand-500 flex items-center justify-center text-4xl font-extrabold uppercase shadow-sm">
                      {name.charAt(0)}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-navy-950/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={22} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[9px] font-bold text-navy-500/40 uppercase tracking-wider">
                  {uploading ? "Membaca gambar..." : "Klik untuk ganti foto (Maks 2MB)"}
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Nama Admin</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
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
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">No. Telepon / WA</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 0812xxxxxxxx"
                    className="input-glass pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Password Baru (Opsional)</label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Biarkan kosong jika tidak ingin mengubah sandi"
                    className="input-glass pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(profile.name);
                    setPhone(profile.phone || "");
                    setImage(profile.image || "");
                    setPassword("");
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
                    <><Loader className="animate-spin" size={14} /> Menyimpan...</>
                  ) : (
                    <><Check size={14} /> Simpan</>
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
