import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createMember, findMemberByContact } from "@/lib/member-store";
import { DEFAULT_MEMBER_PASSWORD, hashPassword } from "@/lib/auth";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(\+84|0)\d{9,10}$/, "invalid phone"),
  email: z.string().trim().email().max(200),
  product: z.string().trim().max(100).optional(),
  // honeypot — real users never see/fill this; kept permissive so bots that
  // fill it get a fake success instead of a tell-tale 400
  website: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(`register:${ip}`)) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Thông tin chưa hợp lệ." }, { status: 400 });
  }

  // honeypot tripped — pretend success, do not persist
  if (parsed.data.website) {
    return NextResponse.json({ loginId: parsed.data.phone, alreadyRegistered: false });
  }

  const { name, phone, email, product } = parsed.data;

  try {
    const existing = await findMemberByContact(phone, email);

    if (!existing) {
      const passwordHash = await hashPassword(DEFAULT_MEMBER_PASSWORD);
      await createMember({ name, phone, email, product }, passwordHash);
    }

    return NextResponse.json({
      loginId: phone,
      alreadyRegistered: Boolean(existing),
    });
  } catch (err) {
    console.error("[register] failed", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi, vui lòng thử lại." },
      { status: 500 },
    );
  }
}
