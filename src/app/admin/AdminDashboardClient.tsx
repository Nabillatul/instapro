"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Package,
  ExternalLink,
  UserCheck,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Plus,
} from "lucide-react";

interface AdminDashboardProps {
  articleCount: number;
  productCount: number;
  coachCount: number;
  photoCount: number;
}

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AdminDashboardClient({
  articleCount,
  productCount,
  coachCount,
  photoCount,
}: AdminDashboardProps) {
  const summaryCards = [
    { label: "Artikel Berita", count: articleCount, icon: <FileText size={22} />, color: "from-brand-500 to-brand-600", bg: "bg-brand-50 text-brand-500" },
    { label: "Katalog Produk", count: productCount, icon: <Package size={22} />, color: "from-navy-500 to-navy-700", bg: "bg-navy-50 text-navy-500" },
    { label: "Mentor & Coach", count: coachCount, icon: <UserCheck size={22} />, color: "from-indigo-500 to-purple-600", bg: "bg-indigo-50 text-indigo-600" },
    { label: "Foto Kegiatan", count: photoCount, icon: <ImageIcon size={22} />, color: "from-amber-500 to-orange-600", bg: "bg-amber-50 text-amber-600" },
  ];

  const menuCards = [
    {
      title: "Artikel & Berita",
      countText: `${articleCount} artikel`,
      desc: "Tambah, edit, atau hapus artikel yang tampil di halaman Berita.",
      link: "/admin/artikel",
      publicLink: "/berita",
      icon: <FileText size={22} />,
      color: "bg-brand-500",
    },
    {
      title: "Katalog Produk",
      countText: `${productCount} produk`,
      desc: "Tambah, edit, atau hapus produk sistem yang tampil di Layanan.",
      link: "/admin/produk",
      publicLink: "/layanan#katalog-produk",
      icon: <Package size={22} />,
      color: "bg-navy-500",
    },
    {
      title: "Coach & Mentor",
      countText: `${coachCount} mentor`,
      desc: "Tambah, edit foto & biodata coach yang tampil di halaman Kelas Instapro.",
      link: "/admin/coach",
      publicLink: "/kelas-quantum",
      icon: <UserCheck size={22} />,
      color: "bg-indigo-500",
    },
    {
      title: "Foto Galeri Kelas",
      countText: `${photoCount} foto`,
      desc: "Tambah atau ganti foto kegiatan & testimoni alumni di Kelas Instapro.",
      link: "/admin/kelas-foto",
      publicLink: "/kelas-quantum",
      icon: <ImageIcon size={22} />,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-navy-500 p-8 md:p-10 text-white shadow-xl relative overflow-hidden"
      >
        <motion.div
          aria-hidden
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -right-10 -top-10 w-80 h-80 rounded-full border border-white/10 pointer-events-none"
        />
        <div className="absolute right-10 bottom-0 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest mb-3 backdrop-blur-xs">
            <Sparkles size={12} /> Live Administration Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Selamat Datang di Admin Panel</h1>
          <p className="text-white/80 text-sm font-medium max-w-xl leading-relaxed">
            Kelola konten artikel berita, katalog paket produk, profil coach mentor, dan dokumentasi foto kegiatan secara real-time dari satu tempat.
          </p>
        </div>
      </motion.div>

      {/* Summary Stat Cards Grid */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {summaryCards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={itemVariant}
            whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-3xl p-6 border border-navy-500/5 shadow-sm flex items-center gap-4 transition-shadow duration-300 relative overflow-hidden"
          >
            <div className={`w-13 h-13 rounded-2xl ${card.bg} flex items-center justify-center shrink-0 font-extrabold`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-500">{card.count}</p>
              <p className="text-[11px] font-bold text-navy-500/40 uppercase tracking-wider">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Menu Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-extrabold text-navy-500/50 uppercase tracking-widest">
            Manajemen Konten & Website
          </h2>
          <span className="text-[11px] font-bold text-brand-500">4 Modul Aktif</span>
        </div>

        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {menuCards.map((menu, idx) => (
            <motion.div
              key={idx}
              variants={itemVariant}
              whileHover={{ y: -8, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.12)" }}
              className="group bg-white rounded-3xl p-7 border border-navy-500/5 shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${menu.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${menu.color} flex items-center justify-center text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 shadow-md`}>
                    {menu.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-navy-500 font-extrabold text-sm truncate">{menu.title}</h3>
                    <p className="text-navy-500/40 text-xs font-semibold">{menu.countText}</p>
                  </div>
                </div>
                <p className="text-navy-500/60 text-xs font-medium mb-6 leading-relaxed">
                  {menu.desc}
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-navy-500/5 mt-auto">
                <Link
                  href={menu.link}
                  className="btn-primary text-xs px-4 py-2.5 flex-1 justify-center shadow-xs"
                >
                  Kelola Modul
                </Link>
                <Link
                  href={menu.publicLink}
                  className="btn-secondary text-xs px-3 py-2.5 border-navy-100 text-navy-500 hover:bg-navy-50"
                  target="_blank"
                  title="Lihat Tampilan Publik"
                >
                  <ExternalLink size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
