import { redirect, notFound } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { getPostById } from "@/lib/post-store";
import AdminNav from "@/components/AdminNav";
import PostForm from "@/components/PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />
      <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <h1 className="font-display text-xl font-semibold text-maroon-900">
          Sửa bài — {post.title}
        </h1>
        <div className="mt-5 rounded-2xl border border-gold-500/20 bg-white p-6">
          <PostForm post={post} />
        </div>
      </main>
    </div>
  );
}
