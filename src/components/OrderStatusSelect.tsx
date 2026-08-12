"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CheckoutStatus } from "@/lib/checkout-store";

const STATUS_OPTIONS: { id: CheckoutStatus; label: string }[] = [
  { id: "pending", label: "Đang chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "shipping", label: "Đang giao hàng" },
  { id: "completed", label: "Hoàn tất" },
  { id: "cancelled", label: "Đã hủy" },
];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: CheckoutStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: CheckoutStatus) {
    setValue(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        window.alert("Cập nhật trạng thái thất bại.");
        setValue(status);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as CheckoutStatus)}
      className="rounded-full border border-maroon-900/20 bg-white px-3 py-1.5 text-xs font-semibold text-maroon-900 outline-none focus:border-gold-500 disabled:opacity-60"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
