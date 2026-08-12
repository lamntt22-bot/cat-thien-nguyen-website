"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { MemberRecord } from "@/lib/member-store";

export default function MemberForm({ member }: { member: MemberRecord }) {
  const router = useRouter();
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [email, setEmail] = useState(member.email);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      router.push("/admin");
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
        <label className="mb-1 block text-sm font-medium text-maroon-900">Họ và tên</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">Số điện thoại</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-maroon-900">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {submitting ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
