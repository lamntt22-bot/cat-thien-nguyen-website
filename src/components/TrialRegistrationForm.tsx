"use client";

import { useState, type FormEvent } from "react";
import { PHONE_RE } from "@/lib/leads";
import type { ProductRecord } from "@/lib/product-store";

interface TrialRegistrationFormProps {
  products: ProductRecord[];
}

export default function TrialRegistrationForm({ products }: TrialRegistrationFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-gold-500/20 bg-cream-50 p-8 text-center shadow-xl">
        <p className="text-ink-700">
          Hiện chưa có sản phẩm nào mở đăng ký dùng thử. Vui lòng quay lại sau hoặc liên hệ trực
          tiếp với chúng tôi.
        </p>
      </div>
    );
  }

  function toggleProduct(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Vui lòng nhập họ tên đầy đủ.";
    if (!PHONE_RE.test(phone.trim())) {
      next.phone = "Số điện thoại chưa đúng định dạng (VD: 0912345678).";
    }
    if (occupation.trim().length < 2) {
      next.occupation = "Vui lòng nhập nghề nghiệp / công tác hiện tại.";
    }
    if (selected.length === 0) next.products = "Vui lòng chọn ít nhất một sản phẩm dùng thử.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (website.trim() !== "") {
      setSuccess(true);
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/trial-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          occupation: occupation.trim(),
          productIds: selected,
          website,
        }),
      });
      if (res.status === 429) {
        setSubmitError("Bạn vừa đăng ký gần đây — vui lòng thử lại sau ít phút.");
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSubmitError(data?.error ?? "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }
      setSuccess(true);
    } catch {
      setSubmitError("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-gold-500/20 bg-cream-50 p-6 shadow-xl sm:p-8">
      {success ? (
        <div className="py-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-maroon-900 text-2xl text-gold-400">
            ✓
          </div>
          <h3 className="mt-4 text-xl font-bold text-maroon-900">Đăng ký thành công!</h3>
          <p className="mt-2 text-sm text-ink-700 sm:text-base">
            Cảm ơn bạn đã quan tâm. Đội ngũ Cát Thiên Nguyên sẽ liên hệ để gửi mẫu dùng thử trong
            thời gian sớm nhất.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <h2 className="text-lg font-bold text-maroon-900">Thông tin đăng ký</h2>

          <div>
            <label htmlFor="trial-name" className="mb-1 block text-sm font-medium text-maroon-900">
              Họ tên
            </label>
            <input
              id="trial-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="Nguyễn Văn A"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="trial-phone" className="mb-1 block text-sm font-medium text-maroon-900">
              Số điện thoại
            </label>
            <input
              id="trial-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="0911556893"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label
              htmlFor="trial-occupation"
              className="mb-1 block text-sm font-medium text-maroon-900"
            >
              Nghề nghiệp / công tác hiện tại
            </label>
            <input
              id="trial-occupation"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="VD: Kinh doanh tự do, Dược sĩ, Nhân viên văn phòng..."
            />
            {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>}
          </div>

          <div>
            <p className="mb-2 block text-sm font-medium text-maroon-900">
              Chọn sản phẩm muốn dùng thử (có thể chọn nhiều)
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {products.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                    selected.includes(p.id)
                      ? "border-gold-500 bg-gold-500/10 text-maroon-900"
                      : "border-maroon-900/15 bg-white text-ink-700 hover:border-maroon-900/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className="h-4 w-4 accent-red-600"
                  />
                  {p.name}
                </label>
              ))}
            </div>
            {errors.products && <p className="mt-1 text-sm text-red-600">{errors.products}</p>}
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="trial-website">Website</label>
            <input
              id="trial-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-red-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 disabled:opacity-60"
          >
            {submitting ? "Đang gửi..." : "Đăng ký dùng thử"}
          </button>
        </form>
      )}
    </div>
  );
}
