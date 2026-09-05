import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PHONE_RE } from "@/lib/leads";
import { getProductsByIds } from "@/lib/product-store";
import { createTrialRequest } from "@/lib/trial-store";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên đầy đủ.").max(120),
  phone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Số điện thoại chưa đúng định dạng (VD: 0912345678)."),
  occupation: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập nghề nghiệp / công tác hiện tại.")
    .max(200),
  productIds: z
    .array(z.string().uuid())
    .min(1, "Vui lòng chọn ít nhất một sản phẩm dùng thử."),
  // honeypot — real users never see/fill this
  website: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(`trial-request:${ip}`)) {
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

  // honeypot tripped — pretend success, do not persist
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  try {
    const products = await getProductsByIds(parsed.data.productIds);
    if (products.length === 0) {
      return NextResponse.json({ error: "Sản phẩm bạn chọn không hợp lệ." }, { status: 400 });
    }

    await createTrialRequest({
      name: parsed.data.name,
      phone: parsed.data.phone,
      occupation: parsed.data.occupation,
      productIds: products.map((p) => p.id),
      productNames: products.map((p) => p.name),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[trial-requests] create failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
