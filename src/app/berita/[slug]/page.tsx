import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import ArticleDetailClient from "./ArticleDetailClient";

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);

  if (!article || !article.published) {
    notFound();
  }

  const allArticles = await getArticles();
  let relatedArticles = allArticles.filter(
    (a) => a.category === article.category && a.id !== article.id
  );

  // If less than 5, fill up with other recent articles
  if (relatedArticles.length < 5) {
    const extraArticles = allArticles.filter(
      (a) => a.id !== article.id && !relatedArticles.some((r) => r.id === a.id)
    );
    relatedArticles = [...relatedArticles, ...extraArticles].slice(0, 5);
  } else {
    relatedArticles = relatedArticles.slice(0, 5);
  }

  return <ArticleDetailClient article={article} relatedArticles={relatedArticles} />;
}
