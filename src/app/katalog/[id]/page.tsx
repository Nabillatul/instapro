import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductBySlug(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
