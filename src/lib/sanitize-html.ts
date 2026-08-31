import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Nội dung soạn từ RichTextEditor (chỉ admin mới ghi được) vẫn được lọc lại ở server trước khi
 * lưu — phòng trường hợp tài khoản admin bị chiếm hoặc có ai gọi thẳng API bỏ qua giao diện.
 */
export function sanitizeContentHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "blockquote",
      "code",
      "pre",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      span: ["style"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      li: ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$|^right$|^center$|^justify$/],
        "font-size": [/^\d+(\.\d+)?(px|em|rem)$/],
        color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(.*\)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }),
    },
  });
}
