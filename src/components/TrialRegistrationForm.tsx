"use client";

import { useState, type FormEvent } from "react";
import { PHONE_RE } from "@/lib/leads";
import type { ProductRecord } from "@/lib/product-store";

interface TrialRegistrationFormProps {
  products: ProductRecord[];
}

const PURPOSE_OPTIONS = [
  {
    id: "ca-nhan" as const,
    label: "Trải nghiệm cải thiện sức khỏe cá nhân",
    hint: "Khách hàng lẻ",
  },
  {
    id: "doi-tac" as const,
    label: "Tìm hiểu sản phẩm để phát triển kinh doanh / phân phối",
    hint: "Đối tác",
  },
];

const INDUSTRY_OPTIONS = [
  "Kinh doanh tự do / Online",
  "Chủ Spa / Thẩm mỹ / Phòng khám Đông y",
  "Dân văn phòng / Công sở",
];
const INDUSTRY_OTHER = "khac";

// Tagline ngắn cho từng loại trà trong danh sách chọn — chỉ dùng ở form này, không ảnh hưởng
// tới badge hiển thị ở các trang sản phẩm khác.
const PRODUCT_TAGLINES: Record<string, string> = {
  "hong-nguyet-tra": "Khí huyết dồi dào",
  "thanh-ha-tra": "Không còn nỗi lo về trĩ",
};

export default function TrialRegistrationForm({ products }: TrialRegistrationFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [purpose, setPurpose] = useState<"" | "ca-nhan" | "doi-tac">("");
  const [industry, setIndustry] = useState("");
  const [industryOther, setIndustryOther] = useState("");
  const [note, setNote] = useState("");
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
    if (address.trim().length < 2) next.address = "Vui lòng nhập địa chỉ nhận mẫu thử.";
    if (!purpose) next.purpose = "Vui lòng chọn mục đích trải nghiệm.";
    if (!industry) {
      next.industry = "Vui lòng chọn lĩnh vực / công việc hiện tại.";
    } else if (industry === INDUSTRY_OTHER && industryOther.trim().length < 2) {
      next.industry = "Vui lòng nhập lĩnh vực của bạn.";
    }
    if (selected.length === 0) next.products = "Vui lòng chọn ít nhất một loại trà muốn trải nghiệm.";
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
      const occupation = industry === INDUSTRY_OTHER ? industryOther.trim() : industry;
      const res = await fetch("/api/trial-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          purpose,
          occupation,
          note: note.trim() || undefined,
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
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <h2 className="text-lg font-bold text-maroon-900">Thông tin đăng ký</h2>

          <div>
            <label htmlFor="trial-name" className="mb-1 block text-sm font-medium text-maroon-900">
              Họ và tên
            </label>
            <input
              id="trial-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="Ví dụ: Chị Lan Anh"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="trial-phone" className="mb-1 block text-sm font-medium text-maroon-900">
              Số điện thoại / Zalo
            </label>
            <input
              id="trial-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="0911556893"
            />
            <p className="mt-1 text-xs text-ink-700/60">Để xác nhận gửi mẫu và liên hệ tư vấn.</p>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label
              htmlFor="trial-address"
              className="mb-1 block text-sm font-medium text-maroon-900"
            >
              Địa chỉ nhận mẫu thử
            </label>
            <input
              id="trial-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="Tỉnh/Thành phố hoặc địa chỉ cụ thể"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div>
            <p className="mb-2 block text-sm font-medium text-maroon-900">Mục đích trải nghiệm</p>
            <div className="space-y-2">
              {PURPOSE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    purpose === opt.id
                      ? "border-gold-500 bg-gold-500/10"
                      : "border-maroon-900/15 bg-white hover:border-maroon-900/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="trial-purpose"
                    checked={purpose === opt.id}
                    onChange={() => setPurpose(opt.id)}
                    className="mt-0.5 h-4 w-4 accent-red-600"
                  />
                  <span>
                    <span className="block font-medium text-maroon-900">{opt.label}</span>
                    <span className="text-xs text-ink-700/60">({opt.hint})</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
          </div>

          <div>
            <p className="mb-2 block text-sm font-medium text-maroon-900">
              Lĩnh vực / Công việc hiện tại
            </p>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIndustry(opt)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    industry === opt
                      ? "border-gold-500 bg-gold-500/15 text-maroon-900"
                      : "border-maroon-900/15 bg-white text-ink-700 hover:border-maroon-900/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIndustry(INDUSTRY_OTHER)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  industry === INDUSTRY_OTHER
                    ? "border-gold-500 bg-gold-500/15 text-maroon-900"
                    : "border-maroon-900/15 bg-white text-ink-700 hover:border-maroon-900/30"
                }`}
              >
                Khác
              </button>
            </div>
            {industry === INDUSTRY_OTHER && (
              <input
                type="text"
                value={industryOther}
                onChange={(e) => setIndustryOther(e.target.value)}
                className="mt-2 w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
                placeholder="Nhập lĩnh vực / công việc của bạn"
              />
            )}
            {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
          </div>

          <div>
            <p className="mb-2 block text-sm font-medium text-maroon-900">
              Chọn loại trà muốn trải nghiệm (có thể chọn nhiều)
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {products.map((p) => {
                const tagline = PRODUCT_TAGLINES[p.slug];
                return (
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
                    <span>
                      {p.name}
                      {tagline && <span className="text-ink-700/60"> — {tagline}</span>}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.products && <p className="mt-1 text-sm text-red-600">{errors.products}</p>}
          </div>

          <div>
            <label htmlFor="trial-note" className="mb-1 block text-sm font-medium text-maroon-900">
              Mong muốn / Chia sẻ thêm{" "}
              <span className="font-normal text-ink-700/60">(không bắt buộc)</span>
            </label>
            <textarea
              id="trial-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              placeholder="Ví dụ: Tình trạng sức khỏe cần hỗ trợ, hoặc mong muốn về chính sách đại lý/phân phối..."
            />
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
