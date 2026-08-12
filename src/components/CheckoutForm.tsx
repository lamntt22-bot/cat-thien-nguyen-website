"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatVnd } from "@/lib/format";

export default function CheckoutForm({
  defaultName,
  defaultPhone,
}: {
  defaultName: string;
  defaultPhone: string;
}) {
  const router = useRouter();
  const { items, totalAmount, clear } = useCart();
  const [fullName, setFullName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "cod">("cod");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-gold-500/20 bg-white p-8 text-center">
        <p className="text-sm text-ink-700">Giỏ hàng của bạn đang trống.</p>
        <Link
          href="/#san-pham"
          className="mt-4 inline-block rounded-full bg-maroon-900 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-maroon-800"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          paymentMethod,
          note: note.trim() || undefined,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      clear();
      router.push(`/checkout/success?id=${data.checkout.id}`);
    } catch {
      setError("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div className="rounded-2xl border border-gold-500/20 bg-white p-5">
        <h2 className="font-display text-sm font-semibold text-maroon-900">Đơn hàng</h2>
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span className="text-ink-700">
                {item.name} <span className="text-ink-700/50">× {item.quantity}</span>
              </span>
              <span className="font-medium text-maroon-900">
                {formatVnd(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gold-500/15 pt-3">
          <span className="font-display text-sm font-semibold text-maroon-900">Tổng cộng</span>
          <span className="font-display text-lg font-bold text-red-600">
            {formatVnd(totalAmount)}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-gold-500/20 bg-white p-5">
        <h2 className="font-display text-sm font-semibold text-maroon-900">Thông tin nhận hàng</h2>
        <div className="mt-3 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-maroon-900">Họ và tên</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-maroon-900">
              Số điện thoại
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-maroon-900">
              Địa chỉ nhận hàng
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-maroon-900">
              Ghi chú (tuỳ chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gold-500/20 bg-white p-5">
        <h2 className="font-display text-sm font-semibold text-maroon-900">
          Phương thức thanh toán
        </h2>
        <div className="mt-3 space-y-3">
          <label className="flex items-start gap-3 rounded-xl border border-maroon-900/15 p-4 transition hover:border-gold-500/40">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-semibold text-maroon-900">
                Thanh toán khi nhận hàng (COD)
              </span>
              <span className="block text-xs text-ink-700/70">
                Thanh toán tiền mặt trực tiếp cho nhân viên giao hàng.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-maroon-900/15 p-4 transition hover:border-gold-500/40">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "bank_transfer"}
              onChange={() => setPaymentMethod("bank_transfer")}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-semibold text-maroon-900">
                Chuyển khoản ngân hàng
              </span>
              <span className="block text-xs text-ink-700/70">
                Thông tin tài khoản nhận chuyển khoản sẽ được đội ngũ Cát Thiên Nguyên gửi lại
                cho bạn ngay sau khi đặt hàng thành công.
              </span>
            </span>
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {submitting ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </form>
  );
}
