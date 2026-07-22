"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Users,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const benefits = [
  { icon: <BookOpen className="text-brand-500" size={24} />, title: "Materi Terstruktur", desc: "Materi disusun secara sistematis mulai dari dasar hingga tingkat lanjut." },
  { icon: <Award className="text-brand-500" size={24} />, title: "Sertifikat Resmi", desc: "Sertifikat kelulusan resmi dari PT Insta Pro Solution untuk karir Anda." },
  { icon: <Users className="text-brand-500" size={24} />, title: "Mentoring Eksklusif", desc: "Bimbingan langsung oleh praktisi industri berpengalaman." },
  { icon: <ShieldCheck className="text-brand-500" size={24} />, title: "Dukungan Teknis", desc: "Konsultasi gratis pasca pelatihan selama periode tertentu." },
];

const schedules = [
  { day: "Sabtu - Minggu", time: "09:00 - 16:00 WIB", topic: "Intensive Boot Camp" },
  { day: "Setiap Bulan", time: "Sesuai Jadwal Rilis", topic: "Batch Baru Dibuka" },
  { day: "Online / Offline", time: "Fleksibel / On-site", topic: "Lokasi Menyesuaikan" },
];

export default function KelasQuantumPage() {
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
          {/* Smooth Attention Drawing Pulse Animation on Button */}
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <Link href="https://quantumclass.instapro.kelompok-6.site/" className="btn-primary px-8 py-4 text-xs font-bold shadow-md">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Program Description */}
      <section className="relative z-10 section-container mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-navy-500 mb-6">Apa itu Kelas Quantum?</h2>
            <div className="space-y-4 text-navy-500/70 text-sm font-medium leading-relaxed">
              <p>
                Kelas Quantum adalah program akselerasi kompetensi digital yang diinisiasi oleh PT Insta Pro Solution. Program ini dirancang khusus untuk menjembatani kesenjangan keterampilan digital di instansi pemerintahan, korporasi, institusi pendidikan, dan UMKM.
              </p>
              <p>
                Kami menggabungkan penyampaian teori praktis dengan studi kasus nyata untuk memastikan bahwa setiap materi yang dipelajari dapat langsung diimplementasikan dalam pekerjaan sehari-hari.
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
                UI/UX Design & Prototyping
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                Web & System Development (No-Code & Custom)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                Social Media Strategy & Content Creator
              </li>
            </ul>
          </motion.div>
        </div>
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
            <Link href="https://quantumclass.instapro.kelompok-6.site/" className="btn-primary px-8 py-4 text-xs font-bold">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
