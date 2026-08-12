"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCartButton({
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
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ productId, name, price, image }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-500"
    >
      {added ? "Đã thêm ✓" : "Thêm vào giỏ"}
    </button>
  );
}
