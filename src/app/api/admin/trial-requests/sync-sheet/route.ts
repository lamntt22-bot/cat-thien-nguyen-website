import { NextRequest, NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/session";
import { listTrialRequests } from "@/lib/trial-store";
import { resyncAllTrialRequestsToSheet } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  try {
    const records = await listTrialRequests();
    await resyncAllTrialRequestsToSheet(records);
    return NextResponse.json({ ok: true, count: records.length });
  } catch (err) {
    console.error("[admin/trial-requests/sync-sheet] failed", err);
    const message = err instanceof Error ? err.message : "Đã xảy ra lỗi, vui lòng thử lại.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
