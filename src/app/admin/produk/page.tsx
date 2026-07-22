import { getProducts } from "@/lib/products";
import ProductManager from "./ProductManager";

export default async function AdminProdukPage() {
  const products = await getProducts();

  return <ProductManager products={products} />;
}
