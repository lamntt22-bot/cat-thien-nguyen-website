import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { findMemberById } from "@/lib/member-store";
import { getProductsByIds } from "@/lib/product-store";
import { createCheckout } from "@/lib/checkout-store";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(\+84|0)\d{9,10}$/, "invalid phone"),
  address: z.string().trim().min(5).max(300),
  paymentMethod: z.enum(["bank_transfer", "cod"]),
  note: z.string().trim().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`checkout:${ip}`)) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
      { status: 429 },
    );
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Vui lòng đăng nhập để đặt hàng." }, { status: 401 });
  }

  const member = await findMemberById(session.memberId);
  if (!member) {
    return NextResponse.json({ error: "Vui lòng đăng nhập để đặt hàng." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Thông tin đặt hàng chưa hợp lệ." }, { status: 400 });
  }

  const { fullName, phone, address, paymentMethod, note, items } = parsed.data;

  try {
    // Never trust client-submitted prices — re-fetch the authoritative price from the DB.
    const productIds = items.map((i) => i.productId);
    const products = await getProductsByIds(productIds);
    const productMap = new Map(products.map((p) => [p.id, p]));

    const checkoutItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product || !product.priceAmount) {
        throw new Error(`Sản phẩm không hợp lệ hoặc chưa mở bán: ${item.productId}`);
      }
      return {
        productId: product.id,
        productName: product.name,
        unitPrice: product.priceAmount,
        quantity: item.quantity,
      };
    });

    const checkout = await createCheckout({
      memberId: member.id,
      fullName,
      phone,
      address,
      paymentMethod,
      note,
      items: checkoutItems,
    });

    return NextResponse.json({ checkout });
  } catch (err) {
    console.error("[checkout] failed", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi, vui lòng thử lại." },
      { status: 500 },
    );
  }
}
