"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
} from "framer-motion";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { getWhatsAppLink, formatRupiah } from "@/lib/utils";
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
  Search,
  Eye,
  X,
  CheckCircle2,
  Zap,
  Sparkles,
  PhoneCall,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  gallery: string[];
  category: string;
  features: string[];
  stock: number;
  featured: boolean;
}

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

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const whyUs = [
  { icon: <ShieldCheck size={22} />, title: "Terpercaya & Berlisensi", desc: "Sistem kami telah digunakan oleh instansi pemerintah dan korporasi di seluruh Indonesia." },
  { icon: <Zap size={22} />, title: "Implementasi Cepat", desc: "Proses onboarding dan serah terima sistem dilakukan dalam waktu efisien." },
  { icon: <BadgeCheck size={22} />, title: "Dukungan Purna Jual", desc: "Garansi pemeliharaan dan konsultasi teknis pasca proyek tanpa biaya tambahan." },
  { icon: <Sparkles size={22} />, title: "Inovasi Berkelanjutan", desc: "Teknologi kami selalu diperbarui sesuai tren dan kebutuhan era digital." },
];

export default function LayananPage() {
  const [activeId, setActiveId] = useState<string>(services[0]?.id ?? "");
  const active = services.find((s) => s.id === activeId) ?? services[0];

  // Catalog products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingProducts(false));
  }, []);

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Magnetic hover effect for CTA
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

  const whyRef = useRef(null);
  const whyInView = useInView(whyRef, { once: true, amount: 0.2 });

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
          Program & Katalog Layanan
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-500 mb-6"
        >
          Layanan & <span className="text-gradient">Katalog Sistem</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-navy-500/70 max-w-2xl mx-auto font-medium"
        >
          Kami menyediakan berbagai program layanan konsultasi digital, pengembangan sistem kustom, hingga katalog paket produk sistem informasi siap pakai untuk instansi dan bisnis Anda.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            href={getWhatsAppLink("Halo Instapro, saya ingin berkonsultasi mengenai layanan Instapro.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-8 py-3.5 shadow-lg shadow-brand-500/20"
          >
            <PhoneCall size={17} /> Konsultasi Gratis via WA
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            href="#katalog-produk"
            className="btn-secondary px-8 py-3.5 border-navy-500/10 text-navy-500 hover:bg-navy-50 inline-flex items-center gap-2"
          >
            Lihat Katalog Produk <ArrowRight size={17} />
          </motion.a>
        </motion.div>
      </section>

      {/* Why Us Strip */}
      <section ref={whyRef} className="relative z-10 section-container mb-24">
        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate={whyInView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {whyUs.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
              className="glass rounded-2xl bg-white border border-navy-500/5 p-6 flex flex-col gap-3 transition-shadow duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                {item.icon}
              </div>
              <h4 className="text-navy-500 font-extrabold text-sm">{item.title}</h4>
              <p className="text-navy-500/60 text-xs font-semibold leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Interactive Services: tab list + detail panel */}
      <section className="relative z-10 section-container mb-24">
        <SectionHeading badge="Program Kami" title="Layanan Unggulan Instapro" subtitle="Pilih program yang sesuai kebutuhan organisasi atau bisnis Anda." />
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 max-w-5xl mx-auto items-start mt-12">
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

                  {/* Order & Consult Actions — WA Only */}
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
                        href="/tentang-kami#kontak"
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

      {/* ===== KATALOG PRODUK & PENJUALAN SISTEM SECTION ===== */}
      <section id="katalog-produk" className="relative z-10 section-container mb-24">
        <SectionHeading
          badge="Katalog Paket Produk"
          title="Pilih Paket Sistem Informasi"
          subtitle="Jelajahi paket aplikasi dan sistem tata kelola digital. Hubungi kami via WhatsApp untuk mendapatkan penawaran terbaik."
        />

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-10 mb-8">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500/30" />
            <input
              type="text"
              placeholder="Cari nama sistem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-navy-100 text-navy-900 placeholder:text-navy-500/30 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm text-xs font-semibold"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-brand-500 text-white shadow-sm"
                    : "bg-white border border-navy-100 text-navy-500/70 hover:bg-navy-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loadingProducts ? (
          <div className="text-center py-16 text-navy-500/50 font-bold text-sm">
            Memuat Katalog Produk...
          </div>
        ) : (
          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                variants={cardVariant}
                whileHover={{ y: -8, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.12)" }}
                className="group glass rounded-3xl bg-white overflow-hidden flex flex-col border border-navy-500/5 shadow-sm transition-all duration-300 relative"
              >
                {/* Gradient accent top border */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl" />

                <div className="aspect-[16/10] bg-blush-50/40 relative overflow-hidden flex items-center justify-center p-6 border-b border-navy-500/5">
                  <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
                  <img
                    src={product.image || "/images/logo simtkd 2.png"}
                    alt={product.name}
                    className="max-w-[70%] max-h-[70%] w-auto h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-extrabold bg-navy-500 text-white uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-extrabold bg-brand-500 text-white uppercase tracking-wider flex items-center gap-1">
                      <Star size={9} /> Unggulan
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-navy-500 font-extrabold text-base mb-2 group-hover:text-brand-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-navy-500/60 text-xs font-semibold leading-relaxed line-clamp-3 mb-4">
                      {product.description}
                    </p>

                    {/* Features list bullet points */}
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-1.5 mb-6">
                        {product.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-navy-500/70">
                            <CheckCircle2 size={13} className="text-brand-500 flex-shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-navy-500/5 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] font-bold text-navy-500/40 uppercase block">Investasi Paket</span>
                      <span className="text-brand-500 font-extrabold text-base">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2.5 rounded-xl border border-navy-100 bg-white text-navy-500/70 hover:text-brand-500 hover:bg-navy-50 transition-all cursor-pointer"
                        title="Detail Produk"
                      >
                        <Eye size={16} />
                      </button>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        href={getWhatsAppLink(`Halo Instapro, saya tertarik dengan paket *${product.name}* seharga ${formatRupiah(product.price)}. Mohon info lebih lanjut.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-600 transition-all cursor-pointer shadow-sm"
                      >
                        <MessageCircle size={14} /> Pesan WA
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
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
        <div className="relative overflow-hidden glass rounded-3xl p-10 md:p-16 border border-brand-500/10 bg-gradient-to-br from-white via-blush-50/60 to-brand-50/30 text-center max-w-3xl mx-auto">
          {/* Decorative orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-navy-500/5 blur-2xl pointer-events-none" />
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy-500 mb-3 relative z-10">
            Butuh Paket Solusi Custom?
          </h2>
          <p className="text-navy-500/70 mb-8 max-w-lg mx-auto text-sm font-semibold relative z-10">
            Mari rumuskan sistem digitalisasi administrasi yang disesuaikan dengan struktur birokrasi dan kapasitas anggaran daerah Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <motion.a
              style={{ x: ctaSpringX, y: ctaSpringY }}
              onMouseMove={handleCtaMove}
              onMouseLeave={handleCtaLeave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              href={getWhatsAppLink("Halo Instapro, saya butuh solusi sistem kustom.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3.5 shadow-lg shadow-brand-500/20"
            >
              <MessageCircle size={18} /> Hubungi WhatsApp
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <a href="#katalog-produk" className="btn-secondary px-8 py-3.5 border-navy-500/10 text-navy-500 hover:bg-navy-50 inline-flex items-center gap-2">
                Lihat Katalog Paket <ArrowRight size={18} />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== MODAL DETAIL PRODUK ===== */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/65 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-navy-500 flex items-center justify-center hover:bg-white shadow-md z-20 cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Left: Product Image */}
              <div className="sm:w-[45%] aspect-square sm:aspect-auto bg-blush-50/40 flex items-center justify-center p-8 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-navy-500/5">
                <img
                  src={selectedProduct.image || "/images/logo simtkd 2.png"}
                  alt={selectedProduct.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Right: Info */}
              <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  <span className="text-brand-500 text-[10px] font-extrabold uppercase tracking-wider block mb-1">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-navy-500 font-extrabold text-lg mb-2 leading-snug">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-navy-500/70 text-xs font-semibold leading-relaxed mb-4">
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="space-y-1.5 bg-navy-50/50 p-4 rounded-xl">
                      <span className="text-[10px] font-extrabold text-navy-500 uppercase tracking-wider block mb-2">Fitur Unggulan:</span>
                      {selectedProduct.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-navy-500/80">
                          <CheckCircle2 size={13} className="text-brand-500 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-navy-500/5 mt-4">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-navy-500/40 uppercase block">Harga Paket</span>
                    <span className="text-brand-500 font-extrabold text-xl">
                      {formatRupiah(selectedProduct.price)}
                    </span>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={getWhatsAppLink(`Halo Instapro, saya berminat dengan paket *${selectedProduct.name}* seharga ${formatRupiah(selectedProduct.price)}. Mohon info lebih lanjut mengenai spesifikasi dan cara pemesanan.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center py-3.5 text-xs"
                  >
                    <MessageCircle size={16} /> Pesan via WhatsApp
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}