"use client";

import Image from "next/image";
import Link from "next/link";
import { useLeadCapture } from "@/components/LeadCaptureContext";

export default function Hero() {
  const { open } = useLeadCapture();

  return (
    <section id="top" className="relative overflow-hidden bg-cream-100">
      {/* Nền phủ đầy 2 bên khi màn hình rộng hơn khung ảnh (thu nhỏ zoom) — dùng chính ảnh cổng làm phông thay vì để trắng */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        <Image
          src="/assets/products/cửa hàng web có thầy Huỳnh.png"
          alt=""
          fill
          className="scale-125 object-cover object-center blur-2xl"
        />
        <div className="absolute inset-0 bg-cream-100/55" />
      </div>

      <div className="relative mx-auto lg:max-w-6xl">
        <Image
          src="/assets/products/cửa hàng web có thầy Huỳnh.png"
          alt="Cửa hàng Cát Thiên Nguyên cùng Giáo sư Viện sĩ Lương Ngọc Huỳnh"
          width={1536}
          height={1024}
          className="relative z-0 h-auto w-full"
          priority
        />

        {/* Desktop: hook chính của trang được đặt vào khoảng trống bên phải, cạnh ảnh thầy Huỳnh.
            Chữ dùng đơn vị cqw (theo bề rộng của chính khung này) thay vì theo breakpoint viewport,
            để khi zoom trình duyệt (ảnh bị khoá max-width nhưng viewport vẫn đổi) chữ luôn co giãn
            đúng theo khung, không bị vỡ ra ngoài nền trắng. */}
        <div
          className="absolute left-[48%] right-[17%] top-[32%] bottom-[7%] hidden flex-col justify-center overflow-hidden rounded-2xl bg-cream-50/85 text-left shadow-sm backdrop-blur-[2px] lg:flex"
          style={{ containerType: "inline-size", padding: "clamp(0.85rem, 2.4cqw, 1.75rem)" }}
        >
          <span
            className="inline-flex w-fit items-center rounded-full border border-maroon-800/25 bg-maroon-900/5 px-3.5 py-1.5 font-semibold uppercase tracking-wide text-maroon-800"
            style={{ fontSize: "clamp(0.6rem, 1.15cqw, 0.75rem)" }}
          >
            Dược liệu quý cấp 1 của Việt Nam
          </span>

          <h1
            className="font-display font-bold leading-tight text-maroon-950"
            style={{ fontSize: "clamp(1.1rem, 3.6cqw, 2.75rem)", marginTop: "clamp(0.5rem, 1.8cqw, 1rem)" }}
          >
            Dành cho ai muốn kinh doanh trà Đông y, dược liệu — mà không cần đánh cược uy tín vào
            nguồn hàng trôi nổi
          </h1>

          <p
            className="max-w-md leading-relaxed text-ink-700/85"
            style={{ fontSize: "clamp(0.7rem, 1.35cqw, 1rem)", marginTop: "clamp(0.5rem, 1.8cqw, 1rem)" }}
          >
            Phát triển độc quyền theo công thức của{" "}
            <strong className="text-maroon-800">GS.VS Lương Ngọc Huỳnh</strong>, sản xuất tại nhà
            máy có kiểm soát chất lượng, đầy đủ giấy tờ truy vết nguồn gốc.
          </p>

          <div
            className="flex flex-wrap items-center"
            style={{ marginTop: "clamp(0.75rem, 2.4cqw, 1.5rem)", gap: "clamp(0.5rem, 1.4cqw, 0.75rem)" }}
          >
            <button
              type="button"
              onClick={() => open()}
              className="rounded-full bg-maroon-900 font-bold text-cream-50 shadow-lg shadow-maroon-900/25 transition hover:bg-maroon-800"
              style={{
                fontSize: "clamp(0.7rem, 1.3cqw, 1rem)",
                padding: "clamp(0.55rem, 1.5cqw, 0.875rem) clamp(1rem, 2.8cqw, 1.75rem)",
              }}
            >
              Đăng ký nhận ưu đãi
            </button>
            <Link
              href="/san-pham"
              className="rounded-full border border-maroon-800/40 font-semibold text-maroon-900 transition hover:bg-maroon-900/5"
              style={{
                fontSize: "clamp(0.7rem, 1.3cqw, 1rem)",
                padding: "clamp(0.55rem, 1.5cqw, 0.875rem) clamp(1rem, 2.8cqw, 1.75rem)",
              }}
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile & tablet: nội dung xếp gọn bên dưới cổng */}
      <div className="bg-maroon-900 px-5 py-8 sm:px-8 sm:py-10 lg:hidden">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
            Dược liệu quý cấp 1 của Việt Nam
          </span>

          <h1 className="mt-4 font-display text-2xl font-semibold leading-tight text-cream-50 sm:text-3xl">
            Dành cho ai muốn kinh doanh trà Đông y, dược liệu — mà không cần đánh cược uy tín vào
            nguồn hàng trôi nổi
          </h1>

          <p className="mt-4 text-sm text-cream-100/80 sm:text-base">
            Cát Thiên Nguyên đưa dược liệu quý cấp 1 của Việt Nam trở lại đời sống hiện đại, qua
            những bài trà túi lọc tiện dụng — phát triển độc quyền theo công thức của{" "}
            <strong className="text-gold-300">Giáo sư Viện sĩ Lương Ngọc Huỳnh</strong>, sản xuất
            tại nhà máy có kiểm soát chất lượng, đầy đủ giấy tờ truy vết nguồn gốc.
          </p>

          <div className="mt-6 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => open()}
              className="w-full rounded-full bg-gold-500 px-7 py-3.5 text-base font-bold text-maroon-950 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400 sm:w-auto"
            >
              Đăng ký nhận ưu đãi
            </button>
            <Link
              href="/san-pham"
              className="w-full rounded-full border border-cream-100/30 px-7 py-3.5 text-center text-base font-semibold text-cream-50 transition hover:bg-cream-50/10 sm:w-auto"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </div>

      <div className="imperial-wave-divider" />
    </section>
  );
}
