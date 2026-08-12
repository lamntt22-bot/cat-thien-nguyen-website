import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { updateMember } from "@/lib/member-store";

const memberSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(\+84|0)\d{9,10}$/, "invalid phone"),
  email: z.string().trim().email().max(200),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = memberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Thông tin chưa hợp lệ." }, { status: 400 });
  }

  try {
    const member = await updateMember(id, parsed.data);
    return NextResponse.json({ member });
  } catch (err) {
    console.error("[admin/members] update failed", err);
    const code = (err as { code?: string })?.code;
    if (code === "23505") {
      return NextResponse.json(
        { error: "Số điện thoại hoặc email này đã dùng cho tài khoản khác." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
