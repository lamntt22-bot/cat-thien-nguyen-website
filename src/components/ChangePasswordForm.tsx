"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Mật khẩu mới cần ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Hai mật khẩu không khớp.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-maroon-900">
          Mật khẩu mới
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          placeholder="Ít nhất 8 ký tự"
          required
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-maroon-900"
        >
          Nhập lại mật khẩu mới
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-red-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {submitting ? "Đang lưu..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
