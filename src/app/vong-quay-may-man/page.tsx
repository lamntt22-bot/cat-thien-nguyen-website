import type { Metadata } from "next";
import LuckySpinWheel from "@/components/LuckySpinWheel";

export const metadata: Metadata = {
  title: "Vòng quay may mắn — Cát Thiên Nguyên",
  description: "Điền thông tin để tham gia quay thưởng cùng Cát Thiên Nguyên — nhận ngay sản phẩm dùng thử hoặc mã giảm giá.",
};

export default function VongQuayMayManPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-maroon-900 to-maroon-950 px-5 py-12 sm:px-8">
      <div className="w-full max-w-md rounded-3xl border border-gold-500/30 bg-cream-50 p-6 shadow-2xl sm:p-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-maroon-800">
            Cát Thiên Nguyên
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-maroon-950 sm:text-3xl">
            Vòng Quay May Mắn
          </h1>
          <p className="mt-2 text-sm text-ink-700">
            Điền thông tin để tham gia quay thưởng — nhận ngay sản phẩm dùng thử hoặc mã giảm giá.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <LuckySpinWheel />
        </div>
      </div>
    </main>
  );
}
