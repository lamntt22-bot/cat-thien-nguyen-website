"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId.trim(), password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Đăng nhập thất bại.");
        return;
      }
      const next = searchParams.get("next");
      if (data.mustChangePassword) {
        router.push("/change-password");
      } else if (next) {
        router.push(next);
      } else {
        router.push(data.role === "admin" ? "/admin" : "/dashboard");
      }
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
        <label htmlFor="loginId" className="mb-1 block text-sm font-medium text-maroon-900">
          Số điện thoại hoặc email
        </label>
        <input
          id="loginId"
          type="text"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          placeholder="0911556893"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-maroon-900">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          placeholder="••••••••"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-red-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
