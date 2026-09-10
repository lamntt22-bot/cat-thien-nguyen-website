"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatVnd } from "@/lib/format";
import { getComboInfo } from "@/lib/promo";

export default function PromoQuantityAddToCart({
  productId,
  name,
  price,
  image,
}: {
  productId: string;
  name: string;
  price: number;
  image?: string;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { freeBoxes, totalBoxes, isCombo } = getComboInfo(qty);

  function handleAdd() {
    addItem({ productId, name, price, image }, qty);
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-4 space-y-2">
      {isCombo && (
        <p className="rounded-lg bg-gold-500/15 px-3 py-1.5 text-xs font-semibold text-maroon-800">
          🎁 Mua {qty} tặng {freeBoxes} — bạn nhận {totalBoxes} hộp
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-full border border-maroon-900/15 bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center text-sm font-bold text-maroon-900"
            aria-label="Giảm số lượng"
          >
            −
          </button>
          <span className="min-w-[1.5rem] text-center text-sm font-semibold text-maroon-900">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-8 w-8 items-center justify-center text-sm font-bold text-maroon-900"
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-500"
        >
          {added ? "Đã thêm ✓" : `Thêm vào giỏ · ${formatVnd(price * qty)}`}
        </button>
      </div>
    </div>
  );
}
