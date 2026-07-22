"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getWhatsAppLink } from "@/lib/utils";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={getWhatsAppLink("Halo Instapro, saya ingin konsultasi tentang layanan digital Anda.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-400 transition-colors group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Chat WhatsApp"
    >
      <MessageCircle size={26} className="text-white" />
      <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-navy-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat via WhatsApp
      </span>
    </motion.a>
  );
}
