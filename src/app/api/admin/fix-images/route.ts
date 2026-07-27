import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

async function uploadBase64ToCloudinary(base64Data: string): Promise<string | null> {
  const matches = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1] || "png";
  const buffer = Buffer.from(matches[2], "base64");

  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "instapro/profiles", resource_type: "image", transformation: [{ quality: "auto", fetch_format: "auto" }] },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve({ secure_url: result.secure_url });
          }
        );
        stream.end(buffer);
      });
      return result.secure_url;
    } catch (e) {
      console.warn("Cloudinary upload failed, using local storage:", e);
    }
  }

  // Fallback to local
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const filename = `avatar-${Date.now()}.${ext}`;
  await fs.promises.writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

// GET: Fix all users with base64 images in DB
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  
  // Simple secret check to prevent unauthorized access
  if (secret !== "fix-base64-images-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, image: true },
    });

    const fixed: string[] = [];
    const cleared: string[] = [];

    for (const user of users) {
      if (user.image && user.image.startsWith("data:image/")) {
        console.log(`🔧 Fixing base64 image for: ${user.email}`);
        const newUrl = await uploadBase64ToCloudinary(user.image);
        
        if (newUrl) {
          await prisma.user.update({
            where: { id: user.id },
            data: { image: newUrl },
          });
          fixed.push(user.email);
        } else {
          // If upload fails, just clear the image
          await prisma.user.update({
            where: { id: user.id },
            data: { image: null },
          });
          cleared.push(user.email);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixed.length} users, cleared ${cleared.length} users`,
      fixed,
      cleared,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
