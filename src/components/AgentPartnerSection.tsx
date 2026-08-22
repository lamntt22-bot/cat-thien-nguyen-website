"use client";

import Reveal from "@/components/Reveal";
import AmbientBackground from "@/components/AmbientBackground";
import { CraneCorner, CloudWisp } from "@/components/MotifAccents";
import OrnamentCorner from "@/components/OrnamentCorner";
import { useLeadCapture } from "@/components/LeadCaptureContext";

const DISCOUNT_TIERS = [
  { level: "Đơn từ 3 sản phẩm bất kỳ", discount: "10%" },
  { level: "Từ 5.000.000₫", discount: "15%" },
  { level: "Từ 15.000.000₫", discount: "20%" },
  { level: "Từ 30.000.000₫", discount: "25%" },
  { level: "Từ 100.000.000₫", discount: "30%" },
  { level: "Từ 300.000.000₫", discount: "34%" },
  { level: "Từ 500.000.000₫", discount: "37%" },
  { level: "Từ 1.000.000.000₫", discount: "40%" },
];

export default function AgentPartnerSection() {
  const { open } = useLeadCapture();

  return (
    <section id="dai-ly-doi-tac" className="bg-cream-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Kênh kinh doanh cùng Cát Thiên Nguyên
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            Chương trình Đại lý & Đối tác
          </h2>
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
                Rào cản thấp
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-maroon-900">
                Đại lý Cát Thiên Nguyên
              </h3>
              <p className="mt-2 text-sm text-ink-700">
                Dành cho ai muốn có thêm nguồn thu từ kinh doanh sức khỏe — không cần vốn lớn,
                không cần mặt bằng. Chỉ cần một đơn hàng từ 3 sản phẩm để bắt đầu.
              </p>

              <div className="mt-5 overflow-hidden rounded-xl border border-maroon-900/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-maroon-900/5 text-left text-ink-700">
                      <th className="px-3 py-2 font-medium">Doanh số nhập hàng/tháng</th>
                      <th className="px-3 py-2 text-right font-medium">Chiết khấu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DISCOUNT_TIERS.map((tier) => (
                      <tr key={tier.level} className="border-t border-maroon-900/5">
                        <td className="px-3 py-2 text-ink-700">{tier.level}</td>
                        <td className="px-3 py-2 text-right font-semibold text-red-600">
                          {tier.discount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-ink-700/60">
                * Sản phẩm đã đóng gói sẵn, có đầy đủ hình ảnh, nội dung, giấy tờ để đăng bán ngay.
              </p>

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
              <CraneCorner position="top-right" className="-right-14 -top-14 h-32 w-32 opacity-55" />
              <CraneCorner position="bottom-left" className="-bottom-14 -left-14 h-28 w-28 opacity-45" />
              <CloudWisp className="left-[30%] top-[8%] h-24 w-32 opacity-25" rotate={5} />
              <span className="relative w-fit rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold uppercase text-gold-400">
                Độc quyền khu vực
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold">
                Đối tác độc quyền Cát Thiên Nguyên
              </h3>
              <p className="mt-2 text-sm text-cream-100/80">
                Dành cho nhà đầu tư/chủ kinh doanh muốn sở hữu một điểm bán trà Đông y độc quyền
                tại khu vực của mình — dòng sản phẩm chủ lực chỉ có tại điểm bán của bạn.
              </p>

              <div className="mt-5 space-y-3 rounded-xl border border-gold-500/20 bg-maroon-900/60 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-cream-100/70">Điều kiện gia nhập</span>
                  <span className="text-right font-semibold text-gold-400">
                    Đơn đầu tiên ≥ 50.000.000₫ + mở điểm bán vật lý
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-cream-100/70">Chiết khấu</span>
                  <span className="text-right font-semibold text-gold-400">
                    Ưu đãi riêng, cao hơn Đại lý thường
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-cream-100/70">Hỗ trợ triển khai</span>
                  <span className="text-right font-semibold text-gold-400">
                    Bộ hồ sơ concept, bảng hiệu chuẩn
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-cream-100/60">
                * Mỗi khu vực/thành phố chỉ có một Đối tác độc quyền.
              </p>

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
