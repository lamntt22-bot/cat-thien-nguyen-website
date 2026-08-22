"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useLeadCapture } from "@/components/LeadCaptureContext";
import { useCart } from "@/components/CartContext";
import LogoutButton from "@/components/LogoutButton";

const NAV_LINKS = [
  { href: "/#ve-chung-toi", label: "Về chúng tôi" },
  { href: "/#nguoi-bao-chung", label: "Người bảo chứng" },
  { href: "/#san-pham", label: "Sản phẩm" },
  { href: "/#dai-ly-doi-tac", label: "Đại lý & Đối tác" },
  { href: "/thong-bao", label: "Thông báo" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/#lien-he", label: "Liên hệ" },
];

function CartLink({ className = "" }: { className?: string }) {
  const { totalCount } = useCart();
  return (
    <Link href="/cart" className={`relative inline-flex items-center ${className}`} aria-label="Giỏ hàng">
      <span aria-hidden="true" className="text-xl">
        🛒
      </span>
      {totalCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
          {totalCount}
        </span>
      )}
    </Link>
  );
}

export default function Header({ member }: { member: { name: string } | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useLeadCapture();

  return (
    <header className="relative z-30 border-b border-maroon-900/15 bg-gold-300/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2.5 sm:px-8">
        <Link href="/" className="shrink-0">
          <Logo imgClassName="h-11 w-auto sm:h-12" />
        </Link>

        <nav className="hidden items-center gap-2.5 text-sm font-medium text-maroon-900/85 lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="whitespace-nowrap transition hover:text-red-600">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          {member ? (
            <div className="flex items-center gap-2 text-sm text-maroon-900/85">
              <span className="max-w-[140px] truncate whitespace-nowrap font-semibold text-maroon-950">
                Xin chào, {member.name}
              </span>
              <LogoutButton className="whitespace-nowrap font-semibold text-maroon-900/85 transition hover:text-red-600" />
            </div>
          ) : (
            <Link href="/login" className="whitespace-nowrap text-sm font-semibold text-maroon-900/85 transition hover:text-red-600">
              Đăng nhập
            </Link>
          )}
          <CartLink className="text-maroon-900 hover:text-red-600" />
          <button
            type="button"
            onClick={() => open()}
            className="whitespace-nowrap rounded-full bg-maroon-800 px-3.5 py-2.5 text-sm font-bold text-cream-50 shadow-md shadow-maroon-900/20 transition hover:bg-maroon-700"
          >
            Đăng ký nhận ưu đãi
          </button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <CartLink className="text-maroon-900" />
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-maroon-900"
          >
            <span className="text-2xl" aria-hidden="true">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-maroon-900/15 bg-gold-300 px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-maroon-900/85">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="transition hover:text-red-600"
              >
                {link.label}
              </a>
            ))}
            {member ? (
              <div className="flex items-center justify-between">
                <span className="truncate font-semibold text-maroon-950">
                  Xin chào, {member.name}
                </span>
                <LogoutButton className="font-semibold text-maroon-900/85 transition hover:text-red-600" />
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="transition hover:text-red-600">
                Đăng nhập
              </Link>
            )}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              open();
            }}
            className="mt-4 w-full rounded-full bg-maroon-800 px-5 py-3 text-sm font-bold text-cream-50 shadow-md shadow-maroon-900/20 transition hover:bg-maroon-700"
          >
            Đăng ký nhận ưu đãi
          </button>
        </div>
      )}
    </header>
  );
}
