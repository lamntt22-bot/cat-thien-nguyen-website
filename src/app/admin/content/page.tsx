import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { getPageSections } from "@/lib/page-content-store";
import { PAGE_SECTIONS } from "@/lib/page-content-config";
import AdminNav from "@/components/AdminNav";

export default async function AdminContentPage() {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const sections = await getPageSections(PAGE_SECTIONS.map((s) => s.slug));

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <h1 className="font-display text-xl font-semibold text-maroon-900">Nội dung trang</h1>
        <p className="mt-1 text-sm text-ink-700/70">
          Chỉnh sửa tiêu đề, mô tả, ảnh và danh sách cho các phần nội dung trên trang web — không
          cần sửa code.
        </p>

        <div className="mt-5 space-y-3">
          {PAGE_SECTIONS.map((cfg) => {
            const current = sections[cfg.slug];
            return (
              <Link
                key={cfg.slug}
                href={`/admin/content/${cfg.slug}`}
                className="block rounded-2xl border border-gold-500/20 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <p className="font-display text-base font-semibold text-maroon-900">{cfg.label}</p>
                <p className="mt-1 truncate text-sm text-ink-700/70">
                  {current?.heading || "Chưa có nội dung — dùng mặc định trên trang web."}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
