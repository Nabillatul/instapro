"use client";

import { useState } from "react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Loader, XCircle, Inbox, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  pending: { label: "⏳ Menunggu Konfirmasi", badgeClass: "bg-amber-50 text-amber-600 border border-amber-200" },
  confirmed: { label: "✅ Dikonfirmasi", badgeClass: "bg-blue-50 text-blue-600 border border-blue-200" },
  in_progress: { label: "🔧 Sedang Dikerjakan", badgeClass: "bg-purple-50 text-purple-600 border border-purple-200" },
  completed: { label: "🎉 Selesai", badgeClass: "bg-green-50 text-green-600 border border-green-200" },
  cancelled: { label: "❌ Dibatalkan", badgeClass: "bg-red-50 text-red-600 border border-red-200" },
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
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o)
        );
        router.refresh();
      } else {
        alert(data.error || "Gagal membatalkan pesanan.");
      }
    } catch {
      alert("Terjadi kesalahan.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="glass rounded-2xl bg-white p-5 border border-navy-500/5 shadow-sm space-y-4">
          <div className="flex justify-between items-start text-xs flex-wrap gap-2">
            <div>
              <span className="text-navy-500 font-mono font-extrabold">{order.id}</span>
              <p className="text-navy-500/40 mt-0.5 font-semibold">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider ${
              STATUS_CONFIG[order.status]?.badgeClass || "bg-navy-50 text-navy-500/50"
            }`}>
              {STATUS_CONFIG[order.status]?.label || order.status}
            </span>
          </div>

          <div className="divide-y divide-navy-500/5">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-2 flex justify-between text-xs font-semibold">
                <span className="text-navy-500/70">
                  {item.product?.name || "Layanan Custom"} x{item.quantity}
                </span>
                <span className="text-navy-500 font-bold">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {order.paymentMethod && (
            <div className="bg-navy-50/50 rounded-xl p-3 text-[10px] font-bold text-navy-500/70 flex items-center gap-1.5 border border-navy-100">
              <CreditCard size={12} className="text-brand-500 shrink-0" />
              <span>Metode: {order.paymentMethod}</span>
            </div>
          )}

          <div className="pt-3 border-t border-navy-500/5 flex justify-between items-center flex-wrap gap-3">
            <div>
              <span className="text-navy-500/50 text-[10px] font-bold uppercase block">Total Pembayaran</span>
              <span className="text-brand-500 font-extrabold text-xs">
                {formatRupiah(order.totalAmount)}
              </span>
            </div>

            {order.status === "pending" && (
              <button
                onClick={() => handleCancelOrder(order.id)}
                disabled={cancellingId === order.id}
                className="px-4 py-2 rounded-xl text-[10px] font-bold bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {cancellingId === order.id ? (
                  <Loader size={12} className="animate-spin" />
                ) : (
                  <XCircle size={12} />
                )}
                Batalkan Pesanan
              </button>
            )}
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="glass rounded-2xl bg-white p-8 text-center border border-navy-500/5 shadow-sm">
          <Inbox className="mx-auto mb-3 text-navy-500/20" size={32} />
          <p className="text-navy-500/40 text-xs font-semibold">Belum ada riwayat pesanan.</p>
        </div>
      )}
    </div>
  );
}
