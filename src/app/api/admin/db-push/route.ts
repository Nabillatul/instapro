import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Ensure the image column exists by attempting a no-op update
// This acts as a schema check endpoint
export async function GET() {
  try {
    // Try to read the image field from the User model
    const testUser = await prisma.user.findFirst({
      select: { id: true, image: true },
    });
    return NextResponse.json({ success: true, imageFieldExists: true, sample: testUser?.image ?? null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
