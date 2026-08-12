import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { listProducts } from "@/lib/product-store";
import AdminNav from "@/components/AdminNav";
import DeleteButton from "@/components/DeleteButton";

const CATEGORY_LABEL: Record<string, string> = {
  "tra-dong-y": "Trà Đông Y",
  "ngoc-am": "Tinh dầu Ngọc Am",
  bach: "Chăm sóc Bạch",
};

export default async function AdminProductsPage() {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const products = await listProducts();

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-xl font-semibold text-maroon-900">
            Sản phẩm ({products.length})
          </h1>
          <a
            href="/admin/products/new"
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
          >
            + Thêm sản phẩm
          </a>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-gold-500/20 bg-white">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-gold-500/20 text-left text-xs uppercase tracking-wide text-ink-700/60">
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Dòng</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gold-500/10">
                  <td className="px-4 py-3 font-medium text-maroon-900">{p.name}</td>
                  <td className="px-4 py-3 text-ink-700">
                    {CATEGORY_LABEL[p.category] ?? p.category}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{p.price}</td>
                  <td className="px-4 py-3 text-ink-700">{p.badge ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/products/${p.id}/edit`}
                        className="rounded-full border border-maroon-900/20 px-3 py-1.5 text-xs font-semibold text-maroon-900 transition hover:bg-maroon-900/5"
                      >
                        Sửa
                      </a>
                      <DeleteButton
                        endpoint={`/api/admin/products/${p.id}`}
                        confirmMessage={`Xoá sản phẩm "${p.name}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
