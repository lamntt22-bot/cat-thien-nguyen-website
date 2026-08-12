import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { createOrder } from "@/lib/order-store";
import { getProductById } from "@/lib/product-store";

const schema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50).default(1),
  note: z.string().trim().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Vui lòng đăng nhập trước." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu đơn hàng chưa hợp lệ." }, { status: 400 });
  }

  try {
    const product = await getProductById(parsed.data.productId);
    if (!product) {
      return NextResponse.json({ error: "Sản phẩm không tồn tại." }, { status: 404 });
    }

    const order = await createOrder({
      memberId: session.memberId,
      productId: product.id,
      productName: product.name,
      quantity: parsed.data.quantity,
      note: parsed.data.note,
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error("[orders] create failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
