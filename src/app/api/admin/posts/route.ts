import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { createPost, listPosts } from "@/lib/post-store";
import { sanitizeContentHtml } from "@/lib/sanitize-html";

const postSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "slug chỉ gồm chữ thường, số và gạch ngang"),
  category: z.enum(["thong-bao", "tin-tuc"]),
  title: z.string().trim().min(1, "Tiêu đề là bắt buộc").max(500, "Tiêu đề tối đa 500 ký tự"),
  excerpt: z.string().trim().min(1, "Sapo là bắt buộc").max(800, "Sapo tối đa 800 ký tự"),
  content: z.string().trim().max(20000).default(""),
  media: z
    .array(
      z.object({
        type: z.enum(["image", "video"]),
        url: z.string().url(),
      }),
    )
    .max(20)
    .default([]),
  image: z.string().trim().max(1000).optional(),
  seoTitle: z.string().trim().max(500, "Tiêu đề SEO tối đa 500 ký tự").optional(),
  seoDescription: z.string().trim().max(1000, "Mô tả SEO tối đa 1000 ký tự").optional(),
  seoKeywords: z.string().trim().max(1000, "Từ khoá SEO tối đa 1000 ký tự").optional(),
  published: z.boolean().default(true),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export async function GET(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const posts = await listPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") || "Dữ liệu bài viết chưa hợp lệ." },
      { status: 400 },
    );
  }

  try {
    const post = await createPost({
      ...parsed.data,
      content: sanitizeContentHtml(parsed.data.content),
    });
    return NextResponse.json({ post });
  } catch (err) {
    console.error("[admin/posts] create failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
