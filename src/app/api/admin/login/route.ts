import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const ADMIN_SESSION_TOKEN = "admin_session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();

    // Cari user di database berdasarkan email (case insensitive)
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: emailClean, mode: "insensitive" },
      },
    });

    // Validasi apakah user ada dan memiliki role "admin"
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Email atau password admin salah." },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email atau password admin salah." },
        { status: 401 }
      );
    }

    // Create a simple admin session cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_TOKEN, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
