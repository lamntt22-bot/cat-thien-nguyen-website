import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { listProducts } from "@/lib/product-store";
import { listOrdersForMember } from "@/lib/order-store";
import LogoutButton from "@/components/LogoutButton";
import OrderProductButton from "@/components/OrderProductButton";

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Đang chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
};

export default async function DashboardPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");

  const [products, orders] = await Promise.all([
    listProducts(),
    listOrdersForMember(member.id),
  ]);

  return (
    <main className="min-h-screen bg-cream-100">
      <header className="border-b border-gold-500/25 bg-maroon-900 text-cream-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <p className="font-display text-lg font-semibold">Xin chào, {member.name}</p>
            <p className="text-xs text-cream-100/70">
              {member.phone} · {member.email}
            </p>
          </div>
          <LogoutButton className="rounded-full border border-cream-50/30 px-4 py-2 text-sm font-semibold transition hover:bg-cream-50/10" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <section>
          <h2 className="font-display text-xl font-semibold text-maroon-900">
            Yêu cầu mua hàng của bạn
          </h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-ink-700">
              Bạn chưa có yêu cầu mua nào — chọn sản phẩm bên dưới và bấm &ldquo;Quan tâm
              mua&rdquo; để đội ngũ CTN liên hệ tư vấn.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-gold-500/20 bg-white">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-gold-500/20 text-left text-xs uppercase tracking-wide text-ink-700/60">
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3">Số lượng</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-gold-500/10">
                      <td className="px-4 py-3 font-medium text-maroon-900">{o.productName}</td>
                      <td className="px-4 py-3 text-ink-700">{o.quantity}</td>
                      <td className="px-4 py-3 text-ink-700">
                        {ORDER_STATUS_LABEL[o.status] ?? o.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-maroon-900">
            Sản phẩm Cát Thiên Nguyên
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col rounded-2xl border border-gold-500/20 bg-white p-4"
              >
                <h3 className="font-display text-base font-semibold text-maroon-900">
                  {p.name}
                </h3>
                <p className="mt-1 flex-1 text-sm text-ink-700">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-red-600">
                    {p.price}
                  </span>
                  <OrderProductButton productId={p.id} productName={p.name} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
