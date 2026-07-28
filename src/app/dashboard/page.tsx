import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import DashboardHeader from "./DashboardHeader";
import UserRegistrationsList from "./UserRegistrationsList";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  let registrations: any[] = [];
  let dbUser: any = null;

  try {
    const userEmail = session.user.email;
    if (userEmail) {
      try {
        const emailClean = userEmail.toLowerCase().trim();
        dbUser = await prisma.user.findFirst({
          where: { email: { equals: emailClean, mode: "insensitive" } },
          select: { id: true, name: true, email: true, phone: true, role: true, image: true },
        });
      } catch {
        // fallback
      }

      if (dbUser) {
        registrations = await prisma.classRegistration.findMany({
          where: { email: userEmail },
          orderBy: { createdAt: "desc" },
        });
      }
    }
  } catch (error) {
    console.error("Dashboard database fetch skipped:", error);
  }

  const userProfile = dbUser
    ? {
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || null,
        image: (dbUser as any).image || null,
        role: dbUser.role || "customer",
      }
    : {
        name: session.user.name || "Pengguna",
        email: session.user.email || "",
        phone: null,
        image: null,
        role: (session.user as any).role || "customer",
      };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-blush bg-nodes">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Profile Header with Edit & Motion Animations */}
          <DashboardHeader
            initialUser={userProfile}
            classesCount={registrations.length}
          />

          {/* Registrations & Program Aktivitas dengan Animasi */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-black text-navy-500 flex items-center gap-2">
                <GraduationCap className="text-brand-500" size={22} />
                Program Kelas Instapro Learning Academy
              </h2>
              <Link
                href="/kelas-quantum"
                className="text-xs font-extrabold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
              >
                Lihat Semua Program <ArrowRight size={14} />
              </Link>
            </div>

            <UserRegistrationsList registrations={registrations} />
          </div>

        </div>
      </div>
    </div>
  );
}
