"use client";

import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, ArrowRight, Loader, CheckCircle2, ShoppingBag, LogOut, KeyRound, X, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset / Change Password Modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");
    setResetSuccess("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail || session?.user?.email,
          newPassword: resetPassword,
        }),
      });

      const data = await res.json();
      setResetLoading(false);

      if (res.ok && data.success) {
        setResetSuccess("Password berhasil diganti! Sesi akan dimuat ulang...");
        setTimeout(() => {
          setShowResetModal(false);
          setResetSuccess("");
          setResetPassword("");
          if (session?.user) {
            signOut({ callbackUrl: "/login" });
          }
        }, 1200);
      } else {
        setResetError(data.error || "Gagal memperbarui password.");
      }
    } catch {
      setResetLoading(false);
      setResetError("Terjadi kesalahan sistem saat memperbarui password.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isLogin) {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email.trim(),
          password: formData.password.trim(),
        });

        if (res?.error) {
          setError("Email atau password salah. Silakan coba lagi.");
          setLoading(false);
        } else {
          window.location.href = callbackUrl;
        }
      } catch (err: any) {
        console.error("Login catch error:", err);
        if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.includes("NEXT_REDIRECT")) {
          window.location.href = callbackUrl;
          return;
        }
        setError("Email atau password salah. Silakan coba lagi.");
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            phone: formData.phone.trim(),
          }),
        });

        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setLoading(false);
        } else {
          try {
            const loginRes = await signIn("credentials", {
              redirect: false,
              email: formData.email.trim(),
              password: formData.password.trim(),
            });

            setLoading(false);

            if (loginRes?.error) {
              setSuccess("Registrasi sukses! Silakan login.");
              setIsLogin(true);
              setFormData({ name: "", email: "", password: "", phone: "" });
            } else {
              window.location.href = callbackUrl;
            }
          } catch {
            window.location.href = callbackUrl;
          }
        }
      } catch (err) {
        setError("Registrasi gagal. Coba lagi.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-20 bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="section-container w-full max-w-md relative z-10">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <img
            src="/logo-landscape.png"
            alt="InstaPro Logo"
            className="h-12 w-auto mx-auto mb-2 object-contain"
          />
        </div>

        {status === "authenticated" && session?.user ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl bg-white p-8 border border-navy-500/5 shadow-md text-center"
          >
            <div className="w-20 h-20 bg-brand-500 text-white flex items-center justify-center text-3xl font-extrabold uppercase rounded-full mx-auto mb-6 shadow-sm">
              {session.user.name ? session.user.name[0] : "U"}
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-[9px] font-bold bg-brand-50 text-brand-500 uppercase tracking-widest mb-2 border border-brand-500/10">
              {session.user.role === "admin" ? "Administrator" : "Customer / Pengguna"}
            </span>

            <h1 className="text-xl font-extrabold text-navy-500 mb-1">
              {session.user.name}
            </h1>
            <p className="text-xs font-bold text-navy-500/40 mb-6">
              {session.user.email}
            </p>

            <div className="space-y-3.5 mb-8 text-left rounded-2xl bg-navy-50/50 p-4 border border-navy-500/5 text-xs font-bold text-navy-500">
              <div className="flex justify-between items-center">
                <span className="text-navy-500/50 text-[10px] uppercase tracking-wider">Nama Lengkap</span>
                <span className="font-extrabold">{session.user.name}</span>
              </div>
              <div className="h-px bg-navy-500/5" />
              <div className="flex justify-between items-center">
                <span className="text-navy-500/50 text-[10px] uppercase tracking-wider">Alamat Email</span>
                <span className="font-extrabold truncate max-w-[200px]">{session.user.email}</span>
              </div>
              <div className="h-px bg-navy-500/5" />
              <div className="flex justify-between items-center">
                <span className="text-navy-500/50 text-[10px] uppercase tracking-wider">No. WhatsApp</span>
                <span className="font-extrabold">{(session.user as any).phone || "-"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push(callbackUrl)}
                className="btn-primary w-full justify-center py-3.5 text-xs"
              >
                {callbackUrl.includes("checkout") 
                  ? "Lanjut ke Checkout" 
                  : callbackUrl.includes("dashboard") 
                  ? "Masuk ke Dashboard" 
                  : "Lanjut Belanja / Katalog"}
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => {
                  setResetEmail(session.user?.email || "");
                  setResetPassword("");
                  setResetError("");
                  setResetSuccess("");
                  setShowResetModal(true);
                }}
                className="w-full py-3 rounded-xl text-xs font-bold bg-navy-50 text-navy-600 hover:bg-navy-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-navy-100"
              >
                <KeyRound size={14} /> Ubah Password Akun
              </button>

              {callbackUrl.includes("checkout") && (
                <button
                  onClick={() => router.push("/katalog")}
                  className="btn-secondary w-full justify-center py-3 text-xs"
                >
                  Kembali ke Katalog
                </button>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full py-3 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-red-100"
              >
                <LogOut size={14} /> Keluar dari Akun
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl bg-white p-8 border border-navy-500/5 shadow-md"
          >
            {/* Info konteks checkout */}
            {callbackUrl.includes("checkout") && (
              <div className="flex items-center justify-center gap-2 mb-5 text-brand-500 animate-pulse">
                <ShoppingBag size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Login untuk melanjutkan checkout
                </span>
              </div>
            )}

            {/* Tab Selection */}
            <div className="flex gap-2 mb-8 bg-navy-50/60 p-1 rounded-xl">
              <button
                onClick={() => { setIsLogin(true); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isLogin
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-navy-500/60 hover:text-navy-500"
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isLogin
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-navy-500/60 hover:text-navy-500"
                }`}
              >
                Buat Akun
              </button>
            </div>

            <h1 className="text-xl font-extrabold text-navy-500 mb-6 text-center">
              {isLogin ? "Selamat Datang Kembali" : "Buat Akun Instapro"}
            </h1>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold p-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-[10px] font-bold p-3 rounded-xl mb-4 flex items-center gap-2">
                <CheckCircle2 size={14} />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Nama Lengkap</label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                        <input
                          type="text"
                          name="name"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Nama Lengkap"
                          autoComplete="name"
                          className="input-glass pl-10 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">No. WhatsApp</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                        <input
                          type="tel"
                          name="phone"
                          required={!isLogin}
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Contoh: 0821xxxxxxxx"
                          autoComplete="tel"
                          className="input-glass pl-10 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Alamat Email"
                    autoComplete="username"
                    className="input-glass pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(formData.email || "");
                        setResetPassword("");
                        setResetError("");
                        setResetSuccess("");
                        setShowResetModal(true);
                      }}
                      className="text-[10px] font-bold text-brand-500 hover:underline cursor-pointer"
                    >
                      Lupa Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="input-glass pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-4 mt-6 text-xs"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={16} /> Memproses...
                  </>
                ) : (
                  <>
                    {isLogin ? "Masuk & Lanjut Checkout" : "Buat Akun & Lanjut Checkout"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-navy-500/5 text-center">
              <button
                onClick={() => router.push("/katalog")}
                className="text-[10px] font-bold text-navy-500/40 hover:text-brand-500 transition-colors cursor-pointer"
              >
                ← Kembali ke Katalog Produk
              </button>
            </div>
          </motion.div>
        )}

        {/* Modal Reset / Ubah Password */}
        {showResetModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-navy-500/5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-navy-500 flex items-center gap-2">
                  <KeyRound className="text-brand-500" size={18} />
                  {session?.user ? "Ubah Password Akun" : "Reset / Lupa Password"}
                </h2>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="p-2 rounded-xl text-navy-500/40 hover:bg-navy-50 hover:text-navy-500 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-navy-500/50 text-xs font-medium mb-5">
                Masukkan email terdaftar dan ketikkan password baru Anda.
              </p>

              {resetError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold p-3 rounded-xl mb-4">
                  {resetError}
                </div>
              )}
              {resetSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-600 text-[10px] font-bold p-3 rounded-xl mb-4 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  {resetSuccess}
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-4" autoComplete="off">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Email Akun</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="email@domain.com"
                      disabled={Boolean(session?.user?.email)}
                      autoComplete="off"
                      className="input-glass pl-10 text-xs font-semibold disabled:bg-slate-100 disabled:opacity-75"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Password Baru</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                    <input
                      type="password"
                      required
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder="Masukkan password baru (min 6 karakter)"
                      autoComplete="new-password"
                      className="input-glass pl-10 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 btn-secondary text-xs py-3 justify-center cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 btn-primary text-xs py-3 justify-center cursor-pointer"
                  >
                    {resetLoading ? (
                      <><Loader className="animate-spin" size={14} /> Memproses...</>
                    ) : (
                      "Simpan Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-center text-[10px] font-bold text-navy-500/40 mt-4">
          © 2025 PT. Insta Pro Solution — Pekanbaru, Riau
        </p>
      </div>
    </div>
  );
}