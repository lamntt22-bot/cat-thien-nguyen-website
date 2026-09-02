export type PageSectionField = "eyebrow" | "heading" | "body" | "note" | "image" | "items";

export interface PageSectionConfig {
  slug: string;
  label: string;
  fields: PageSectionField[];
  itemsLabel?: string;
  itemsHint?: string;
  /** width/height của khung hiển thị ảnh — có giá trị thì cho phép kéo/phóng để cắt ảnh vừa khung. */
  imageAspectRatio?: number;
}

export const PAGE_SECTIONS: PageSectionConfig[] = [
  {
    slug: "ve-chung-toi",
    label: "Về chúng tôi — Câu chuyện thương hiệu",
    fields: ["eyebrow", "heading", "body", "image", "items", "note"],
    itemsLabel: "Số liệu thị trường",
    itemsHint: "Giá trị = con số hiển thị to (VD: 7 triệu+), Tiêu đề = mô tả đi kèm bên dưới.",
  },
  {
    slug: "nguoi-bao-chung",
    label: "Người bảo chứng — Giáo sư Huỳnh",
    fields: ["eyebrow", "heading", "body", "image", "items"],
    itemsLabel: "Gạch đầu dòng năng lực / uy tín",
    itemsHint: "Chỉ cần nhập Tiêu đề cho mỗi dòng, để trống Giá trị.",
    imageAspectRatio: 4 / 5,
  },
  {
    slug: "hanh-trinh-cua-chung-toi",
    label: "Hành trình của chúng tôi — Video",
    fields: ["eyebrow", "heading", "items"],
    itemsLabel: "Danh sách video (link YouTube)",
    itemsHint: "Giá trị = dán nguyên link YouTube từ trình duyệt. Tiêu đề = chú thích ngắn, tuỳ chọn.",
  },
  {
    slug: "dai-ly-doi-tac",
    label: "Đại lý & Đối tác — Tiêu đề chung",
    fields: ["eyebrow", "heading"],
  },
  {
    slug: "dai-ly-doi-tac-dai-ly",
    label: "Đại lý & Đối tác — Thẻ \"Đại lý\"",
    fields: ["eyebrow", "heading", "body", "note", "items"],
    itemsLabel: "Bảng chiết khấu theo doanh số",
    itemsHint: "Tiêu đề = mức doanh số nhập hàng, Giá trị = % chiết khấu.",
  },
  {
    slug: "dai-ly-doi-tac-doi-tac",
    label: "Đại lý & Đối tác — Thẻ \"Đối tác độc quyền\"",
    fields: ["eyebrow", "heading", "body", "note", "items"],
    itemsLabel: "Điều kiện & quyền lợi",
    itemsHint: "Tiêu đề = tên điều kiện, Giá trị = nội dung.",
  },
];

export function getPageSectionConfig(slug: string): PageSectionConfig | undefined {
  return PAGE_SECTIONS.find((s) => s.slug === slug);
}
