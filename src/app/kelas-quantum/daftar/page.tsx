"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Send, Loader } from "lucide-react";
import StepIndicator from "@/components/ui/StepIndicator";
import { getWhatsAppLink } from "@/lib/utils";

const steps = [
  "Informasi Pribadi",
  "Pilihan Kelas",
  "Detail Tambahan",
  "Jadwal",
  "Pembayaran",
];

const classOptions = [
  { id: "digital-literacy", name: "Digital Literacy & Security Mastery", price: "Rp 1.500.000" },
  { id: "uiux-design", name: "Professional UI/UX System Design", price: "Rp 2.500.000" },
  { id: "webdev-nocode", name: "Web Dev & No-Code Automation", price: "Rp 2.000.000" },
  { id: "socmed-mgmt", name: "Social Media & Content Strategy", price: "Rp 1.750.000" },
];

export default function DaftarKelasPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    selectedClass: classOptions[0].name,
    experience: "Pemula (tidak ada dasar)",
    motivation: "",
    preferredDate: "Weekend (Sabtu-Minggu)",
    preferredTime: "Pagi (09:00 - 12:00 WIB)",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate successful registration data submit, directly go to next step
      setTimeout(() => {
        setLoading(false);
        nextStep();
      }, 1200);
    } catch (err) {
      console.error(err);
      setLoading(false);
      nextStep();
    }
  };

  const handleWAConfirmation = () => {
    const waMsg = `Halo Instapro, saya sudah mengisi form pendaftaran Kelas Quantum:\n\nNama: ${formData.fullName}\nEmail: ${formData.email}\nInstansi: ${formData.institution}\nKelas: ${formData.selectedClass}\nJadwal: ${formData.preferredDate} (${formData.preferredTime})\n\nMohon instruksi pembayaran selanjutnya.`;
    window.open(getWhatsAppLink(waMsg), "_blank");
  };

  return (
    <div className="pt-28 pb-20 min-h-screen flex items-center bg-blush bg-nodes">
      <div className="section-container w-full max-w-2xl relative z-10">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="glass rounded-3xl bg-white p-8 border border-navy-500/5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 rounded-bl-[100%]" />

          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 relative z-10"
              >
                <h2 className="text-xl font-extrabold text-navy-500 mb-6">Informasi Pribadi</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Nama Lengkap</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nama lengkap Anda"
                      className="input-glass text-xs font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Alamat email aktif"
                        className="input-glass text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">No. WhatsApp</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Contoh: 0821xxxxxxxx"
                        className="input-glass text-xs font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Instansi / Kantor (Opsional)</label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="Nama tempat bekerja / belajar"
                      className="input-glass text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-navy-500/5">
                  <button
                    onClick={nextStep}
                    disabled={!formData.fullName || !formData.email || !formData.phone}
                    className="btn-primary text-xs px-6 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    Lanjut <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Class Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 relative z-10"
              >
                <h2 className="text-xl font-extrabold text-navy-500 mb-6">Pilihan Kelas</h2>
                <div className="space-y-3">
                  {classOptions.map((option) => {
                    const isSelected = formData.selectedClass === option.name;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-brand-50/50 border-brand-500 text-navy-500"
                            : "bg-white border-navy-100 text-navy-500/60 hover:text-navy-500 hover:bg-navy-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="selectedClass"
                            value={option.name}
                            checked={isSelected}
                            onChange={handleChange}
                            className="accent-brand-500"
                          />
                          <span className="text-xs font-bold">{option.name}</span>
                        </div>
                        <span className="text-xs font-extrabold text-brand-500">{option.price}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-6 border-t border-navy-500/5">
                  <button onClick={prevStep} className="btn-secondary text-xs px-6">
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <button onClick={nextStep} className="btn-primary text-xs px-6">
                    Lanjut <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Additional Details */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 relative z-10"
              >
                <h2 className="text-xl font-extrabold text-navy-500 mb-6">Detail Tambahan</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Pengalaman Bidang Terkait</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-navy-100 text-navy-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
                    >
                      <option value="Pemula (tidak ada dasar)">Pemula (tidak ada dasar)</option>
                      <option value="Menengah (paham dasar-dasar)">Menengah (paham dasar-dasar)</option>
                      <option value="Mahir (ingin memperdalam)">Mahir (ingin memperdalam)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Motivasi Mengikuti Kelas</label>
                    <textarea
                      name="motivation"
                      rows={4}
                      value={formData.motivation}
                      onChange={handleChange}
                      placeholder="Apa tujuan atau kendala tata kelola yang ingin dipecahkan?"
                      className="input-glass text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-navy-500/5">
                  <button onClick={prevStep} className="btn-secondary text-xs px-6">
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <button onClick={nextStep} className="btn-primary text-xs px-6">
                    Lanjut <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Schedule */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 relative z-10"
              >
                <h2 className="text-xl font-extrabold text-navy-500 mb-6">Preferensi Jadwal</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Hari Pelaksanaan</label>
                    <select
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-navy-100 text-navy-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
                    >
                      <option value="Weekend (Sabtu-Minggu)">Weekend (Sabtu-Minggu)</option>
                      <option value="Weekday (Selasa-Kamis)">Weekday (Selasa-Kamis)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Jam Pelaksanaan</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-navy-100 text-navy-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
                    >
                      <option value="Pagi (09:00 - 12:00 WIB)">Pagi (09:00 - 12:00 WIB)</option>
                      <option value="Siang (13:00 - 16:00 WIB)">Siang (13:00 - 16:00 WIB)</option>
                      <option value="Malam (19:00 - 21:00 WIB)">Malam (19:00 - 21:00 WIB)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-navy-500/5">
                  <button onClick={prevStep} className="btn-secondary text-xs px-6">
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary text-xs px-6"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={16} /> Menyimpan...
                      </>
                    ) : (
                      <>
                        Kirim Pendaftaran <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Payment Instructions (WhatsApp Link) */}
            {currentStep === 4 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center relative z-10"
              >
                <div className="w-16 h-16 bg-brand-50/50 rounded-full flex items-center justify-center text-brand-500 mx-auto">
                  <Check size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-navy-500 mb-2">Formulir Terkirim!</h2>
                  <p className="text-navy-500/60 text-xs font-semibold max-w-md mx-auto leading-relaxed">
                    Terima kasih telah mendaftar. Data pendaftaran Anda telah kami simpan. Silakan hubungi admin kami via WhatsApp untuk penyelesaian pembayaran dan info batch selanjutnya.
                  </p>
                </div>

                <div className="rounded-2xl border border-navy-500/5 bg-blush-50/20 p-4 text-left max-w-sm mx-auto space-y-2 text-xs font-bold text-navy-500/80">
                  <div className="flex justify-between">
                    <span className="text-navy-500/50">Pendaftar</span>
                    <span>{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-500/50">Pilihan Kelas</span>
                    <span>{formData.selectedClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-500/50">Status Pendaftaran</span>
                    <span className="text-amber-500 font-extrabold">Menunggu Pembayaran</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                  <button
                    onClick={handleWAConfirmation}
                    className="btn-primary w-full justify-center text-xs"
                  >
                    <MessageCircle size={18} />
                    Selesaikan di WhatsApp
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
