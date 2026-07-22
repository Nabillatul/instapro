"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Palette,
  Code2,
  TrendingUp,
  Share2,
  ShoppingCart,
  GraduationCap,
  Users,
  FolderKanban,
  Award,
  Clock,
  ChevronRight,
  Sparkles,
  Quote,
  X,
  Cpu,
  Braces,
  GitGraphIcon,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { getWhatsAppLink } from "@/lib/utils";
import NodeNetwork from "@/components/ui/NodeNetwork";
import LaptopDesignIcon from "@/components/ui/LaptopDesignIcon";

const serviceIcons: Record<string, React.ReactNode> = {
  LaptopDesignIcon: <LaptopDesignIcon size={28} />,
  Code2: <Code2 size={28} />,
  TrendingUp: <TrendingUp size={28} />,
  Share2: <Share2 size={28} />,
  Braces: <Braces size={28} />,
  GraduationCap: <GraduationCap size={28} />,
};

const serviceCards = [
  { icon: "LaptopDesignIcon", title: "UI/UX System Design", desc: "Kami merancang desain website dan sistem digital yang modern, responsif, dan mudah digunakan untuk mendukung kebutuhan organisasi dan bisnis Anda.", color: "from-brand-500/10 to-brand-500/20" },
  { icon: "Code2", title: "Website & Mobile Development", desc: "Kami mengembangkan aplikasi, website, dan sistem informasi yang disesuaikan dengan kebutuhan organisasi agar proses kerja menjadi lebih efektif dan terintegrasi.", color: "from-navy-500/10 to-navy-500/20" },
  { icon: "TrendingUp", title: "Digital Strategy", desc: "Kami membantu meningkatkan visibilitas bisnis dan organisasi melalui strategi digital marketing yang tepat dan efektif di era digital.", color: "from-brand-500/10 to-brand-500/20" },
  { icon: "Braces", title: "Custom Software Development", desc: "Kami Menyediakan Layanan Pengembangan Aplikasi Berbasis Web,Mobile,Maupun Desktop Yang Dirancang Secara Khusus Sesuai Kebutuhan Bisnis Dan Kebutuhan Operasional Organiasi Anda.", color: "from-brand-500/10 to-brand-500/20" },
  { icon: "GraduationCap", title: "Instapro Learning Academy", desc: "Merupakan Unit Pelatihan Peningkatan Kualitas SDM Melalui Program Pelatihan,Sertifikasi,In-House,Reguler Serta Privat.Kami Menghadirkan Pembelajaran Yang Aplikatif, Interaktif Dan Dapat Disesuaikan Dengan Kebutuhan Industri.Dengan Dukungan Instruktur Yang Berpengalaman Dan Kurikulum Yang Terus Diperbarui Mengikuti Perkembangan Zaman.", color: "from-navy-500/10 to-navy-500/20" },
];

const stats = [
  { icon: <Users size={24} className="text-brand-500" />, value: 50, suffix: "+", label: "Instansi & Klien" },
  { icon: <FolderKanban size={24} className="text-brand-500" />, value: 120, suffix: "+", label: "Desa & Proyek Didampingi" },
  { icon: <Award size={24} className="text-brand-500" />, value: 3, suffix: "+", label: "Tahun Pengalaman" },
  { icon: <Clock size={24} className="text-brand-500" />, value: 24, suffix: "/7", label: "Dukungan Teknis" },
];

