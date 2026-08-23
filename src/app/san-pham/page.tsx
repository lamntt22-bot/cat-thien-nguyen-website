import type { Metadata } from "next";
import ProductsSection from "@/components/ProductsSection";
import { listProducts, type ProductRecord } from "@/lib/product-store";

export const metadata: Metadata = {
  title: "Sản phẩm — Cát Thiên Nguyên",
  description:
    "3 dòng sản phẩm của Cát Thiên Nguyên: Trà Đông Y, Tinh dầu Phong Thủy Ngọc Am, và dòng chăm sóc thiên nhiên Bạch.",
};

export default async function SanPhamPage() {
  let products: ProductRecord[] = [];
  try {
    products = await listProducts();
  } catch (err) {
    console.error("[san-pham] failed to load products", err);
  }

  return (
    <main>
      <ProductsSection products={products} />
    </main>
  );
}
