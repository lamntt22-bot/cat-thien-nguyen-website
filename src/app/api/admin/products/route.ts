import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { createProduct, listProducts } from "@/lib/product-store";

const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "slug chỉ gồm chữ thường, số và gạch ngang"),
  category: z.enum(["tra-dong-y", "ngoc-am", "bach"]),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
  price: z.string().trim().min(1).max(100),
  priceAmount: z.number().nonnegative().optional(),
  badge: z.string().trim().max(60).optional(),
  cbmp: z.string().trim().max(60).optional(),
  image: z.string().trim().max(300).optional(),
  sortOrder: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu sản phẩm chưa hợp lệ." }, { status: 400 });
  }

  try {
    const product = await createProduct(parsed.data);
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[admin/products] create failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
