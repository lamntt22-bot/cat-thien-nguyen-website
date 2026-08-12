import type { Metadata } from "next";
import PostDetail from "@/components/PostDetail";
import { getPostBySlug } from "@/lib/post-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug("thong-bao", slug).catch(() => null);
  return { title: post ? `${post.title} — Cát Thiên Nguyên` : "Thông báo — Cát Thiên Nguyên" };
}

export default async function ThongBaoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostDetail category="thong-bao" slug={slug} />;
}
