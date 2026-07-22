"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";

export default function KeranjangPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blush bg-nodes">
        <div className="text-center p-8 glass rounded-3xl bg-white border border-navy-500/5 max-w-sm shadow-sm">
          <ShoppingCart size={64} className="text-brand-500/20 mx-auto mb-6" />
          <h1 className="text-xl font-extrabold text-navy-500 mb-2">Keranjang Kosong</h1>
          <p className="text-navy-500/50 text-xs font-semibold mb-6">Belum ada paket produk di keranjang Anda.</p>
          <Link href="/katalog" className="btn-primary text-xs w-full justify-center">
            <ArrowLeft size={16} /> Jelajahi Katalog Sistem
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-navy-500 mb-8"
        >
          Keranjang Belanja
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                layout
                className="glass rounded-2xl bg-white p-4 flex flex-col sm:flex-row items-center gap-4 border border-navy-500/5 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl bg-brand-50/50 flex items-center justify-center flex-shrink-0 text-brand-500">
                  <ShoppingCart size={24} />
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="text-navy-500 font-extrabold text-sm truncate">{item.name}</h3>
                  <p className="text-brand-500 font-bold text-xs mt-1">
                    {formatRupiah(item.price)}
                  </p>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg border border-navy-100 bg-white flex items-center justify-center text-navy-500/70 hover:bg-navy-50 transition-colors cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-navy-500 font-extrabold w-8 text-center text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg border border-navy-100 bg-white flex items-center justify-center text-navy-500/70 hover:bg-navy-50 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Total Item Price & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-navy-500/5">
                  <p className="text-navy-500 font-extrabold text-sm">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-brand-500 hover:text-brand-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="glass rounded-3xl bg-white p-6 sticky top-24 border border-navy-500/5 shadow-sm">
              <h2 className="text-navy-500 font-extrabold text-base mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-6 text-xs font-bold text-navy-500/75">
                <div className="flex justify-between">
                  <span className="text-navy-500/55">Jumlah Paket</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-500/55">Subtotal</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="h-px bg-navy-500/5" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-navy-500 font-extrabold text-sm">Total</span>
                  <span className="text-brand-500 font-extrabold text-base">{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full justify-center py-4 text-xs">
                Lanjut ke Checkout <ArrowRight size={16} />
              </Link>

              <Link
                href="/katalog"
                className="btn-secondary w-full justify-center mt-3 py-3 text-xs"
              >
                Kembali Belanja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
