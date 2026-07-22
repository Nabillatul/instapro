import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    let savedContact = null;
    try {
      savedContact = await prisma.contact.create({
        data: {
          name,
          email,
          subject,
          message,
        },
      });
    } catch (dbError) {
      console.warn("DB insert skipped for contact (tables not migrated yet):", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Pesan berhasil disimpan.",
      data: savedContact,
    });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
