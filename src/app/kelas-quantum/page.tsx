"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Users,
  Quote,
  Sparkles,
  X,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";

interface Coach {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  skills: string[];
}

const benefits = [
  { icon: <BookOpen className="text-brand-500" size={24} />, title: "Materi Terstruktur", desc: "Materi disusun secara sistematis mulai dari dasar hingga tingkat lanjut." },
  { icon: <Award className="text-brand-500" size={24} />, title: "Sertifikat Resmi", desc: "Sertifikat kelulusan resmi dari PT Insta Pro Solution untuk karir Anda." },
  { icon: <Users className="text-brand-500" size={24} />, title: "Mentoring Eksklusif", desc: "Bimbingan langsung oleh praktisi industri berpengalaman." },
  { icon: <ShieldCheck className="text-brand-500" size={24} />, title: "Dukungan Teknis", desc: "Konsultasi gratis pasca pelatihan selama periode tertentu." },
];

const fallbackCoach: Coach = {
  id: "fallback",
  name: "Setyo Irawan, S.IP",
  title: "Head Coach & Institutional Strategy",
  bio: "Pakar tata kelola birokrasi, strategi transformasi digital, dan pendampingan peningkatan kapasitas SDM institusi, korporasi, serta desa dengan pengalaman lebih dari 10 tahun.",
  image: "/images/Setyo Irawan, S.IP.jpg",
  skills: ["Transformasi Digital", "Tata Kelola Daerah", "Public Policy", "SDM Leadership"],
};

const schedules = [
  { day: "Sabtu - Minggu", time: "09:00 - 16:00 WIB", topic: "Intensive Boot Camp" },
  { day: "Setiap Bulan", time: "Sesuai Jadwal Rilis", topic: "Batch Baru Dibuka" },
  { day: "Online / Offline", time: "Fleksibel / On-site", topic: "Lokasi Menyesuaikan" },
];

