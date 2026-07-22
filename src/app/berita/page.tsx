import { getArticles, getCategories } from "@/lib/articles";
import BeritaClient from "./BeritaClient";

export default async function BeritaPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  return <BeritaClient articles={articles} categories={categories} />;
}
