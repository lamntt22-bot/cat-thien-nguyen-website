import Link from "next/link";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/nguoi-bao-chung", label: "Người bảo chứng" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/dai-ly-doi-tac", label: "Đại lý & Đối tác" },
  { href: "/thong-bao", label: "Thông báo" },
  { href: "/tin-tuc", label: "Tin tức" },
];

export default function Footer() {
  return (
    <footer className="relative bg-maroon-950 pt-14 text-cream-100/80">
      <div className="imperial-wave-divider absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo onDark imgClassName="h-11 w-auto" />
          <p className="mt-4 max-w-sm text-sm">
            Dược Trời Ban · Đất Khai Phúc · Sống Lành Tâm. Trà Đông y, tinh dầu phong thủy Ngọc Am
            và dược mỹ phẩm thiên nhiên, phát triển độc quyền theo công thức của Giáo sư Viện sĩ
            Lương Ngọc Huỳnh.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Điều hướng
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-cream-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Liên hệ
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href="tel:0911556893" className="flex items-center gap-2.5 hover:text-cream-50">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs"
                >
                  📞
                </span>
                Hotline: 0911 556 893
              </a>
            </li>
            <li>
              <a
                href="https://zalo.me/0911556893"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-cream-50"
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0068FF] text-[9px] font-black tracking-tight text-white"
                >
                  Zalo
                </span>
                Zalo: 0911 556 893
              </a>
            </li>
            <li>
              <a
                href="https://web.facebook.com/profile.php?id=61579367331528"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-cream-50"
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1877F2] font-display text-sm font-bold text-white"
                >
                  f
                </span>
                Facebook: Cát Thiên Nguyên
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-cream-100/10 px-5 py-5 text-center text-xs text-cream-100/50 sm:px-8">
        © {new Date().getFullYear()} Công ty Cổ phần Cát Thiên Nguyên. Địa chỉ, mã số doanh nghiệp
        sẽ được bổ sung trước khi ra mắt chính thức.
      </div>
    </footer>
  );
}
