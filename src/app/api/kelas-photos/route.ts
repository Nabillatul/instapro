import { NextResponse } from "next/server";
import { getPhotosFromFile, savePhotosToFile } from "@/lib/kelas-photos-data";

export async function GET() {
  const photos = getPhotosFromFile();
  return NextResponse.json({ success: true, photos });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, imageUrl, caption, authorName, authorRole, category } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Judul dan Gambar wajib diisi" },
        { status: 400 }
      );
    }

    const photos = getPhotosFromFile();
    const newPhoto = {
      id: "kp-" + Date.now(),
      title,
      imageUrl,
      caption: caption || "",
      authorName: authorName || "",
      authorRole: authorRole || "",
      category: category || "Testimoni Alumni",
      createdAt: new Date().toISOString(),
    };

    photos.unshift(newPhoto);
    savePhotosToFile(photos);

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, imageUrl, caption, authorName, authorRole, category } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID wajib diisi" }, { status: 400 });
    }

    let photos = getPhotosFromFile();
    const idx = photos.findIndex((p) => p.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Foto tidak ditemukan" }, { status: 404 });
    }

    photos[idx] = {
      ...photos[idx],
      title: title ?? photos[idx].title,
      imageUrl: imageUrl ?? photos[idx].imageUrl,
      caption: caption ?? photos[idx].caption,
      authorName: authorName ?? photos[idx].authorName,
      authorRole: authorRole ?? photos[idx].authorRole,
      category: category ?? photos[idx].category,
    };

    savePhotosToFile(photos);
    return NextResponse.json({ success: true, photo: photos[idx] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID wajib diisi" }, { status: 400 });
    }

    let photos = getPhotosFromFile();
    photos = photos.filter((p) => p.id !== id);
    savePhotosToFile(photos);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
