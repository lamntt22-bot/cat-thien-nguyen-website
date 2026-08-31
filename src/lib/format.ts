export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}₫`;
}

export function formatVndInput(amount: number): string {
  return amount > 0 ? amount.toLocaleString("vi-VN") : "";
}

export function parseVndInput(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

/** RichTextEditor trả về "<p></p>" cho nội dung trống — không phải chuỗi rỗng — nên cần kiểm tra
 * bằng cách bỏ hết thẻ HTML thay vì chỉ so sánh với "". */
export function isEmptyRichText(html: string): boolean {
  const withoutTags = html.replace(/<[^>]*>/g, "").trim();
  const hasMedia = /<(img|video)\b/i.test(html);
  return withoutTags.length === 0 && !hasMedia;
}
