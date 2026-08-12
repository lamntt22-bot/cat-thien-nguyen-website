import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { deletePost, updatePost } from "@/lib/post-store";

const postSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "slug chỉ gồm chữ thường, số và gạch ngang"),
  category: z.enum(["thong-bao", "tin-tuc"]),
  title: z.string().trim().min(1).max(300),
  excerpt: z.string().trim().max(500).default(""),
  content: z.string().trim().max(20000).default(""),
  published: z.boolean().default(true),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu bài viết chưa hợp lệ." }, { status: 400 });
  }

  try {
    const post = await updatePost(id, parsed.data);
    return NextResponse.json({ post });
  } catch (err) {
    console.error("[admin/posts] update failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { id } = await params;
  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/posts] delete failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
