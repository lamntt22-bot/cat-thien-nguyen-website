import { redirect, notFound } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { getProductById } from "@/lib/product-store";
import AdminNav from "@/components/AdminNav";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />
      <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <h1 className="font-display text-xl font-semibold text-maroon-900">
          Sửa sản phẩm — {product.name}
        </h1>
        <div className="mt-5 rounded-2xl border border-gold-500/20 bg-white p-6">
          <ProductForm product={product} />
        </div>
      </main>
    </div>
  );
}
