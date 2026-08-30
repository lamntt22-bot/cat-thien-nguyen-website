import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { getPageSection, upsertPageSection } from "@/lib/page-content-store";
import { getPageSectionConfig } from "@/lib/page-content-config";

const sectionSchema = z.object({
  eyebrow: z.string().trim().max(120).optional(),
  heading: z.string().trim().max(300).optional(),
  body: z.string().trim().max(4000).optional(),
  note: z.string().trim().max(500).optional(),
  image: z.string().trim().max(300).optional(),
  items: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(300),
        value: z.string().trim().max(120).optional(),
      }),
    )
    .max(20)
    .default([]),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { slug } = await params;
  if (!getPageSectionConfig(slug)) {
    return NextResponse.json({ error: "Không tìm thấy mục nội dung." }, { status: 404 });
  }

  const section = await getPageSection(slug);
  return NextResponse.json({ section });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { slug } = await params;
  if (!getPageSectionConfig(slug)) {
    return NextResponse.json({ error: "Không tìm thấy mục nội dung." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu chưa hợp lệ." }, { status: 400 });
  }

  try {
    const section = await upsertPageSection(slug, parsed.data);
    return NextResponse.json({ section });
  } catch (err) {
    console.error("[admin/content] update failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
