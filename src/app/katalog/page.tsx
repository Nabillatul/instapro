import { getProducts, getProductCategories } from "@/lib/products";
import KatalogClient from "./KatalogClient";

export default async function KatalogPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);

  return <KatalogClient products={products} categories={categories} />;
}
