import type { PostRecord } from "@/lib/post-store";

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function PostCard({ post }: { post: PostRecord }) {
  const cover = post.image || post.media.find((m) => m.type === "image")?.url;

  return (
    <a
      href={`/${post.category}/${post.slug}`}
      className="flex h-full flex-col rounded-2xl border border-gold-500/25 border-t-2 border-t-gold-500 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="mb-3 aspect-[3/4] w-full rounded-xl object-cover" />
      )}
      <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
        {formatDate(post.publishedAt)}
      </span>
      <h3 className="mt-2 font-display text-lg font-semibold text-maroon-900">{post.title}</h3>
      <p className="mt-2 flex-1 text-sm text-ink-700">{post.excerpt}</p>
      <span className="mt-4 text-sm font-semibold text-maroon-800">Xem chi tiết →</span>
    </a>
  );
}