const portfolioItems = [
  {
    title: "SISTEM INFORMASI MANAJEMEN TANAH KAS DESA",
    category: "SIM-TKD",
    desc: "SIM-TKD Merupakan Sistem Digital Berbasis Web Untuk Mengelolah Keuangan Usaha Tanah Kas Desa,Meliputi Seluruh Transaksi Keuangan Pengelolahan Bukti Transaksi Monitoring Saldo Kas Serta Penyusunan Laporan Secara Otomatis Dan Terintegrasi.",
    image: "/images/logo simtkd 2.png",
  },
  {
    title: "PELAYANAN ELEKTRONIK TERPADU ADMINISTRASI DESA",
    category: "PELITA",
    desc: "PELITA Merupakan Sistem Pelayanan Administrasi Desa Berbasis Digital Guna Mempermudah Pelayanan Publik Kepada Masyarakat.Aplikasi Ini Terintegrasi Dengan TTE Dari Balai Sertifikasi Elektronik (BSrE).",
    image: "/images/logo pelita.png",
  },
  {
    title: "APLIKASI PENGELOLAAN KOPERASI DESA",
    category: "KOPDESIA",
    desc: "KOPDESIA Merupakan Aplikasi Yang Dirancang Untuk Membantu Mengurus Koperasi Mengelola Berbagai Data Koperasi,Seperti Data Anggota,Simpanan,Pinjaman,Serta Transaksi Koperasi Secara Lebih Terstruktur.Sistem Ini Dapat Menyusun Laporan,Monitoring Operasional Secara RealTIme.",
    image: "/images/logo kopdesia.png",
  },
  {
    title: "APLIKASI PENGOLAHAN BUMDES",
    category: "BUMDESIA",
    desc: "BUMDESIA Merupakan Sistem Digital Yang Dikembangkan Untuk Membantu Pengelolahan Bumdes Dalam Hal Mencatat Aktifitas Usaha,Mengelola Laporan Keuangan,Memantau Perkembangan Unit Usaha.",
    image: "/images/LOGO BUMDESIA.png",
  },
  {
    title: "SISTEM ABSENSI DIGITAL",
    category: "SIABDI",
    desc: "SIABDI Merupakan Sistem Absen Digital Yang Dirancang Untuk Membantu Instansi Atau Perusahaan Dalam Memonitor Kehadiran Karyawan.SIABDI Dilengkapi Dengan Sistem Pembatas Radius Lokasi,Absensi Menggunakan Perangkat Handphone Dengan Dukungan Kamera Dan GPS.",
    image: "/images/LOG SIABDI.png",
  },
  {
    title: "PROFESIONAL TRAINING CERTIFIED AND HUMAN DEVELOPMENT CENTER",
    category: "INSTAPRO LEARNING ACADEMY",
    desc: "Instapro Learning Academy merupakan pusat pelatihan pengembangan sumberdaya manusia yang menghadirkan program pelatihan profesional, sertifikasi, in-house trainig,serta reguler untuk individu maupun organisasi dengan pembekalan yang relevan dengan kebutuhan dunia kerja melalui pembelajaran yang praktis, interaktif, dan berorientasi pada hasil.",
    image: "/images/logo ILA 2.png",
  },


];

const testimonials = [
  {
    quote: "Kerja sama dengan Instapro Solution memberikan dampak nyata bagi transparansi dan efisiensi tata kelola di instansi kami. Sistem yang dibangun sangat user-friendly.",
    author: "Bapak Krido Kawal Basuki",
    role: "Kepala Desa Tambusai Kecamatan Rumbio Jaya Kabupaten Kampar",
  },
];

const carouselPhotos = [
  {
    src: "/images/gambarbg2.jpeg",
    alt: "Instapro Penyerahan Penghargaan",
    label: "Penyerahan Penghargaan",
    caption: "Diskusi Publik & Launching Produk Instapro",
  },
  {
    src: "/gambarbg.jpeg",
    alt: "Instapro Momen Launching",
    label: "Momen Launching",
    caption: '"Inovasi Lokal, Dampak Global & Digitalisasi Desa"',
  },
];

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const CURSOR_SIZE = 50;

/** 3D tilt card with a cursor-following spotlight highlight. Wraps card visuals only;
 *  scroll-entrance animation is handled by the outer GSAP-targeted wrapper. */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 8);
    rotateX.set((0.5 - py) * 8);
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.35), transparent 45%)",
        }}
      />
      {children}
    </motion.div>
  );
}

