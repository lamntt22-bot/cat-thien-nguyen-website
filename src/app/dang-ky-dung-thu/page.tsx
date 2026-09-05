import type { Metadata } from "next";
import TrialRegistrationForm from "@/components/TrialRegistrationForm";
import { listProducts, type ProductRecord } from "@/lib/product-store";

export const metadata: Metadata = {
  title: "Đăng ký dùng thử sản phẩm — Cát Thiên Nguyên",
  description:
    "Đăng ký nhận mẫu dùng thử miễn phí các sản phẩm của Cát Thiên Nguyên trước khi nhập hàng, làm Đại lý hoặc Đối tác.",
};

const BENEFITS = [
  "Nhận mẫu dùng thử miễn phí trước khi quyết định nhập hàng số lượng lớn",
  "Được tư vấn trực tiếp chiết khấu Đại lý / Đối tác phù hợp với quy mô kinh doanh",
  "Đánh giá thật chất lượng sản phẩm — không cần đánh cược uy tín vào nguồn hàng trôi nổi",
];

export default async function TrialRegistrationPage() {
  let products: ProductRecord[] = [];
  try {
    products = await listProducts({ onlyPublished: true, onlyTrialAvailable: true });
  } catch (err) {
    console.error("[dang-ky-dung-thu] failed to load products", err);
  }

  return (
    <main className="bg-cream-100">
      <section className="border-b border-gold-500/25 bg-maroon-900 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl px-5 text-center text-cream-50 sm:px-8">
          <span className="inline-flex items-center rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
            Dành cho Đại lý & Đối tác
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Đăng ký nhận mẫu dùng thử miễn phí
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-cream-100/85 sm:text-base">
            Trước khi trở thành Đại lý hay Đối tác của Cát Thiên Nguyên, bạn có thể đăng ký dùng
            thử trực tiếp sản phẩm để đánh giá chất lượng — hoàn toàn miễn phí.
          </p>
          <ul className="mt-6 inline-block space-y-2.5 text-left">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-cream-100/90 sm:text-base">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-maroon-950">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-5 py-10 sm:px-8 sm:py-14">
        <TrialRegistrationForm products={products} />
      </section>
    </main>
  );
}
