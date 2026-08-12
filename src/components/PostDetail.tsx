import { notFound } from "next/navigation";
import { getPostBySlug, type PostCategory } from "@/lib/post-store";
import { formatDate } from "@/components/PostCard";

const CATEGORY_LABEL: Record<PostCategory, string> = {
  "thong-bao": "thông báo",
  "tin-tuc": "tin tức",
};

export default async function PostDetail({
  category,
  slug,
}: {
  category: PostCategory;
  slug: string;
}) {
  const post = await getPostBySlug(category, slug);
  if (!post) notFound();

  const backHref = `/${category}`;
  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="bg-cream-50 py-14 sm:py-20">
      <article className="mx-auto max-w-2xl px-5 sm:px-8">
        <a href={backHref} className="text-sm font-semibold text-maroon-800 hover:underline">
          ← Về danh sách {CATEGORY_LABEL[category]}
        </a>

        <span className="mt-6 block text-xs font-semibold uppercase tracking-wide text-red-600">
          {formatDate(post.publishedAt)}
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
          {post.title}
        </h1>

        {post.media.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {post.media.map((item) =>
              item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.url}
                  src={item.url}
                  alt=""
                  className="w-full rounded-xl border border-gold-500/20 object-cover"
                />
              ) : (
                <video
                  key={item.url}
                  src={item.url}
                  controls
                  className="w-full rounded-xl border border-gold-500/20"
                />
              ),
            )}
          </div>
        )}

        <div className="mt-6 space-y-4 text-ink-700">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
