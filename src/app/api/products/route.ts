import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const fallbackProducts = [
  {
    id: "prod-1",
    name: "Sistem Informasi Manajemen Tanah Kas Desa (SIM-TKD)",
    slug: "sim-tkd",
    description: "Sistem digital berbasis web untuk mengelola keuangan usaha tanah kas desa, bukti transaksi, dan laporan otomatis.",
    price: 7500000,
    image: "/images/logo simtkd 2.png",
    gallery: ["/images/logo simtkd 2.png"],
    features: ["Pencatatan Aset", "Laporan Keuangan Otomatis", "Monitoring Saldo Realtime"],
    category: "Sistem Desa",
    stock: 50,
    featured: true,
  },
  {
    id: "prod-2",
    name: "Pelayanan Elektronik Terpadu Administrasi Desa (PELITA)",
    slug: "pelita",
    description: "Sistem pelayanan administrasi desa berbasis digital terintegrasi TTE Balai Sertifikasi Elektronik (BSrE).",
    price: 8500000,
    image: "/images/logo pelita.png",
    gallery: ["/images/logo pelita.png"],
    features: ["Integrasi BSrE TTE", "Pengajuan Surat Online", "Tracking Berkas Warga"],
    category: "Pelayanan Publik",
    stock: 50,
    featured: true,
  },
  {
    id: "prod-3",
    name: "Aplikasi Pengelolaan Koperasi Desa (KOPDESIA)",
    slug: "kopdesia",
    description: "Aplikasi kelola data anggota, simpanan, pinjaman, dan transaksi keuangan koperasi secara terstruktur.",
    price: 6500000,
    image: "/images/logo kopdesia.png",
    gallery: ["/images/logo kopdesia.png"],
    features: ["Manajemen Simpan Pinjam", "Laporan SHU", "Monitoring Transaksi"],
    category: "Koperasi & Usaha",
    stock: 50,
    featured: true,
  },
  {
    id: "prod-4",
    name: "Aplikasi Pengolahan BUMDES (BUMDESIA)",
    slug: "bumdesia",
    description: "Sistem digital untuk membantu pengelolaan BUMDes dalam pencatatan aktivitas usaha dan pemantauan unit usaha.",
    price: 7000000,
    image: "/images/LOGO BUMDESIA.png",
    gallery: ["/images/LOGO BUMDESIA.png"],
    features: ["Pencatatan Usaha", "Laporan Arus Kas", "Dashboard Unit Usaha"],
    category: "Koperasi & Usaha",
    stock: 50,
    featured: false,
  },
  {
    id: "prod-5",
    name: "Sistem Absensi Digital (SIABDI)",
    slug: "siabdi",
    description: "Sistem absen digital dengan GPS radius lokasi, verifikasi foto kamera, dan rekapitulasi kehadiran instansi.",
    price: 5500000,
    image: "/images/LOG SIABDI.png",
    gallery: ["/images/LOG SIABDI.png"],
    features: ["GPS Geofencing", "Foto Selfie Camera", "Export Laporan Kehadiran"],
    category: "Sistem Absensi",
    stock: 50,
    featured: false,
  },
  {
    id: "prod-6",
    name: "Instapro Learning Academy - Custom Capacity Building",
    slug: "instapro-learning-academy",
    description: "Paket pelatihan peningkatan kapasitas SDM instansi/desa dengan sertifikat dan instruktur berpengalaman.",
    price: 4500000,
    image: "/images/logo ILA 2.png",
    gallery: ["/images/logo ILA 2.png"],
    features: ["Pelatihan In-House", "Modul Interaktif", "Sertifikat Kelulusan Resmi"],
    category: "Pelatihan SDM",
    stock: 99,
    featured: true,
  },
];

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (products && products.length > 0) {
      const formatted = products.map((p) => ({
        ...p,
        gallery: typeof p.gallery === "string" ? JSON.parse(p.gallery || "[]") : p.gallery,
        features: typeof p.features === "string" ? JSON.parse(p.features || "[]") : p.features,
      }));
      return NextResponse.json({ success: true, products: formatted });
    }
  } catch (error) {
    console.error("Database fetch products error, using fallback:", error);
  }

  return NextResponse.json({ success: true, products: fallbackProducts });
}
