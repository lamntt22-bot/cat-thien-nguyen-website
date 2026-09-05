import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { deleteTrialRequest, updateTrialRequestStatus } from "@/lib/trial-store";

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "done"]),
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
    await updateTrialRequestStatus(id, parsed.data.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/trial-requests] update failed", err);
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
    await deleteTrialRequest(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/trial-requests] delete failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
