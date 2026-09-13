"use client";

import { useState, type FormEvent } from "react";
import { PHONE_RE } from "@/lib/leads";
import { LUCKY_PRIZES } from "@/lib/lucky-spin-prizes";

const SEGMENT_ANGLE = 360 / LUCKY_PRIZES.length;
const CENTER = 150;
const RADIUS = 140;

function polarToCartesian(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + radius * Math.sin(rad), y: CENTER - radius * Math.cos(rad) };
}

function segmentPath(index: number) {
  const start = index * SEGMENT_ANGLE;
  const end = start + SEGMENT_ANGLE;
  const p1 = polarToCartesian(start, RADIUS);
  const p2 = polarToCartesian(end, RADIUS);
  return `M${CENTER},${CENTER} L${p1.x},${p1.y} A${RADIUS},${RADIUS} 0 0,1 ${p2.x},${p2.y} Z`;
}

type Step = "form" | "wheel" | "result";

export default function LuckySpinWheel() {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prizeLabel, setPrizeLabel] = useState("");
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Vui lòng nhập họ tên đầy đủ.";
    if (!PHONE_RE.test(phone.trim())) {
      next.phone = "Số điện thoại chưa đúng định dạng (VD: 0912345678).";
    }
    if (occupation.trim().length < 2) next.occupation = "Vui lòng nhập nghề nghiệp.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/lucky-spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), occupation: occupation.trim(), website }),
      });
      if (res.status === 429) {
        setSubmitError("Bạn vừa thử gần đây — vui lòng thử lại sau ít phút.");
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSubmitError(data?.error ?? "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }

      const index = LUCKY_PRIZES.findIndex((p) => p.key === data.prizeKey);
      const targetIndex = index === -1 ? 0 : index;
      const segmentCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      const jitter = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.6);
      const extraSpins = 5 * 360;
      const finalRotation = extraSpins + (360 - segmentCenter + jitter);

      setPrizeLabel(data.prizeLabel);
      setAlreadyPlayed(Boolean(data.alreadyPlayed));

      if (data.alreadyPlayed) {
        // Đã quay trước đó — hiện luôn kết quả cũ, không cần quay lại animation.
        setStep("result");
        return;
      }

      setStep("wheel");
      // Đợi 1 nhịp để DOM vẽ bánh xe ở vị trí 0 trước khi set rotation, để animation transition chạy đúng.
      requestAnimationFrame(() => {
        setSpinning(true);
        setRotation(finalRotation);
      });
      setTimeout(() => {
        setSpinning(false);
        setStep("result");
      }, 4200);
    } catch {
      setSubmitError("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "form") {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4" noValidate>
        <div>
          <label htmlFor="spin-name" className="mb-1 block text-sm font-medium text-maroon-900">
            Họ tên
          </label>
          <input
            id="spin-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            placeholder="Nguyễn Văn A"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="spin-phone" className="mb-1 block text-sm font-medium text-maroon-900">
            Số điện thoại
          </label>
          <input
            id="spin-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            placeholder="0911556893"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="spin-occupation" className="mb-1 block text-sm font-medium text-maroon-900">
            Nghề nghiệp
          </label>
          <input
            id="spin-occupation"
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full rounded-xl border border-maroon-900/15 bg-white px-4 py-3 text-ink-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            placeholder="VD: Kinh doanh tự do, Nhân viên văn phòng..."
          />
          {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>}
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="spin-website">Website</label>
          <input
            id="spin-website"
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
          {submitting ? "Đang xử lý..." : "🎉 Tham gia quay thưởng"}
        </button>
      </form>
    );
  }

  if (step === "wheel") {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-[300px] w-[300px]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[-6px] z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[22px] border-x-transparent border-t-red-600"
          />
          <svg
            viewBox="0 0 300 300"
            className="h-full w-full drop-shadow-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.23, 1)" : "none",
            }}
          >
            <circle cx={CENTER} cy={CENTER} r={RADIUS + 4} fill="#fdfaf3" stroke="#c9a24b" strokeWidth={4} />
            {LUCKY_PRIZES.map((prize, i) => {
              const mid = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
              const labelPos = polarToCartesian(mid, RADIUS * 0.62);
              return (
                <g key={prize.key}>
                  <path d={segmentPath(i)} fill={prize.color} stroke="#fdfaf3" strokeWidth={2} />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="#fdfaf3"
                    fontSize={12}
                    fontWeight={700}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                  >
                    {prize.shortLabel}
                  </text>
                </g>
              );
            })}
            <circle cx={CENTER} cy={CENTER} r={16} fill="#c9a24b" stroke="#fdfaf3" strokeWidth={3} />
          </svg>
        </div>
        <p className="text-sm font-semibold text-maroon-900">
          {spinning ? "Đang quay, chúc bạn may mắn..." : "Chuẩn bị..."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md py-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon-900 text-3xl text-gold-400">
        🎁
      </div>
      <h3 className="mt-4 text-xl font-bold text-maroon-900">
        {alreadyPlayed ? "Bạn đã tham gia rồi!" : "Chúc mừng bạn!"}
      </h3>
      <p className="mt-2 text-ink-700">
        {alreadyPlayed ? "Số điện thoại này đã quay trước đó. Phần thưởng của bạn là:" : "Bạn đã trúng:"}
      </p>
      <p className="mt-3 rounded-xl bg-gold-500/15 px-4 py-3 text-lg font-bold text-maroon-900">
        {prizeLabel}
      </p>
      <p className="mt-4 text-sm text-ink-700">
        Vui lòng đưa màn hình này cho nhân viên Cát Thiên Nguyên tại sự kiện để nhận thưởng.
      </p>
    </div>
  );
}
