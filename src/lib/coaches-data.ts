import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "lib", "coaches.json");

export interface CoachData {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  skills: string[];
}

const initialCoaches: CoachData[] = [
  {
    id: "coach-1",
    name: "Setyo Irawan, S.IP",
    title: "Head Coach & Institutional Strategy",
    bio: "Pakar tata kelola birokrasi, strategi transformasi digital, dan pendampingan peningkatan kapasitas SDM institusi, korporasi, serta desa dengan pengalaman lebih dari 10 tahun.",
    image: "/images/Setyo Irawan, S.IP.jpg",
    skills: ["Transformasi Digital", "Tata Kelola Daerah", "Public Policy", "SDM Leadership"],
  },
];

export function getCoachesFromFile(): CoachData[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading coaches.json:", err);
  }
  return initialCoaches;
}

export function saveCoachesToFile(coaches: CoachData[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(coaches, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing coaches.json:", err);
  }
}
