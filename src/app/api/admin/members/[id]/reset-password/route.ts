import { NextRequest, NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/session";
import { resetMemberPassword } from "@/lib/member-store";
import { DEFAULT_MEMBER_PASSWORD, hashPassword } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { id } = await params;

  try {
    const passwordHash = await hashPassword(DEFAULT_MEMBER_PASSWORD);
    await resetMemberPassword(id, passwordHash);
    return NextResponse.json({ tempPassword: DEFAULT_MEMBER_PASSWORD });
  } catch (err) {
    console.error("[admin/members] reset-password failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
