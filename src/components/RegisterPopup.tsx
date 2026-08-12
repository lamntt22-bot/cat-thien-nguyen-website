"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PHONE_RE, EMAIL_RE } from "@/lib/leads";
import type { ProductRecord } from "@/lib/product-store";
import OrnamentCorner from "@/components/OrnamentCorner";

const FREE_CONSULT_ID = "tu-van-mien-phi";
const FREE_CONSULT_LABEL = "Tư vấn miễn phí — chưa chọn sản phẩm cụ thể";

interface RegisterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
  products: ProductRecord[];
}

type Step = "form" | "success";

export default function RegisterPopup({
  isOpen,
  onClose,
  initialProduct,
  products,
}: RegisterPopupProps) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState(initialProduct ?? "");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<{ loginId: string; alreadyRegistered: boolean } | null>(
    null,
  );

  // Reset the form each time the popup transitions from closed to open — done
  // during render (React's documented pattern for "adjusting state when a
  // prop changes"), not inside an effect, so it doesn't cascade an extra render.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setStep("form");
      setProduct(initialProduct ?? "");
      setSubmitError("");
      setResult(null);
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Vui lòng nhập họ tên đầy đủ.";
    if (!PHONE_RE.test(phone.trim())) next.phone = "Số điện thoại chưa đúng định dạng (VD: 0912345678).";
    if (!EMAIL_RE.test(email.trim())) next.email = "Email chưa đúng định dạng.";
    if (!product) next.product = "Vui lòng chọn sản phẩm bạn quan tâm.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (website.trim() !== "") {
      setStep("success");
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          product,
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
      setResult({
        loginId: data?.loginId ?? phone.trim(),
        alreadyRegistered: Boolean(data?.alreadyRegistered),
      });
      setStep("success");
    } catch {
      setSubmitError("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-maroon-950/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border-t-4 border-gold-500 bg-cream-50 p-6 shadow-2xl sm:max-w-md sm:rounded-3xl sm:border-4 sm:p-8"
      >
        <OrnamentCorner
          position="top-left"
          className="pointer-events-none absolute left-2 top-2 hidden h-8 w-8 text-gold-500/50 sm:block"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-maroon-900/5 text-lg text-maroon-800 transition hover:bg-maroon-900/10"
        >
          ✕
        </button>

        {step === "form" ? (
          <>
            <h2 id="register-title" className="pr-10 text-xl font-bold text-maroon-900 sm:text-2xl">
              Đăng ký nhận ưu đãi từ Cát Thiên Nguyên
            </h2>
            <p className="mt-1 text-sm text-ink-700">
              Điền thông tin, đội ngũ Cát Thiên Nguyên sẽ liên hệ tư vấn cho bạn.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="reg-name" className="mb-1 block text-sm font-medium text-maroon-900">
                  Họ tên
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
                  placeholder="Nguyễn Văn A"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="reg-phone" className="mb-1 block text-sm font-medium text-maroon-900">
                  Số điện thoại
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
                  placeholder="0911556893"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-maroon-900">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
                  placeholder="ban@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="reg-product" className="mb-1 block text-sm font-medium text-maroon-900">
                  Sản phẩm quan tâm
                </label>
                <select
                  id="reg-product"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
                >
                  <option value="">— Chọn sản phẩm —</option>
                  <option value={FREE_CONSULT_ID}>{FREE_CONSULT_LABEL}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.product && <p className="mt-1 text-sm text-red-600">{errors.product}</p>}
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="reg-website">Website</label>
                <input
                  id="reg-website"
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
                {submitting ? "Đang gửi..." : "Đăng ký"}
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-maroon-900 text-2xl text-gold-400">
              ✓
            </div>
            <h2 className="mt-4 text-xl font-bold text-maroon-900 sm:text-2xl">
              Cảm ơn bạn đã đăng ký!
            </h2>

            {result?.alreadyRegistered ? (
              <p className="mt-2 text-ink-700">
                Số điện thoại/email này đã có tài khoản trên hệ thống — vui lòng đăng nhập lại để
                xem thông tin của bạn.
              </p>
            ) : (
              <>
                <p className="mt-2 text-ink-700">Hệ thống đã tạo sẵn tài khoản cho bạn:</p>
                <div className="mt-3 rounded-xl bg-maroon-900/5 p-4 text-left text-sm">
                  <p>
                    <span className="text-ink-700/70">Tài khoản đăng nhập:</span>{" "}
                    <span className="font-semibold text-maroon-900">{result?.loginId}</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-ink-700/70">Mật khẩu mặc định:</span>{" "}
                    <span className="font-semibold text-maroon-900">123456789</span>
                  </p>
                </div>
                <p className="mt-3 text-sm font-medium text-red-600">
                  Vui lòng đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản.
                </p>
              </>
            )}

            <a
              href="/login"
              className="mt-6 block w-full rounded-xl bg-red-600 px-6 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
            >
              Đăng nhập ngay
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full rounded-xl px-6 py-3 text-sm font-semibold text-ink-700 transition hover:bg-maroon-900/5"
            >
              Để sau, đóng popup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
