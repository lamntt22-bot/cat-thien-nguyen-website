"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TrialRequestStatus } from "@/lib/trial-store";

const STATUS_OPTIONS: { id: TrialRequestStatus; label: string }[] = [
  { id: "new", label: "Mới đăng ký" },
  { id: "contacted", label: "Đã liên hệ" },
  { id: "done", label: "Đã gửi mẫu" },
];

export default function TrialStatusSelect({
  requestId,
  status,
}: {
  requestId: string;
  status: TrialRequestStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: TrialRequestStatus) {
    setValue(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/trial-requests/${requestId}`, {
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
      onChange={(e) => handleChange(e.target.value as TrialRequestStatus)}
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
