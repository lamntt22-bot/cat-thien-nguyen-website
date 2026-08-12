"use client";

import { useState } from "react";

export default function OrderProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleClick() {
    setState("submitting");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <span className="text-xs font-semibold text-green-700">
        Đã gửi yêu cầu mua {productName} — CTN sẽ liên hệ bạn sớm.
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "submitting"}
      className="rounded-full bg-maroon-900 px-4 py-2 text-xs font-bold text-cream-50 transition hover:bg-maroon-800 disabled:opacity-60"
    >
      {state === "submitting" ? "Đang gửi..." : "Quan tâm mua"}
    </button>
  );
}
