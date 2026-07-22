export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  caseStudy?: {
    title: string;
    description: string;
  };
}

export const services: ServiceItem[] = [
  {
    id: "uiux",
    icon: "LaptopDesignIcon",
    title: "UI/UX System Design",
    shortDesc: "Desain antarmuka modern, interaktif, dan intuitif untuk kenyamanan pengguna maksimal.",
    longDesc: "Ubah sistem digital dan aplikasi Anda menjadi lebih modern, elegan, serta sangat ramah pengguna. Kami merancang alur pengalaman pengguna (UX) yang minim hambatan dan antarmuka visual (UI) kelas dunia yang meningkatkan kepuasan pengguna, konversi bisnis, serta citra profesional institusi Anda secara signifikan.",
    caseStudy: {
      title: "Redesain & Optimalisasi Portal Layanan Publik",
      description: "Berhasil mentransformasi portal publik yang rumit menjadi efisien dan intuitif, meningkatkan tingkat kepuasan pengguna (User Satisfaction) hingga 65% serta mempercepat waktu transaksi layanan hingga 45%.",
    },
  },
  {
    id: "webdev",
    icon: "Code2",
    title: "Website & System Development",
    shortDesc: "Pengembangan sistem digital, portal web, dan aplikasi siap pakai berkinerja tinggi.",
    longDesc: "Bangun platform digital yang cepat, aman, dan dapat diandalkan sesuai alur kerja spesifik organisasi Anda. Dari Sistem Informasi Manajemen (SIM), portal pelayanan publik, hingga aplikasi berbasis web/mobile kompleks — kami hadirkan solusi teknologi berkinerja tinggi dengan keamanan standar industri dan arsitektur yang mudah dikembangkan.",
    caseStudy: {
      title: "Sistem Terintegrasi Tata Kelola Administrasi & Keuangan",
      description: "Membangun sistem informasi terpadu yang menghubungkan operasional harian, laporan keuangan otomatis, dan pencatatan transaksi secara real-time tanpa risiko kebocoran data.",
    },
  },
  {
    id: "digital-strategy",
    icon: "TrendingUp",
    title: "Digital Strategy & Consultation",
    shortDesc: "Perencanaan strategi transformasi digital yang presisi untuk akselerasi pertumbuhan organisasi.",
    longDesc: "Navigasi transformasi digital organisasi Anda bersama para pakar terpercaya. Kami memetakan kebutuhan arsitektur IT, mengoptimalkan proses bisnis yang tidak efisien, dan merumuskan roadmap teknologi tepat sasaran yang menghemat anggaran operasional sekaligus memaksimalkan hasil kerja jangka panjang.",
    caseStudy: {
      title: "Peta Jalan (Roadmap) Transformasi Digital Instansi & Bisnis",
      description: "Merumuskan strategi digitalisasi menyeluruh yang berhasil memangkas proses birokrasi manual sebesar 50% dan mempercepat akselerasi adopsi teknologi staf secara signifikan.",
    },
  },
  {
    id: "socmed",
    icon: "Cpu",
    title: "Custom Software Development",
    shortDesc: "Solusi perangkat lunak khusus yang dirancang presisi sesuai alur kerja unik bisnis Anda.",
    longDesc: "Setiap organisasi memiliki tantangan operasional yang unik. Kami menciptakan perangkat lunak tailor-made (khusus) mulai dari sistem manajemen inventaris, sistem absensi berbasis GPS/Radius, hingga otomatisasi dokumen operasional yang bekerja tepat sesuai kebutuhan dan aturan main bisnis Anda.",
    caseStudy: {
      title: "Sistem Absensi Digital & Monitoring Operasional Real-Time",
      description: "Mengembangkan aplikasi absensi digital berfitur Geofencing GPS dan verifikasi kamera yang meningkatkan kedisiplinan serta efisiensi pengawasan staf lapangan hingga 90%.",
    },
  },
  {
    id: "training",
    icon: "GraduationCap",
    title: "Instapro Learning Academy",
    shortDesc: "Program pelatihan profesional & pendampingan SDM untuk kesiapan adopsi teknologi.",
    longDesc: "Teknologi canggih hanya akan sukses jika SDM Anda siap mengelolanya. Melalui Instapro Learning Academy, kami menyediakan pelatihan profesional, sertifikasi, serta pendampingan langsung (in-house training) yang praktis dan berorientasi hasil untuk memastikan staf Anda mahir mengoperasikan sistem digital dengan percaya diri.",
    caseStudy: {
      title: "Pendampingan & Pelatihan Digitalisasi SDM Organisasi",
      description: "Melatih dan mendampingi 200+ staf serta operator dalam adopsi sistem digital baru, mencapai tingkat kelancaran operasional mandiri 100% hanya dalam 2 minggu.",
    },
  },
];
