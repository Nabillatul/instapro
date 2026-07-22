"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";
import { Suspense } from "react";

function CheckoutSuksesContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "ORD-" + Math.floor(Math.random() * 100000);
  const isPending = searchParams.get("pending") === "true";

  const handleWAConfirmation = () => {
    const waMsg = `Halo Instapro, saya ingin konfirmasi pesanan dengan Order ID: ${orderId}. Mohon diproses. Terima kasih!`;
    window.open(getWhatsAppLink(waMsg), "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-20 bg-blush bg-nodes">
      <div className="section-container text-center max-w-md relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="glass rounded-3xl p-8 md:p-10 border border-brand-500/10 bg-white shadow-lg"
        >
          <div className="w-16 h-16 bg-brand-50/50 rounded-full flex items-center justify-center text-brand-500 mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-navy-500 mb-2">
            {isPending ? "Pemesanan Pending" : "Pemesanan Sukses!"}
          </h1>
          <p className="text-navy-500/60 text-xs font-semibold mb-6 leading-relaxed">
            {isPending
              ? "Transaksi Anda sedang diproses. Silakan hubungi admin kami untuk konfirmasi lebih lanjut."
              : "Terima kasih atas pesanan Anda. Sistem kami telah menerima dan memproses data pesanan Anda secara otomatis."}
          </p>

          {/* Order Details */}
          <div className="rounded-2xl border border-navy-500/5 bg-blush-50/20 p-4 mb-8 text-left space-y-2 text-xs font-bold text-navy-500/80">
            <div className="flex justify-between">
              <span className="text-navy-500/50">Order ID</span>
              <span className="font-mono font-extrabold">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-500/50">Status</span>
              <span className={isPending ? "text-amber-500" : "text-green-500"}>
                {isPending ? "Pending" : "Sukses"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleWAConfirmation}
              className="btn-primary w-full justify-center py-3.5 text-xs"
            >
              <MessageCircle size={18} />
              Konfirmasi via WhatsApp
            </button>
            <Link
              href="/"
              className="btn-secondary w-full justify-center py-3 text-xs"
            >
              <Home size={14} />
              Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuksesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-24 bg-blush">
        <div className="text-navy-500/55 text-sm font-semibold">Memuat data transaksi...</div>
      </div>
    }>
      <CheckoutSuksesContent />
    </Suspense>
  );
}
