import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/admin-auth";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload buffer to Cloudinary via upload_stream
function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload gagal, tidak ada hasil dari Cloudinary"));
        } else {
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      }
    );
    stream.end(buffer);
  });
}

// GET: List uploaded images from Cloudinary folder
export async function GET() {
  try {
    await requireAdmin();

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "instapro/",
      resource_type: "image",
      max_results: 100,
    });

    const files = result.resources.map(
      (r: { secure_url: string }) => r.secure_url
    );

    return NextResponse.json({ files });
  } catch (error: any) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load gallery" },
      { status: 500 }
    );
  }
}

// POST: Upload a new file to Cloudinary
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary under "instapro" folder
    const result = await uploadToCloudinary(buffer, "instapro");

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
