import QRCode from "qrcode";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { listLuckySpins } from "@/lib/lucky-spin-store";
import AdminNav from "@/components/AdminNav";
import DeleteButton from "@/components/DeleteButton";
import LuckySpinRedeemedToggle from "@/components/LuckySpinRedeemedToggle";

const SPIN_PAGE_URL = "https://catthiennguyen.com/vong-quay-may-man";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export default async function AdminLuckySpinsPage() {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const spins = await listLuckySpins().catch((err) => {
    console.error("[admin/lucky-spins] failed to load", err);
    return [];
  });

  const qrDataUrl = await QRCode.toDataURL(SPIN_PAGE_URL, {
    width: 480,
    margin: 2,
    color: { dark: "#6e0e13", light: "#fdfaf3" },
  });

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <div>
            <h1 className="font-display text-xl font-semibold text-maroon-900">
              Vòng quay may mắn ({spins.length})
            </h1>
            <p className="mt-1 text-sm text-ink-700">
              Khách quét mã QR tại sự kiện, điền thông tin và quay thưởng. Đánh dấu "Đã đổi
              thưởng" sau khi trao quà tại sự kiện.
            </p>

            {spins.length === 0 ? (
              <p className="mt-6 text-sm text-ink-700">Chưa có ai tham gia quay thưởng.</p>
            ) : (
              <div className="mt-5 overflow-x-auto rounded-2xl border border-gold-500/20 bg-white">
                <table className="w-full min-w-[800px] text-sm">
                  <thead>
                    <tr className="border-b border-gold-500/20 text-left text-xs uppercase tracking-wide text-ink-700/60">
                      <th className="px-4 py-3">Họ tên</th>
                      <th className="px-4 py-3">SĐT</th>
                      <th className="px-4 py-3">Nghề nghiệp</th>
                      <th className="px-4 py-3">Phần thưởng</th>
                      <th className="px-4 py-3">Thời gian</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {spins.map((s) => (
                      <tr key={s.id} className="border-b border-gold-500/10 align-top">
                        <td className="px-4 py-3 font-medium text-maroon-900">{s.name}</td>
                        <td className="px-4 py-3 text-ink-700">{s.phone}</td>
                        <td className="px-4 py-3 text-ink-700">{s.occupation}</td>
                        <td className="px-4 py-3 font-semibold text-maroon-800">{s.prizeLabel}</td>
                        <td className="px-4 py-3 text-ink-700">{formatDate(s.createdAt)}</td>
                        <td className="px-4 py-3">
                          <LuckySpinRedeemedToggle id={s.id} redeemed={s.redeemed} />
                        </td>
                        <td className="px-4 py-3">
                          <DeleteButton
                            endpoint={`/api/admin/lucky-spins/${s.id}`}
                            confirmMessage={`Xoá lượt quay của "${s.name}"?`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="h-fit rounded-2xl border border-gold-500/20 bg-white p-5 text-center">
            <h2 className="font-display text-sm font-semibold text-maroon-900">
              Mã QR mang đi sự kiện
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Mã QR vòng quay may mắn" className="mx-auto mt-3 w-full rounded-xl" />
            <a
              href={qrDataUrl}
              download="vong-quay-may-man-qr.png"
              className="mt-3 block rounded-full bg-maroon-900 px-4 py-2 text-xs font-bold text-cream-50 transition hover:bg-maroon-800"
            >
              Tải mã QR
            </a>
            <p className="mt-3 break-all text-xs text-ink-700/60">{SPIN_PAGE_URL}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
