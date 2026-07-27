import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { auth } from "@/auth";
import { cookies } from "next/headers";

async function isAuthenticated() {
  const session = await auth();
  if (session?.user) return true;

  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  if (adminSession && adminSession.value === "authenticated") return true;

  return false;
}

export async function POST(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary (always — credentials are baked into @/lib/cloudinary)
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "instapro/profiles",
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) reject(error || new Error("Cloudinary upload error"));
          else resolve({ secure_url: result.secure_url });
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ success: true, url: uploadResult.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengunggah gambar" },
      { status: 500 }
    );
  }
}
