/**
 * Nội dung soạn từ RichTextEditor được lưu dạng HTML. Bài viết/mô tả cũ (trước khi có
 * RichTextEditor) vẫn là văn bản thường, tách đoạn bằng dòng trống — nhận diện bằng việc
 * có/không có thẻ HTML để hiển thị đúng cho cả nội dung cũ lẫn mới.
 */
export default function RichContent({ html, className }: { html: string; className?: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(html);

  if (isHtml) {
    return (
      <div
        className={`rich-content ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const paragraphs = html.split(/\n\s*\n/).filter(Boolean);
  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
