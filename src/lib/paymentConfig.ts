
// 1. DAFTAR REKENING BANK PT
export const BANK_ACCOUNTS = [
  {
    bankName: "Bank BCA",
    accountNo: "1234567890", // GANTI nomor rekening BCA PT di sini
    holderName: "PT. Insta Pro Solution",
  },
  {
    bankName: "Bank Mandiri",
    accountNo: "9876543210987", // GANTI nomor rekening Mandiri PT di sini
    holderName: "PT. Insta Pro Solution",
  },
  {
    bankName: "Bank BRI",
    accountNo: "0001020304050607", // GANTI nomor rekening BRI PT di sini
    holderName: "PT. Insta Pro Solution",
  },
];

// 2. PATH GAMBAR QRIS PT
// Pastikan file gambar QRIS ditaruh di dalam folder `/public/` (misalnya `/public/qris-pt.png`)
// dan tuliskan path-nya di bawah ini (misal: "/qris-pt.png").
// Saat ini kami sediakan placeholder QR agar tampilan tetap terlihat sangat premium.
export const QRIS_IMAGE_PATH = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PT%20INSTA%20PRO%20SOLUTION%20QRIS"; 

// 3. DAFTAR NOMOR E-WALLET PT
export const EWALLET_ACCOUNTS = [
  {
    walletName: "DANA",
    phoneNo: "08217710106", // GANTI nomor DANA di sini
    holderName: "PT. Insta Pro Solution",
  },
  {
    walletName: "GoPay / OVO",
    phoneNo: "08217710106", // GANTI nomor GoPay / OVO di sini
    holderName: "PT. Insta Pro Solution",
  },
];
