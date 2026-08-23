"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ProductCategory, ProductRecord } from "@/lib/product-store";

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "tra-dong-y", label: "Trà Đông Y" },
  { id: "ngoc-am", label: "Tinh dầu phong thủy" },
  { id: "bach", label: "Mỹ phẩm thiên nhiên" },
];

interface ProductFormProps {
  product?: ProductRecord;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? "tra-dong-y");
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "Đang cập nhật");
  const [priceAmount, setPriceAmount] = useState(product?.priceAmount ?? 0);
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [cbmp, setCbmp] = useState(product?.cbmp ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [sortOrder, setSortOrder] = useState(product?.sortOrder ?? 0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim(),
          category,
          name: name.trim(),
          description: description.trim(),
          price: price.trim(),
          priceAmount: Number(priceAmount) > 0 ? Number(priceAmount) : undefined,
          badge: badge.trim() || undefined,
          cbmp: cbmp.trim() || undefined,
          image: image.trim() || undefined,
          sortOrder: Number(sortOrder) || 0,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">
            Slug (định danh, chữ thường-gạch ngang)
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            placeholder="hong-nguyet-tra"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">Dòng sản phẩm</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">Tên sản phẩm</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">
            Giá (hoặc &ldquo;Sắp ra mắt&rdquo;/&ldquo;Đang cập nhật&rdquo;)
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">
            Badge (tuỳ chọn)
          </label>
          <input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            placeholder="Sản phẩm chủ lực / Sắp ra mắt"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">
          Giá bán thực (VNĐ, để 0 nếu chưa mở bán online)
        </label>
        <input
          type="number"
          min={0}
          value={priceAmount}
          onChange={(e) => setPriceAmount(Number(e.target.value))}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          placeholder="440000"
        />
        <p className="mt-1 text-xs text-ink-700/60">
          Chỉ sản phẩm có giá này mới hiện nút &ldquo;Thêm vào giỏ&rdquo; để khách mua trực tiếp trên web.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">
            Số CBMP (tuỳ chọn)
          </label>
          <input
            value={cbmp}
            onChange={(e) => setCbmp(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">Thứ tự hiển thị</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">
          Đường dẫn ảnh (trong /public, tuỳ chọn)
        </label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          placeholder="/assets/products/ten-anh.jpg"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
      </button>
    </form>
  );
}
