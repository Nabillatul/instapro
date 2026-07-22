import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import {
  FileText, Package, ExternalLink, ShoppingBag, Clock, TrendingUp,
  Users, CheckCircle, XCircle, Wrench,
} from "lucide-react";

export default async function AdminPage() {
  await requireAdmin();

  let articleCount = 0;
  let productCount = 0;
  let orderTotal = 0;
  let orderPending = 0;
  let orderConfirmed = 0;
  let orderInProgress = 0;
  let orderCompleted = 0;
  let orderCancelled = 0;
  let userCount = 0;

  try {
    articleCount = await prisma.article.count();
    productCount = await prisma.product.count();
    orderTotal = await prisma.order.count();
    orderPending = await prisma.order.count({ where: { status: "pending" } });
    orderConfirmed = await prisma.order.count({ where: { status: "confirmed" } });
    orderInProgress = await prisma.order.count({ where: { status: "in_progress" } });
    orderCompleted = await prisma.order.count({ where: { status: "completed" } });
    orderCancelled = await prisma.order.count({ where: { status: "cancelled" } });
    userCount = await prisma.user.count({ where: { role: "customer" } });
  } catch {
    // tables may not exist yet
  }

  const topStats = [
    {
      label: "Total Pesanan",
      value: orderTotal,
      icon: <ShoppingBag size={20} />,
      color: "text-brand-500",
      bg: "bg-brand-50",
      bar: "bg-brand-500",
    },
    {
      label: "Pending",
      value: orderPending,
      icon: <Clock size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      bar: "bg-amber-500",
    },
    {
      label: "Dikerjakan",
      value: orderInProgress,
      icon: <Wrench size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      bar: "bg-blue-500",
    },
    {
      label: "Selesai",
      value: orderCompleted,
      icon: <CheckCircle size={20} />,
      color: "text-green-600",
      bg: "bg-green-50",
      bar: "bg-green-500",
    },
    {
      label: "Dibatalkan",
      value: orderCancelled,
      icon: <XCircle size={20} />,
      color: "text-red-500",
      bg: "bg-red-50",
      bar: "bg-red-400",
    },
    {
      label: "Total Pengguna",
      value: userCount,
      icon: <Users size={20} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      bar: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-navy-500 p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute left-20 bottom-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Selamat Datang,</p>
          <h1 className="text-3xl font-extrabold mb-2">Admin Panel Instapro</h1>
          <p className="text-white/70 text-sm font-semibold max-w-lg">
            Kelola konten, produk, dan pesanan dari satu tempat. Data di bawah ini diperbarui secara real-time dari database.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-sm font-extrabold text-navy-500/50 uppercase tracking-widest mb-4">Statistik Pesanan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {topStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-navy-500/5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${stat.bar}`} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] font-bold text-navy-500/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-navy-500/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-navy-500">{articleCount}</p>
            <p className="text-[11px] font-bold text-navy-500/40">Total Artikel Dipublikasi</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-navy-500/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center text-navy-500 shrink-0">
            <Package size={22} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-navy-500">{productCount}</p>
            <p className="text-[11px] font-bold text-navy-500/40">Total Produk di Katalog</p>
          </div>
        </div>
      </div>

      {/* Menu Cards */}
      <div>
        <h2 className="text-sm font-extrabold text-navy-500/50 uppercase tracking-widest mb-4">Manajemen Konten</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Artikel */}
          <div className="group bg-white rounded-3xl p-7 border border-navy-500/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-500/15 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-navy-500 font-extrabold text-sm">Artikel & Berita</h2>
                <p className="text-navy-500/40 text-xs font-semibold">{articleCount} artikel</p>
              </div>
            </div>
            <p className="text-navy-500/60 text-xs font-semibold mb-6 leading-relaxed">
              Tambah, edit, atau hapus artikel yang tampil di halaman Berita.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/artikel" className="btn-primary text-xs px-4 py-2">
                Kelola
              </Link>
              <Link href="/berita" className="btn-secondary text-xs px-4 py-2" target="_blank">
                <ExternalLink size={13} /> Lihat
              </Link>
            </div>
          </div>

          {/* Produk */}
          <div className="group bg-white rounded-3xl p-7 border border-navy-500/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-500/15 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-navy-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-navy-500 flex items-center justify-center text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Package size={22} />
              </div>
              <div>
                <h2 className="text-navy-500 font-extrabold text-sm">Katalog Produk</h2>
                <p className="text-navy-500/40 text-xs font-semibold">{productCount} produk</p>
              </div>
            </div>
            <p className="text-navy-500/60 text-xs font-semibold mb-6 leading-relaxed">
              Tambah, edit, atau hapus produk yang tampil di halaman Katalog.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/produk" className="btn-primary text-xs px-4 py-2">
                Kelola
              </Link>
              <Link href="/katalog" className="btn-secondary text-xs px-4 py-2" target="_blank">
                <ExternalLink size={13} /> Lihat
              </Link>
            </div>
          </div>

          {/* Pesanan */}
          <div className="group bg-white rounded-3xl p-7 border border-navy-500/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-500/15 relative overflow-hidden">
            {orderPending > 0 && (
              <span className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-amber-500 text-white uppercase tracking-widest animate-pulse">
                {orderPending} Pending
              </span>
            )}
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h2 className="text-navy-500 font-extrabold text-sm">Pesanan & Pembayaran</h2>
                <p className="text-navy-500/40 text-xs font-semibold">{orderTotal} pesanan masuk</p>
              </div>
            </div>
            <p className="text-navy-500/60 text-xs font-semibold mb-6 leading-relaxed">
              Lihat riwayat pesanan, update status, dan hubungi pembeli via WhatsApp.
            </p>
            <div className="flex gap-2">
              <Link href="/admin/pesanan" className="btn-primary text-xs px-4 py-2">
                Kelola Pesanan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}