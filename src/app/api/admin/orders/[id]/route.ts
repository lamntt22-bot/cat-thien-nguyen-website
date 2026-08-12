import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { updateCheckoutStatus } from "@/lib/checkout-store";

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipping", "completed", "cancelled"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ." }, { status: 400 });
  }

  try {
    await updateCheckoutStatus(id, parsed.data.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/orders] update failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
