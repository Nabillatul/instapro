import { NextResponse } from "next/server";
import { getCoachesFromFile, saveCoachesToFile } from "@/lib/coaches-data";

export async function GET() {
  const coaches = getCoachesFromFile();
  return NextResponse.json({ success: true, coaches });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, title, bio, image, skills } = body;

    if (!name || !title) {
      return NextResponse.json(
        { success: false, message: "Nama dan Jabatan wajib diisi." },
        { status: 400 }
      );
    }

    const coaches = getCoachesFromFile();
    const newCoach = {
      id: "coach-" + Date.now(),
      name,
      title,
      bio: bio || "",
      image: image || "/images/Setyo Irawan, S.IP.jpg",
      skills: Array.isArray(skills) ? skills : typeof skills === "string" ? skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    };

    coaches.push(newCoach);
    saveCoachesToFile(coaches);

    return NextResponse.json({ success: true, coach: newCoach });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, title, bio, image, skills } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID wajib disertakan." }, { status: 400 });
    }

    let coaches = getCoachesFromFile();
    const idx = coaches.findIndex((c: any) => c.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Coach tidak ditemukan." }, { status: 404 });
    }

    coaches[idx] = {
      ...coaches[idx],
      name: name ?? coaches[idx].name,
      title: title ?? coaches[idx].title,
      bio: bio ?? coaches[idx].bio,
      image: image ?? coaches[idx].image,
      skills: Array.isArray(skills) ? skills : typeof skills === "string" ? skills.split(",").map((s: string) => s.trim()).filter(Boolean) : coaches[idx].skills,
    };

    saveCoachesToFile(coaches);
    return NextResponse.json({ success: true, coach: coaches[idx] });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID wajib disertakan." }, { status: 400 });
    }

    let coaches = getCoachesFromFile();
    coaches = coaches.filter((c: any) => c.id !== id);
    saveCoachesToFile(coaches);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
