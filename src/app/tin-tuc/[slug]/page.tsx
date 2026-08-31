import type { Metadata } from "next";
import PostDetail from "@/components/PostDetail";
import { getPostBySlug } from "@/lib/post-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug("tin-tuc", slug).catch(() => null);
  if (!post) return { title: "Tin tức — Cát Thiên Nguyên" };

  const title = `${post.seoTitle || post.title} — Cát Thiên Nguyên`;
  const description = post.seoDescription || post.excerpt || undefined;
  return {
    title,
    description,
    keywords: post.seoKeywords || undefined,
    openGraph: {
      title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function TinTucDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostDetail category="tin-tuc" slug={slug} />;
}
