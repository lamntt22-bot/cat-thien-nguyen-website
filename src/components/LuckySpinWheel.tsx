"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { PHONE_RE } from "@/lib/leads";
import { WHEEL_SEGMENTS } from "@/lib/lucky-spin-prizes";

const ZALO_OA_URL = "https://zalo.me/1148983422157930792";

const SEGMENT_ANGLE = 360 / WHEEL_SEGMENTS.length;
const CENTER = 150;
const RADIUS = 140;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lineHeight));
}

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

type Step = "form" | "spinning" | "result";

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
  const [confirmationCode, setConfirmationCode] = useState("");
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "image" | "text" | "failed">("idle");
  const [redirecting, setRedirecting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (step !== "result") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const W = 800;
    const H = 480;
    canvas.width = W;
    canvas.height = H;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#fdfaf3");
    grad.addColorStop(1, "#f3e9d6");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#c9a24b";
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, W - 32, H - 32);
    ctx.strokeStyle = "#6e0e13";
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, W - 56, H - 56);

    ctx.textAlign = "center";

    ctx.fillStyle = "#6e0e13";
    ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("CÁT THIÊN NGUYÊN", W / 2, 78);

    ctx.fillStyle = "#a9803b";
    ctx.font = "600 15px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("VÒNG QUAY MAY MẮN", W / 2, 104);

    ctx.fillStyle = "#c31f2b";
    ctx.font = "bold 30px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("🎉 PHIẾU TRÚNG THƯỞNG", W / 2, 160);

    ctx.fillStyle = "#171012";
    ctx.font = "500 17px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(`Khách hàng: ${name}   •   SĐT: ${phone}`, W / 2, 200);

    roundRect(ctx, 80, 230, W - 160, 130, 18);
    ctx.fillStyle = "#ecd9a8";
    ctx.fill();
    ctx.strokeStyle = "#c9a24b";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#6e0e13";
    ctx.font = "bold 25px 'Segoe UI', Arial, sans-serif";
    wrapText(ctx, prizeLabel, W / 2, 285, W - 240, 32);

    if (confirmationCode) {
      ctx.fillStyle = "#a9803b";
      ctx.font = "600 13px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`Mã xác nhận: ${confirmationCode}`, W / 2, 340);
    }

    ctx.fillStyle = "#5a4a3a";
    ctx.font = "13px 'Segoe UI', Arial, sans-serif";
    const dateStr = new Date().toLocaleDateString("vi-VN");
    ctx.fillText(`Ngày quay: ${dateStr}`, W / 2, 400);
    ctx.fillText(
      "Gửi ảnh phiếu này cho Zalo OA hoặc xuất trình tại sự kiện để nhận thưởng.",
      W / 2,
      424,
    );
  }, [step, name, phone, prizeLabel, confirmationCode]);

  function handleDownloadVoucher() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "phieu-trung-thuong-cat-thien-nguyen.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(confirmationCode);
      setCopyStatus("text");
    } catch {
      setCopyStatus("failed");
    }
  }

  // Zalo không hỗ trợ soạn sẵn nội dung trong link chat (khác wa.me?text=), nên cách gần nhất
  // để khách "chỉ cần dán rồi gửi" là: tự copy sẵn ảnh phiếu thưởng (hoặc dòng xác nhận, nếu
  // trình duyệt không cho copy ảnh) vào clipboard, rồi mới chuyển sang đúng khung chat Zalo OA.
  // Lưu ý: phải copy TRƯỚC khi rời trang — mở cửa sổ/điều hướng trước sẽ làm trang mất focus,
  // khiến Clipboard API báo lỗi "Document is not focused".
  async function handleSendToZalo() {
    setRedirecting(true);
    const canvas = canvasRef.current;
    try {
      if (!canvas || !window.ClipboardItem) throw new Error("no clipboard image support");
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
      if (!blob) throw new Error("canvas toBlob failed");
      await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
      setCopyStatus("image");
    } catch {
      try {
        await navigator.clipboard.writeText(
          `Tôi vừa quay trúng: ${prizeLabel}. Mã xác nhận: ${confirmationCode}`,
        );
        setCopyStatus("text");
      } catch {
        setCopyStatus("failed");
      }
    }
    // Điều hướng ngay tại tab hiện tại (không mở tab mới) — window.open sau một thao tác bất
    // đồng bộ dễ bị Safari/trình duyệt chặn như popup, còn đổi location thì không bị chặn.
    // Chờ một chút để khách kịp đọc dòng hướng dẫn bên dưới trước khi rời sang Zalo.
    setTimeout(() => {
      window.location.href = ZALO_OA_URL;
    }, 900);
  }

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

      const matchingIndexes = WHEEL_SEGMENTS.reduce<number[]>((acc, p, i) => {
        if (p.key === data.prizeKey) acc.push(i);
        return acc;
      }, []);
      const targetIndex =
        matchingIndexes.length > 0
          ? matchingIndexes[Math.floor(Math.random() * matchingIndexes.length)]
          : 0;
      const segmentCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      const jitter = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.6);
      const extraSpins = 5 * 360;
      const finalRotation = extraSpins + (360 - segmentCenter + jitter);

      setPrizeLabel(data.prizeLabel);
      setConfirmationCode(data.confirmationCode ?? "");
      setAlreadyPlayed(Boolean(data.alreadyPlayed));
      setCopyStatus("idle");

      if (data.alreadyPlayed) {
        // Đã quay trước đó — vẫn quay bánh xe tới đúng ô đã trúng cho trực quan, rồi hiện kết quả.
        setStep("spinning");
        requestAnimationFrame(() => {
          setSpinning(true);
          setRotation(finalRotation);
        });
        setTimeout(() => {
          setSpinning(false);
          setStep("result");
        }, 4200);
        return;
      }

      setStep("spinning");
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

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative h-[280px] w-[280px] shrink-0 sm:h-[300px] sm:w-[300px]">
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
          {WHEEL_SEGMENTS.map((prize, i) => {
            const mid = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
            const labelPos = polarToCartesian(mid, RADIUS * 0.66);
            const words = prize.shortLabel.split(" ");
            const lines =
              words.length > 2
                ? [words.slice(0, -1).join(" "), words[words.length - 1]]
                : [prize.shortLabel];
            return (
              <g key={`${prize.key}-${i}`}>
                <path d={segmentPath(i)} fill={prize.color} stroke="#fdfaf3" strokeWidth={2} />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fill="#fdfaf3"
                  fontSize={8.5}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                >
                  {lines.map((line, li) => (
                    <tspan key={li} x={labelPos.x} dy={li === 0 ? 0 : 10}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
          <circle cx={CENTER} cy={CENTER} r={16} fill="#c9a24b" stroke="#fdfaf3" strokeWidth={3} />
        </svg>
      </div>

      {step === "form" && (
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
            {submitting ? "Đang xử lý..." : "🎉 Điền thông tin để quay"}
          </button>
        </form>
      )}

      {step === "spinning" && (
        <p className="text-sm font-semibold text-maroon-900">Đang quay, chúc bạn may mắn...</p>
      )}

      {step === "result" && (
        <div className="w-full max-w-lg text-center">
          <h3 className="text-xl font-bold text-maroon-900">
            {alreadyPlayed ? "Bạn đã tham gia rồi!" : "Chúc mừng bạn!"}
          </h3>
          <p className="mt-1 text-sm text-ink-700">
            {alreadyPlayed
              ? "Số điện thoại này đã quay trước đó. Đây là phiếu thưởng của bạn:"
              : "Đây là phiếu trúng thưởng của bạn:"}
          </p>

          <canvas
            ref={canvasRef}
            className="mx-auto mt-4 w-full rounded-2xl border border-gold-500/30 shadow-lg"
          />

          {confirmationCode && (
            <div className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-gold-500/40 bg-gold-300/20 px-4 py-2">
              <span className="text-xs text-ink-700">Mã xác nhận:</span>
              <span className="font-mono text-sm font-bold tracking-wide text-maroon-900">
                {confirmationCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="ml-1 text-xs font-semibold text-maroon-900 underline underline-offset-2"
              >
                Sao chép
              </button>
            </div>
          )}

          <div className="mt-5">
            <button
              type="button"
              onClick={handleSendToZalo}
              disabled={redirecting}
              className="w-full rounded-xl bg-[#0068FF] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#0068FF]/30 transition hover:bg-[#0057d6] disabled:opacity-70"
            >
              {redirecting ? "Đang chuyển sang Zalo..." : "💬 Gửi phiếu thưởng qua Zalo OA"}
            </button>
          </div>

          <p className="mt-3 text-xs text-ink-700/70">
            {redirecting && copyStatus === "image" &&
              "Đã copy ảnh phiếu thưởng — dán ảnh vào khung chat Zalo rồi bấm Gửi nhé!"}
            {redirecting && copyStatus === "text" &&
              "Đã copy nội dung xác nhận — dán vào khung chat Zalo rồi bấm Gửi nhé!"}
            {redirecting && copyStatus === "failed" &&
              `Vui lòng gõ mã xác nhận ${confirmationCode || ""} hoặc gửi kèm ảnh phiếu thưởng vào khung chat Zalo nhé!`}
            {!redirecting &&
              "Bấm nút trên: ảnh phiếu thưởng sẽ được copy sẵn, Zalo OA mở đúng khung chat — bạn chỉ cần dán vào và bấm Gửi."}
          </p>

          <button
            type="button"
            onClick={handleDownloadVoucher}
            className="mt-3 text-xs font-semibold text-maroon-900 underline underline-offset-2"
          >
            📥 Hoặc tải ảnh phiếu thưởng về máy
          </button>
        </div>
      )}
    </div>
  );
}
