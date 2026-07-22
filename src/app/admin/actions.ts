"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

export async function createArticle(formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || (title ? slugify(title) : "");
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const image = (formData.get("image") as string)?.trim() || "/images/articles/default.jpg";
  const category = (formData.get("category") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || "Admin Instapro";
  const published = formData.get("published") === "on";
  const dateStr = formData.get("date") as string;
  const createdAt = dateStr ? new Date(dateStr) : new Date();

  if (!title || !excerpt || !content || !category) {
    return { error: "Judul, ringkasan, konten, dan kategori wajib diisi." };
  }

  try {
    await prisma.article.create({
      data: { title, slug, excerpt, content, image, category, author, published, createdAt },
    });
    revalidatePath("/berita");
    revalidatePath("/admin/artikel");
    return { success: true };
  } catch (error) {
    console.error("Gagal menyimpan artikel:", error);
    return { error: "Gagal menyimpan artikel. Slug mungkin sudah digunakan." };
  }
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || (title ? slugify(title) : "");
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const image = (formData.get("image") as string)?.trim() || "/images/articles/default.jpg";
  const category = (formData.get("category") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || "Admin Instapro";
  const published = formData.get("published") === "on";
  const dateStr = formData.get("date") as string;
  const createdAt = dateStr ? new Date(dateStr) : undefined;

  if (!title || !excerpt || !content || !category) {
    return { error: "Judul, ringkasan, konten, dan kategori wajib diisi." };
  }

  try {
    await prisma.article.update({
      where: { id },
      data: { 
        title, 
        slug, 
        excerpt, 
        content, 
        image, 
        category, 
        author, 
        published,
        ...(createdAt ? { createdAt } : {})
      },
    });
    revalidatePath("/berita");
    revalidatePath(`/berita/${slug}`);
    revalidatePath("/admin/artikel");
    return { success: true };
  } catch (error) {
    console.error("Gagal memperbarui artikel:", error);
    return { error: "Gagal memperbarui artikel." };
  }
}

export async function deleteArticle(id: string) {
  await requireAdmin();

  try {
    await prisma.article.delete({ where: { id } });
    revalidatePath("/berita");
    revalidatePath("/admin/artikel");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus artikel:", error);
    return { error: "Gagal menghapus artikel." };
  }
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || (name ? slugify(name) : "");
  const description = (formData.get("description") as string)?.trim();
  const price = parseInt(formData.get("price") as string, 10);
  const image = (formData.get("image") as string)?.trim() || "/images/products/default.jpg";
  const galleryRaw = (formData.get("gallery") as string)?.trim();
  const featuresRaw = (formData.get("features") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const stock = parseInt(formData.get("stock") as string, 10) || 0;
  const featured = formData.get("featured") === "on";

  const gallery = galleryRaw
    ? galleryRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [image];
  const features = featuresRaw
    ? featuresRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  if (!name || !description || !category || isNaN(price)) {
    return { error: "Nama, deskripsi, kategori, dan harga wajib diisi." };
  }

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        image,
        gallery: JSON.stringify(gallery),
        features: JSON.stringify(features),
        category,
        stock,
        featured,
      },
    });
    revalidatePath("/katalog");
    revalidatePath("/admin/produk");
    return { success: true };
  } catch (error) {
    console.error("Gagal menyimpan produk:", error);
    return { error: "Gagal menyimpan produk. Slug mungkin sudah digunakan." };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || (name ? slugify(name) : "");
  const description = (formData.get("description") as string)?.trim();
  const price = parseInt(formData.get("price") as string, 10);
  const image = (formData.get("image") as string)?.trim() || "/images/products/default.jpg";
  const galleryRaw = (formData.get("gallery") as string)?.trim();
  const featuresRaw = (formData.get("features") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const stock = parseInt(formData.get("stock") as string, 10) || 0;
  const featured = formData.get("featured") === "on";

  const gallery = galleryRaw
    ? galleryRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [image];
  const features = featuresRaw
    ? featuresRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  if (!name || !description || !category || isNaN(price)) {
    return { error: "Nama, deskripsi, kategori, dan harga wajib diisi." };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        image,
        gallery: JSON.stringify(gallery),
        features: JSON.stringify(features),
        category,
        stock,
        featured,
      },
    });
    revalidatePath("/katalog");
    revalidatePath(`/katalog/${slug}`);
    revalidatePath("/admin/produk");
    return { success: true };
  } catch (error) {
    console.error("Gagal memperbarui produk:", error);
    return { error: "Gagal memperbarui produk." };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/katalog");
    revalidatePath("/admin/produk");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    return { error: "Gagal menghapus produk. Produk mungkin masih terkait pesanan." };
  }
}
