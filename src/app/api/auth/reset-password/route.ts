import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;
    const newPassword = body.newPassword;

    console.log("🔐 reset-password called:", { email: email ? email.substring(0, 5) + "..." : null, hasPassword: !!newPassword });

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    const passwordClean = String(newPassword).trim();

    if (passwordClean.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const emailClean = String(email).toLowerCase().trim();

    // First find user
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: emailClean, mode: "insensitive" },
      },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      console.log("❌ User not found for email:", emailClean);
      return NextResponse.json(
        { error: "Email tidak ditemukan di sistem." },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(passwordClean, 10);

    // Immediately verify the hash is correct before saving
    const hashCheck = await bcrypt.compare(passwordClean, hashedPassword);
    console.log(`Hash pre-verify: ${hashCheck}`);

    // Update password in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
      select: { id: true, email: true, password: true },
    });

    // Verify the hash stored in DB matches
    const dbCheck = await bcrypt.compare(passwordClean, updatedUser.password!);
    console.log(`✅ DB password verify: ${dbCheck} for user: ${updatedUser.email}`);

    if (!dbCheck) {
      console.error("❌ CRITICAL: Password stored but verification failed!");
      return NextResponse.json(
        { error: "Gagal menyimpan password baru. Coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui! Silakan login dengan password baru.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem saat memperbarui password." },
      { status: 500 }
    );
  }
}

