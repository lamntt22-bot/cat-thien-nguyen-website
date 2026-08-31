"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { PostCategory, PostMedia, PostRecord } from "@/lib/post-store";
import MediaUploader from "@/components/MediaUploader";
import ImageCropUploader from "@/components/ImageCropUploader";
import RichTextEditor from "@/components/RichTextEditor";

interface PostFormProps {
  post?: PostRecord;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [category, setCategory] = useState<PostCategory>(post?.category ?? "thong-bao");
  const [title, setTitle] = useState(post?.title ?? "");
  const [image, setImage] = useState(post?.image ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  const [seoKeywords, setSeoKeywords] = useState(post?.seoKeywords ?? "");
  const [media, setMedia] = useState<PostMedia[]>(post?.media ?? []);
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt ?? new Date().toISOString().slice(0, 10),
  );
  const [published, setPublished] = useState(post?.published ?? true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = isEdit ? `/api/admin/posts/${post!.id}` : "/api/admin/posts";
      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim(),
          category,
          title: title.trim(),
          image: image.trim() || undefined,
          excerpt: excerpt.trim(),
          content: content.trim(),
          seoTitle: seoTitle.trim() || undefined,
          seoDescription: seoDescription.trim() || undefined,
          seoKeywords: seoKeywords.trim() || undefined,
          media,
          published,
          publishedAt,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      router.push("/admin/posts");
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
            Slug (chữ thường-gạch ngang)
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            placeholder="ra-mat-chuong-trinh-dai-ly"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-maroon-900">Mục</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PostCategory)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          >
            <option value="thong-bao">Thông báo</option>
            <option value="tin-tuc">Tin tức</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">Ngày đăng</label>
        <input
          type="date"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">
          Tiêu đề bài viết <span className="text-red-600">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">
          Ảnh đại diện bài viết (tuỳ chọn — khung tự lấy theo tỉ lệ ảnh gốc)
        </label>
        <ImageCropUploader value={image} onChange={setImage} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">
          Sapo — tóm tắt nội dung <span className="text-red-600">*</span>
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          placeholder="Tóm tắt ngắn gọn nội dung bài viết, hiển thị ở trang danh sách."
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">Phần nội dung</label>
        <RichTextEditor value={content} onChange={setContent} placeholder="Nhập nội dung bài viết..." />
      </div>

      <div className="rounded-xl border border-maroon-900/15 bg-cream-100/60 p-4">
        <p className="mb-3 text-sm font-semibold text-maroon-900">Tối ưu SEO (tuỳ chọn)</p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-maroon-900">Tiêu đề SEO</label>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="Để trống sẽ dùng Tiêu đề bài viết ở trên."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-maroon-900">Mô tả SEO</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="Để trống sẽ dùng Sapo ở trên."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-maroon-900">Từ khoá SEO</label>
            <input
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="Cách nhau bằng dấu phẩy, VD: trà đông y, dược liệu, cát thiên nguyên"
            />
          </div>
        </div>
      </div>

      <MediaUploader media={media} onChange={setMedia} />

      <label className="flex items-center gap-2 text-sm text-maroon-900">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 accent-red-600"
        />
        Đăng công khai ngay (bỏ chọn để lưu bản nháp)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Đăng bài"}
      </button>
    </form>
  );
}
