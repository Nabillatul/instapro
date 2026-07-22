"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { getWhatsAppLink } from "@/lib/utils";
import { services } from "@/lib/services";
import LaptopDesignIcon from "@/components/ui/LaptopDesignIcon";
import {
  Palette,
  Code2,
  TrendingUp,
  Cpu,
  GraduationCap,
  MessageCircle,
  ArrowRight,
  Star,
} from "lucide-react";


const iconMap: Record<string, React.ReactNode> = {
  LaptopDesignIcon: <LaptopDesignIcon size={20} />,
  Code2: <Code2 size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  Cpu: <Cpu size={20} />,
  GraduationCap: <GraduationCap size={20} />,
};

const stages = [
  { step: "01", name: "Inisiasi & Analisis", desc: "Menganalisis kebutuhan birokrasi, regulasi, dan kesiapan organisasi." },
  { step: "02", name: "Desain Sistem & Prototipe", desc: "Merancang wireframe, alur tata kelola data, dan antarmuka sistem." },
  { step: "03", name: "Pengembangan Sistem", desc: "Coding sistem terintegrasi dengan standar keamanan data instansi." },
  { step: "04", name: "Pelatihan & Pendampingan SDM", desc: "Melatih operator dan staf daerah agar terbiasa mengoperasikan sistem." },
  { step: "05", name: "Evaluasi & Serah Terima", desc: "Pengujian akhir, migrasi data penuh, dan serah terima resmi." },
];

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const stageVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};



