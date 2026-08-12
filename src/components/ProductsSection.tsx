"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { CloudMotif } from "@/components/CraneCloudMotif";
import { useLeadCapture } from "@/components/LeadCaptureContext";
import AddToCartButton from "@/components/AddToCartButton";
import type { ProductCategory, ProductRecord } from "@/lib/product-store";

const productCategories: { id: ProductCategory; label: string }[] = [
  { id: "tra-dong-y", label: "Trà Đông Y" },
  { id: "ngoc-am", label: "Tinh dầu Phong Thủy Ngọc Am" },
  { id: "bach", label: "Chăm sóc thiên nhiên — dòng Bạch" },
];

export default function ProductsSection({ products }: { products: ProductRecord[] }) {
  const [active, setActive] = useState<ProductCategory>("tra-dong-y");
  const { open } = useLeadCapture();
  const visible = products.filter((p) => p.category === active);

  return (
    <section id="san-pham" className="bg-cream-100 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Sản phẩm nổi bật
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            3 dòng sản phẩm của Cát Thiên Nguyên
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                active === cat.id
                  ? "bg-maroon-900 text-cream-50 shadow-md"
                  : "bg-white text-ink-700 hover:bg-maroon-900/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) => (
            <Reveal key={product.id} delayMs={i * 60}>
              <div className="flex h-full flex-col rounded-2xl border border-gold-500/25 border-t-2 border-t-gold-500 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-maroon-900 to-maroon-950 text-center text-xs text-cream-100/50">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <CloudMotif className="absolute inset-0 h-full w-full scale-150 opacity-35" />
                      <span className="relative">
                        Ảnh sản phẩm
                        <br />
                        (cập nhật sau)
                      </span>
                    </>
                  )}
                </div>
                {product.badge && (
                  <span className="mb-2 inline-flex w-fit rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-600">
                    {product.badge}
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-maroon-900">
                  {product.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-ink-700">{product.description}</p>
                {product.cbmp && (
                  <p className="mt-2 text-xs text-ink-700/60">Số CBMP: {product.cbmp}</p>
                )}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="font-display text-base font-semibold text-red-600">
                    {product.price}
                  </span>
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
                      className="rounded-full bg-maroon-900 px-4 py-2 text-xs font-bold text-cream-50 transition hover:bg-maroon-800"
                    >
                      Quan tâm sản phẩm này
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
