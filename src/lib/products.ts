import prisma from "@/lib/prisma";

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  gallery: string[];
  category: string;
  features: string[];
  stock: number;
  featured: boolean;
}

function parseJsonArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];

  // Already an array
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }

  // Try to parse string
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string");
      }
    } catch {
      return [];
    }
  }

  return [];
}

function mapProduct(product: Record<string, any>): ProductItem {
  return {
    id: product.id || "",
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    price: Number(product.price) || 0,
    image: product.image || "",
    gallery: parseJsonArray(product.gallery),
    features: parseJsonArray(product.features),
    category: product.category || "",
    stock: Number(product.stock) || 0,
    featured: Boolean(product.featured) || false,
  };
}

export async function getProducts(): Promise<ProductItem[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!products || products.length === 0) {
      return [];
    }

    return products.map(mapProduct);
  } catch (error) {
    console.error("Failed to fetch products from database:", error);
    return [];
  }
}

export async function getProductBySlug(
  slug: string
): Promise<ProductItem | undefined> {
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (product) return mapProduct(product);
  } catch (error) {
    console.error(`Failed to fetch product with slug "${slug}":`, error);
  }

  return undefined;
}

export async function getProductById(
  id: string
): Promise<ProductItem | undefined> {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product) return mapProduct(product);
  } catch (error) {
    console.error(`Failed to fetch product with id "${id}":`, error);
  }

  return undefined;
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const products = await getProducts();
    const categories = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    return categories;
  } catch (error) {
    console.error("Failed to fetch product categories:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<ProductItem[]> {
  try {
    const products = await getProducts();
    return products.filter((p) => p.featured);
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}