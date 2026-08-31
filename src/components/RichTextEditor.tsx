"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize, Color } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const FONT_SIZES = [
  { label: "Nhỏ", value: "13px" },
  { label: "Vừa", value: "16px" },
  { label: "Lớn", value: "20px" },
  { label: "Rất lớn", value: "26px" },
];
const TEXT_COLORS = ["#3a1f14", "#7a1f1f", "#b8860b", "#1f4d3a", "#1f3a5f", "#6b21a8"];

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm font-semibold transition disabled:opacity-30 ${
        active ? "bg-maroon-900 text-cream-50" : "text-maroon-900 hover:bg-maroon-900/10"
      }`}
    >
      {children}
    </button>
  );
}

function ImageButton({ editor }: { editor: Editor }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      window.alert("Định dạng ảnh chưa hỗ trợ — dùng JPG, PNG, WEBP hoặc GIF.");
      return;
    }
    setUploading(true);
    try {
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        window.alert(data?.error ?? "Không tải lên được ảnh.");
        return;
      }
      const { error } = await getSupabaseBrowser()
        .storage.from("post-media")
        .uploadToSignedUrl(data.path, data.token, file, { contentType: file.type });
      if (error) {
        window.alert(`Không tải lên được ảnh: ${error.message}`);
        return;
      }
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    } catch {
      window.alert("Không tải lên được ảnh, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <ToolbarButton
        title="Chèn ảnh"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "…" : "🖼"}
      </ToolbarButton>
    </>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [colorOpen, setColorOpen] = useState(false);
  // Theo dõi HTML mà chính editor này vừa phát ra — dùng để phân biệt "value đổi vì chính mình
  // vừa gõ" (bỏ qua, không set lại content — set lại giữa chừng sẽ làm mất định dạng vừa áp
  // dụng, VD chọn tiêu đề) với "value đổi từ bên ngoài" (VD chuyển sang sửa bài khác).
  const lastEmittedRef = useRef(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      FontSize,
      Image.configure({ HTMLAttributes: { class: "max-w-full rounded-lg" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Nhập nội dung..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedRef.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] w-full rounded-b-xl border border-t-0 border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-red-600 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-gold-500 [&_blockquote]:pl-3 [&_blockquote]:italic",
      },
    },
  });

  // Chỉ set lại content khi value đổi từ BÊN NGOÀI (VD chuyển sang sửa bản ghi khác) —
  // so với lastEmittedRef chứ không phải editor.getHTML(), tránh đè mất định dạng vừa gõ.
  useEffect(() => {
    if (!editor) return;
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  function setLink() {
    const previous = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Đường dẫn liên kết (để trống để bỏ):", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().unsetLink().run();
      return;
    }
    editor!.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-maroon-900/15 bg-cream-100 p-1.5">
        <select
          value={
            editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else if (v === "h2") editor.chain().focus().setHeading({ level: 2 }).run();
            else editor.chain().focus().setHeading({ level: 3 }).run();
          }}
          className="h-8 rounded-md border border-maroon-900/15 bg-white px-1.5 text-xs text-ink-900"
        >
          <option value="p">Đoạn văn</option>
          <option value="h2">Tiêu đề lớn</option>
          <option value="h3">Tiêu đề nhỏ</option>
        </select>

        <select
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          defaultValue=""
          className="h-8 rounded-md border border-maroon-900/15 bg-white px-1.5 text-xs text-ink-900"
        >
          <option value="" disabled>
            Cỡ chữ
          </option>
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="mx-1 h-5 w-px bg-maroon-900/15" />

        <ToolbarButton
          title="Đậm"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="Nghiêng"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          title="Gạch chân"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </ToolbarButton>
        <ToolbarButton
          title="Gạch ngang"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </ToolbarButton>

        <div className="relative">
          <ToolbarButton title="Màu chữ" onClick={() => setColorOpen((v) => !v)}>
            A
          </ToolbarButton>
          {colorOpen && (
            <div className="absolute left-0 top-9 z-10 flex gap-1 rounded-lg border border-maroon-900/15 bg-white p-1.5 shadow-md">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().setColor(c).run();
                    setColorOpen(false);
                  }}
                  className="h-6 w-6 rounded-full border border-maroon-900/15"
                  style={{ backgroundColor: c }}
                />
              ))}
              <button
                type="button"
                title="Bỏ màu"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setColorOpen(false);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-maroon-900/15 text-[10px] text-ink-700"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="mx-1 h-5 w-px bg-maroon-900/15" />

        <ToolbarButton
          title="Căn trái"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          title="Căn giữa"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ≣
        </ToolbarButton>
        <ToolbarButton
          title="Căn phải"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ☰
        </ToolbarButton>
        <ToolbarButton
          title="Căn đều"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          ▤
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-maroon-900/15" />

        <ToolbarButton
          title="Danh sách gạch đầu dòng"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •≡
        </ToolbarButton>
        <ToolbarButton
          title="Danh sách đánh số"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          title="Trích dẫn"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-maroon-900/15" />

        <ToolbarButton title="Chèn liên kết" active={editor.isActive("link")} onClick={setLink}>
          🔗
        </ToolbarButton>
        <ImageButton editor={editor} />

        <div className="mx-1 h-5 w-px bg-maroon-900/15" />

        <ToolbarButton
          title="Hoàn tác"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          title="Làm lại"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↷
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
