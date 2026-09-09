import Link from "next/link";
import type { ProductRecord } from "@/lib/product-store";

interface TrialRegistrationSectionProps {
  products: ProductRecord[];
}

export default function TrialRegistrationSection({ products }: TrialRegistrationSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-y border-gold-500/25 bg-maroon-900 py-8 sm:py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-5 text-center sm:px-8">
        <span className="inline-flex items-center rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
          Dược trời ban · Đất khai phúc · Sống lành tâm
        </span>
        <h2 className="font-display text-xl font-bold text-cream-50 sm:text-2xl lg:text-3xl">
          Đăng ký trải nghiệm Hồng Nguyệt Trà
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-cream-100/85 sm:text-base">
          Dành riêng cho khách hàng mong muốn lắng nghe cơ thể và các đối tác quan tâm đến giải
          pháp dưỡng sinh thảo dược bền vững.
        </p>
        <Link
          href="/dang-ky-dung-thu"
          className="mt-2 rounded-full bg-red-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
        >
          Đăng ký trải nghiệm miễn phí
        </Link>
      </div>
    </section>
  );
}
