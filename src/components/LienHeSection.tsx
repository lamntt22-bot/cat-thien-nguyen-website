"use client";

import AmbientBackground from "@/components/AmbientBackground";
import { CraneCorner, CloudWisp } from "@/components/MotifAccents";
import { useLeadCapture } from "@/components/LeadCaptureContext";

const CONTACT_CHANNELS = [
  {
    href: "tel:0911556893",
    label: "Hotline",
    value: "0911 556 893",
    icon: "📞",
    bg: "bg-red-600",
    external: false,
  },
  {
    href: "https://zalo.me/0911556893",
    label: "Zalo",
    value: "0911 556 893",
    icon: "Zalo",
    bg: "bg-[#0068FF]",
    external: true,
  },
  {
    href: "https://web.facebook.com/profile.php?id=61579367331528",
    label: "Facebook",
    value: "Cát Thiên Nguyên",
    icon: "f",
    bg: "bg-[#1877F2]",
    external: true,
  },
];

export default function LienHeSection() {
  const { open } = useLeadCapture();

  return (
    <section
      id="lien-he"
      className="relative overflow-hidden bg-maroon-950 py-16 text-center text-cream-50 sm:py-20"
    >
      <div className="imperial-wave-divider absolute inset-x-0 top-0" />
      <AmbientBackground variant="light" />
      <CraneCorner position="top-right" className="hidden h-56 w-56 opacity-65 lg:-right-8 lg:-top-8 lg:block" />
      <CraneCorner position="bottom-left" className="hidden h-56 w-56 opacity-65 lg:-bottom-8 lg:-left-8 lg:block" />
      <CloudWisp className="left-[8%] top-[10%] h-28 w-36 opacity-25" rotate={6} />
      <CloudWisp className="right-[10%] bottom-[10%] h-24 w-32 opacity-20" rotate={-6} />

      <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
        <span className="text-sm font-semibold uppercase tracking-wide text-gold-400">
          Liên hệ
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          Kết nối với Cát Thiên Nguyên
        </h1>
        <p className="mt-3 text-cream-100/80">
          Đăng ký nhận tư vấn sản phẩm, hoặc liên hệ trực tiếp qua các kênh dưới đây — đội ngũ Cát
          Thiên Nguyên phản hồi trong thời gian sớm nhất.
        </p>

        <div className="mx-auto mt-8 grid gap-4 sm:grid-cols-3">
          {CONTACT_CHANNELS.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gold-500/25 bg-maroon-900/60 p-5 transition hover:bg-maroon-900"
            >
              <span
                aria-hidden="true"
                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white ${channel.bg}`}
              >
                {channel.icon}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-gold-400">
                {channel.label}
              </span>
              <span className="text-sm font-semibold text-cream-50">{channel.value}</span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => open()}
          className="mt-8 rounded-full bg-gold-500 px-8 py-3.5 text-base font-bold text-maroon-950 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400"
        >
          Đăng ký nhận ưu đãi
        </button>
      </div>
    </section>
  );
}
