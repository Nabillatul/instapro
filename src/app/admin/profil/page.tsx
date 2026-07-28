import { requireAdmin, getAdminUser } from "@/lib/admin-auth";
import AdminProfilePage from "./AdminProfilePage";

export const metadata = {
  title: "Profil Admin | Instapro",
};

export default async function AdminProfilPage() {
  await requireAdmin();
  const admin = await getAdminUser();

  const adminProfile = {
    name: admin?.name ?? "Admin Instapro",
    email: admin?.email ?? "admin@instapro.co.id",
    phone: admin?.phone ?? null,
    image: admin?.image ?? null,
  };

  return <AdminProfilePage admin={adminProfile} />;
}
