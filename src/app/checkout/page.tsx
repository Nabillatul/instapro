"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatRupiah, getWhatsAppLink } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Loader, 
  QrCode, 
  Building2, 
  Wallet, 
  MessageSquare, 
  Copy, 
  Check,
  MapPin,
  Navigation,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BANK_ACCOUNTS, QRIS_IMAGE_PATH, EWALLET_ACCOUNTS } from "@/lib/paymentConfig";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [selectedMethod, setSelectedMethod] = useState<"qris" | "bank" | "ewallet" | "whatsapp">("qris");
  const [selectedBank, setSelectedBank] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderAccount, setSenderAccount] = useState("");

  // Batasi agar pengguna harus login dulu
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  useEffect(() => {
    if (items.length === 0 && status !== "loading") {
      router.push("/katalog");
    }
  }, [items, status, router]);

  // Auto-fill dari data profile session
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        phone: (session.user as any).phone || prev.phone,
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Browser Anda tidak mendukung GPS. Silakan isi alamat secara manual.");
      return;
    }
    setGeoLoading(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Menggunakan Nominatim OpenStreetMap (gratis, tanpa API key)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`,
            { headers: { "User-Agent": "InstaPro-App" } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const parts = [
            addr.road || addr.pedestrian || "",
            addr.suburb || addr.neighbourhood || addr.hamlet || "",
            addr.village || addr.town || addr.city_district || "",
            addr.city || addr.county || addr.regency || "",
            addr.state || "",
            addr.postcode ? `Kode Pos: ${addr.postcode}` : "",
          ].filter(Boolean);
          const formattedAddress = parts.join(", ");
          setFormData(prev => ({ ...prev, address: formattedAddress }));
          setGeoLoading(false);
        } catch {
          setGeoError("Gagal mendapatkan nama alamat. Silakan isi manual.");
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Akses lokasi ditolak. Izinkan akses lokasi di browser untuk fitur ini.");
        } else {
          setGeoError("Gagal mendapatkan lokasi. Silakan isi alamat secara manual.");
        }
      },
      { timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let paymentDetailText = "";
      if (selectedMethod === "qris") {
        paymentDetailText = `QRIS (A/N: ${senderName}, No/HP: ${senderAccount})`;
      } else if (selectedMethod === "bank") {
        paymentDetailText = `Transfer Bank (${BANK_ACCOUNTS[selectedBank].bankName}) - A/N: ${senderName}, Rek: ${senderAccount}`;
      } else if (selectedMethod === "ewallet") {
        paymentDetailText = `E-Wallet (${EWALLET_ACCOUNTS[selectedWallet].walletName}) - A/N: ${senderName}, HP: ${senderAccount}`;
      } else {
        paymentDetailText = "Direct WhatsApp";
      }

      // 1. Simpan order ke database
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          customerDetails: {
            ...formData,
            paymentMethod: paymentDetailText,
          },
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();
      const orderId = data.orderId || "ORD-" + Math.floor(Math.random() * 100000);

      // 2. Siapkan detail teks untuk WhatsApp
      let paymentDetailWA = "";
      if (selectedMethod === "qris") {
        paymentDetailWA = `QRIS (PT. Insta Pro Solution) - Pengirim: ${senderName} (${senderAccount})`;
      } else if (selectedMethod === "bank") {
        const bank = BANK_ACCOUNTS[selectedBank];
        paymentDetailWA = `Transfer Bank ${bank.bankName} (${bank.accountNo} a/n ${bank.holderName}) - Pengirim: ${senderName} (${senderAccount})`;
      } else if (selectedMethod === "ewallet") {
        const wallet = EWALLET_ACCOUNTS[selectedWallet];
        paymentDetailWA = `E-Wallet ${wallet.walletName} (${wallet.phoneNo} a/n ${wallet.holderName}) - Pengirim: ${senderName} (${senderAccount})`;
      } else {
        paymentDetailWA = "Direct WhatsApp (Bayar/Diskusi Manual)";
      }

      const waMsg = `Halo Instapro, saya ingin mengonfirmasi pesanan produk/layanan digital:

Order ID: ${orderId}
Metode Pembayaran: ${paymentDetailWA}

Daftar Pesanan:
${items.map(i => `- ${i.name} (${i.quantity}x) - ${formatRupiah(i.price * i.quantity)}`).join("\n")}

Total Pembayaran: ${formatRupiah(totalPrice)}

Data Pembeli:
Nama: ${formData.name}
Email: ${formData.email}
No HP: ${formData.phone}
Alamat: ${formData.address}
Catatan: ${formData.notes || "-"}`;

      clearCart();
      if (selectedMethod === "whatsapp") {
        window.open(getWhatsAppLink(waMsg), "_blank");
      }
      router.push(`/checkout/sukses?order_id=${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  if (status === "loading" || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blush">
        <div className="text-center">
          <Loader className="animate-spin text-brand-500 mx-auto mb-4" size={40} />
          <p className="text-navy-500/70 text-sm font-semibold">Memeriksa Sesi & Keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/keranjang"
            className="inline-flex items-center gap-2 text-brand-500 text-xs font-bold uppercase tracking-wider mb-6 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Keranjang
          </Link>

          <h1 className="text-3xl font-extrabold text-navy-500 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Informasi Kontak */}
                <div className="glass rounded-3xl bg-white p-6 md:p-8 space-y-4 border border-navy-500/5 shadow-sm">
                  <h2 className="text-navy-500 font-extrabold text-base mb-4 flex items-center gap-2">
                    <CreditCard className="text-brand-500" size={20} />
                    Informasi Kontak & Pengiriman
                  </h2>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Nama Lengkap / Instansi</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Contoh: Kantor Desa Jaya Makmur"
                      className="input-glass text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Email Resmi</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contoh@domain.com"
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

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={11} />
                        Alamat Kantor / Lokasi
                      </label>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={geoLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-500 text-[10px] font-extrabold hover:bg-brand-500/20 transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed border border-brand-500/10"
                      >
                        {geoLoading ? (
                          <>
                            <Loader size={11} className="animate-spin" />
                            Mendeteksi...
                          </>
                        ) : (
                          <>
                            <Navigation size={11} />
                            Deteksi Lokasi Otomatis (GPS)
                          </>
                        )}
                      </button>
                    </div>

                    {geoError && (
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold p-2.5 rounded-xl">
                        <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                        {geoError}
                      </div>
                    )}

                    {formData.address && !geoLoading && !geoError && (
                      <div className="flex items-center gap-1.5 text-green-600 bg-green-50 border border-green-100 px-3 py-2 rounded-xl">
                        <Navigation size={11} className="flex-shrink-0" />
                        <span className="text-[10px] font-bold">Lokasi berhasil dideteksi via GPS — Anda masih bisa mengedit di bawah.</span>
                      </div>
                    )}

                    <textarea
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Klik 'Deteksi Lokasi Otomatis' untuk isi otomatis, atau ketik manual: Jalan, RT/RW, Desa, Kecamatan, Kabupaten/Kota"
                      className="input-glass text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-navy-500/50 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Kebutuhan khusus sistem atau rincian administrasi..."
                      className="input-glass text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Metode Pembayaran */}
                <div className="glass rounded-3xl bg-white p-6 md:p-8 space-y-6 border border-navy-500/5 shadow-sm">
                  <h2 className="text-navy-500 font-extrabold text-base mb-4 flex items-center gap-2">
                    <CreditCard className="text-brand-500" size={20} />
                    Metode Pembayaran
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* QRIS Tab */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("qris")}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedMethod === "qris"
                          ? "border-brand-500 bg-brand-500/5 text-brand-500"
                          : "border-navy-100 bg-white text-navy-500/60 hover:bg-navy-50"
                      }`}
                    >
                      <QrCode size={24} className="mb-2" />
                      <span className="text-xs font-bold">QRIS</span>
                    </button>

                    {/* Bank Transfer Tab */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("bank")}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedMethod === "bank"
                          ? "border-brand-500 bg-brand-500/5 text-brand-500"
                          : "border-navy-100 bg-white text-navy-500/60 hover:bg-navy-50"
                      }`}
                    >
                      <Building2 size={24} className="mb-2" />
                      <span className="text-xs font-bold">Transfer Bank</span>
                    </button>

                    {/* E-Wallet Tab */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("ewallet")}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedMethod === "ewallet"
                          ? "border-brand-500 bg-brand-500/5 text-brand-500"
                          : "border-navy-100 bg-white text-navy-500/60 hover:bg-navy-50"
                      }`}
                    >
                      <Wallet size={24} className="mb-2" />
                      <span className="text-xs font-bold">E-Wallet</span>
                    </button>

                    {/* WhatsApp Chat Tab */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("whatsapp")}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedMethod === "whatsapp"
                          ? "border-brand-500 bg-brand-500/5 text-brand-500"
                          : "border-navy-100 bg-white text-navy-500/60 hover:bg-navy-50"
                      }`}
                    >
                      <MessageSquare size={24} className="mb-2" />
                      <span className="text-xs font-bold">Direct WA</span>
                    </button>
                  </div>

                  {/* Detail Tampilan Pembayaran */}
                  <div className="rounded-2xl border border-navy-500/5 bg-navy-50/50 p-5 mt-4 min-h-[160px] flex flex-col justify-center">
                    {selectedMethod === "qris" && (
                      <div className="text-center space-y-3">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-bold bg-brand-50 text-brand-500 uppercase tracking-widest border border-brand-500/10">
                          Scan QRIS Resmi PT
                        </span>
                        <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-navy-500/5 flex items-center justify-center">
                          <img
                            src={QRIS_IMAGE_PATH}
                            alt="QRIS InstaPro"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-navy-500/50 max-w-sm mx-auto leading-relaxed">
                          Scan kode QR di atas menggunakan aplikasi e-wallet (GoPay, DANA, OVO, LinkAja) atau mobile banking Anda. Setelah pembayaran sukses, tekan tombol "Kirim Pemesanan" untuk konfirmasi via WA.
                        </p>
                      </div>
                    )}

                    {selectedMethod === "bank" && (
                      <div className="space-y-4">
                        <div className="flex gap-2 border-b border-navy-500/5 pb-3 overflow-x-auto">
                          {BANK_ACCOUNTS.map((bank, index) => (
                            <button
                              key={bank.bankName}
                              type="button"
                              onClick={() => setSelectedBank(index)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                                selectedBank === index
                                  ? "bg-brand-500 text-white"
                                  : "bg-white text-navy-500/70 border border-navy-100 hover:bg-navy-50"
                              }`}
                            >
                              {bank.bankName}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-navy-500/5">
                            <div>
                              <p className="text-[9px] font-bold text-navy-500/40 uppercase tracking-wider">Nomor Rekening</p>
                              <p className="text-sm font-black text-navy-500 font-mono">
                                {BANK_ACCOUNTS[selectedBank].accountNo}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(BANK_ACCOUNTS[selectedBank].accountNo, "bank")}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-navy-50 hover:bg-navy-100 text-navy-500 transition-all cursor-pointer"
                            >
                              {copied === "bank" ? (
                                <>
                                  <Check size={12} className="text-green-500" />
                                  Tersalin!
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  Salin
                                </>
                              )}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-white/40 p-3 rounded-xl border border-dashed border-navy-200 text-xs">
                            <div>
                              <p className="text-[9px] font-bold text-navy-500/40 uppercase tracking-wider">Nama Penerima</p>
                              <p className="font-extrabold text-navy-500">
                                {BANK_ACCOUNTS[selectedBank].holderName}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-navy-500/40 uppercase tracking-wider">Bank</p>
                              <p className="font-extrabold text-navy-500">
                                {BANK_ACCOUNTS[selectedBank].bankName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMethod === "ewallet" && (
                      <div className="space-y-4">
                        <div className="flex gap-2 border-b border-navy-500/5 pb-3 overflow-x-auto">
                          {EWALLET_ACCOUNTS.map((wallet, index) => (
                            <button
                              key={wallet.walletName}
                              type="button"
                              onClick={() => setSelectedWallet(index)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                                selectedWallet === index
                                  ? "bg-brand-500 text-white"
                                  : "bg-white text-navy-500/70 border border-navy-100 hover:bg-navy-50"
                              }`}
                            >
                              {wallet.walletName}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-navy-500/5">
                            <div>
                              <p className="text-[9px] font-bold text-navy-500/40 uppercase tracking-wider">Nomor E-Wallet / HP</p>
                              <p className="text-sm font-black text-navy-500 font-mono">
                                {EWALLET_ACCOUNTS[selectedWallet].phoneNo}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(EWALLET_ACCOUNTS[selectedWallet].phoneNo, "wallet")}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-navy-50 hover:bg-navy-100 text-navy-500 transition-all cursor-pointer"
                            >
                              {copied === "wallet" ? (
                                <>
                                  <Check size={12} className="text-green-500" />
                                  Tersalin!
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  Salin
                                </>
                              )}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-white/40 p-3 rounded-xl border border-dashed border-navy-200 text-xs">
                            <div>
                              <p className="text-[9px] font-bold text-navy-500/40 uppercase tracking-wider">Nama Penerima</p>
                              <p className="font-extrabold text-navy-500">
                                {EWALLET_ACCOUNTS[selectedWallet].holderName}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-navy-500/40 uppercase tracking-wider">Provider</p>
                              <p className="font-extrabold text-navy-500">
                                {EWALLET_ACCOUNTS[selectedWallet].walletName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMethod === "whatsapp" && (
                      <div className="text-center py-4 space-y-2">
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-2">
                          <MessageSquare size={20} />
                        </div>
                        <h4 className="text-xs font-extrabold text-navy-500">Hubungi Langsung via WhatsApp</h4>
                        <p className="text-[10px] font-bold text-navy-500/50 max-w-xs mx-auto leading-relaxed">
                          Anda dapat mendiskusikan metode pembayaran lain, meminta faktur/invoice, atau konfirmasi langsung dengan Admin Instapro melalui chat WhatsApp.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sender Details Input (only for non-whatsapp methods) */}
                  {selectedMethod !== "whatsapp" && (
                    <div className="mt-4 pt-4 border-t border-navy-500/5 space-y-4">
                      <p className="text-[10px] font-extrabold text-brand-500 uppercase tracking-widest">
                        Konfirmasi Detail Rekening Pengirim
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-navy-500/50 uppercase tracking-wider">
                            Nama Pemilik Rekening / Akun
                          </label>
                          <input
                            type="text"
                            required
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="Contoh: Budi Santoso"
                            className="input-glass text-xs font-semibold py-2"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-navy-500/50 uppercase tracking-wider">
                            Nomor Rekening / No. HP Pengirim
                          </label>
                          <input
                            type="text"
                            required
                            value={senderAccount}
                            onChange={(e) => setSenderAccount(e.target.value)}
                            placeholder="Contoh: 1220xxxx atau 0812xxxx"
                            className="input-glass text-xs font-semibold py-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-xs font-bold justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Sedang Memproses...
                    </>
                  ) : (
                    <>
                      Kirim Pemesanan ({formatRupiah(totalPrice)})
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Review */}
            <div className="lg:col-span-2">
              <div className="glass rounded-3xl bg-white p-6 sticky top-24 space-y-6 border border-navy-500/5 shadow-sm">
                <h2 className="text-navy-500 font-extrabold text-base flex items-center gap-2">
                  <ShoppingBag className="text-brand-500" size={20} />
                  Review Pemesanan
                </h2>

                <div className="divide-y divide-navy-500/5">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-navy-500 font-bold text-xs truncate">{item.name}</p>
                        <p className="text-navy-500/40 text-[10px] font-bold uppercase mt-0.5">Jumlah: {item.quantity}</p>
                      </div>
                      <span className="text-navy-500 font-extrabold text-xs">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-navy-500/5 space-y-3 text-xs font-bold text-navy-500/75">
                  <div className="flex justify-between">
                    <span className="text-navy-500/55">Subtotal</span>
                    <span>{formatRupiah(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-navy-500 font-extrabold text-sm">Total Pembayaran</span>
                    <span className="text-brand-500 font-extrabold text-base">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
