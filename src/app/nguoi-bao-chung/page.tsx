import type { Metadata } from "next";
import Endorser from "@/components/Endorser";

export const metadata: Metadata = {
  title: "Người bảo chứng chuyên môn — Cát Thiên Nguyên",
  description:
    "Giáo sư Viện sĩ Lương Ngọc Huỳnh — người đứng sau công thức của mọi dòng trà Đông y Cát Thiên Nguyên.",
};

export default function NguoiBaoChungPage() {
  return (
    <main>
      <Endorser showMoreLink={false} />
    </main>
  );
}
