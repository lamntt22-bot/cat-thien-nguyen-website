import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { listPosts, type PostRecord } from "@/lib/post-store";

export const metadata: Metadata = {
  title: "Tin tức — Cát Thiên Nguyên",
  description: "Tin tức về chương trình, sự kiện của Cát Thiên Nguyên và các đối tác.",
};

export default async function TinTucPage() {
  let tinTucPosts: PostRecord[] = [];
  try {
    tinTucPosts = await listPosts({ category: "tin-tuc", onlyPublished: true });
  } catch (err) {
    console.error("[tin-tuc] failed to load posts", err);
  }

  return (
    <main className="bg-cream-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Chương trình & sự kiện
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            Tin tức
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-ink-700">
            Thông tin về các chương trình, sự kiện của Cát Thiên Nguyên và đối tác.
          </p>
        </div>

        {tinTucPosts.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tinTucPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink-700">Chưa có tin tức nào.</p>
        )}
      </div>
    </main>
  );
}
