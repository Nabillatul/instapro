import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { name, phone, image, password, email, isAdminUpdate } = await request.json();

    let hashedPassword: string | undefined;
    if (password && typeof password === "string" && password.trim().length > 0) {
      hashedPassword = await bcrypt.hash(password.trim(), 10);
    }

    if (isAdminUpdate) {
      // Admin update: check admin cookie
      const cookieStore = await cookies();
      const adminSession = cookieStore.get("admin_session");
      if (!adminSession || adminSession.value !== "authenticated") {
        return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
      }

      // Find the target admin user by email if provided, or fallback to first admin
      const emailToFind = email ? email.toLowerCase().trim() : undefined;
      const adminUser = await prisma.user.findFirst({
        where: emailToFind
          ? { email: { equals: emailToFind, mode: "insensitive" } }
          : { role: "admin" },
      });

      if (!adminUser) {
        return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
      }

      const updateData: any = {};
      if (name) updateData.name = name.trim();
      if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
      if (image !== undefined) updateData.image = image;
      if (hashedPassword) updateData.password = hashedPassword;

      const updated = await prisma.user.update({
        where: { id: adminUser.id },
        data: updateData,
      });

      console.log(`✅ Admin profile updated successfully for: ${updated.email}`);
      return NextResponse.json({ success: true, user: { name: updated.name, email: updated.email, phone: updated.phone, image: updated.image } });
    } else {
      // User update: check NextAuth session
      const session = await auth();
      if (!session?.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userEmailClean = session.user.email.toLowerCase().trim();
      const user = await prisma.user.findFirst({
        where: { email: { equals: userEmailClean, mode: "insensitive" } },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const updateData: any = {};
      if (name) updateData.name = name.trim();
      if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
      if (image !== undefined) updateData.image = image;
      if (hashedPassword) updateData.password = hashedPassword;

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      console.log(`✅ Customer profile updated successfully for: ${updated.email}`);
      return NextResponse.json({ success: true, user: { name: updated.name, email: updated.email, phone: updated.phone, image: updated.image } });
    }
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
