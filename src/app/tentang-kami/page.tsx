"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  animate,
  useReducedMotion,
  AnimatePresence,
  useSpring,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import SectionHeading from "@/components/ui/SectionHeading";
import { Shield, Lightbulb, Building2, FileCheck, Award, Code, X, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const teamMembers = [
  { 
    name: "Setyo Irawan, S.IP", 
    role: "Managing Director", 
    division: "Direksi", 
    image: "/images/Setyo Irawan, S.IP.jpg"
  },
  { 
    name: "Raja Azian, ST", 
    role: "Software Architect", 
    division: "Sistem & IT", 
    image: "/images/Raja Azian, S.T.jpg"
  },
  { 
    name: "Jean, S.Tr.Kom", 
    role: "Mobile Developer", 
    division: "Sistem & IT", 
    image: "/images/Jean, S.Tr.Kom.jpg"
  },
  { 
    name: "Refandi Syahputra, S.Sos", 
    role: "Planning Strategic", 
    division: "Strategi & Tata Kelola", 
    image: "/images/Refandi Syahputra. S.Sos.jpg"
  },
  { 
    name: "Ferdian Hadi Nugraha, S.Kom", 
    role: "UI/UX Designer", 
    division: "Sistem & IT",
    image: "/images/Ferdian Hadi Nugraha, S.Kom.jpg"
  },
];

const values = [
  { number: "01", title: "Inovatif", desc: "Menghadirkan solusi tata kelola kreatif yang relevan dengan perkembangan digital terkini." },
  { number: "02", title: "Profesional", desc: "Menjaga kualitas pendampingan dan integritas kerja tinggi di setiap tingkatan proyek." },
  { number: "03", title: "Kolaboratif", desc: "Bekerja bahu-membahu dengan instansi, organisasi, dan desa sebagai mitra pertumbuhan." },
  { number: "04", title: "Berorientasi Hasil", desc: "Memastikan digitalisasi memberikan dampak nyata pada layanan masyarakat dan organisasi." },
];

const licenses = [
  { label: "AKTA PENDIRIAN ", value: "No. 30 Tanggal 24 November 2025 Notaris : Sri Hatika,SH" },
  { label: "NIB", value: "1601260059674" },
  { label: "SK MENKUMHAM", value: "AHU-0101529.AH.01.01.TAHUN 2025" },
  { label: "BENTUK BADAN USAHA", value: "Perseroan Terbatas (PT)" },
  { label: "NAMA RESMI", value: "PT. Insta Pro Solution" },
  { label: "COMPLIANCE COMMITMEN", value: "PT. Insta Pro Solution beroperasi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku di Republik Indonesia dan berkomitmen terhadap   tatakelola perusahaan yang profesional,     transparan, dan akuntabel" },
];

const portfolioItems = [
  { 
    title: "SISTEM INFORMASI MANAJEMEN TANAH KAS DESA", 
    category: "desa", 
    year: "2025", 
    desc: "SIM-TKD Merupakan Sistem Digital Berbasis Web Untuk Mengelolah Keuangan Usaha Tanah Kas Desa,Meliputi Seluruh Transaksi Keuangan Pengelolahan Bukti Transaksi Monitoring Saldo Kas Serta Penyusunan Laporan Secara Otomatis Dan Terintegrasi.", 
    image: "/images/logo simtkd 2.png",
    images: [
      "/images/logo simtkd 2.png",
      "/images/logo simtkd 2.png",
      "/images/logo simtkd 2.png",
      "/images/logo simtkd 2.png",
      "/images/logo simtkd 2.png",
    ],
    status: "Selesai Implementasi & Pendampingan",
  },
  { 
    title: "PELAYANAN ELEKTRONIK TERPADU ADMINISTRASI DESA", 
    category: "desa", 
    year: "2025", 
    desc: "PELITA Merupakan Sistem Pelayanan Administrasi Desa Berbasis Digital Guna Mempermudah Pelayanan Publik Kepada Masyarakat.Aplikasi Ini Terintegrasi Dengan TTE Dari Balai Sertifikasi Elektronik (BSrE).", 
    image: "/images/logo pelita.png",
    images: [
      "/images/logo pelita.png",
      "/images/logo pelita.png",
      "/images/logo pelita.png",
      "/images/logo pelita.png",
      "/images/logo pelita.png",
    ],
    status: "Selesai",
  },
  { 
    title: "APLIKASI PENGELOLAAN KOPERASI DESA", 
    category: "desa", 
    year: "2025", 
    desc: "KOPDESIA Merupakan Aplikasi Yang Dirancang Untuk Membantu Mengurus Koperasi Mengelola Berbagai Data Koperasi,Seperti Data Anggota,Simpanan,Pinjaman,Serta Transaksi Koperasi Secara Lebih Terstruktur.Sistem Ini Dapat Menyusun Laporan,Monitoring Operasional Secara RealTIme", 
    image: "/images/logo kopdesia.png",
    images: [
      "/images/logo kopdesia.png",
      "/images/logo kopdesia.png",
      "/images/logo kopdesia.png",
      "/images/logo kopdesia.png",
      "/images/logo kopdesia.png",
    ],
    status: "Selesai Pelaksanaan",
  },
  { 
    title: "APLIKASI PENGOLAHAN BUMDES", 
    category: "desa", 
    year: "2025", 
    desc: "BUMDESIA Merupakan Sistem Digital Yang Dikembangkan Untuk Membantu Pengelolahan Bumdes Dalam Hal Mencatat Aktifitas Usaha,Mengelola Laporan Keuangan,Memantau Perkembangan Unit Usaha.", 
    image: "/images/LOGO BUMDESIA.png",
    images: [
      "/images/LOGO BUMDESIA.png",
      "/images/LOGO BUMDESIA.png",
      "/images/LOGO BUMDESIA.png",
      "/images/LOGO BUMDESIA.png",
      "/images/LOGO BUMDESIA.png",
    ],
    status: "Selesai Deployment & Serah Terima",
  },
  { 
    title: "SISTEM ABSENSI DIGITAL", 
    category: "desa", 
    year: "2025", 
    desc: "SIABDI Merupakan Sistem Absen Digital Yang Dirancang Untuk Membantu Instansi Atau Perusahaan Dalam Memonitor Kehadiran Karyawan.SIABDI Dilengkapi Dengan Sistem Pembatas Radius Lokasi,Absensi Menggunakan Perangkat Handphone Dengan Dukungan Kamera Dan GPS.", 
    image: "/images/LOG SIABDI.png",
    images: [
      "/images/LOG SIABDI.png",
      "/images/logo ILA 2.png",
      "/images/LOG SIABDI.png",
      "/images/LOG SIABDI.png",
      "/images/LOG SIABDI.png",
    ],
    status: "Selesai & Serah Terima",
  },
  { 
    title: "PROFESIONAL TRAINING CERTIFIED AND HUMAN DEVELOPMENT CENTER", 
    category: "institusi", 
    year: "2025", 
    desc: "Instapro Learnig Academy merupakan pusat pelatihan pengembangan sumberdaya manusia yang menghadirkan program pelatihan profesional, sertifikasi, in-house trainig,serta reguler untuk individu maupun organisasi dengan pembekalan yang relevan dengan kebutuhan dunia kerja melalui pembelajaran yang praktis, interaktif, dan berorientasi pada hasil.", 
    image: "/images/logo ILA 2.png",
    images: [
      "/images/logo ILA 2.png",
      "/images/logo ILA 2.png",
      "/images/logo ILA 2.png",
      "/images/logo ILA 2.png",
      "/images/logo ILA 2.png",
    ],
    status: "Selesai Implementasi & Pendampingan",
  },
];

/** SVG lanyard hardware: a striped fabric ribbon, a metal swivel ring,
 *  and a badge clip clamping onto the card below. */
function LanyardHardware() {
  return (
    <svg width="40" height="60" viewBox="0 0 40 60" className="relative z-10" aria-hidden>
      <defs>
        <pattern id="ribbonStripes" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#0e00cdff" />
          <rect width="3.2" height="7" fill="#ffffff" opacity="0.22" />
        </pattern>
        <linearGradient id="metalGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#9CA3AF" />
        </linearGradient>
      </defs>

      {/* Ribbon */}
      <rect x="12" y="-4" width="16" height="34" rx="2" fill="url(#ribbonStripes)" />

      {/* Metal swivel ring */}
      <circle cx="20" cy="34" r="6" fill="none" stroke="url(#metalGradient)" strokeWidth="2.5" />

      {/* Badge clip clamping the card */}
      <path d="M11 39 L29 39 L26 52 L14 52 Z" fill="url(#metalGradient)" />
      <rect x="11" y="39" width="18" height="3" rx="1" fill="#8B92A0" />
      <rect x="16" y="43" width="8" height="1.5" rx="0.75" fill="#6B7280" opacity="0.5" />
    </svg>
  );
}

function NametagCard({ member, idx }: { member: (typeof teamMembers)[number]; idx: number }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragRotate = useTransform(x, [-60, 60], [-16, 16]);

  // --- 3D tilt tracking ---
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 180, damping: 18, mass: 0.6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 180, damping: 18, mass: 0.6 });

  // Glare position follows the pointer, 0-100%
  const rawGlareX = useMotionValue(50);
  const rawGlareY = useMotionValue(50);
  const glareX = useSpring(rawGlareX, { stiffness: 180, damping: 20 });
  const glareY = useSpring(rawGlareY, { stiffness: 180, damping: 20 });
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)`;

  // Dynamic shadow that leans opposite the tilt
  const shadowX = useTransform(rotateY, (v) => v * -1.2);
  const shadowY = useTransform(rotateX, (v) => v * 1.2 + 14);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 28px rgba(15, 23, 42, 0.22)`;

  const isDragging = useRef(false);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rawRotateY.set((px - 0.5) * 26);
    rawRotateX.set((0.5 - py) * 22);
    rawGlareX.set(px * 100);
    rawGlareY.set(py * 100);
  };

  const resetTilt = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawGlareX.set(50);
    rawGlareY.set(50);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    animate(x, 0, { type: "spring", stiffness: 260, damping: 13 });
    animate(y, 0, { type: "spring", stiffness: 260, damping: 13 });
    resetTilt();
  };

  return (
    <motion.div
      className="team-card relative pt-8 flex flex-col items-center"
      style={{ transformOrigin: "top center", perspective: 1000 }}
      animate={reduceMotion ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
      transition={{ duration: 4 + (idx % 3) * 0.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <LanyardHardware />
      </div>

      {/* Draggable, 3D-tilting badge */}
      <motion.div
        drag={!reduceMotion}
        dragElastic={0.5}
        dragConstraints={{ top: -8, bottom: 26, left: -46, right: 46 }}
        dragTransition={{ bounceStiffness: 320, bounceDamping: 16 }}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={handleDragEnd}
        onMouseMove={handlePointerMove}
        onMouseLeave={resetTilt}
        style={{
          x,
          y,
          rotate: dragRotate,
          rotateX,
          rotateY,
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          boxShadow,
        }}
        whileHover={{ scale: 1.03 }}
        whileDrag={{ scale: 1.06 }}
        className="relative mt-3 glass rounded-3xl p-4 bg-white border border-navy-500/5 text-center cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* Photo "pops" forward in 3D space */}
        <div
          className="relative w-44 h-44 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-100 pointer-events-none"
          style={{ transform: "translateZ(45px)" }}
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            draggable={false}
            className="object-cover"
          />
        </div>

        <div style={{ transform: "translateZ(25px)" }}>
          <h4 className="text-sm font-bold text-navy-500">{member.name}</h4>
          <p className="text-xs text-navy-500/60">{member.role}</p>
          <span className="text-[10px] text-brand-500 font-bold uppercase">
            {member.division}
          </span>
        </div>

        {/* Moving glare / holographic sheen */}
        {!reduceMotion && (
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-overlay"
            style={{ background: glareBackground, transform: "translateZ(60px)" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

const CURSOR_SIZE = 60;

export default function TentangKamiPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [selectedProject, setSelectedProject] = useState<typeof portfolioItems[number] | null>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const reduceMotion = useReducedMotion();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorSpringX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const cursorSpringY = useSpring(cursorY, { stiffness: 300, damping: 28 });

  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left - CURSOR_SIZE / 2);
    cursorY.set(e.clientY - rect.top - CURSOR_SIZE / 2);
  };

  useEffect(() => {
    if (!selectedProject) {
      setCurrentImgIdx(0);
      return;
    }

    const projectImages = selectedProject.images && selectedProject.images.length > 0
      ? selectedProject.images
      : [selectedProject.image];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
      if (e.key === "ArrowLeft") {
        setCurrentImgIdx((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentImgIdx((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  useGSAP(() => {
    gsap.fromTo(".team-card", { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.6, stagger: 0.12,
      scrollTrigger: { trigger: ".team-grid", start: "top 80%" },
    });
    gsap.fromTo(".value-card", { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.5, stagger: 0.1,
      scrollTrigger: { trigger: ".values-grid", start: "top 80%" },
    });
  }, { scope: containerRef });

  const filteredPortfolio = activeFilter === "semua"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <div ref={containerRef} className="pt-28 pb-20 bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <section className="relative z-10 section-container text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 glass border border-brand-500/10 text-brand-500"
        >
          Profil Kami
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-500 mb-6"
        >
          Mengenal <span className="text-gradient">Insta Pro Solution</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-navy-500/70 max-w-2xl mx-auto font-medium"
        >
          Mitra strategis pendampingan sistem digital dan peningkatan kapasitas SDM yang kredibel untuk instansi pemerintah, organisasi, dan desa.
        </motion.p>
      </section>

      {/* Section Profil */}
      <section className="relative z-10 section-container mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-navy-500 mb-6">Membangun Ekosistem Kredibel</h2>
            <div className="space-y-4 text-navy-500/70 leading-relaxed text-sm font-medium">
              <p>
                <strong className="text-navy-500 font-bold">PT Insta Pro Solution</strong> adalah perusahaan teknologi berbadan hukum Perseroan Terbatas (PT) yang bergerak di bidang pengembangan sistem dan solusi digital untuk mendukung peningkatan kualitas tata kelola institusi, organisasi, dan sektor usaha di Indonesia.

Kami berkomitmen menghadirkan sistem yang terintegrasi, akuntabel, dan berbasis data guna meningkatkan efisiensi operasional, transparansi administrasi, serta mendukung pengambilan keputusan yang lebih efektif melalui pemanfaatan teknologi digital.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-navy-500/5 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="text-brand-500" size={24} />
              <h3 className="text-xl font-bold text-navy-500">Informasi Resmi</h3>
            </div>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between border-b border-navy-500/5 pb-3">
                <span className="text-navy-500/50">Bentuk Usaha</span>
                <span className="text-navy-500 font-bold">Perseroan Terbatas (PT)</span>
              </div>
              <div className="flex justify-between border-b border-navy-500/5 pb-3">
                <span className="text-navy-500/50">Nama Resmi</span>
                <span className="text-navy-500 font-bold">PT. Insta Pro Solution</span>
              </div>
              <div className="flex justify-between border-b border-navy-500/5 pb-3">
                <span className="text-navy-500/50">Kantor Pusat</span>
                <span className="text-navy-500 font-bold text-right">Jl. Duyung No. 100 D, Pekanbaru</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-navy-500/50">Layanan Inti</span>
                <span className="text-brand-500 font-bold text-right">Tata Kelola, IT, & SDM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="relative z-10 section-container mb-24">
        <SectionHeading badge="Arah & Fokus" title="Visi & Misi Instapro" />
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-navy-500/5 bg-white"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50/50 flex items-center justify-center text-brand-500 mb-6">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy-500 mb-3">Visi Kami</h3>
            <p className="text-navy-500/70 text-sm leading-relaxed font-medium">
             Menjadi pionir global dalam menciptakan ekosistem kerja yang cerdas, adaptif, dan berkelanjutan melalui integrasi kecerdasan manusia dan teknologi
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 border border-navy-500/5 bg-white"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50/50 flex items-center justify-center text-brand-500 mb-6">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy-500 mb-3">Layanan</h3>
            <ul className="space-y-3 text-navy-500/70 text-sm font-medium">
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>UI UX Design
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>Website Development
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>Marketing
              </li>
               <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>Social Media
              </li>
                <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>eCommerce Store
                </li>
                <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>Tech Support
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>Capacity Building
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 border border-navy-500/5 bg-white"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50/50 flex items-center justify-center text-brand-500 mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy-500 mb-3">Misi Kami</h3>
            <ul className="space-y-3 text-navy-500/70 text-sm font-medium">
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>
               Menyediakan aplikasi berbasis web dan/atau mobile sesuai kebutuhan pelanggan
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>
               Menyediakan platform teknologi yang efisien dan transparan
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>
               Menyediakan kebutuhan software berbasis teknologi terbaru
              </li>
               <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>
               Menyebutkan kurikulum berbasis data untuk meningkatkan kompetensi tenaga kerja
              </li>
                <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>
               Membantu organisasi melakukan transformasi digital secara organis dan humanis
                </li>
                <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">&#8226;</span>
               Peningkatan Kompetensi Organisasi Sumber Daya Manusia (SDM).
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Nilai Perusahaan (Large Typography) */}
      <section className="relative z-10 section-container mb-24">
        <SectionHeading badge="Nilai Utama" title="Prinsip Kerja Instapro" />
        <div className="values-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {values.map((val, idx) => (
            <div
              key={idx}
              className="value-card glass rounded-2xl p-6 bg-white border border-navy-500/5 card-hover text-left flex flex-col justify-between min-h-[200px]"
            >
              <div className="text-4xl font-extrabold text-brand-500/20 font-mono mb-4">{val.number}</div>
              <div>
                <h4 className="text-lg font-extrabold text-navy-500 mb-2 uppercase tracking-wide">
                  {val.title}
                </h4>
                <p className="text-navy-500/70 text-xs font-semibold leading-relaxed">
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Grid with Filtering */}
      <section className="relative z-10 section-container mb-24">
        <SectionHeading badge="Portofolio" title="Rekam Jejak Hasil Kerja"  subtitle="Beberapa proyek yang telah kami kerjakan meliputi pengembangan website, sistem digital, serta pelatihan dan pendampingan peningkatan kapasitas SDM untuk membantu organisasi dan bisnis beradaptasi serta berkembang di era transformasi digital."/>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 mb-12">
          {["semua", "institusi", "desa"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === category
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-white border border-navy-100 text-navy-500/70 hover:bg-navy-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid items */}
        <div className="relative" onMouseMove={handleGridMouseMove}>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredPortfolio.map((item, idx) => {
              const isDimmed = hoveredIdx !== null && hoveredIdx !== idx;
              return (
                <motion.div
                  key={idx}
                  layout
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setSelectedProject(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedProject(item);
                  }}
                  animate={{ opacity: isDimmed ? 0.5 : 1, scale: isDimmed ? 0.97 : 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer border border-navy-500/10 bg-white hover:border-brand-500/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* LOGO AREA — aspect ratio different from home page (4/3 instead of 1/1) */}
                  <div className="relative aspect-[4/3] bg-blush-50/40 flex items-center justify-center p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-dots opacity-[0.07]" />
                    <div className="relative w-[65%] h-[65%] z-10">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Index number */}
                    <span className="absolute top-3 left-3 text-navy-500/30 text-[10px] font-mono font-bold tracking-widest z-10">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {/* Arrow badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-300 z-10"
                    >
                      <ArrowRight size={13} />
                    </motion.div>

                    {/* Border glow on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-brand-500/20 transition-all duration-300" />
                  </div>

                  {/* TEXT CONTENT — below the logo box, not overlaid */}
                  <div className="p-5 border-t border-navy-500/5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-brand-500 text-[9px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-navy-500 font-extrabold text-sm leading-snug mt-1 mb-1 group-hover:text-brand-500 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-navy-500/60 text-[11px] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-[10px] text-navy-500/40 font-mono font-bold mt-4 block">{item.year}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Follow cursor tooltip */}
          {!reduceMotion && (
            <motion.div
              style={{ x: cursorSpringX, y: cursorSpringY, width: CURSOR_SIZE, height: CURSOR_SIZE }}
              animate={{ opacity: hoveredIdx !== null ? 1 : 0, scale: hoveredIdx !== null ? 1 : 0.4 }}
              transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.25 } }}
              className="hidden md:flex pointer-events-none absolute top-0 left-0 z-20 rounded-full bg-brand-500 text-white text-[10px] font-bold uppercase items-center justify-center tracking-wider"
            >
              Lihat
            </motion.div>
          )}
        </div>
      </section>

      {/* Perizinan & Legalitas */}
      <section className="relative z-10 section-container mb-24">
        <div className="glass rounded-3xl p-8 md:p-12 border border-brand-500/10 bg-white/95">
          <SectionHeading
            badge="Kepatuhan"
            title="Legalitas & Perizinan Negara"
            subtitle="PT Insta Pro Solution mematuhi seluruh perizinan berusaha kementerian terkait."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-8">
            {licenses.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl p-5 border border-navy-500/5 bg-blush-50/20 text-center flex flex-col justify-center"
              >
                <FileCheck size={20} className="text-brand-500 mx-auto mb-2" />
                <p className="text-navy-500/40 text-[10px] font-bold uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-navy-500 font-bold text-xs break-all">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tim / Struktur Organisasi */}
      <section className="relative z-10 section-container mb-24">
        <SectionHeading
          badge="Tim Kepemimpinan"
          title="Meet Our Leadership"
          subtitle="Transformasi digital bukan hanya tentang teknologi.
Ini tentang sistem yang tepat dan SDM yang siap mengelolanya.

Kami hadir untuk membangun keduanya."
        />

        <div className="team-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7 mt-16">
          {teamMembers.map((member, idx) => (
            <NametagCard key={idx} member={member} idx={idx} />
          ))}
        </div>
      </section>

      {/* Modal Detail Portfolio */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/40 backdrop-blur-md cursor-pointer overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white border border-navy-500/5 shadow-2xl cursor-default my-auto"
            >
              {(() => {
                const gallery = selectedProject.images && selectedProject.images.length > 0
                  ? selectedProject.images
                  : [selectedProject.image];
                const activeImg = gallery[currentImgIdx] || selectedProject.image;

                return (
                  <>
                    {/* Top Banner / Image Carousel */}
                    <div className="relative aspect-[16/9] sm:aspect-[16/8] bg-blush-50/40 flex items-center justify-center p-6 border-b border-navy-500/5 shrink-0 group">
                      <div className="absolute inset-0 bg-dots opacity-[0.07]" />
                      <div className="relative w-[60%] h-[60%]">
                        <Image
                          key={currentImgIdx}
                          src={activeImg}
                          alt={`${selectedProject.title} ${currentImgIdx + 1}`}
                          fill
                          className="object-contain transition-all duration-300"
                        />
                      </div>

                      <span className="absolute top-4 left-4 text-[10px] text-white bg-brand-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest z-10">
                        {selectedProject.category}
                      </span>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-navy-900/10 text-navy-900/60 hover:bg-navy-900/20 flex items-center justify-center transition-colors z-10 cursor-pointer"
                      >
                        <X size={16} />
                      </button>

                      {/* Navigation Arrows for Slider */}
                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImgIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-navy-900 shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                            title="Foto Sebelumnya"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            onClick={() => setCurrentImgIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-navy-900 shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                            title="Foto Berikutnya"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Selector Bar (Support hingga 5 Gambar) */}
                    {gallery.length > 1 && (
                      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border-b border-navy-500/5">
                        {gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImgIdx(idx)}
                            className={`relative w-12 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                              currentImgIdx === idx
                                ? "border-brand-500 scale-105 shadow-sm"
                                : "border-slate-200 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Content Section (Scrollable if tall) */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-navy-500 leading-snug">{selectedProject.title}</h3>
                  <span className="px-2.5 py-1 rounded-lg bg-navy-50 text-navy-500/60 font-mono text-xs font-bold shrink-0">
                    {selectedProject.year}
                  </span>
                </div>
                
                <p className="text-navy-500/70 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                  {selectedProject.desc}
                </p>

                <div className="space-y-4 border-t border-navy-500/5 pt-4">
                  <div>
                    <h5 className="text-[10px] text-navy-500/40 font-bold uppercase tracking-wider mb-1">Status Proyek</h5>
                    <p className="text-xs text-navy-500 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {selectedProject.status || "Selesai & Serah Terima"}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="btn-primary px-6 py-2.5 text-xs font-bold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-sm cursor-pointer"
                  >
                    Tutup Detail
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}