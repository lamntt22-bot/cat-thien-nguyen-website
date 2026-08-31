"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import AmbientBackground from "@/components/AmbientBackground";
import { CraneCorner, CloudWisp } from "@/components/MotifAccents";
import OrnamentCorner from "@/components/OrnamentCorner";
import { useLeadCapture } from "@/components/LeadCaptureContext";
import RichContent from "@/components/RichContent";
import type { PageSectionRecord } from "@/lib/page-content-store";

const DEFAULTS = {
  intro: {
    eyebrow: "Kênh kinh doanh cùng Cát Thiên Nguyên",
    heading: "Chương trình Đại lý & Đối tác",
  },
  daily: {
    eyebrow: "Rào cản thấp",
    heading: "Đại lý Cát Thiên Nguyên",
    body: "Dành cho ai muốn có thêm nguồn thu từ kinh doanh sức khỏe — không cần vốn lớn, không cần mặt bằng. Chỉ cần một đơn hàng từ 3 sản phẩm để bắt đầu.",
    note: "Sản phẩm đã đóng gói sẵn, có đầy đủ hình ảnh, nội dung, giấy tờ để đăng bán ngay.",
    items: [
      { title: "Đơn từ 3 sản phẩm bất kỳ", value: "10%" },
      { title: "Từ 5.000.000₫", value: "15%" },
      { title: "Từ 15.000.000₫", value: "20%" },
      { title: "Từ 30.000.000₫", value: "25%" },
      { title: "Từ 100.000.000₫", value: "30%" },
      { title: "Từ 300.000.000₫", value: "34%" },
      { title: "Từ 500.000.000₫", value: "37%" },
      { title: "Từ 1.000.000.000₫", value: "40%" },
    ],
  },
  partner: {
    eyebrow: "Độc quyền khu vực",
    heading: "Đối tác độc quyền Cát Thiên Nguyên",
    body: "Dành cho nhà đầu tư/chủ kinh doanh muốn sở hữu một điểm bán trà Đông y độc quyền tại khu vực của mình — dòng sản phẩm chủ lực chỉ có tại điểm bán của bạn.",
    note: "Mỗi khu vực/thành phố chỉ có một Đối tác độc quyền.",
    items: [
      { title: "Điều kiện gia nhập", value: "Đơn đầu tiên ≥ 50.000.000₫ + mở điểm bán vật lý" },
      { title: "Chiết khấu", value: "Ưu đãi riêng, cao hơn Đại lý thường" },
      { title: "Hỗ trợ triển khai", value: "Bộ hồ sơ concept, bảng hiệu chuẩn" },
    ],
  },
};

export interface AgentPartnerContent {
  intro?: PageSectionRecord | null;
  daily?: PageSectionRecord | null;
  partner?: PageSectionRecord | null;
}

export default function AgentPartnerSection({
  showMoreLink = true,
  content,
}: {
  showMoreLink?: boolean;
  content?: AgentPartnerContent;
}) {
  const { open } = useLeadCapture();

  const introEyebrow = content?.intro?.eyebrow || DEFAULTS.intro.eyebrow;
  const introHeading = content?.intro?.heading || DEFAULTS.intro.heading;

  const dailyHeading = content?.daily?.heading || DEFAULTS.daily.heading;
  const dailyEyebrow = content?.daily?.eyebrow || DEFAULTS.daily.eyebrow;
  const dailyBody = content?.daily?.body || DEFAULTS.daily.body;
  const dailyNote = content?.daily?.note || DEFAULTS.daily.note;
  const dailyTiers = content?.daily?.items?.length ? content.daily.items : DEFAULTS.daily.items;

  const partnerHeading = content?.partner?.heading || DEFAULTS.partner.heading;
  const partnerEyebrow = content?.partner?.eyebrow || DEFAULTS.partner.eyebrow;
  const partnerBody = content?.partner?.body || DEFAULTS.partner.body;
  const partnerNote = content?.partner?.note || DEFAULTS.partner.note;
  const partnerConditions = content?.partner?.items?.length
    ? content.partner.items
    : DEFAULTS.partner.items;

  return (
    <section id="dai-ly-doi-tac" className="bg-cream-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            {introEyebrow}
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            {introHeading}
          </h2>
          {showMoreLink && (
            <Link
              href="/dai-ly-doi-tac"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-maroon-900 px-5 py-2.5 text-sm font-bold text-cream-50 shadow-md transition hover:bg-maroon-800"
            >
              Xem thêm
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* MVP1 — Đại lý */}
          <Reveal>
            <div className="relative flex h-full flex-col rounded-3xl border border-gold-500/30 border-t-2 border-t-gold-500 bg-white p-7 shadow-sm sm:p-8">
              <OrnamentCorner
                position="top-right"
                className="pointer-events-none absolute right-4 top-4 h-8 w-8 text-gold-500/40"
              />
              <span className="w-fit rounded-full bg-maroon-900/8 px-3 py-1 text-xs font-semibold uppercase text-maroon-800">
                {dailyEyebrow}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-maroon-900">
                {dailyHeading}
              </h3>
              <RichContent html={dailyBody} className="mt-2 text-sm text-ink-700" />

              <div className="mt-5 overflow-hidden rounded-xl border border-maroon-900/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-maroon-900/5 text-left text-ink-700">
                      <th className="px-3 py-2 font-medium">Doanh số nhập hàng/tháng</th>
                      <th className="px-3 py-2 text-right font-medium">Chiết khấu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyTiers.map((tier) => (
                      <tr key={tier.title} className="border-t border-maroon-900/5">
                        <td className="px-3 py-2 text-ink-700">{tier.title}</td>
                        <td className="px-3 py-2 text-right font-semibold text-red-600">
                          {tier.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-ink-700/60">* {dailyNote}</p>

              <button
                type="button"
                onClick={() => open({ product: "dai-ly" })}
                className="mt-6 w-full rounded-full bg-maroon-900 px-6 py-3.5 text-base font-bold text-cream-50 transition hover:bg-maroon-800"
              >
                Đăng ký làm Đại lý
              </button>
            </div>
          </Reveal>

          {/* MVP2 — Đối tác độc quyền */}
          <Reveal delayMs={100}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-gold-500/30 bg-maroon-950 p-7 text-cream-50 shadow-sm sm:p-8">
              <AmbientBackground variant="light" />
              <CraneCorner position="top-right" className="-right-8 -top-8 h-44 w-44 opacity-70" />
              <CraneCorner position="bottom-left" className="-bottom-8 -left-8 h-40 w-40 opacity-55" />
              <CloudWisp className="left-[30%] top-[8%] h-24 w-32 opacity-25" rotate={5} />
              <span className="relative w-fit rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold uppercase text-gold-400">
                {partnerEyebrow}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold">{partnerHeading}</h3>
              <RichContent html={partnerBody} className="mt-2 text-sm text-cream-100/80" />

              <div className="mt-5 space-y-3 rounded-xl border border-gold-500/20 bg-maroon-900/60 p-4 text-sm">
                {partnerConditions.map((c) => (
                  <div key={c.title} className="flex justify-between gap-4">
                    <span className="text-cream-100/70">{c.title}</span>
                    <span className="text-right font-semibold text-gold-400">{c.value}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-cream-100/60">* {partnerNote}</p>

              <button
                type="button"
                onClick={() => open({ product: "doi-tac-doc-quyen" })}
                className="mt-6 w-full rounded-full bg-gold-500 px-6 py-3.5 text-base font-bold text-maroon-950 transition hover:bg-gold-400"
              >
                Đăng ký Đối tác độc quyền
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
