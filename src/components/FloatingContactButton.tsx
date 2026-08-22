const HOTLINE = "0911556893";
const FACEBOOK_URL = "https://web.facebook.com/profile.php?id=61579367331528";
const ZALO_URL = `https://zalo.me/${HOTLINE}`;

const CHANNELS = [
  {
    href: FACEBOOK_URL,
    label: "Nhắn tin Facebook",
    icon: "f",
    bg: "bg-[#1877F2]",
    pulseColor: "rgba(24,119,242,0.55)",
    external: true,
  },
  {
    href: ZALO_URL,
    label: "Chat Zalo",
    icon: "Zalo",
    bg: "bg-[#0068FF]",
    pulseColor: "rgba(0,104,255,0.55)",
    external: true,
  },
  {
    href: `tel:${HOTLINE}`,
    label: "Gọi ngay",
    icon: "📞",
    bg: "bg-red-600",
    pulseColor: "rgba(220,38,38,0.55)",
    external: false,
  },
];

export default function FloatingContactButton() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
      {CHANNELS.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          aria-label={channel.label}
          target={channel.external ? "_blank" : undefined}
          rel={channel.external ? "noopener noreferrer" : undefined}
          className={`animate-pulse-ring flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg transition hover:scale-105 ${channel.bg}`}
          style={{ "--pulse-color": channel.pulseColor } as React.CSSProperties}
        >
          {channel.icon === "Zalo" ? (
            <span className="text-[11px] font-black tracking-tight">Zalo</span>
          ) : (
            <span aria-hidden="true" className={channel.icon === "f" ? "font-display text-xl" : "text-lg"}>
              {channel.icon}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
