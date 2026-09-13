import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PHONE_RE } from "@/lib/leads";
import { createLuckySpin, getLuckySpinByPhone } from "@/lib/lucky-spin-store";
import { pickRandomPrize } from "@/lib/lucky-spin-prizes";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên đầy đủ.").max(120),
  phone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Số điện thoại chưa đúng định dạng (VD: 0912345678)."),
  occupation: z.string().trim().min(2, "Vui lòng nhập nghề nghiệp.").max(200),
  // honeypot — real users never see/fill this
  website: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(`lucky-spin:${ip}`)) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") || "Thông tin chưa hợp lệ." },
      { status: 400 },
    );
  }

  // honeypot tripped — pretend success with a harmless prize, do not persist
  if (parsed.data.website) {
    return NextResponse.json({ prizeKey: "giam-5", prizeLabel: "Giảm giá 5%", alreadyPlayed: false });
  }

  try {
    const existing = await getLuckySpinByPhone(parsed.data.phone);
    if (existing) {
      return NextResponse.json({
        prizeKey: existing.prizeKey,
        prizeLabel: existing.prizeLabel,
        alreadyPlayed: true,
      });
    }

    const prize = pickRandomPrize();
    await createLuckySpin({
      name: parsed.data.name,
      phone: parsed.data.phone,
      occupation: parsed.data.occupation,
      prizeKey: prize.key,
      prizeLabel: prize.label,
    });

    return NextResponse.json({ prizeKey: prize.key, prizeLabel: prize.label, alreadyPlayed: false });
  } catch (err) {
    console.error("[lucky-spin] create failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
