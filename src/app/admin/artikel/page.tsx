import { getArticles } from "@/lib/articles";
import ArticleManager from "./ArticleManager";

export default async function AdminArtikelPage() {
  const articles = await getArticles(false);

  return <ArticleManager articles={articles} />;
}
