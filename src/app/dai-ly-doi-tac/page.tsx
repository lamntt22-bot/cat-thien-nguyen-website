import type { Metadata } from "next";
import AgentPartnerSection from "@/components/AgentPartnerSection";

export const metadata: Metadata = {
  title: "Đại lý & Đối tác — Cát Thiên Nguyên",
  description:
    "Chương trình Đại lý (rào cản thấp, chiết khấu 10–40%) và Đối tác độc quyền khu vực của Cát Thiên Nguyên.",
};

export default function DaiLyDoiTacPage() {
  return (
    <main>
      <AgentPartnerSection showMoreLink={false} />
    </main>
  );
}
