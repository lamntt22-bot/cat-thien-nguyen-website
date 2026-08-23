"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { formatVnd } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalAmount } = useCart();

  return (
    <main className="min-h-[70vh] bg-cream-100 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-maroon-900">Giỏ hàng</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gold-500/20 bg-white p-8 text-center">
            <p className="text-sm text-ink-700">Giỏ hàng của bạn đang trống.</p>
            <Link
              href="/san-pham"
              className="mt-4 inline-block rounded-full bg-maroon-900 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-maroon-800"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-2xl border border-gold-500/20 bg-white p-4"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-maroon-900/5">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm font-semibold text-maroon-900">{item.name}</p>
                  <p className="mt-1 text-sm text-red-600">{formatVnd(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon-900/20 text-maroon-900 transition hover:bg-maroon-900/5"
                    aria-label="Giảm số lượng"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-maroon-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon-900/20 text-maroon-900 transition hover:bg-maroon-900/5"
                    aria-label="Tăng số lượng"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="ml-2 text-xs font-semibold text-ink-700/60 transition hover:text-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between rounded-2xl border border-gold-500/25 bg-white p-5">
              <span className="font-display text-base font-semibold text-maroon-900">
                Tổng cộng
              </span>
              <span className="font-display text-lg font-bold text-red-600">
                {formatVnd(totalAmount)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-full bg-red-600 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-red-500"
            >
              Tiến hành thanh toán
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
