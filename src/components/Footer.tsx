import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/#ve-chung-toi", label: "Về chúng tôi" },
  { href: "/#nguoi-bao-chung", label: "Người bảo chứng" },
  { href: "/#san-pham", label: "Sản phẩm" },
  { href: "/#dai-ly-doi-tac", label: "Đại lý & Đối tác" },
  { href: "/thong-bao", label: "Thông báo" },
  { href: "/tin-tuc", label: "Tin tức" },
];

export default function Footer() {
  return (
    <footer id="lien-he" className="relative bg-maroon-950 pt-14 text-cream-100/80">
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
                <a href={link.href} className="transition hover:text-cream-50">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Liên hệ
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              Hotline:{" "}
              <a href="tel:0911556893" className="hover:text-cream-50">
                0911 556 893
              </a>
            </li>
            <li>
              Zalo:{" "}
              <a href="https://zalo.me/0911556893" className="hover:text-cream-50">
                0911 556 893
              </a>
            </li>
            <li>
              Facebook:{" "}
              <a
                href="https://facebook.com/profile.php?id=61566924726003"
                className="hover:text-cream-50"
              >
                Cát Thiên Nguyên
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