export default function KelasQuantumPage() {
  const [photos, setPhotos] = useState<ClassPhoto[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedPhoto, setSelectedPhoto] = useState<ClassPhoto | null>(null);

  // Auto-rotating photo gallery index
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    fetch("/api/kelas-photos")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.photos)) {
          setPhotos(data.photos);
        }
      })
      .catch((err) => console.error("Error loading photos:", err))
      .finally(() => setLoadingPhotos(false));

    fetch("/api/coaches")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.coaches) && data.coaches.length > 0) {
          setCoaches(data.coaches);
        }
      })
      .catch((err) => console.error("Error loading coaches:", err));
  }, []);

  const photoCategories = ["Semua", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];

  const filteredPhotos = photos.filter(
    (p) => activeCategory === "Semua" || p.category === activeCategory
  );

  // Auto-rotate photos every 3.5 seconds
  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % photos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [photos.length]);

  const handlePrevPhoto = () => {
    if (photos.length === 0) return;
    setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    if (photos.length === 0) return;
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const currentPhoto = photos[activePhotoIdx] || photos[0];
  const displayCoaches = coaches.length > 0 ? coaches : [fallbackCoach];

  return (
    <div className="pt-28 pb-20 bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      {/* Hero */}
      <section className="relative z-10 section-container text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 glass border border-brand-500/10 text-brand-500"
        >
          Pendidikan & Pelatihan
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-500 mb-6"
        >
          <span className="text-gradient">Instapro Learning Academy</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-navy-500/70 max-w-2xl mx-auto mb-8 font-medium"
        >
          Tingkatkan kompetensi digital tim organisasi dan aparat desa Anda dengan kurikulum intensif, terarah, dan dimentori langsung oleh ahli.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <Link
              href="https://quantumclass.instapro.kelompok-6.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 text-xs font-bold shadow-md"
            >
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Program Description */}
      <section className="relative z-10 section-container mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-navy-500 mb-6">Apa itu Kelas Instapro?</h2>
            <div className="space-y-4 text-navy-500/70 text-sm font-medium leading-relaxed">
              <p>
                Instapro Learning Academy (Kelas Instapro) adalah pusat pelatihan pengembangan SDM yang menghadirkan program pelatihan profesional, sertifikasi, in-house training, serta reguler untuk individu maupun organisasi.
              </p>
              <p>
                Kami menggabungkan penyampaian teori praktis dengan studi kasus nyata untuk memastikan bahwa setiap materi yang dipelajari dapat langsung diimplementasikan dalam tata kelola pekerjaan sehari-hari.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-navy-500/5 bg-white shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 rounded-bl-[100%]" />
            <h3 className="text-xl font-bold text-navy-500 mb-4 flex items-center gap-2 relative z-10">
              <GraduationCap className="text-brand-500" /> Kurikulum Utama
            </h3>
            <ul className="space-y-3 text-navy-500/70 text-xs font-bold relative z-10">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                Literasi & Keamanan Digital Dasar
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                UI/UX Design & Prototyping Sistem
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                Pengembangan Web & Tata Kelola Sistem Informasi
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                Social Media Strategy & Content Creator
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION COACH (DYNAMIC COACH LIST WITH 3D ANIMATED CARDS) ===== */}
      <section className="relative z-10 section-container mb-24 overflow-hidden">
        <SectionHeading
          badge="Head Coach & Mentor"
          title="Instruktur Utama Kelas"
          subtitle="Praktisi senior yang membimbing dan mengawal peningkatan kapasitas SDM Anda."
        />

        {/* Background Decorative */}
        <motion.div
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-brand-500/8 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-navy-500/5 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], x: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-4xl mx-auto mt-12 relative z-10 space-y-10">
          {displayCoaches.map((coach, cIdx) => (
            <motion.div
              key={coach.id || cIdx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl bg-white border border-navy-500/5 shadow-xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-[380px_1fr]">

                {/* LEFT — Photo Panel */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative bg-gradient-to-br from-navy-500 via-navy-600 to-navy-800 flex flex-col items-center justify-center p-10 min-h-[360px] overflow-hidden"
                >
                  {/* Animated background circles */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/5"
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/8"
                      animate={{ scale: [1.1, 1, 1.1], rotate: [360, 180, 0] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-brand-500/20 blur-xl" />
                    <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-brand-400/10 blur-xl" />
                  </motion.div>

                  {/* 3D-tilt Photo Frame */}
                  <motion.div
                    whileHover={{
                      rotateY: 8,
                      rotateX: -4,
                      scale: 1.04,
                      boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
                    }}
                    style={{ transformPerspective: 800 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative w-44 h-44 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl z-10"
                  >
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Shimmer overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>

                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    animate={{ y: [0, -5, 0] }}
                    className="absolute top-6 left-6 bg-brand-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1.5"
                  >
                    <Sparkles size={10} /> Lead Instructor
                  </motion.div>

                  {/* Name overlay at bottom */}
                  <div className="mt-6 text-center z-10 relative">
                    <h4 className="text-white font-extrabold text-lg leading-tight">{coach.name}</h4>
                    <p className="text-brand-300 text-xs font-bold mt-1">{coach.title}</p>
                  </div>
                </motion.div>

                {/* RIGHT — Description Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="p-8 md:p-10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-brand-500 text-xs font-extrabold uppercase tracking-wider mb-4">
                      <Quote size={16} />
                      <span>Tentang Coach</span>
                    </div>
                    <p className="text-navy-500/80 text-sm leading-relaxed font-medium mb-8">
                      {coach.bio}
                    </p>

                    {/* Skills with stagger */}
                    {coach.skills && coach.skills.length > 0 && (
                      <div>
                        <p className="text-[10px] font-extrabold text-navy-500/40 uppercase tracking-wider mb-3">Keahlian Utama</p>
                        <div className="flex flex-wrap gap-2">
                          {coach.skills.map((skill, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8, y: 8 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.35 + idx * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              whileHover={{ scale: 1.08, y: -2 }}
                              className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-50 to-blush-50 text-brand-600 text-xs font-bold border border-brand-500/15 shadow-sm cursor-default"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 pt-6 border-t border-navy-500/5 flex flex-col sm:flex-row gap-3"
                  >
                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      href="https://quantumclass.instapro.kelompok-6.site/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs py-3"
                    >
                      <GraduationCap size={16} /> Daftar Kelas Sekarang
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      href={getWhatsAppLink ? getWhatsAppLink(`Halo, saya ingin berkonsultasi mengenai pelatihan dengan Coach ${coach.name}.`) : "https://wa.me/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs py-3 border-navy-500/10 text-navy-500 hover:bg-navy-50"
                    >
                      <MessageCircle size={16} /> Tanya via WhatsApp
                    </motion.a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ===== SECTION GALERI KEGIATAN & TESTIMONI (3D ANIMATED CAROUSEL) ===== */}
      <section className="relative z-10 section-container mb-24 overflow-hidden">
        <SectionHeading
          badge="Dokumentasi & Testimoni"
          title="Galeri Aktivitas Berkelanjutan"
          subtitle="Foto-foto suasana pelatihan dan testimoni peserta yang berganti secara otomatis dengan animasi 3D."
        />

        {/* 3D Auto-Rotating Gallery Container */}
        {loadingPhotos ? (
          <div className="text-center py-16 text-navy-500/50 font-bold text-xs">Memuat foto kegiatan...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16 text-navy-500/40 font-bold text-xs">Belum ada foto kegiatan.</div>
        ) : (
          <div className="max-w-4xl mx-auto mt-10">
            {/* 3D Perspective Wrapper */}
            <div className="relative py-4" style={{ perspective: 1200 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto?.id || activePhotoIdx}
                  initial={{ opacity: 0, rotateY: 15, scale: 0.94, z: -100 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
                  exit={{ opacity: 0, rotateY: -15, scale: 0.94, z: -100 }}
                  transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  className="glass rounded-3xl bg-white overflow-hidden border border-navy-500/10 shadow-2xl group relative"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
                    {/* Photo area */}
                    <div className="md:col-span-7 aspect-[4/3] md:aspect-auto relative overflow-hidden bg-slate-900">
                      <motion.img
                        src={currentPhoto?.imageUrl}
                        alt={currentPhoto?.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent md:hidden" />
                      <span className="absolute top-4 left-4 bg-brand-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                        <Sparkles size={10} /> {currentPhoto?.category}
                      </span>
                      <button
                        onClick={() => setSelectedPhoto(currentPhoto)}
                        className="absolute bottom-4 right-4 bg-white/90 text-navy-500 p-2.5 rounded-full shadow-md hover:bg-white transition-all cursor-pointer z-10 hover:scale-110"
                        title="Perbesar Foto"
                      >
                        <Maximize2 size={16} />
                      </button>
                    </div>

                    {/* Testimonial & Details content */}
                    <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-white relative">
                      {/* Subtle background icon glow */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-[100%] pointer-events-none" />

                      <div>
                        <div className="flex items-center gap-2 text-brand-500 text-xs font-extrabold uppercase tracking-wider mb-3">
                          <Quote size={16} /> Testimoni Activity
                        </div>
                        <h3 className="text-navy-500 font-extrabold text-lg mb-3 leading-snug">
                          {currentPhoto?.title}
                        </h3>
                        {currentPhoto?.caption && (
                          <p className="text-navy-500/70 text-xs font-medium leading-relaxed italic mb-6">
                            &ldquo;{currentPhoto?.caption}&rdquo;
                          </p>
                        )}
                      </div>

                      {currentPhoto?.authorName && (
                        <div className="pt-4 border-t border-navy-500/5 mt-auto">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-md">
                              <UserCheck size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-navy-500 font-extrabold text-xs truncate">{currentPhoto.authorName}</p>
                              <p className="text-navy-500/50 text-[10px] font-semibold truncate">{currentPhoto.authorRole}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevPhoto}
                className="absolute -left-4 sm:left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-navy-500 shadow-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-30 border border-navy-500/5"
                title="Foto Sebelumnya"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute -right-4 sm:right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-navy-500 shadow-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-30 border border-navy-500/5"
                title="Foto Berikutnya"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Rotating Dot Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIdx(i)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    i === activePhotoIdx ? "w-8 h-2.5 bg-brand-500 shadow-xs" : "w-2.5 h-2.5 bg-navy-500/20 hover:bg-navy-500/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Thumbnail Scroll Strip with 3D hover */}
            <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-none justify-center">
              {photos.map((photo, i) => (
                <motion.button
                  key={photo.id}
                  onClick={() => setActivePhotoIdx(i)}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer shadow-sm ${
                    i === activePhotoIdx ? "border-brand-500 ring-2 ring-brand-500/30 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className="relative z-10 section-container mb-20">
        <SectionHeading badge="Keunggulan" title="Benefit Mengikuti Kelas" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="glass rounded-2xl bg-white border border-navy-500/5 p-6 card-hover shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-50/50 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h4 className="text-navy-500 font-extrabold text-sm mb-2">{benefit.title}</h4>
              <p className="text-navy-500/60 text-xs font-semibold leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className="relative z-10 section-container mb-20">
        <div className="glass rounded-3xl p-8 md:p-12 border border-brand-500/10 bg-white/95 text-center">
          <SectionHeading badge="Jadwal" title="Jadwal Pelaksanaan Umum" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 text-left">
            {schedules.map((schedule, idx) => (
              <div key={idx} className="rounded-xl border border-navy-500/5 bg-blush-50/20 p-6 text-center">
                <Calendar className="text-brand-500 mx-auto mb-3" size={24} />
                <h4 className="text-navy-500 font-extrabold text-sm mb-1">{schedule.topic}</h4>
                <p className="text-brand-500 font-bold text-xs mb-2">{schedule.day}</p>
                <p className="text-navy-500/50 text-[11px] font-bold uppercase">{schedule.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="relative z-10 section-container">
        <div className="glass rounded-3xl p-10 max-w-3xl mx-auto border border-brand-500/10 bg-white/90 text-center shadow-sm">
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy-500 mb-4">Mulai Perjalanan Digital Anda Sekarang</h2>
          <p className="text-navy-500/70 text-xs font-semibold mb-8 max-w-lg mx-auto">
            Segera daftarkan diri atau delegasikan tim organisasi Anda untuk mendapatkan slot kelas terdekat.
          </p>
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <Link
              href="https://quantumclass.instapro.kelompok-6.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 text-xs font-bold"
            >
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal Lightbox Photo Preview */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col sm:flex-row"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-navy-500 flex items-center justify-center hover:bg-white shadow-md z-20 cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Left: Photo — takes 55% width on desktop */}
              <div className="sm:w-[55%] aspect-[4/3] sm:aspect-auto bg-slate-950 relative overflow-hidden flex-shrink-0">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Info */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  <span className="text-brand-500 text-[10px] font-extrabold uppercase tracking-wider block mb-1">
                    {selectedPhoto.category}
                  </span>
                  <h3 className="text-navy-500 font-extrabold text-base sm:text-lg mb-2 leading-snug">
                    {selectedPhoto.title}
                  </h3>

                  {selectedPhoto.caption && (
                    <p className="text-navy-500/70 text-xs font-medium leading-relaxed italic">
                      &ldquo;{selectedPhoto.caption}&rdquo;
                    </p>
                  )}
                </div>

                {selectedPhoto.authorName && (
                  <div className="flex items-center gap-3 pt-4 mt-4 border-t border-navy-500/5">
                    <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <UserCheck size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-navy-500 font-extrabold text-xs truncate">{selectedPhoto.authorName}</p>
                      <p className="text-navy-500/50 text-[10px] font-semibold truncate">{selectedPhoto.authorRole}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
