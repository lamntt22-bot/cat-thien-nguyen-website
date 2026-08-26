"use client";

import Image from "next/image";
import Link from "next/link";
import OrnamentCorner from "@/components/OrnamentCorner";
import { useLeadCapture } from "@/components/LeadCaptureContext";

export default function Hero() {
  const { open } = useLeadCapture();

  return (
    <section id="top" className="relative overflow-hidden bg-cream-100">
      <div className="relative">
        <Image
          src="/assets/products/cửa hàng web.png"
          alt="Cửa hàng Cát Thiên Nguyên — Nam dược trị gốc, Dưỡng tâm an nhiên"
          width={1536}
          height={1024}
          className="relative z-0 h-auto w-full"
          priority
        />

        {/* Desktop: ảnh Giáo sư và slogan được lồng ghép vào giữa cánh cổng, mỗi bên nửa không gian */}
        <div className="absolute left-[18%] right-[17%] top-[34%] bottom-[7%] hidden lg:flex lg:items-stretch lg:gap-5 xl:gap-7">
          <div className="relative h-full w-[46%] shrink-0 overflow-hidden rounded-[1.25rem] border-2 border-gold-500/50 shadow-xl">
            <Image
              src="/assets/products/ảnh thầy Huỳnh.jpg"
              alt="Giáo sư Viện sĩ Lương Ngọc Huỳnh"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-950/90 to-transparent px-3 py-2.5 xl:px-4 xl:py-3">
              <p className="font-display text-[11px] font-semibold text-gold-300 xl:text-sm">
                GS.VS Lương Ngọc Huỳnh
              </p>
            </div>
            <OrnamentCorner position="top-left" className="absolute left-2 top-2 h-6 w-6 text-gold-300/90 xl:h-7 xl:w-7" />
            <OrnamentCorner position="top-right" className="absolute right-2 top-2 h-6 w-6 text-gold-300/90 xl:h-7 xl:w-7" />
            <OrnamentCorner position="bottom-left" className="absolute bottom-2 left-2 h-6 w-6 text-gold-300/90 xl:h-7 xl:w-7" />
            <OrnamentCorner
              position="bottom-right"
              className="absolute bottom-2 right-2 h-6 w-6 text-gold-300/90 xl:h-7 xl:w-7"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center text-left">
            <span className="inline-flex w-fit items-center rounded-full border border-maroon-800/25 bg-maroon-900/5 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-maroon-800 xl:text-xs">
              Dược liệu quý cấp 1 của Việt Nam
            </span>

            <h1 className="mt-3 font-display text-xl font-bold leading-tight text-maroon-950 xl:text-3xl 2xl:text-4xl">
              Dành cho ai muốn kinh doanh trà Đông y, dược liệu — mà không cần đánh cược uy tín vào
              nguồn hàng trôi nổi
            </h1>

            <Link
              href="/ve-chung-toi"
              className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-maroon-900 px-5 py-2.5 text-xs font-bold text-cream-50 shadow-md shadow-maroon-900/20 transition hover:bg-maroon-800 xl:px-6 xl:py-3 xl:text-sm"
            >
              Xem thêm
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile & tablet: nội dung xếp gọn bên dưới cổng */}
      <div className="bg-maroon-900 px-5 py-8 sm:px-8 sm:py-10 lg:hidden">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gold-400/70 shadow-md">
            <Image
              src="/assets/products/ảnh thầy Huỳnh.jpg"
              alt="Giáo sư Viện sĩ Lương Ngọc Huỳnh"
              fill
              className="object-cover"
            />
          </span>

          <span className="mt-4 inline-flex items-center rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
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
