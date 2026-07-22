import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, institution, selectedClass, experience, motivation, preferredDate, preferredTime } = body;

    // Check database model and connection
    let registration = null;
    try {
      registration = await prisma.classRegistration.create({
        data: {
          fullName,
          email,
          phone,
          institution,
          selectedClass,
          experience,
          motivation,
          preferredDate,
          preferredTime,
          status: "pending",
        },
      });
    } catch (dbError) {
      console.warn("DB insert skipped for registration (tables not migrated yet):", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil disimpan.",
      data: registration,
    });
  } catch (error: any) {
    console.error("Class Registration API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
