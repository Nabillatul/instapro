import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { getCoachesFromFile } from "@/lib/coaches-data";
import { getPhotosFromFile } from "@/lib/kelas-photos-data";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  await requireAdmin();

  let articleCount = 0;
  let productCount = 0;
  let coachCount = 0;
  let photoCount = 0;

  try {
    articleCount = await prisma.article.count();
    productCount = await prisma.product.count();
  } catch {
    // fallback
  }

  try {
    const coaches = getCoachesFromFile();
    coachCount = Array.isArray(coaches) ? coaches.length : 0;

    const photos = getPhotosFromFile();
    photoCount = Array.isArray(photos) ? photos.length : 0;
  } catch {
    // fallback
  }

  return (
    <AdminDashboardClient
      articleCount={articleCount}
      productCount={productCount}
      coachCount={coachCount}
      photoCount={photoCount}
    />
  );
}