import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";

const BUCKET = "post-media";

const schema = z.object({
  filename: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
});

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(-100);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Yêu cầu upload không hợp lệ." }, { status: 400 });
  }

  const { contentType } = parsed.data;
  if (!contentType.startsWith("image/") && !contentType.startsWith("video/")) {
    return NextResponse.json(
      { error: "Chỉ hỗ trợ upload ảnh hoặc video." },
      { status: 400 },
    );
  }

  const path = `posts/${Date.now()}-${crypto.randomUUID()}-${sanitizeFilename(parsed.data.filename)}`;

  try {
    const { data, error } = await getSupabase()
      .storage.from(BUCKET)
      .createSignedUploadUrl(path);
    if (error) throw error;

    const { data: publicUrlData } = getSupabase().storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({
      path: data.path,
      token: data.token,
      publicUrl: publicUrlData.publicUrl,
      type: contentType.startsWith("video/") ? "video" : "image",
    });
  } catch (err) {
    console.error("[admin/upload-url] failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
