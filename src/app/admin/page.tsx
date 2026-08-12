import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { listMembers } from "@/lib/member-store";
import { listAllOrders } from "@/lib/order-store";
import AdminNav from "@/components/AdminNav";
import ResetPasswordButton from "@/components/ResetPasswordButton";

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Đang chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export default async function AdminPage() {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const [members, orders] = await Promise.all([listMembers(), listAllOrders()]);
  const ordersByMember = new Map<string, typeof orders>();
  for (const o of orders) {
    ordersByMember.set(o.memberId, [...(ordersByMember.get(o.memberId) ?? []), o]);
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <h1 className="font-display text-xl font-semibold text-maroon-900">
          Khách hàng đã đăng ký ({members.length})
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          Toàn bộ khách đăng ký qua popup hoặc tự tạo tài khoản mua lẻ, kèm yêu cầu mua hàng của
          từng người (nếu có).
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-gold-500/20 bg-white">
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="border-b border-gold-500/20 text-left text-xs uppercase tracking-wide text-ink-700/60">
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Liên hệ</th>
                <th className="px-4 py-3">Sản phẩm quan tâm lúc đăng ký</th>
                <th className="px-4 py-3">Ngày đăng ký</th>
                <th className="px-4 py-3">Yêu cầu mua hàng</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const memberOrders = ordersByMember.get(m.id) ?? [];
                return (
                  <tr key={m.id} className="border-b border-gold-500/10 align-top">
                    <td className="px-4 py-3 font-medium text-maroon-900">
                      {m.name}
                      {m.role === "admin" && (
                        <span className="ml-2 rounded bg-maroon-900 px-1.5 py-0.5 text-[10px] font-bold text-gold-400">
                          ADMIN
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-700">
                      {m.phone}
                      <br />
                      {m.email}
                    </td>
                    <td className="px-4 py-3 text-ink-700">{m.interestedProduct ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-700">{formatDate(m.createdAt)}</td>
                    <td className="px-4 py-3 text-ink-700">
                      {memberOrders.length === 0 ? (
                        "—"
                      ) : (
                        <ul className="space-y-1">
                          {memberOrders.map((o) => (
                            <li key={o.id}>
                              {o.productName} × {o.quantity} —{" "}
                              <span className="font-medium">
                                {ORDER_STATUS_LABEL[o.status] ?? o.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-2">
                        <a
                          href={`/admin/members/${m.id}/edit`}
                          className="rounded-full border border-maroon-900/20 px-3 py-1.5 text-xs font-semibold text-maroon-900 transition hover:bg-maroon-900/5"
                        >
                          Sửa thông tin
                        </a>
                        <ResetPasswordButton memberId={m.id} memberName={m.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
