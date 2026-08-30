import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/session";
import { deleteProduct, updateProduct } from "@/lib/product-store";

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
  contentDetail: z.string().trim().max(8000).optional(),
  price: z.string().trim().min(1).max(100),
  priceAmount: z.number().nonnegative().optional(),
  badge: z.string().trim().max(60).optional(),
  cbmp: z.string().trim().max(60).optional(),
  image: z.string().trim().max(300).optional(),
  sortOrder: z.number().int().default(0),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu sản phẩm chưa hợp lệ." }, { status: 400 });
  }

  try {
    const product = await updateProduct(id, parsed.data);
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[admin/products] update failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "Không có quyền." }, { status: 403 });

  const { id } = await params;
  try {
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/products] delete failed", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }
}
