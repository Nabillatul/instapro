import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const results = {
      adminCreated: false,
      productsCreated: 0,
      articlesCreated: 0,
    };

    // 1. Ensure Admin User exists
    const adminPassword = await bcrypt.hash("password123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@instapro.co.id" },
      update: {},
      create: {
        name: "Admin Instapro",
        email: "admin@instapro.co.id",
        password: adminPassword,
        role: "admin",
        phone: "08217710106",
      },
    });

    if (admin) {
      results.adminCreated = true;
    }

    // 2. Initial Products if empty
    const productCount = await prisma.product.count().catch(() => 0);
    if (productCount === 0) {
      const initialProducts = [
        {
          name: "Sistem Web Profil Desa & Digitalisasi Pelayanan",
          slug: "sistem-web-profil-desa",
          description: "Platform digital terpadu untuk pelayanan administrasi warga, transparansi anggaran, dan promosi potensi desa mandiri.",
          price: 7500000,
          image: "/images/products/default.jpg",
          gallery: JSON.stringify(["/images/products/default.jpg"]),
          features: JSON.stringify(["Persyaratan Surat Online", "Transparansi APBD", "Peta Digital Desa", "Layanan Mandiri Warga"]),
          category: "Sistem Desa",
          stock: 99,
          featured: true,
        },
        {
          name: "Sistem Manajemen Keuangan & Akuntansi Lembaga",
          slug: "sistem-manajemen-keuangan",
          description: "Aplikasi keuangan berbasis cloud untuk pembukuan akurat, laporan arus kas otomatis, dan audit internal.",
          price: 12000000,
          image: "/images/products/default.jpg",
          gallery: JSON.stringify(["/images/products/default.jpg"]),
          features: JSON.stringify(["Jurnal Otomatis", "Laporan Laba Rugi", "Manajemen Kas & Bank", "Multi User Access"]),
          category: "Software Keuangan",
          stock: 50,
          featured: true,
        },
        {
          name: "Sistem Akademik & Informasi Pendidikan",
          slug: "sistem-akademik-pendidikan",
          description: "Sistem informasi pengelolaan nilai, presensi digital, jadwal pelajaran, dan portal wali murid berbasis web.",
          price: 9500000,
          image: "/images/products/default.jpg",
          gallery: JSON.stringify(["/images/products/default.jpg"]),
          features: JSON.stringify(["Rapor Digital", "Presensi QR Code", "Portal Orang Tua", "Integrasi Dapodik"]),
          category: "Sistem Pendidikan",
          stock: 50,
          featured: false,
        },
      ];

      for (const p of initialProducts) {
        await prisma.product.create({ data: p });
      }
      results.productsCreated = initialProducts.length;
    }

    // 3. Initial Articles if empty
    const articleCount = await prisma.article.count().catch(() => 0);
    if (articleCount === 0) {
      const initialArticles = [
        {
          title: "Akselerasi Digitalisasi Desa Menuju Tata Kelola Mandiri",
          slug: "akselerasi-digitalisasi-desa",
          excerpt: "Bagaimana integrasi sistem informasi desa meningkatkan efisiensi pelayanan publik dan transparansi anggaran.",
          content: "Digitalisasi desa bukan sekadar tren, melainkan kebutuhan pokok untuk mempermudah akses layanan publik. Dengan sistem yang terintegrasi, warga dapat mengajukan surat administratif secara daring, sementara pemerintah desa memperoleh transparansi data yang akurat.",
          image: "/images/articles/default.jpg",
          category: "Digitalisasi Desa",
          author: "Tim Konsultan Instapro",
          published: true,
        },
        {
          title: "Strategi Transformasi Digital bagi Organisasi & Lembaga",
          slug: "strategi-transformasi-digital",
          excerpt: "Langkah strategis dalam mengadopsi teknologi informasi untuk efisiensi operasional dan pertumbuhan berkelanjutan.",
          content: "Penerapan sistem informasi yang tepat dapat menghemat efisiensi waktu hingga 70%. Penting bagi setiap organisasi untuk memetakan kebutuhan sistem sebelum memilih solusi teknologi yang relevan.",
          image: "/images/articles/default.jpg",
          category: "Teknologi",
          author: "Admin Instapro",
          published: true,
        },
      ];

      for (const a of initialArticles) {
        await prisma.article.create({ data: a });
      }
      results.articlesCreated = initialArticles.length;
    }

    return NextResponse.json({
      success: true,
      message: "Database berhasil di-seed dengan data awal!",
      results,
    });
  } catch (error: any) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
