import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  verifySessionToken,
  hashPassword,
  createSessionToken,
} from "@/lib/auth";
import { updateMemberPassword } from "@/lib/member-store";

const schema = z.object({
  newPassword: z.string().min(8).max(200),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Mật khẩu mới cần ít nhất 8 ký tự." },
      { status: 400 },
    );
  }

  try {
    const passwordHash = await hashPassword(parsed.data.newPassword);
    await updateMemberPassword(session.memberId, passwordHash);

    const newToken = await createSessionToken({
      memberId: session.memberId,
      role: session.role,
      mustChangePassword: false,
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, newToken, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error("[change-password] failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
