import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { listPosts, type PostRecord } from "@/lib/post-store";

export const metadata: Metadata = {
  title: "Cẩm nang sức khoẻ — Cát Thiên Nguyên",
  description:
    "Kiến thức dưỡng sinh Đông y, chăm sóc sức khoẻ chủ động — hoàn toàn miễn phí từ Cát Thiên Nguyên.",
};

export default async function CamNangSucKhoePage() {
  let posts: PostRecord[] = [];
  try {
    posts = await listPosts({ category: "cam-nang-suc-khoe", onlyPublished: true });
  } catch (err) {
    console.error("[cam-nang-suc-khoe] failed to load posts", err);
  }

  return (
    <main className="bg-cream-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Kiến thức miễn phí
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            Cẩm nang sức khoẻ
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-ink-700">
            Kiến thức dưỡng sinh Đông y, chăm sóc sức khoẻ chủ động từ Cát Thiên Nguyên — đọc và
            áp dụng hoàn toàn miễn phí.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink-700">
            Cẩm nang đang được biên soạn, quay lại sau nhé.
          </p>
        )}
      </div>
    </main>
  );
}
