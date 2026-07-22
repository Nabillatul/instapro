import prisma from "@/lib/prisma";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  published: boolean;
}

function mapArticle(article: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: Date;
}): Article {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    image: article.image,
    category: article.category,
    author: article.author,
    date: article.createdAt.toISOString(),
    published: article.published,
  };
}

export async function getArticles(publishedOnly = true): Promise<Article[]> {
  try {
    const articles = await prisma.article.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: "desc" },
    });

    if (articles.length === 0) {
      return [];
    }

    return articles.map(mapArticle);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (article) return mapArticle(article);
  } catch {
    // fallback below
  }

  return undefined;
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.category === category);
}

export async function getCategories(): Promise<string[]> {
  const articles = await getArticles();
  return Array.from(new Set(articles.map((a) => a.category)));
}