function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const total = carouselPhotos.length;

  const goTo = (index: number, dir: number) => {
    if (flipping) return;
    setDirection(dir);
    setFlipping(true);
    setTimeout(() => {
      setCurrent(index);
      setFlipping(false);
    }, 350);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % total, 1);
    }, 4500);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, flipping]);

  const photo = carouselPhotos[current];

  return (
    <div className="lg:col-span-5 flex justify-center items-center mt-6 lg:mt-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full max-w-[480px] lg:max-w-none"
        style={{ perspective: "1200px" }}
      >
        {/* Backlight glow */}
        <motion.div
          className="absolute -inset-2 bg-gradient-to-tr from-brand-500 to-brand-600 rounded-[32px] blur-2xl opacity-15 pointer-events-none"
          animate={{ opacity: [0.1, 0.22, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Book-flip card */}
        <div
          className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group"
          style={{
            transformStyle: "preserve-3d",
            animation: flipping
              ? `bookFlip${direction > 0 ? "Fwd" : "Bwd"} 0.7s cubic-bezier(0.4,0,0.2,1) forwards`
              : "none",
          }}
        >
          {/* Image */}
          <img
            key={current}
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-navy-950/85 via-navy-950/40 to-transparent pointer-events-none">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-brand-500 uppercase tracking-widest mb-1">
              <Award size={10} /> {photo.label}
            </div>
            <p className="text-[11px] text-white/90 font-semibold line-clamp-1">{photo.caption}</p>
          </div>

          {/* Dot nav */}
          <div className="absolute bottom-4 right-4 flex gap-1.5 pointer-events-auto">
            {carouselPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${i === current
                  ? "w-5 h-2 bg-brand-500"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
                  }`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Float Badge 1 — top-left */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-5 -left-5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border border-navy-500/10 items-center gap-2 hidden sm:flex z-10"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
            <Users size={14} />
          </div>
          <div>
            <div className="text-[7px] font-bold text-navy-500/40 uppercase tracking-wider">Kemitraan</div>
            <div className="text-[11px] font-extrabold text-navy-500">Desa & Instansi</div>
          </div>
        </motion.div>

        {/* Float Badge 2 — bottom-right */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-5 -right-5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border border-navy-500/10 items-center gap-2 hidden sm:flex z-10"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <div>
            <div className="text-[7px] font-bold text-navy-500/40 uppercase tracking-wider">Kapasitas</div>
            <div className="text-[11px] font-extrabold text-navy-500">Sertifikasi SDM</div>
          </div>
        </motion.div>

        {/* Keyframe animations injected via style tag */}
        <style>{`
          @keyframes bookFlipFwd {
            0%   { transform: rotateY(0deg) scale(1); }
            30%  { transform: rotateY(-25deg) scale(0.97); box-shadow: -12px 0 40px rgba(0,0,0,0.18); }
            70%  { transform: rotateY(15deg) scale(0.98); }
            100% { transform: rotateY(0deg) scale(1); }
          }
          @keyframes bookFlipBwd {
            0%   { transform: rotateY(0deg) scale(1); }
            30%  { transform: rotateY(25deg) scale(0.97); box-shadow: 12px 0 40px rgba(0,0,0,0.18); }
            70%  { transform: rotateY(-15deg) scale(0.98); }
            100% { transform: rotateY(0deg) scale(1); }
          }
        `}</style>
      </motion.div>
    </div>
  );
}

function PortfolioGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    (typeof portfolioItems)[number] | null
  >(null);
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

  // Esc untuk menutup modal + kunci scroll body selama modal terbuka,
  // supaya modal selalu pasti bisa ditutup dari 3 jalur (X, backdrop, Esc).
  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  return (
    <div className="relative" onMouseMove={handleGridMouseMove}>
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-8"
      >
        {portfolioItems.map((item, idx) => {
          const isDimmed = hoveredIdx !== null && hoveredIdx !== idx;
          return (
            <motion.div
              key={idx}
              variants={cardVariant}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedItem(item);
              }}
              animate={{ opacity: isDimmed ? 0.5 : 1, scale: isDimmed ? 0.97 : 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-xl overflow-hidden cursor-pointer border border-navy-500/10 bg-white hover:border-brand-500/30 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* LOGO AREA — image kept whole via object-contain, never cropped/stretched */}
              <div className="relative aspect-[1/1] bg-blush-50/40 flex items-center justify-center p-4 overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-[0.07]" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="relative z-10 max-w-[65%] max-h-[65%] w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-110"
                />

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
              <div className="p-4 border-t border-navy-500/5">
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
            </motion.div>
          );
        })}
      </motion.div>

      {/* Studio-style follow cursor */}
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

      {/* ===== MODAL / LIGHTBOX — versi ringkas, animasi spring, selalu bisa ditutup ===== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="portfolio-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              key="portfolio-modal-card"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xs bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Tutup"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-blush-50 flex items-center justify-center text-navy-500 shadow-md transition-colors"
              >
                <X size={16} />
              </button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.25 }}
                className="relative aspect-[4/3] bg-blush-50/40 flex items-center justify-center p-6"
              >
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-w-[60%] max-h-[60%] w-auto h-auto object-contain"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="p-5"
              >
                <span className="text-brand-500 text-[10px] font-bold uppercase tracking-wider">
                  {selectedItem.category}
                </span>
                <h3 className="text-navy-500 font-extrabold text-base mt-1 mb-2 leading-snug">
                  {selectedItem.title}
                </h3>
                <p className="text-navy-500/70 text-xs leading-relaxed">
                  {selectedItem.desc}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useReducedMotion();

  // Magnetic hover for primary CTAs
  const heroCtaX = useMotionValue(0);
  const heroCtaY = useMotionValue(0);
  const heroCtaSpringX = useSpring(heroCtaX, { stiffness: 150, damping: 14, mass: 0.3 });
  const heroCtaSpringY = useSpring(heroCtaY, { stiffness: 150, damping: 14, mass: 0.3 });

  const finalCtaX = useMotionValue(0);
  const finalCtaY = useMotionValue(0);
  const finalCtaSpringX = useSpring(finalCtaX, { stiffness: 150, damping: 14, mass: 0.3 });
  const finalCtaSpringY = useSpring(finalCtaY, { stiffness: 150, damping: 14, mass: 0.3 });

  const makeMagneticHandlers = (x: typeof heroCtaX, y: typeof heroCtaY) => ({
    onMouseMove: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    },
    onMouseLeave: () => {
      x.set(0);
      y.set(0);
    },
  });

  useGSAP(
    () => {
      // Services stagger animation
      gsap.fromTo(
        ".service-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: servicesRef.current, start: "top 80%" },
        }
      );

      // Stats slide animation
      gsap.fromTo(
        ".stat-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        }
      );
    }
  );

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh bg-nodes"
      >
        <div className="absolute inset-0 bg-dots opacity-40" />

        {/* Dynamic Connected Node Network (1 Momen Besar Hero) */}
        <NodeNetwork />

        {/* Content */}
        <div className="relative z-10 section-container w-full py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 16 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/10 text-brand-500 text-xs font-bold tracking-wider uppercase mb-6"
              >
                <Sparkles size={12} className="animate-spin-slow" />
                PT Insta Pro Solution
              </motion.div>

              {/* Curtain-reveal headline */}
              <div className="overflow-hidden mb-6">
                <motion.h1
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy-500 leading-tight"
                >
                  Mitra Strategis <br />
                  <span className="text-gradient">Digital Tranformation And Human Development </span> Center
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="text-base md:text-lg text-navy-500/70 max-w-2xl mb-8 leading-relaxed font-medium"
              >
                Kami membantu organisasi membangun sistem digital sekaligus meningkatkan kapasitas SDM agar siap menghadapi era transformasi digital.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <motion.a
                  style={{ x: heroCtaSpringX, y: heroCtaSpringY }}
                  {...makeMagneticHandlers(heroCtaX, heroCtaY)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  href={getWhatsAppLink("Halo Instapro, saya tertarik untuk melakukan Konsultasi Gratis mengenai program tata kelola.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-4 w-full sm:w-auto text-center"
                >
                  <MessageCircle size={20} />
                  Konsultasi Gratis
                </motion.a>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link
                    href="/layanan"
                    className="btn-secondary text-base px-8 py-4 w-full sm:w-auto font-bold border-navy-500/20 text-navy-500 justify-center"
                  >
                    Lihat Layanan
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            <PhotoCarousel />

          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex"
          >
            <div className="w-6 h-10 rounded-full border-2 border-navy-500/10 flex items-start justify-center p-1.5 bg-white/50">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-brand-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section ref={servicesRef} className="relative py-24 bg-white z-10">
        <div className="section-container">
          <SectionHeading
            badge="Layanan Utama"
            title="Bagaimana Kami Membantu Anda?"
            subtitle="Instapro Solution menghadirkan solusi teknologi serta pendampingan SDM untuk membantu organisasi beradaptasi dan berkembang di era digital."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {serviceCards.map((service, idx) => (
              <div key={idx} className="service-card h-full">
                <TiltCard className="group relative h-full rounded-2xl glass p-8 card-hover cursor-pointer border border-navy-500/5 bg-blush-50/20 hover:border-brand-500/20 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div
                    className={`relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-brand-500 mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}
                  >
                    {serviceIcons[service.icon]}
                  </div>

                  <h3 className="relative z-10 text-lg font-bold text-navy-500 mb-2 group-hover:text-brand-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="relative z-10 text-navy-500/70 text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  <Link
                    href="/layanan"
                    className="relative z-10 inline-flex items-center gap-1 text-brand-500 text-sm font-bold hover:gap-2 transition-all"
                  >
                    Pelajari Lebih Lanjut <ChevronRight size={14} />
                  </Link>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section ref={statsRef} className="relative py-24 bg-blush-50/50 border-y border-navy-500/5 z-10 bg-nodes">
        <div className="section-container">
          <SectionHeading
            badge="Pencapaian & Kredibilitas"
            title="Bukti Kepercayaan Mitra Kami"
            subtitle="Pengalaman mendampingi tata kelola administrasi digital di berbagai daerah secara konsisten."
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="text-center glass rounded-2xl p-8 border border-navy-500/5 bg-white/90 shadow-sm hover:shadow-lg hover:border-brand-500/20 transition-shadow duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-brand-50/50 mb-4"
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-extrabold text-navy-500 mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-navy-500/60 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO SECTION ===== */}
      <section className="relative py-24 bg-white z-10">
        <div className="section-container">
          <SectionHeading
            badge="Portofolio Terpilih"
            title="Proyek Unggulan Terkini"
            subtitle="Berikut adalah beberapa produk layanan kami yang sukses memberikan dampak positif langsung pada efektivitas sistem tata kelola serta peningkatan SDM."
          />

          <PortfolioGrid />

          <div className="text-center mt-12">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href="/tentang-kami"
                className="btn-secondary border-navy-500/20 text-navy-500 font-bold hover:bg-navy-50"
              >
                Lihat Seluruh Portofolio <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="relative py-24 bg-blush-50/30 border-t border-navy-500/5 z-10">
        <div className="section-container">
          <SectionHeading
            badge="Testimoni Mitra"
            title="Apa Kata Mereka?"
            subtitle="Tanggapan langsung dari para pejabat dinas dan kepala desa yang telah bermitra bersama Instapro."
          />

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
          >
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                variants={cardVariant}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="relative glass rounded-2xl p-8 border border-navy-500/5 bg-white overflow-hidden hover:shadow-lg hover:border-brand-500/15 transition-shadow duration-300 flex flex-col justify-between"
              >
                <Quote className="absolute -top-3 -right-1 text-brand-500/[0.06] pointer-events-none" size={110} strokeWidth={1.5} />
                <p className="relative z-10 text-navy-500/80 italic text-sm leading-relaxed mb-6">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="relative z-10">
                  <h4 className="text-navy-500 font-bold text-sm">{test.author}</h4>
                  <p className="text-brand-500 text-xs font-semibold">{test.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden z-10 bg-mesh bg-nodes">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto glass rounded-3xl p-10 md:p-16 border border-brand-500/10 bg-white/90"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-500 mb-4">
              Siap Mengoptimalkan Tata Kelola Sistem Anda?
            </h2>
            <p className="text-navy-500/70 mb-8 max-w-lg mx-auto font-medium">
              Konsultasikan kendala birokrasi, kapasitas SDM, atau kebutuhan sistem administrasi institusi Anda bersama pakar kami.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                style={{ x: finalCtaSpringX, y: finalCtaSpringY }}
                {...makeMagneticHandlers(finalCtaX, finalCtaY)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href={getWhatsAppLink("Halo Instapro, saya ingin berkonsultasi mengenai pembuatan sistem tata kelola.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 w-full sm:w-auto"
              >
                <Phone size={18} />
                Hubungi Kami Sekarang
              </motion.a>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link href="/kontak" className="btn-secondary border-navy-500/20 text-navy-500 font-bold hover:bg-navy-50 px-8 py-4 w-full sm:w-auto">
                  Request Quote
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}