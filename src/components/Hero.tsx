"use client";

import Image from "next/image";
import AmbientBackground from "@/components/AmbientBackground";
import { CraneCorner, CloudWisp } from "@/components/MotifAccents";
import OrnamentCorner from "@/components/OrnamentCorner";
import { useLeadCapture } from "@/components/LeadCaptureContext";

export default function Hero() {
  const { open } = useLeadCapture();

  return (
    <section id="top" className="relative overflow-hidden bg-maroon-900">
      <Image
        src="/assets/products/cửa hàng web.png"
        alt="Cửa hàng Cát Thiên Nguyên — Nam dược trị gốc, Dưỡng tâm an nhiên"
        width={1536}
        height={1024}
        className="relative z-10 h-auto w-full"
        priority
      />
      <AmbientBackground variant="full" />
      <CraneCorner position="top-right" className="-right-8 -top-10 h-48 w-48 opacity-90 sm:h-64 sm:w-64" />
      <CraneCorner position="bottom-left" className="-bottom-10 -left-8 h-48 w-48 opacity-90 sm:h-64 sm:w-64" />
      <CloudWisp className="left-[30%] top-[18%] h-40 w-52 opacity-45 sm:h-52 sm:w-64" />
      <CloudWisp className="right-[8%] top-[6%] h-28 w-36 opacity-30" rotate={6} />
      <CloudWisp className="right-[14%] bottom-[8%] h-24 w-32 opacity-25" rotate={-8} />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300 sm:text-sm">
            Dược liệu quý cấp 1 của Việt Nam
          </span>

          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-cream-50 sm:text-4xl lg:text-5xl">
            Dành cho ai muốn kinh doanh trà Đông y, dược liệu — mà không cần đánh cược uy tín vào
            nguồn hàng trôi nổi
          </h1>

          <p className="mt-5 max-w-xl text-base text-cream-100/80 sm:text-lg">
            Cát Thiên Nguyên đưa dược liệu quý cấp 1 của Việt Nam trở lại đời sống hiện đại, qua
            những bài trà túi lọc tiện dụng — phát triển độc quyền theo công thức của{" "}
            <strong className="text-gold-300">Giáo sư Viện sĩ Lương Ngọc Huỳnh</strong>, sản xuất
            tại nhà máy có kiểm soát chất lượng, đầy đủ giấy tờ truy vết nguồn gốc.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => open()}
              className="rounded-full bg-gold-500 px-7 py-3.5 text-base font-bold text-maroon-950 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400"
            >
              Đăng ký nhận ưu đãi
            </button>
            <a
              href="#san-pham"
              className="rounded-full border border-cream-100/30 px-7 py-3.5 text-center text-base font-semibold text-cream-50 transition hover:bg-cream-50/10"
            >
              Xem sản phẩm
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-gold-400/30 shadow-2xl">
            <Image
              src="/assets/products/ảnh thầy Huỳnh.jpg"
              alt="Giáo sư Viện sĩ Lương Ngọc Huỳnh"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-950/85 to-transparent px-5 py-4">
              <p className="font-display text-sm font-semibold text-gold-300 sm:text-base">
                Giáo sư Viện sĩ Lương Ngọc Huỳnh
              </p>
            </div>
            <OrnamentCorner position="top-left" className="absolute left-3 top-3 h-9 w-9 text-gold-400/80" />
            <OrnamentCorner position="top-right" className="absolute right-3 top-3 h-9 w-9 text-gold-400/80" />
            <OrnamentCorner position="bottom-left" className="absolute bottom-3 left-3 h-9 w-9 text-gold-400/80" />
            <OrnamentCorner
              position="bottom-right"
              className="absolute bottom-3 right-3 h-9 w-9 text-gold-400/80"
            />
          </div>
        </div>
      </div>
      <div className="imperial-wave-divider" />
    </section>
  );
}
