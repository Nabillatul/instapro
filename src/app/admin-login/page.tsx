"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader, ShieldAlert, KeyRound, X, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset Password Modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

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
          email: resetEmail,
          newPassword: resetPassword,
        }),
      });

      const data = await res.json();
      setResetLoading(false);

      if (res.ok && data.success) {
        setResetSuccess(data.message || "Password admin berhasil diperbarui!");
        setTimeout(() => {
          setShowResetModal(false);
          setResetSuccess("");
          setResetPassword("");
        }, 2000);
      } else {
        setResetError(data.error || "Gagal memperbarui password admin.");
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

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Email atau password admin salah.");
      }
    } catch {
      setLoading(false);
      setError("Terjadi kesalahan. Silakan coba lagi.");
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
            className="h-12 w-auto mx-auto mb-4 object-contain"
          />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-bold uppercase tracking-widest">
            <ShieldAlert size={11} />
            Admin Access Only
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl bg-white p-8 border border-navy-500/5 shadow-md"
        >
          <h1 className="text-xl font-extrabold text-navy-500 mb-2 text-center">
            Panel Administrator
          </h1>
          <p className="text-navy-500/50 text-xs font-semibold text-center mb-8">
            Masuk menggunakan kredensial admin untuk mengelola konten website.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold p-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">
                Email Admin
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@instapro.co.id"
                  className="input-glass pl-10 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || "");
                    setResetPassword("");
                    setResetError("");
                    setResetSuccess("");
                    setShowResetModal(true);
                  }}
                  className="text-[10px] font-bold text-brand-500 hover:underline cursor-pointer"
                >
                  Lupa Password Admin?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password admin"
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
                  <Loader className="animate-spin" size={16} /> Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Panel Admin
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-navy-500/5 text-center">
            <p className="text-[10px] font-bold text-navy-500/40">
              Halaman ini hanya untuk administrator Instapro Solution.
            </p>
          </div>
        </motion.div>

        {/* Modal Reset Password Admin */}
        {showResetModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-navy-500/5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-navy-500 flex items-center gap-2">
                  <KeyRound className="text-brand-500" size={18} />
                  Reset Password Admin
                </h2>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="p-2 rounded-xl text-navy-500/40 hover:bg-navy-50 hover:text-navy-500 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-navy-500/50 text-xs font-medium mb-5">
                Masukkan email admin terdaftar dan ketikkan password admin baru.
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

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Email Admin</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@instapro.co.id"
                      className="input-glass pl-10 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Password Admin Baru</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
                    <input
                      type="password"
                      required
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder="Masukkan password admin baru (min 6 karakter)"
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
                      "Simpan Password Admin"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <p className="text-center text-[10px] font-bold text-navy-500/40 mt-4">
          © 2025 PT. Insta Pro Solution — Pekanbaru, Riau
        </p>
      </div>
    </div>
  );
}
