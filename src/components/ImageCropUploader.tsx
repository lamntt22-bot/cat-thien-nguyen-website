"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const FRAME_WIDTH = 280;
const MAX_ZOOM_MULTIPLIER = 4;

interface Pos {
  x: number;
  y: number;
}

export default function ImageCropUploader({
  value,
  onChange,
  aspectRatio = 1,
  outputSize = 1000,
}: {
  value: string;
  onChange: (url: string) => void;
  /** width / height của khung hiển thị, VD 1 = vuông, 4/5 = chân dung. */
  aspectRatio?: number;
  outputSize?: number;
}) {
  const frameHeight = FRAME_WIDTH / aspectRatio;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [coverScale, setCoverScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  function clampPos(nextPos: Pos, currentScale: number, size: { w: number; h: number }): Pos {
    const dispW = size.w * currentScale;
    const dispH = size.h * currentScale;
    const maxX = Math.max(0, (dispW - FRAME_WIDTH) / 2);
    const maxY = Math.max(0, (dispH - frameHeight) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, nextPos.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPos.y)),
    };
  }

  function pickFile() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        `Định dạng ${file.type || "không xác định"} chưa hỗ trợ — dùng ảnh JPG, PNG, WEBP hoặc GIF. Ảnh HEIC từ iPhone cần đổi sang JPG trước.`,
      );
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Ảnh vượt quá 50MB.");
      return;
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(URL.createObjectURL(file));
    setNatural(null);
    setPos({ x: 0, y: 0 });
  }

  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const cover = Math.max(FRAME_WIDTH / w, frameHeight / h);
    setNatural({ w, h });
    setCoverScale(cover);
    setScale(cover);
    setPos({ x: 0, y: 0 });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!natural) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, posX: pos.x, posY: pos.y };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current || !natural) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPos(
      clampPos(
        { x: dragState.current.posX + dx, y: dragState.current.posY + dy },
        scale,
        natural,
      ),
    );
  }

  function onPointerUp() {
    dragState.current = null;
  }

  function handleZoomChange(nextScale: number) {
    if (!natural) return;
    setScale(nextScale);
    setPos((prev) => clampPos(prev, nextScale, natural));
  }

  const cancelCrop = useCallback(() => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    setNatural(null);
  }, [objectUrl]);

  async function confirmCrop() {
    const img = imgRef.current;
    if (!img || !natural) return;
    setUploading(true);
    setError("");
    try {
      const outW = outputSize;
      const outH = Math.round(outputSize / aspectRatio);
      const dispW = natural.w * scale;
      const dispH = natural.h * scale;
      const sx = ((dispW - FRAME_WIDTH) / 2 - pos.x) / scale;
      const sy = ((dispH - frameHeight) / 2 - pos.y) / scale;
      const sWidth = FRAME_WIDTH / scale;
      const sHeight = frameHeight / scale;

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas not supported");
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, outW, outH);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9),
      );
      if (!blob) throw new Error("crop failed");

      const filename = `crop-${Date.now()}.jpg`;
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, contentType: "image/jpeg" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Không tải lên được ảnh đã cắt.");
        return;
      }

      const fileToUpload = new File([blob], filename, { type: "image/jpeg" });
      const { error: uploadError } = await getSupabaseBrowser()
        .storage.from("post-media")
        .uploadToSignedUrl(data.path, data.token, fileToUpload, { contentType: "image/jpeg" });
      if (uploadError) {
        setError(`Không tải lên được ảnh đã cắt: ${uploadError.message}`);
        return;
      }

      onChange(data.publicUrl);
      cancelCrop();
    } catch {
      setError("Không tải lên được ảnh đã cắt, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  }

  const isCropping = Boolean(objectUrl);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-maroon-900">Ảnh (tuỳ chọn)</label>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          handleFileSelected(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {isCropping ? (
        <div>
          <div
            className="relative touch-none select-none overflow-hidden rounded-xl border border-maroon-900/15 bg-maroon-900/5"
            style={{ width: FRAME_WIDTH, height: frameHeight }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={objectUrl ?? undefined}
              alt=""
              onLoad={handleImageLoad}
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={
                natural
                  ? {
                      width: natural.w * scale,
                      height: natural.h * scale,
                      maxWidth: "none",
                      marginLeft: -(natural.w * scale) / 2 + pos.x,
                      marginTop: -(natural.h * scale) / 2 + pos.y,
                    }
                  : { opacity: 0 }
              }
            />
          </div>

          {natural && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-ink-700/60">Thu nhỏ</span>
              <input
                type="range"
                min={coverScale}
                max={coverScale * MAX_ZOOM_MULTIPLIER}
                step={coverScale / 100}
                value={scale}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-ink-700/60">Phóng to</span>
            </div>
          )}
          <p className="mt-1 text-xs text-ink-700/60">
            Kéo ảnh để chỉnh vị trí, dùng thanh trượt để phóng to/thu nhỏ cho vừa khung.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={confirmCrop}
              disabled={!natural || uploading}
              className="rounded-full bg-maroon-900 px-5 py-2 text-sm font-bold text-cream-50 transition hover:bg-maroon-800 disabled:opacity-60"
            >
              {uploading ? "Đang tải lên..." : "Xác nhận & Tải lên"}
            </button>
            <button
              type="button"
              onClick={cancelCrop}
              disabled={uploading}
              className="rounded-full border border-maroon-900/20 px-5 py-2 text-sm font-semibold text-maroon-900 transition hover:bg-maroon-900/5"
            >
              Huỷ
            </button>
          </div>
        </div>
      ) : (
        <div>
          {value && (
            <div
              className="relative mb-3 overflow-hidden rounded-xl border border-maroon-900/15 bg-maroon-900/5"
              style={{ width: FRAME_WIDTH, height: frameHeight }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={pickFile}
              className="rounded-full bg-maroon-900 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-maroon-800"
            >
              {value ? "Đổi ảnh" : "Chọn ảnh"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Xoá ảnh
              </button>
            )}
          </div>
        </div>
      )}

      <p className="mt-2 text-xs text-ink-700/60">
        Chọn từ máy tính hoặc điện thoại — tối đa 50MB. Hỗ trợ ảnh JPG, PNG, WEBP, GIF. Ảnh HEIC
        (mặc định trên iPhone) cần đổi sang JPG trước.
      </p>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
