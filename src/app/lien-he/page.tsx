import type { Metadata } from "next";
import LienHeSection from "@/components/LienHeSection";

export const metadata: Metadata = {
  title: "Liên hệ — Cát Thiên Nguyên",
  description: "Liên hệ Cát Thiên Nguyên qua Hotline, Zalo, Facebook, hoặc đăng ký nhận tư vấn sản phẩm.",
};

export default function LienHePage() {
  return (
    <main>
      <LienHeSection />
    </main>
  );
}
