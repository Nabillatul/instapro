"use client";

import { useState } from "react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Loader, XCircle, Inbox, CreditCard, PackageCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: any }
> = {
  pending: {
    label: "Menunggu Konfirmasi",
    badgeClass: "bg-amber-50 text-amber-600 border border-amber-200/60",
    icon: Clock,
  },
  confirmed: {
    label: "Dikonfirmasi",
    badgeClass: "bg-blue-50 text-blue-600 border border-blue-200/60",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "Sedang Dikerjakan",
    badgeClass: "bg-purple-50 text-purple-600 border border-purple-200/60",
    icon: PackageCheck,
  },
  completed: {
    label: "Selesai",
    badgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Dibatalkan",
    badgeClass: "bg-rose-50 text-rose-600 border border-rose-200/60",
    icon: AlertCircle,
  },
};

export default function UserOrdersList({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;
    setCancellingId(orderId);
    try {
      const res = await fetch("/api/user/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, action: "cancel" }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
        );
        router.refresh();
      } else {
        alert(data.error || "Gagal membatalkan pesanan.");
      }
    } catch {
      alert("Terjadi kesalahan saat membatalkan pesanan.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const config = STATUS_CONFIG[order.status] || {
          label: order.status,
          badgeClass: "bg-navy-50 text-navy-500",
          icon: Clock,
        };
        const StatusIcon = config.icon;

        return (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-5 md:p-6 border border-navy-500/10 shadow-md hover:shadow-lg transition-all duration-300 space-y-4"
          >
            {/* Header order ID & status */}
            <div className="flex justify-between items-center text-xs flex-wrap gap-2 pb-3 border-b border-navy-500/5">
              <div>
                <span className="text-[10px] font-black text-navy-500/40 uppercase tracking-widest block">
                  ID PESANAN
                </span>
                <span className="text-navy-500 font-mono font-extrabold text-sm tracking-tight">
                  #{order.id}
                </span>
                <p className="text-navy-500/50 text-[11px] font-medium mt-0.5">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold uppercase text-[10px] tracking-wider ${config.badgeClass}`}
              >
                <StatusIcon size={12} />
                {config.label}
              </span>
            </div>

            {/* Items list */}
            <div className="divide-y divide-navy-500/5 bg-navy-50/40 rounded-2xl px-4 py-1 border border-navy-500/5">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs font-semibold">
                  <span className="text-navy-700">
                    {item.product?.name || "Layanan Custom"}{" "}
                    <span className="text-brand-500 font-extrabold">x{item.quantity}</span>
                  </span>
                  <span className="text-navy-900 font-bold">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {order.paymentMethod && (
              <div className="bg-gradient-to-r from-navy-50 to-slate-50 rounded-xl p-3 text-[11px] font-bold text-navy-600 flex items-center justify-between border border-navy-100">
                <span className="flex items-center gap-1.5">
                  <CreditCard size={14} className="text-brand-500 shrink-0" />
                  Metode Pembayaran
                </span>
                <span className="uppercase text-brand-600 tracking-wider">{order.paymentMethod}</span>
              </div>
            )}

            {/* Footer total amount & cancel action */}
            <div className="pt-2 flex justify-between items-center flex-wrap gap-3">
              <div>
                <span className="text-navy-500/40 text-[10px] font-extrabold uppercase tracking-widest block">
                  TOTAL PEMBAYARAN
                </span>
                <span className="text-brand-600 font-black text-base md:text-lg">
                  {formatRupiah(order.totalAmount)}
                </span>
              </div>

              {order.status === "pending" && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancellingId === order.id}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {cancellingId === order.id ? (
                    <Loader size={13} className="animate-spin" />
                  ) : (
                    <XCircle size={13} />
                  )}
                  Batalkan Pesanan
                </button>
              )}
            </div>
          </div>
        );
      })}

      {orders.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-navy-500/10 shadow-sm">
          <Inbox className="mx-auto mb-3 text-navy-300" size={40} />
          <h3 className="text-sm font-extrabold text-navy-500">Belum ada riwayat pesanan</h3>
          <p className="text-navy-500/50 text-xs font-medium mt-1">
            Pesanan atau layanan yang Anda pesan akan muncul di sini.
          </p>
        </div>
      )}
    </div>
  );
}
