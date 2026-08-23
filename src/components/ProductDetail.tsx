"use client";

import Image from "next/image";
import Link from "next/link";
import { CloudMotif } from "@/components/CraneCloudMotif";
import { useLeadCapture } from "@/components/LeadCaptureContext";
import AddToCartButton from "@/components/AddToCartButton";
import type { ProductRecord } from "@/lib/product-store";

const CATEGORY_LABEL: Record<string, string> = {
  "tra-dong-y": "Trà Đông Y",
  "ngoc-am": "Tinh dầu phong thủy",
  bach: "Mỹ phẩm thiên nhiên",
};

const FEEDBACK_SLOTS = [1, 2];

export default function ProductDetail({
  product,
  related,
}: {
  product: ProductRecord;
  related: ProductRecord[];
}) {
  const { open } = useLeadCapture();

  return (
    <main className="bg-cream-100 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Link href="/san-pham" className="text-sm font-semibold text-maroon-800 hover:underline">
          ← Về danh sách sản phẩm
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-br from-maroon-900 to-maroon-950 shadow-sm">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-center text-sm text-cream-100/50">
                <CloudMotif className="absolute inset-0 h-full w-full scale-150 opacity-35" />
                <span className="relative">
                  Ảnh sản phẩm
                  <br />
                  (cập nhật sau)
                </span>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
              {CATEGORY_LABEL[product.category] ?? product.category}
            </span>
            {product.badge && (
              <span className="ml-2 inline-flex rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-600">
                {product.badge}
              </span>
            )}
            <h1 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
              {product.name}
            </h1>
            {product.cbmp && (
              <p className="mt-2 text-xs text-ink-700/60">Số CBMP: {product.cbmp}</p>
            )}
            <p className="mt-4 font-display text-2xl font-semibold text-red-600">
              {product.price}
            </p>

            <div className="mt-6">
              {product.priceAmount ? (
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={product.priceAmount}
                  image={product.image}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => open({ product: product.id })}
                  className="rounded-full bg-maroon-900 px-6 py-3 text-sm font-bold text-cream-50 transition hover:bg-maroon-800"
                >
                  Quan tâm sản phẩm này
                </button>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-gold-500/25 bg-white p-5">
              <h2 className="font-display text-lg font-semibold text-maroon-900">
                Thành phần & Công dụng
              </h2>
              <p className="mt-2 text-sm text-ink-700">{product.description}</p>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-xl font-semibold text-maroon-950">
            Video phản hồi từ khách hàng
          </h2>
          <div className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {FEEDBACK_SLOTS.map((slot) => (
              <div
                key={slot}
                className="relative aspect-video w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-maroon-900 to-maroon-950 shadow-sm sm:w-[380px]"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-cream-100/70">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-xl text-white shadow-lg">
                    ▶
                  </span>
                  <span className="text-sm font-medium">Video đang được cập nhật</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-ink-700/45">
            * Ô chờ video — Cát Thiên Nguyên sẽ cập nhật video phản hồi thật trong thời gian tới.
          </p>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold text-maroon-950">
              Sản phẩm khác cùng dòng
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/san-pham/${item.slug}`}
                  className="flex flex-col rounded-2xl border border-gold-500/25 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-maroon-900 to-maroon-950">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <CloudMotif className="absolute inset-0 h-full w-full scale-150 opacity-35" />
                    )}
                  </div>
                  <h3 className="font-display text-sm font-semibold text-maroon-900">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-red-600">{item.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
