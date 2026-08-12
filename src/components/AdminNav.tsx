import LogoutButton from "@/components/LogoutButton";

const LINKS = [
  { href: "/admin", label: "Khách hàng đăng ký" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/posts", label: "Thông báo & Tin tức" },
];

export default function AdminNav({ email }: { email: string }) {
  return (
    <header className="border-b border-gold-500/25 bg-maroon-900 text-cream-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div>
          <p className="font-display text-lg font-semibold">Cát Thiên Nguyên — Admin</p>
          <p className="text-xs text-cream-100/70">Đăng nhập: {email}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-cream-100/85">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-gold-400">
              {l.label}
            </a>
          ))}
          <LogoutButton className="rounded-full border border-cream-50/30 px-4 py-2 text-sm font-semibold transition hover:bg-cream-50/10" />
        </nav>
      </div>
    </header>
  );
}
