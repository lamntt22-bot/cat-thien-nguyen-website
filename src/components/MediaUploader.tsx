"use client";

import { useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { PostMedia } from "@/lib/post-store";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // khớp giới hạn bucket "post-media"

export default function MediaUploader({
  media,
  onChange,
}: {
  media: PostMedia[];
  onChange: (media: PostMedia[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError(`"${file.name}" không phải ảnh hoặc video, đã bỏ qua.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" vượt quá 50MB, đã bỏ qua.`);
        continue;
      }

      setUploading((prev) => [...prev, file.name]);
      try {
        const res = await fetch("/api/admin/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.error ?? `Không tải lên được "${file.name}".`);
          continue;
        }

        const { error: uploadError } = await getSupabaseBrowser()
          .storage.from("post-media")
          .uploadToSignedUrl(data.path, data.token, file);
        if (uploadError) {
          setError(`Không tải lên được "${file.name}".`);
          continue;
        }

        onChange([...media, { type: data.type, url: data.publicUrl }]);
      } catch {
        setError(`Không tải lên được "${file.name}", vui lòng thử lại.`);
      } finally {
        setUploading((prev) => prev.filter((name) => name !== file.name));
      }
    }
  }

  function removeAt(index: number) {
    onChange(media.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-maroon-900">
        Ảnh / video đính kèm (tuỳ chọn)
      </label>

      {media.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {media.map((item, i) => (
            <div
              key={item.url}
              className="group relative aspect-square overflow-hidden rounded-xl border border-maroon-900/15 bg-maroon-900/5"
            >
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <video src={item.url} className="h-full w-full object-cover" muted />
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-maroon-950/70 text-xs font-bold text-cream-50 opacity-0 transition group-hover:opacity-100"
                aria-label="Xoá"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading.length > 0 && (
        <p className="mb-2 text-xs text-ink-700/70">
          Đang tải lên: {uploading.join(", ")}...
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-full file:border-0 file:bg-maroon-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream-50 hover:file:bg-maroon-800"
      />
      <p className="mt-1 text-xs text-ink-700/60">
        Chọn từ máy tính hoặc điện thoại — hỗ trợ nhiều file, tối đa 50MB/file.
      </p>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
