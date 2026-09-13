"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LuckySpinRedeemedToggle({
  id,
  redeemed,
}: {
  id: string;
  redeemed: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(redeemed);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: boolean) {
    setChecked(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/lucky-spins/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redeemed: next }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        window.alert("Cập nhật thất bại.");
        setChecked(!next);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
      <input
        type="checkbox"
        checked={checked}
        disabled={saving}
        onChange={(e) => handleChange(e.target.checked)}
        className="h-4 w-4 accent-red-600"
      />
      <span className={checked ? "text-green-700" : "text-ink-700/60"}>
        {checked ? "Đã đổi thưởng" : "Chưa đổi"}
      </span>
    </label>
  );
}
