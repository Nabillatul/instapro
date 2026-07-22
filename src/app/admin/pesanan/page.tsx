import { requireAdmin } from "@/lib/admin-auth";
import OrderManager from "./OrderManager";

export const metadata = {
  title: "Kelola Pesanan | Admin Instapro",
};

export default async function AdminPesananPage() {
  await requireAdmin();
  return <OrderManager />;
}
