"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { Inbox, ArrowRight, Sparkles, GraduationCap } from "lucide-react";

interface Registration {
  id: string;
  selectedClass: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string | Date;
}

interface UserRegistrationsListProps {
  registrations: Registration[];
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function UserRegistrationsList({
  registrations,
}: UserRegistrationsListProps) {
  if (registrations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl bg-white p-10 text-center border border-navy-500/5 shadow-md space-y-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-[100%] pointer-events-none" />

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto text-brand-500 shadow-sm"
        >
          <GraduationCap size={32} />
        </motion.div>

        <div className="space-y-1">
          <h3 className="text-navy-500 font-extrabold text-sm">Belum Terdaftar di Kelas Pelatihan</h3>
          <p className="text-navy-500/60 text-xs font-medium max-w-sm mx-auto">
            Tingkatkan keahlian birokrasi dan kompetensi digital Anda dengan mengikuti program pelatihan di Instapro Learning Academy.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/kelas-quantum"
            className="btn-primary text-xs py-3 px-6 inline-flex items-center gap-2 shadow-md"
          >
            Daftar Kelas Pelatihan Sekarang <ArrowRight size={15} />
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {registrations.map((reg) => (
        <motion.div
          key={reg.id}
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08)" }}
          className="glass rounded-2xl bg-white p-6 border border-navy-500/5 shadow-sm space-y-3 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="flex justify-between items-start text-xs gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-500 shrink-0" />
              <span className="text-navy-500 font-black text-sm group-hover:text-brand-500 transition-colors">
                {reg.selectedClass}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shrink-0 ${
                reg.status === "confirmed"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : reg.status === "completed"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200 animate-pulse"
              }`}
            >
              {reg.status === "confirmed"
                ? "Dikonfirmasi"
                : reg.status === "completed"
                ? "Selesai"
                : "Menunggu"}
            </span>
          </div>

          <p className="text-navy-500/70 text-xs font-semibold leading-relaxed pl-6">
            Jadwal: {reg.preferredDate} ({reg.preferredTime})
          </p>

          <div className="pt-3 border-t border-navy-500/5 flex justify-between items-center text-[11px] font-bold text-navy-500/40 pl-6">
            <span>Terdaftar pada: {formatDate(reg.createdAt)}</span>
            <span className="text-brand-500 font-extrabold text-[10px] uppercase tracking-wider">
              Instapro Academy Member
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
