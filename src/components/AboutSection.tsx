import Image from "next/image";
import Reveal from "@/components/Reveal";

const MARKET_FACTS = [
  { value: "7 triệu+", label: "người Việt mắc tiểu đường (60% chưa được chẩn đoán)" },
  { value: "12 triệu+", label: "người mắc tăng huyết áp" },
  { value: "13 triệu", label: "phụ nữ đang ở giai đoạn tiền mãn kinh" },
  { value: "42%", label: "người đi làm thường xuyên căng thẳng, mất ngủ" },
];

export default function AboutSection({ moreHref = "/ve-chung-toi" }: { moreHref?: string }) {
  return (
    <section id="ve-chung-toi" className="relative overflow-hidden bg-cream-50 py-16 sm:py-20">
      <Image
        src="/assets/products/dược liệu pro.png"
        alt=""
        fill
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-cream-50/60 via-cream-50/25 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <span
          className="text-sm font-semibold uppercase tracking-wide text-red-600"
          style={{ textShadow: "0 1px 16px rgba(253,250,243,0.9)" }}
        >
          Câu chuyện thương hiệu
        </span>
        <h2
          className="mt-2 max-w-xl font-display text-2xl font-semibold text-maroon-950 sm:text-3xl"
          style={{ textShadow: "0 2px 20px rgba(253,250,243,0.95)" }}
        >
          Sức khỏe người Việt đang bị bào mòn mỗi ngày — không phải vì thiếu thuốc, mà vì thừa
          thuốc
        </h2>
        <div className="mt-4 h-px w-16 bg-gold-500/60" />
        <p
          className="mt-4 max-w-xl text-ink-700"
          style={{ textShadow: "0 1px 16px rgba(253,250,243,0.95)" }}
        >
          Việt Nam sở hữu nguồn dược liệu quý bậc nhất thế giới — nhưng đang dần mai một trước làn
          sóng lạm dụng thuốc Tây. Cát Thiên Nguyên ra đời để đưa dược liệu quý cấp 1 của Việt Nam
          trở lại đời sống hiện đại, xây dựng thói quen chăm sóc sức khỏe chủ động, cải thiện từ
          gốc rễ một cách nhẹ nhàng nhất — không thay thế y học hiện đại.
        </p>
        <a
          href={moreHref}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-maroon-900 px-5 py-2.5 text-sm font-bold text-cream-50 shadow-md transition hover:bg-maroon-800"
        >
          Xem thêm
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <Reveal className="relative mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 px-5 sm:grid-cols-4 sm:px-8">
        {MARKET_FACTS.map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl border border-gold-500/30 bg-blush-50/92 p-4 text-center shadow-sm backdrop-blur-sm"
          >
            <p className="font-display text-2xl font-semibold text-maroon-900">{fact.value}</p>
            <p className="mt-1 text-xs text-ink-700/70">{fact.label}</p>
          </div>
        ))}
      </Reveal>
      <p className="relative mx-auto mt-3 max-w-4xl px-5 text-center text-xs text-ink-700/60 sm:px-8">
        Số liệu thị trường tổng hợp, dùng để minh họa nhu cầu chung — không phải cam kết điều trị
        cho sản phẩm cụ thể.
      </p>
    </section>
  );
}
