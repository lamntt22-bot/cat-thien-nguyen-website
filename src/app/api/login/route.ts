import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findMemberByLoginId } from "@/lib/member-store";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  loginId: z.string().trim().min(3).max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Thông tin đăng nhập chưa hợp lệ." }, { status: 400 });
  }

  const { loginId, password } = parsed.data;

  // Chặn theo cả IP (rộng) và tài khoản (hẹp) — RULE-15 trong bao-mat-CHUAN-OWASP.md.
  if (
    isRateLimited(`login:ip:${ip}`) ||
    isRateLimited(`login:acc:${loginId.toLowerCase()}`)
  ) {
    return NextResponse.json({ error: "Quá nhiều lần thử, vui lòng thử lại sau." }, { status: 429 });
  }

  try {
    const member = await findMemberByLoginId(loginId);
    const genericError = NextResponse.json({ error: "Sai thông tin đăng nhập." }, { status: 401 });

    if (!member) return genericError;

    const validPassword = await verifyPassword(password, member.passwordHash);
    if (!validPassword) return genericError;

    const token = await createSessionToken({
      memberId: member.id,
      role: member.role,
      mustChangePassword: member.mustChangePassword,
    });

    const response = NextResponse.json({
      mustChangePassword: member.mustChangePassword,
      role: member.role,
    });
    response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error("[login] failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
