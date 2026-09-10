"use client";

import { useState } from "react";

export default function SyncSheetButton() {
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSync() {
    setStatus("syncing");
    setMessage("");
    try {
      const res = await fetch("/api/admin/trial-requests/sync-sheet", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Đồng bộ thất bại.");
        return;
      }
      setStatus("done");
      setMessage(`Đã đồng bộ ${data.count} dòng vào Google Sheet.`);
    } catch {
      setStatus("error");
      setMessage("Không kết nối được máy chủ.");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleSync}
        disabled={status === "syncing"}
        className="rounded-full border border-maroon-900/20 px-4 py-2 text-xs font-semibold text-maroon-900 transition hover:bg-maroon-900/5 disabled:opacity-60"
      >
        {status === "syncing" ? "Đang đồng bộ..." : "🔄 Đồng bộ lại toàn bộ vào Google Sheet"}
      </button>
      {message && (
        <p className={`text-xs ${status === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
