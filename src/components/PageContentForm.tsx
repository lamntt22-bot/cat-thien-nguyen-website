"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import MediaUploader from "@/components/MediaUploader";
import type { PageSectionConfig, PageSectionField } from "@/lib/page-content-config";
import type { PageSectionItem, PageSectionRecord } from "@/lib/page-content-store";

export default function PageContentForm({
  config,
  section,
}: {
  config: PageSectionConfig;
  section: PageSectionRecord | null;
}) {
  const router = useRouter();
  const has = (f: PageSectionField) => config.fields.includes(f);

  const [eyebrow, setEyebrow] = useState(section?.eyebrow ?? "");
  const [heading, setHeading] = useState(section?.heading ?? "");
  const [body, setBody] = useState(section?.body ?? "");
  const [note, setNote] = useState(section?.note ?? "");
  const [image, setImage] = useState(section?.image ?? "");
  const [items, setItems] = useState<PageSectionItem[]>(section?.items ?? []);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const media = image ? [{ type: "image" as const, url: image }] : [];

  function updateItem(index: number, patch: Partial<PageSectionItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }
  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  function addItem() {
    setItems((prev) => [...prev, { title: "", value: "" }]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/content/${config.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow: has("eyebrow") ? eyebrow.trim() : undefined,
          heading: has("heading") ? heading.trim() : undefined,
          body: has("body") ? body.trim() : undefined,
          note: has("note") ? note.trim() : undefined,
          image: has("image") ? image.trim() : undefined,
          items: has("items")
            ? items.filter((it) => it.title.trim().length > 0).map((it) => ({
                title: it.title.trim(),
                value: it.value?.trim() || undefined,
              }))
            : [],
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {has("eyebrow") && (
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">
            Nhãn nhỏ phía trên tiêu đề
          </label>
          <input
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
      )}

      {has("heading") && (
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">Tiêu đề</label>
          <input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
      )}

      {has("body") && (
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">Nội dung / mô tả</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
      )}

      {has("note") && (
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">
            Ghi chú nhỏ (tuỳ chọn)
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
      )}

      {has("image") && (
        <MediaUploader
          media={media}
          onChange={(next) => setImage(next[0]?.url ?? "")}
        />
      )}

      {has("items") && (
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">
            {config.itemsLabel ?? "Danh sách"}
          </label>
          {config.itemsHint && (
            <p className="mb-2 text-xs text-ink-700/60">{config.itemsHint}</p>
          )}
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={item.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  placeholder="Tiêu đề"
                  className="flex-1 rounded-xl border border-maroon-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
                />
                <input
                  value={item.value ?? ""}
                  onChange={(e) => updateItem(i, { value: e.target.value })}
                  placeholder="Giá trị (tuỳ chọn)"
                  className="w-40 rounded-xl border border-maroon-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Xoá
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 rounded-full border border-maroon-900/20 px-4 py-1.5 text-xs font-semibold text-maroon-900 transition hover:bg-maroon-900/5"
          >
            + Thêm dòng
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-green-700">Đã lưu thay đổi.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {submitting ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
