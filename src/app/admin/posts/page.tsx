import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { listPosts } from "@/lib/post-store";
import AdminNav from "@/components/AdminNav";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminPostsPage() {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const posts = await listPosts();

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-xl font-semibold text-maroon-900">
            Thông báo & Tin tức ({posts.length})
          </h1>
          <a
            href="/admin/posts/new"
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
          >
            + Đăng bài mới
          </a>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-gold-500/20 bg-white">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-gold-500/20 text-left text-xs uppercase tracking-wide text-ink-700/60">
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Mục</th>
                <th className="px-4 py-3">Ngày đăng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gold-500/10">
                  <td className="px-4 py-3 font-medium text-maroon-900">{p.title}</td>
                  <td className="px-4 py-3 text-ink-700">
                    {p.category === "thong-bao" ? "Thông báo" : "Tin tức"}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{p.publishedAt}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        Đã đăng
                      </span>
                    ) : (
                      <span className="rounded-full bg-ink-700/10 px-2 py-1 text-xs font-semibold text-ink-700">
                        Bản nháp
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/posts/${p.id}/edit`}
                        className="rounded-full border border-maroon-900/20 px-3 py-1.5 text-xs font-semibold text-maroon-900 transition hover:bg-maroon-900/5"
                      >
                        Sửa
                      </a>
                      <DeleteButton
                        endpoint={`/api/admin/posts/${p.id}`}
                        confirmMessage={`Xoá bài "${p.title}"?`}
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
