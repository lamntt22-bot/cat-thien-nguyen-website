import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { listAllCheckouts } from "@/lib/checkout-store";
import { formatVnd } from "@/lib/format";
import AdminNav from "@/components/AdminNav";
import OrderStatusSelect from "@/components/OrderStatusSelect";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  bank_transfer: "Chuyển khoản",
  cod: "Thanh toán khi nhận hàng",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export default async function AdminOrdersPage() {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const checkouts = await listAllCheckouts().catch((err) => {
    console.error("[admin/orders] failed to load checkouts", err);
    return [];
  });

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <h1 className="font-display text-xl font-semibold text-maroon-900">
          Đơn hàng mua trực tiếp ({checkouts.length})
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          Đơn hàng khách đặt qua giỏ hàng trên website, thanh toán chuyển khoản hoặc khi nhận
          hàng.
        </p>

        {checkouts.length === 0 ? (
          <p className="mt-6 text-sm text-ink-700">Chưa có đơn hàng nào.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {checkouts.map((c) => (
              <div key={c.id} className="rounded-2xl border border-gold-500/20 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-sm font-semibold text-maroon-900">
                      {c.fullName} — {c.phone}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-700/70">{c.address}</p>
                    <p className="mt-1 text-xs text-ink-700/60">
                      {formatDate(c.createdAt)} ·{" "}
                      {PAYMENT_METHOD_LABEL[c.paymentMethod] ?? c.paymentMethod}
                      {c.note ? ` · Ghi chú: ${c.note}` : ""}
                    </p>
                  </div>
                  <OrderStatusSelect orderId={c.id} status={c.status} />
                </div>

                <ul className="mt-3 space-y-1 border-t border-gold-500/10 pt-3 text-sm text-ink-700">
                  {c.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium text-maroon-900">
                        {formatVnd(item.unitPrice * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex justify-end text-sm font-semibold text-red-600">
                  {formatVnd(c.totalAmount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