export default function LayananPage() {
  const [activeId, setActiveId] = useState<string>(services[0]?.id ?? "");
  const active = services.find((s) => s.id === activeId) ?? services[0];

  // Magnetic hover effect for the primary CTA
  const reduceMotion = useReducedMotion();
  const ctaX = useMotionValue(0);
  const ctaY = useMotionValue(0);
  const ctaSpringX = useSpring(ctaX, { stiffness: 150, damping: 14, mass: 0.3 });
  const ctaSpringY = useSpring(ctaY, { stiffness: 150, damping: 14, mass: 0.3 });

  const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    ctaX.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    ctaY.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };
  const handleCtaLeave = () => {
    ctaX.set(0);
    ctaY.set(0);
  };

  return (
    <div className="pt-28 pb-20 bg-blush bg-nodes relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      {/* Ambient floating accents */}
      <motion.div
        aria-hidden
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"
        animate={reduceMotion ? undefined : { y: [0, 25, 0], x: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-navy-500/[0.06] blur-3xl pointer-events-none"
        animate={reduceMotion ? undefined : { y: [0, -30, 0], x: [0, -14, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <section className="relative z-10 section-container text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 glass border border-brand-500/10 text-brand-500"
        >
          Program Layanan
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-500 mb-6"
        >
          <span className="text-gradient">Services</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-navy-500/70 max-w-2xl mx-auto font-medium"
        >
          Kami menyediakan berbagai layanan pengembangan teknologi digital, mulai dari pembuatan website, pengembangan sistem informasi, hingga pelatihan dan pendampingan peningkatan kapasitas SDM untuk membantu organisasi dan bisnis berkembang di era digital.
        </motion.p>
      </section>

      {/* Interactive Services: tab list + detail panel */}
      <section className="relative z-10 section-container mb-24">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 max-w-5xl mx-auto items-start">
          {/* Tab list */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl border border-navy-500/5 bg-white/60 p-2 md:sticky md:top-28 space-y-1"
          >
            {services.map((service) => {
              const isActive = service.id === active.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveId(service.id)}
                  className={`relative w-full text-left p-3.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive ? "text-navy-500" : "text-navy-500/50 hover:text-navy-500/80"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeServiceTab"
                      className="absolute inset-0 bg-white rounded-xl border border-brand-500/15 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      isActive ? "bg-brand-500 text-white" : "bg-brand-50/60 text-brand-500"
                    }`}
                  >
                    {iconMap[service.icon]}
                  </span>
                  <span className="relative z-10 min-w-0">
                    <span className="block text-sm font-extrabold truncate">{service.title}</span>
                    <span className="block text-[11px] font-semibold opacity-70 truncate">
                      {service.shortDesc}
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Detail panel */}
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="glass rounded-2xl bg-white border border-navy-500/5 shadow-sm p-6 md:p-10 space-y-8"
                >
                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-bold text-navy-500/50 uppercase tracking-widest mb-2">
                      Deskripsi Program
                    </h4>
                    <h3 className="text-2xl font-extrabold text-navy-500 mb-3">{active.title}</h3>
                    <p className="text-navy-500/70 text-sm leading-relaxed font-semibold">
                      {active.longDesc}
                    </p>
                  </div>


                  {/* Case Study */}
                  {active.caseStudy && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.15 }}
                      className="p-6 rounded-2xl bg-blush-50/30 border border-brand-500/10"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Star size={16} className="text-brand-500" />
                        <span className="text-brand-500 text-xs font-extrabold uppercase tracking-wider">
                          Studi Kasus Sukses
                        </span>
                      </div>
                      <h5 className="text-navy-500 font-extrabold text-sm mb-1">
                        {active.caseStudy.title}
                      </h5>
                      <p className="text-navy-500/60 text-xs leading-relaxed font-medium">
                        {active.caseStudy.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Order & Consult Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-navy-500/5">
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={getWhatsAppLink(`Halo Instapro, saya ingin berkonsultasi mengenai jasa ${active.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs py-3 justify-center"
                    >
                      <MessageCircle size={16} />
                      Konsultasi WhatsApp
                    </motion.a>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/kontak"
                        className="btn-secondary text-xs py-3 justify-center border-navy-500/10 text-navy-500 hover:bg-navy-50 w-full"
                      >
                        Kirim Form Penawaran
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Work Process — animated timeline stepper */}
      <section className="relative z-10 section-container mb-24">
        <div className="glass rounded-3xl p-8 md:p-12 border border-brand-500/10 bg-white/95 text-center">
          <SectionHeading
            badge="Metodologi Kerja"
            title="Tahapan Pendampingan & Pembuatan Sistem"
            subtitle="Kami bekerja secara sistematis untuk memastikan proyek berjalan lancar dari konsepsi hingga operasional mandiri."
          />

          <div className="relative mt-16">
            {/* base line */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-navy-500/10" />
            {/* animated fill line */}
            <motion.div
              className="hidden md:block absolute top-6 left-[10%] h-[2px] bg-brand-500 origin-left"
              style={{ width: "80%" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.3, ease: "easeInOut", delay: 0.2 }}
            />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6 relative"
              variants={containerStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {stages.map((stage, idx) => (
                <motion.div
                  key={idx}
                  variants={stageVariant}
                  className="relative flex flex-col items-center md:items-start text-center md:text-left"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-brand-500 text-brand-500 font-extrabold font-mono text-sm flex items-center justify-center mb-4 shadow-sm"
                  >
                    {stage.step}
                  </motion.div>
                  <h4 className="text-navy-500 font-extrabold text-sm mb-2">{stage.name}</h4>
                  <p className="text-navy-500/60 text-xs leading-relaxed font-semibold">
                    {stage.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 section-container"
      >
        <div className="glass rounded-3xl p-10 md:p-16 border border-brand-500/10 bg-white/90 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy-500 mb-3">
            Butuh Paket Solusi Custom?
          </h2>
          <p className="text-navy-500/70 mb-8 max-w-lg mx-auto text-sm font-semibold">
            Mari rumuskan sistem digitalisasi administrasi yang disesuaikan dengan struktur birokrasi dan kapasitas anggaran daerah Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              style={{ x: ctaSpringX, y: ctaSpringY }}
              onMouseMove={handleCtaMove}
              onMouseLeave={handleCtaLeave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              href={getWhatsAppLink("Halo Instapro, saya butuh solusi sistem kustom.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3"
            >
              <MessageCircle size={18} /> Hubungi WhatsApp
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link href="/katalog" className="btn-secondary px-8 py-3 border-navy-500/10 text-navy-500 hover:bg-navy-50">
                Lihat Katalog Layanan <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}