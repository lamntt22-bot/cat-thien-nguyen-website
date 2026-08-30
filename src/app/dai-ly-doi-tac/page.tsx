import type { Metadata } from "next";
import AgentPartnerSection from "@/components/AgentPartnerSection";
import { getPageSections } from "@/lib/page-content-store";

export const metadata: Metadata = {
  title: "Đại lý & Đối tác — Cát Thiên Nguyên",
  description:
    "Chương trình Đại lý (rào cản thấp, chiết khấu 10–40%) và Đối tác độc quyền khu vực của Cát Thiên Nguyên.",
};

export default async function DaiLyDoiTacPage() {
  let sections: Awaited<ReturnType<typeof getPageSections>> = {};
  try {
    sections = await getPageSections([
      "dai-ly-doi-tac",
      "dai-ly-doi-tac-dai-ly",
      "dai-ly-doi-tac-doi-tac",
    ]);
  } catch (err) {
    console.error("[dai-ly-doi-tac] failed to load page sections", err);
  }

  return (
    <main>
      <AgentPartnerSection
        showMoreLink={false}
        content={{
          intro: sections["dai-ly-doi-tac"],
          daily: sections["dai-ly-doi-tac-dai-ly"],
          partner: sections["dai-ly-doi-tac-doi-tac"],
        }}
      />
    </main>
  );
}
