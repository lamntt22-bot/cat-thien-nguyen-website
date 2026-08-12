import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import AdminNav from "@/components/AdminNav";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />
      <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <h1 className="font-display text-xl font-semibold text-maroon-900">Thêm sản phẩm</h1>
        <div className="mt-5 rounded-2xl border border-gold-500/20 bg-white p-6">
          <ProductForm />
        </div>
      </main>
    </div>
  );
}
