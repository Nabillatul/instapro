import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  if (!adminSession || adminSession.value !== "authenticated") {
    redirect("/admin-login");
  }

  return { authenticated: true };
}

export async function getAdminUser() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: "admin" },
      select: { id: true, name: true, email: true, phone: true, image: true },
    });
    return admin;
  } catch {
    return null;
  }
}
