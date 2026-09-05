import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { listTrialRequests } from "@/lib/trial-store";
import AdminNav from "@/components/AdminNav";
import TrialStatusSelect from "@/components/TrialStatusSelect";
import DeleteButton from "@/components/DeleteButton";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export default async function AdminTrialRequestsPage() {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const requests = await listTrialRequests().catch((err) => {
    console.error("[admin/trial-requests] failed to load", err);
    return [];
  });

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <h1 className="font-display text-xl font-semibold text-maroon-900">
          Đăng ký dùng thử ({requests.length})
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          Đối tác đăng ký nhận sản phẩm dùng thử từ form ở trang chủ — dùng để chăm sóc và gửi
          mẫu.
        </p>

        {requests.length === 0 ? (
          <p className="mt-6 text-sm text-ink-700">Chưa có ai đăng ký dùng thử.</p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-gold-500/20 bg-white">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-gold-500/20 text-left text-xs uppercase tracking-wide text-ink-700/60">
                  <th className="px-4 py-3">Họ tên</th>
                  <th className="px-4 py-3">SĐT</th>
                  <th className="px-4 py-3">Nghề nghiệp / công tác</th>
                  <th className="px-4 py-3">Sản phẩm muốn dùng thử</th>
                  <th className="px-4 py-3">Ngày đăng ký</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-gold-500/10 align-top">
                    <td className="px-4 py-3 font-medium text-maroon-900">{r.name}</td>
                    <td className="px-4 py-3 text-ink-700">{r.phone}</td>
                    <td className="px-4 py-3 text-ink-700">{r.occupation}</td>
                    <td className="px-4 py-3 text-ink-700">
                      {r.productNames.length === 0 ? (
                        "—"
                      ) : (
                        <ul className="list-disc space-y-0.5 pl-4">
                          {r.productNames.map((name, i) => (
                            <li key={i}>{name}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-700">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <TrialStatusSelect requestId={r.id} status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      <DeleteButton
                        endpoint={`/api/admin/trial-requests/${r.id}`}
                        confirmMessage={`Xoá đăng ký dùng thử của "${r.name}"?`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
