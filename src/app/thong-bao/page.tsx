import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { listPosts, type PostRecord } from "@/lib/post-store";

export const metadata: Metadata = {
  title: "Thông báo — Cát Thiên Nguyên",
  description: "Các thông báo, cập nhật chính thức từ Cát Thiên Nguyên dành cho đại lý và đối tác.",
};

export default async function ThongBaoPage() {
  let thongBaoPosts: PostRecord[] = [];
  try {
    thongBaoPosts = await listPosts({ category: "thong-bao", onlyPublished: true });
  } catch (err) {
    console.error("[thong-bao] failed to load posts", err);
  }

  return (
    <main className="bg-cream-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Kênh thông báo chính thức
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            Thông báo
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-ink-700">
            Cập nhật chính sách, chương trình và thông tin quan trọng từ Cát Thiên Nguyên dành cho
            toàn thể đại lý và đối tác.
          </p>
        </div>

        {thongBaoPosts.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {thongBaoPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink-700">Chưa có thông báo nào.</p>
        )}
      </div>
    </main>
  );
}
