"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, MessageCircle, Send, Loader, CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { getWhatsAppLink } from "@/lib/utils";

export default function KontakPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  return (
    <div className="pt-28 pb-20 bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="section-container relative z-10">
        <SectionHeading
          badge="Hubungi Kami"
          title="Konsultasikan Kebutuhan Anda"
          subtitle="Diskusikan kebutuhan pendampingan tata kelola, sistem digital, atau pelatihan SDM bersama tim ahli Instapro Solution."
        />

        <div className="grid lg:grid-cols-5 gap-8 items-start mb-12 mt-10">
          {/* Contact Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-3xl bg-white p-6 border border-navy-500/5 shadow-sm space-y-6">
              <h3 className="text-navy-500 font-extrabold text-base">Informasi Kontak</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50/50 flex items-center justify-center text-brand-500 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-navy-500/50 text-[10px] font-bold uppercase tracking-wider">Kantor Pusat</p>
                  <p className="text-navy-500 text-xs font-semibold mt-0.5 leading-relaxed">
                    Jalan Duyung No. 100 D, Pekanbaru, Riau 28282 INDONESIA
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50/50 flex items-center justify-center text-brand-500 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-navy-500/50 text-[10px] font-bold uppercase tracking-wider">Email Resmi</p>
                  <a href="mailto:info@instapro.co.id" className="text-brand-500 text-xs font-bold mt-0.5 hover:underline block">
                    info@instapro.co.id
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50/50 flex items-center justify-center text-brand-500 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-navy-500/50 text-[10px] font-bold uppercase tracking-wider">Telepon / WhatsApp</p>
                  <a href="tel:+628217710106" className="text-navy-500 text-xs font-bold mt-0.5 hover:underline block">
                    +62 821-7710-106
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Link Options */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppLink("Halo Instapro, saya ingin berkonsultasi tentang layanan pendampingan tata kelola.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 justify-center py-4 text-xs"
              >
                <MessageCircle size={18} /> Chat WhatsApp
              </a>
              <a href="tel:+628217710106" className="btn-secondary flex-1 justify-center py-4 text-xs">
                <Phone size={18} /> Telepon Langsung
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl bg-white p-6 md:p-8 border border-navy-500/5 shadow-sm">
              <h3 className="text-navy-500 font-extrabold text-base mb-6">Kirim Pesan Resmi</h3>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <CheckCircle2 size={48} className="text-brand-500 mx-auto" />
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Nama / Instansi</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nama lengkap atau instansi"
                        className="input-glass text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Email Resmi</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Alamat Email"
                        className="input-glass text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Subjek / Topik</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Contoh: Permintaan Penawaran Sistem Desa"
                      className="input-glass text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Pesan Anda</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tulis detail kebutuhan sistem, pendampingan, atau pelatihan SDM Anda..."
                      className="input-glass text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-4 text-xs"
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
          </div>
        </div>

        {/* Map Embed */}
        <div className="glass rounded-3xl bg-white overflow-hidden aspect-[21/9] w-full border border-navy-500/5 shadow-sm">
          <iframe
            src="https://maps.google.com/maps?q=PT%20Insta%20Pro%20Solution%2C%20Jl.%20Duyung%20No.100d%2C%20Tangkerang%20Barat%2C%20Pekanbaru&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kantor PT Insta Pro Solution Pekanbaru"
          />
        </div>
      </div>
    </div>
  );
}
