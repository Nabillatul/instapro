import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ShoppingBag, GraduationCap, Inbox } from "lucide-react";
import UserOrdersList from "./UserOrdersList";
import DashboardHeader from "./DashboardHeader";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  let orders: any[] = [];
  let registrations: any[] = [];
  let dbUser: any = null;

  try {
    const userEmail = session.user.email;
    if (userEmail) {
      try {
        dbUser = await prisma.user.findUnique({
          where: { email: userEmail },
          select: { id: true, name: true, email: true, phone: true, role: true, image: true },
        });
      } catch {
        // fallback without extra fields
      }

      if (dbUser) {
        orders = await prisma.order.findMany({
          where: { userId: dbUser.id },
          include: {
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });

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
        <div className="max-w-6xl mx-auto">

          {/* Profile Header with Edit */}
          <DashboardHeader initialUser={userProfile} />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Orders */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-extrabold text-navy-500 flex items-center gap-2">
                <ShoppingBag className="text-brand-500" size={20} />
                Riwayat Pesanan
              </h2>
              <UserOrdersList initialOrders={orders} />
            </div>

            {/* Registrations */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-navy-500 flex items-center gap-2">
                <GraduationCap className="text-brand-500" size={20} />
                Kelas Quantum
              </h2>

              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div key={reg.id} className="glass rounded-2xl bg-white p-5 border border-navy-500/5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start text-xs">
                      <span className="text-brand-500 font-extrabold">{reg.selectedClass}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        reg.status === "confirmed"
                          ? "bg-green-50 text-green-600"
                          : reg.status === "completed"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        {reg.status === "confirmed" ? "Dikonfirmasi"
                          : reg.status === "completed" ? "Selesai"
                          : "Menunggu"}
                      </span>
                    </div>
                    <p className="text-navy-500/60 text-[10px] font-semibold leading-relaxed">
                      {reg.preferredDate} ({reg.preferredTime})
                    </p>
                    <div className="pt-2 border-t border-navy-500/5 flex justify-between text-[10px] font-bold text-navy-500/40">
                      <span>Daftar pada</span>
                      <span>{formatDate(reg.createdAt)}</span>
                    </div>
                  </div>
                ))}

                {registrations.length === 0 && (
                  <div className="glass rounded-2xl bg-white p-8 text-center border border-navy-500/5 shadow-sm">
                    <Inbox className="mx-auto mb-3 text-navy-500/20" size={32} />
                    <p className="text-navy-500/40 text-xs font-semibold">Belum terdaftar di kelas manapun.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
