import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream-100 px-5 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-gold-500/25 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-maroon-900">Đăng nhập</h1>
        <p className="mt-1 text-sm text-ink-700">
          Dùng số điện thoại/email và mật khẩu đã đăng ký với Cát Thiên Nguyên.
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-4 text-center text-xs text-ink-700/60">
          Chưa có tài khoản? Đăng ký qua popup ở trang chủ.
        </p>
      </div>
    </main>
  );
}
