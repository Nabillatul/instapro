import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "lib", "kelas-photos.json");

export interface ClassPhotoData {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  authorName: string;
  authorRole: string;
  category: string;
  createdAt: string;
}

const initialPhotos: ClassPhotoData[] = [
  {
    id: "kp-1",
    title: "Pelatihan Digitalisasi Administrasi Desa",
    imageUrl: "/images/gambarbg2.jpeg",
    caption: "Diskusi publik dan pendampingan implementasi aplikasi tata kelola desa bersama perangkat aparatur daerah.",
    authorName: "Drs. Ahmad Subakti",
    authorRole: "Kepala Dinas Pemberdayaan Masyarakat Desa",
    category: "Pelatihan Aparatur",
    createdAt: new Date().toISOString(),
  },
  {
    id: "kp-2",
    title: "Workshop Sertifikasi SDM & IT Governance",
    imageUrl: "/gambarbg.jpeg",
    caption: "Momen kelulusan peserta batch intensif Instapro Learning Academy dengan penyerahan sertifikat resmi.",
    authorName: "Bpk. Krido Kawal Basuki",
    authorRole: "Kepala Desa Tambusai",
    category: "Testimoni Alumni",
    createdAt: new Date().toISOString(),
  },
  {
    id: "kp-3",
    title: "Pendampingan Teknis Operator SIM-TKD & PELITA",
    imageUrl: "/images/gambarbg2.jpeg",
    caption: "Sesi simulasi langsung pengoperasian portal administrasi desa dan pengolahan data kependudukan online.",
    authorName: "Siti Rahmawati, S.Kom",
    authorRole: "Operator SIM-TKD Desa Rumbio",
    category: "In-House Training",
    createdAt: new Date().toISOString(),
  },
];

export function getPhotosFromFile(): ClassPhotoData[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading kelas-photos.json:", err);
  }
  return initialPhotos;
}

export function savePhotosToFile(photos: ClassPhotoData[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(photos, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing kelas-photos.json:", err);
  }
}
