import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import AmbientBackground from "@/components/AmbientBackground";
import { CraneCorner, CloudWisp } from "@/components/MotifAccents";
import OrnamentCorner from "@/components/OrnamentCorner";

const CREDENTIALS = [
  "Người đứng sau công thức của mọi dòng trà Đông y Cát Thiên Nguyên",
  "Người sáng lập võ phái Lâm Sơn Động — nắm giữ 2/3 số kỷ lục võ thuật tại Việt Nam",
  "Bậc thầy khí công và kỳ kinh bát mạch, xuất thân từ gia đình nhiều đời làm Đông y",
  "Từng khám chữa bệnh Đông y cho nhiều chính khách, doanh nhân hàng đầu Việt Nam và thế giới",
  "Bậc thầy phong thủy hàng đầu Việt Nam",
];

export default function Endorser({ showMoreLink = true }: { showMoreLink?: boolean }) {
  return (
    <section id="nguoi-bao-chung" className="relative overflow-hidden bg-maroon-950 py-16 text-cream-50 sm:py-20">
      <AmbientBackground variant="light" />
      <CraneCorner position="top-right" className="hidden h-56 w-56 opacity-65 lg:-right-8 lg:-top-8 lg:block" />
      <CraneCorner position="bottom-left" className="hidden h-40 w-40 opacity-55 lg:-bottom-14 lg:-left-14 lg:block" />
      <CloudWisp className="right-[20%] top-[10%] h-32 w-40 opacity-30" rotate={6} />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center">
        <Reveal>
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.5rem] border border-gold-500/30">
            <Image
              src="/assets/products/ảnh thầy Huỳnh.jpg"
              alt="Giáo sư Viện sĩ Lương Ngọc Huỳnh"
              fill
              className="object-cover"
            />
            <OrnamentCorner position="top-left" className="absolute left-2 top-2 h-8 w-8 text-gold-400/80" />
            <OrnamentCorner
              position="bottom-right"
              className="absolute bottom-2 right-2 h-8 w-8 text-gold-400/80"
            />
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <span className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Người bảo chứng chuyên môn
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Giáo sư Viện sĩ Lương Ngọc Huỳnh
          </h2>
          <ul className="mt-5 space-y-3">
            {CREDENTIALS.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-cream-100/85 sm:text-base">
                <span className="mt-1 text-gold-400" aria-hidden="true">
                  ✺
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-cream-100/70">
            Các dòng trà Đông y của Cát Thiên Nguyên được phát triển độc quyền dựa trên bài thuốc
            và công thức của Giáo sư Viện sĩ Lương Ngọc Huỳnh — thương hiệu không chỉ bán trà, mà
            bán một hệ thống tri thức Đông y có người thật, danh tiếng thật đứng sau.
          </p>
          {showMoreLink && (
            <Link
              href="/nguoi-bao-chung"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-maroon-950 shadow-md transition hover:bg-gold-400"
            >
              Xem thêm
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
