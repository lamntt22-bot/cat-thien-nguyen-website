import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";
import WhyChooseUs from "@/components/WhyChooseUs";

export const metadata: Metadata = {
  title: "Về chúng tôi — Cát Thiên Nguyên",
  description:
    "Câu chuyện thương hiệu Cát Thiên Nguyên và Chuỗi Kiểm Soát Nguồn Gốc 4 Lớp — cam kết minh bạch từ nguyên liệu đến thành phẩm.",
};

export default function VeChungToiPage() {
  return (
    <main>
      <AboutSection moreHref="#chuoi-kiem-soat" />
      <WhyChooseUs />
    </main>
  );
}
