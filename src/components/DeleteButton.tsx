"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  endpoint,
  confirmMessage,
}: {
  endpoint: string;
  confirmMessage: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmMessage)) return;
    setDeleting(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        window.alert("Xoá thất bại, vui lòng thử lại.");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-full border border-red-600/40 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600/10 disabled:opacity-60"
    >
      {deleting ? "Đang xoá..." : "Xoá"}
    </button>
  );
}
