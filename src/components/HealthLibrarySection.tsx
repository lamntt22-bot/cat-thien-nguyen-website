import Link from "next/link";
import PostCard from "@/components/PostCard";
import type { PostRecord } from "@/lib/post-store";

export default function HealthLibrarySection({ posts }: { posts: PostRecord[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-cream-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Kiến thức miễn phí
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            Cẩm nang sức khoẻ
          </h2>
          <p className="mt-3 text-ink-700">
            Kiến thức dưỡng sinh Đông y, chăm sóc sức khoẻ chủ động — đọc và áp dụng hoàn toàn
            miễn phí, cập nhật thường xuyên từ Cát Thiên Nguyên.
          </p>
          <Link
            href="/cam-nang-suc-khoe"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-maroon-900 px-5 py-2.5 text-sm font-bold text-cream-50 shadow-md transition hover:bg-maroon-800"
          >
            Xem tất cả
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
