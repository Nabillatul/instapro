"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  RefreshCcw,
  Loader,
  ChevronDown,
  Filter,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Wrench,
  PackageCheck,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: { label: "Menunggu", color: "amber", icon: Clock },
  confirmed: { label: "Dikonfirmasi", color: "blue", icon: CheckCircle2 },
  in_progress: { label: "Sedang Dikerjakan", color: "purple", icon: Wrench },
  completed: { label: "Selesai", color: "green", icon: PackageCheck },
  cancelled: { label: "Dibatalkan", color: "red", icon: XCircle },
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  confirmed: "bg-blue-50 text-blue-600 border border-blue-200",
  in_progress: "bg-purple-50 text-purple-600 border border-purple-200",
  completed: "bg-green-50 text-green-600 border border-green-200",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
};

// ─── Types ─────────────────────────────────────────────────────────────────
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; slug: string };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  paymentMethod: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddr: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string; phone: string | null };
  items: OrderItem[];
}

// ─── Modal Detail ──────────────────────────────────────────────────────────
function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [updating, setUpdating] = useState(false);

  const changeStatus = async (newStatus: string) => {
    setUpdating(true);
    await onStatusChange(order.id, newStatus);
    setUpdating(false);
  };

  const handleWAContact = () => {
    // Bersihkan nomor telepon pembeli: hapus karakter non-digit, ganti awalan 0 dengan 62
    const rawPhone = order.shippingPhone.replace(/\D/g, "");
    const cleanPhone = rawPhone.startsWith("0")
      ? "62" + rawPhone.slice(1)
      : rawPhone.startsWith("62")
      ? rawPhone
      : "62" + rawPhone;

    const msg = encodeURIComponent(
      `Halo ${order.shippingName}, kami dari Tim Instapro ingin mengonfirmasi pesanan Anda:\n\n` +
      `📦 Order ID: ${order.id}\n` +
      `💳 Metode Bayar: ${order.paymentMethod || "Belum dipilih"}\n` +
      `💰 Total: ${formatRupiah(order.totalAmount)}\n` +
      `📋 Status: ${STATUS_CONFIG[order.status]?.label || order.status}\n\n` +
      `Produk yang dipesan:\n` +
      order.items.map((i) => `• ${i.product?.name} (${i.quantity}x)`).join("\n") +
      `\n\nSilakan konfirmasi pembayaran atau hubungi kami jika ada pertanyaan. Terima kasih! 🙏`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-500/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl border border-navy-500/5 shadow-glass w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-navy-500/5 flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${STATUS_BADGE[order.status]}`}
            >
              {(() => {
                const cfg = STATUS_CONFIG[order.status];
                const Icon = cfg?.icon;
                return Icon ? <Icon size={11} /> : null;
              })()}
              {STATUS_CONFIG[order.status]?.label || order.status}
            </span>
            <h2 className="text-navy-500 font-extrabold text-lg mt-1 font-mono">
              {order.id}
            </h2>
            <p className="text-navy-500/40 text-[10px] font-bold mt-0.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-navy-500/40 hover:text-navy-500 hover:bg-navy-50 transition-all cursor-pointer flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Pembeli */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-extrabold text-navy-500/40 uppercase tracking-widest flex items-center gap-1.5">
              <User size={11} /> Data Pembeli
            </h3>
            <div className="bg-navy-50/50 rounded-2xl p-4 space-y-2 text-xs font-bold text-navy-500">
              <div className="flex items-center gap-2">
                <User size={13} className="text-brand-500 flex-shrink-0" />
                <span>{order.shippingName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-brand-500 flex-shrink-0" />
                <span className="truncate">{order.user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-brand-500 flex-shrink-0" />
                <span>{order.shippingPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-brand-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{order.shippingAddr}</span>
              </div>
              {order.notes && (
                <div className="pt-2 border-t border-navy-500/5 text-navy-500/60 italic text-[10px]">
                  Catatan: {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Pembayaran */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-extrabold text-navy-500/40 uppercase tracking-widest flex items-center gap-1.5">
              <CreditCard size={11} /> Pembayaran
            </h3>
            <div className="bg-navy-50/50 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-navy-500/40">Metode</p>
                <p className="text-xs font-extrabold text-navy-500">
                  {order.paymentMethod || "Tidak Diketahui"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-navy-500/40">Total</p>
                <p className="text-base font-extrabold text-brand-500">
                  {formatRupiah(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Produk */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-extrabold text-navy-500/40 uppercase tracking-widest flex items-center gap-1.5">
              <ShoppingBag size={11} /> Produk Dipesan
            </h3>
            <div className="divide-y divide-navy-500/5 bg-navy-50/50 rounded-2xl p-4">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-navy-500">{item.product?.name}</p>
                    <p className="text-[10px] font-bold text-navy-500/40">
                      Jumlah: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-navy-500">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Update Status */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-extrabold text-navy-500/40 uppercase tracking-widest">
              Update Status Pesanan
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => changeStatus(key)}
                    disabled={updating || order.status === key}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer disabled:cursor-default ${
                      order.status === key
                        ? `${STATUS_BADGE[key]} opacity-100 cursor-default`
                        : "bg-navy-50 text-navy-500/60 hover:bg-navy-100 border border-navy-100"
                    }`}
                  >
                    {updating ? (
                      <Loader size={11} className="animate-spin" />
                    ) : (
                      <Icon size={11} />
                    )}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleWAContact}
              className="flex-1 btn-primary text-xs justify-center py-3"
            >
              <MessageCircle size={14} />
              Hubungi via WhatsApp
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs px-5 py-3"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/orders?status=${filterStatus}&page=${page}`
      );
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      if (data.counts) {
        setStatusCounts(data.counts);
      }
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }, [filterStatus, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => prev ? { ...prev, status } : null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pesanan ini? Data tidak dapat dikembalikan.")) return;
    setDeletingId(id);
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchOrders();
    }
    setDeletingId(null);
  };

  const filteredOrders = search
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.shippingName.toLowerCase().includes(search.toLowerCase()) ||
          o.user?.email.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div
              key={key}
              className={`glass rounded-2xl bg-white p-4 border shadow-sm flex items-center gap-3 cursor-pointer transition-all ${
                filterStatus === key ? "border-brand-500/30 bg-brand-50/20" : "border-navy-500/5"
              }`}
              onClick={() => {
                setFilterStatus(key);
                setPage(1);
              }}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${STATUS_BADGE[key]}`}>
                <Icon size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-navy-500/40 uppercase truncate">
                  {cfg.label}
                </p>
                <p className="text-lg font-extrabold text-navy-500">
                  {statusCounts[key] || 0}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="glass rounded-2xl bg-white p-4 border border-navy-500/5 shadow-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold text-navy-500/40 uppercase tracking-widest flex items-center gap-1">
            <Filter size={11} /> Filter:
          </span>
          <button
            onClick={() => { setFilterStatus("all"); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
              filterStatus === "all"
                ? "bg-brand-500 text-white"
                : "bg-navy-50 text-navy-500/70 hover:bg-navy-100 border border-navy-100"
            }`}
          >
            Semua ({total})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setFilterStatus(key); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                filterStatus === key
                  ? "bg-brand-500 text-white"
                  : "bg-navy-50 text-navy-500/70 hover:bg-navy-100 border border-navy-100"
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Order ID / Nama..."
              className="input-glass pl-8 text-xs font-semibold py-2"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="px-3 py-2 rounded-xl bg-navy-50 text-navy-500/70 hover:bg-navy-100 border border-navy-100 transition-all cursor-pointer"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl bg-white border border-navy-500/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-brand-500" size={32} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="text-brand-500/20 mx-auto mb-4" />
            <p className="text-navy-500/50 text-sm font-semibold">
              {search ? "Pesanan tidak ditemukan." : "Belum ada data pesanan."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-bold text-navy-500">
              <thead className="bg-navy-50/50 border-b border-navy-500/5">
                <tr>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-navy-500/40 font-extrabold">
                    Order ID
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-navy-500/40 font-extrabold">
                    Pembeli
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-navy-500/40 font-extrabold hidden md:table-cell">
                    Pembayaran
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-navy-500/40 font-extrabold">
                    Total
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-navy-500/40 font-extrabold">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-navy-500/40 font-extrabold hidden lg:table-cell">
                    Tanggal
                  </th>
                  <th className="text-center px-5 py-3.5 text-[10px] uppercase tracking-wider text-navy-500/40 font-extrabold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-500/5">
                {filteredOrders.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-navy-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[10px] text-navy-500/70">
                        {order.id.length > 12 ? `${order.id.slice(0, 12)}…` : order.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-extrabold text-navy-500 truncate max-w-[140px]">
                        {order.shippingName}
                      </p>
                      <p className="text-navy-500/40 text-[10px] truncate max-w-[140px]">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-navy-500/60 text-[10px] leading-relaxed">
                        {order.paymentMethod || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-extrabold text-brand-500">
                        {formatRupiah(order.totalAmount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${STATUS_BADGE[order.status]}`}
                      >
                        {STATUS_CONFIG[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-navy-500/40 text-[10px]">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="Lihat Detail"
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-navy-500/50 hover:text-brand-500 hover:bg-brand-50 transition-all cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        {order.status === "cancelled" && (
                          <button
                            onClick={() => handleDelete(order.id)}
                            disabled={deletingId === order.id}
                            title="Hapus Pesanan"
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-navy-500/50 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {deletingId === order.id ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-navy-500/5 bg-navy-50/30">
            <span className="text-[10px] font-bold text-navy-500/40">
              Halaman {page} dari {totalPages} • Total {total} pesanan
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-navy-500/50 hover:text-navy-500 hover:bg-navy-100 border border-navy-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-navy-500/50 hover:text-navy-500 hover:bg-navy-100 border border-navy-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
