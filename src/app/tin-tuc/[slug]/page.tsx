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
  return { title: post ? `${post.title} — Cát Thiên Nguyên` : "Tin tức — Cát Thiên Nguyên" };
}

export default async function TinTucDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostDetail category="tin-tuc" slug={slug} />;
}
