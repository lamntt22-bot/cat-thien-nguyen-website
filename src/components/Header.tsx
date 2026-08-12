"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useLeadCapture } from "@/components/LeadCaptureContext";

const NAV_LINKS = [
  { href: "/#ve-chung-toi", label: "Về chúng tôi" },
  { href: "/#nguoi-bao-chung", label: "Người bảo chứng" },
  { href: "/#san-pham", label: "Sản phẩm" },
  { href: "/#dai-ly-doi-tac", label: "Đại lý & Đối tác" },
  { href: "/thong-bao", label: "Thông báo" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/#lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useLeadCapture();

  return (
    <header className="relative z-30 border-b border-gold-500/30 bg-maroon-900/97 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-1 sm:px-8">
        <div className="flex w-56 justify-center sm:w-72">
          <Link href="/" className="text-cream-50">
            <Logo onDark imgClassName="h-48 w-auto sm:h-60" />
          </Link>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-cream-100/85 xl:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-gold-400">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden xl:block">
          <button
            type="button"
            onClick={() => open()}
            className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-maroon-950 shadow-md shadow-gold-500/20 transition hover:bg-gold-400"
          >
            Đăng ký nhận ưu đãi
          </button>
        </div>

        <button
          type="button"
          aria-label="Mở menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-cream-50 xl:hidden"
        >
          <span className="text-2xl" aria-hidden="true">
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gold-500/20 bg-maroon-900 px-5 py-4 xl:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-cream-100/85">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="transition hover:text-gold-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              open();
            }}
            className="mt-4 w-full rounded-full bg-gold-500 px-5 py-3 text-sm font-bold text-maroon-950 shadow-md shadow-gold-500/20 transition hover:bg-gold-400"
          >
            Đăng ký nhận ưu đãi
          </button>
        </div>
      )}
    </header>
  );
}
