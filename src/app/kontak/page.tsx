"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, MessageCircle, Send, Loader, CheckCircle2, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { getWhatsAppLink } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function KontakPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Gagal mengirim pesan, silakan hubungi kami langsung via WhatsApp.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pesan, silakan hubungi kami langsung via WhatsApp.");
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      label: "Kantor Pusat",
      value: "Jalan Duyung No. 100 D, Pekanbaru, Riau 28282 INDONESIA",
      href: null,
    },
    {
      icon: Mail,
      label: "Email Resmi",
      value: "info@instapro.co.id",
      href: "mailto:info@instapro.co.id",
    },
    {
      icon: Phone,
      label: "Telepon / WhatsApp",
      value: "+62 821-7710-106",
      href: "tel:+628217710106",
    },
  ];

  return (
    <div className="relative pt-28 pb-20 bg-blush bg-nodes overflow-hidden">
      {/* Decorative animated blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-brand-500/10 blur-3xl animate-pulse" />
      <div
        className="pointer-events-none absolute top-1/2 -left-32 w-[360px] h-[360px] rounded-full bg-navy-500/10 blur-3xl animate-pulse"
        style={{ animationDelay: "1.2s" }}
      />
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="section-container relative z-10">
        <SectionHeading
          badge="Hubungi Kami"
          title="Konsultasikan Kebutuhan Anda"
          subtitle="Diskusikan kebutuhan pendampingan tata kelola, sistem digital, atau pelatihan SDM bersama tim ahli Instapro Solution."
        />

        <div className="grid lg:grid-cols-5 gap-8 items-start mb-12 mt-10">
          {/* Contact Details */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-2 space-y-4"
          >
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-50/60 flex items-center justify-center text-brand-500 flex-shrink-0 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white group-hover:rotate-6 group-hover:scale-110">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-navy-500/50 text-[10px] font-bold uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-navy-500 text-xs font-semibold mt-0.5 leading-relaxed break-words">
                      {item.value}
                    </p>
                  </div>
                  {item.href && (
                    <ArrowUpRight
                      size={16}
                      className="ml-auto text-navy-500/20 flex-shrink-0 transition-all duration-300 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  )}
                </div>
              );

              const cardClass =
                "group glass rounded-2xl bg-white p-5 border border-navy-500/5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10 hover:border-brand-500/20 hover:-translate-y-0.5";

              return (
                <motion.div key={item.label} variants={fadeUp} custom={i}>
                  {item.href ? (
                    <a href={item.href} className={`block ${cardClass}`}>
                      {content}
                    </a>
                  ) : (
                    <div className={cardClass}>{content}</div>
                  )}
                </motion.div>
              );
            })}

            {/* Direct Link Options */}
            <motion.div
              variants={fadeUp}
              custom={contactItems.length}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <a
                href={getWhatsAppLink("Halo Instapro, saya ingin berkonsultasi tentang layanan pendampingan tata kelola.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 justify-center py-4 text-xs group"
              >
                <MessageCircle size={18} className="transition-transform duration-300 group-hover:scale-110" />
                Chat WhatsApp
              </a>
              <a href="tel:+628217710106" className="btn-secondary flex-1 justify-center py-4 text-xs group">
                <Phone size={18} className="transition-transform duration-300 group-hover:scale-110" />
                Telepon Langsung
              </a>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="relative glass rounded-3xl bg-white p-6 md:p-8 border border-navy-500/5 shadow-sm overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-brand-500/5 blur-2xl pointer-events-none" />

              <h3 className="text-navy-500 font-extrabold text-base mb-6 relative">Kirim Pesan Resmi</h3>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                  >
                    <CheckCircle2 size={48} className="text-brand-500 mx-auto" />
                  </motion.div>
                  <div>
                    <h4 className="text-navy-500 font-extrabold text-base">Pesan Berhasil Terkirim!</h4>
                    <p className="text-navy-500/60 text-xs font-semibold mt-1">
                      Tim kami akan segera merespon via email atau WhatsApp Anda.
                    </p>
                  </div>
                  <button onClick={() => setSuccess(false)} className="btn-secondary text-xs px-4 py-2">
                    Kirim Pesan Lain
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                          focusedField === "name" ? "text-brand-500" : "text-navy-500/50"
                        }`}
                      >
                        Nama / Instansi
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Nama lengkap atau instansi"
                        className="input-glass text-xs font-semibold transition-shadow duration-200 focus:shadow-md focus:shadow-brand-500/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                          focusedField === "email" ? "text-brand-500" : "text-navy-500/50"
                        }`}
                      >
                        Email Resmi
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Alamat Email"
                        className="input-glass text-xs font-semibold transition-shadow duration-200 focus:shadow-md focus:shadow-brand-500/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                        focusedField === "subject" ? "text-brand-500" : "text-navy-500/50"
                      }`}
                    >
                      Subjek / Topik
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Contoh: Permintaan Penawaran Sistem Desa"
                      className="input-glass text-xs font-semibold transition-shadow duration-200 focus:shadow-md focus:shadow-brand-500/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                        focusedField === "message" ? "text-brand-500" : "text-navy-500/50"
                      }`}
                    >
                      Pesan Anda
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tulis detail kebutuhan sistem, pendampingan, atau pelatihan SDM Anda..."
                      className="input-glass text-xs font-semibold transition-shadow duration-200 focus:shadow-md focus:shadow-brand-500/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-4 text-xs transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={16} /> Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Pesan <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Map Embed */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative glass rounded-3xl bg-white overflow-hidden aspect-[21/9] w-full border border-navy-500/5 shadow-sm group"
        >
          <iframe
            src="https://maps.google.com/maps?q=PT%20Insta%20Pro%20Solution%2C%20Jl.%20Duyung%20No.100d%2C%20Tangkerang%20Barat%2C%20Pekanbaru&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 grayscale-[15%] transition-all duration-500 group-hover:grayscale-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kantor PT Insta Pro Solution Pekanbaru"
          />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 glass bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 border border-navy-500/5 shadow-md flex items-center gap-3 pointer-events-none">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white flex-shrink-0">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-navy-500 text-xs font-extrabold leading-tight">Insta Pro Solution</p>
              <p className="text-navy-500/50 text-[10px] font-semibold">Pekanbaru, Riau</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}