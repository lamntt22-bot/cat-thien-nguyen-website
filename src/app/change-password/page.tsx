import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream-100 px-5 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-gold-500/25 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-maroon-900">
          Đổi mật khẩu lần đầu
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          Bạn đang dùng mật khẩu mặc định — vui lòng đặt mật khẩu mới để tiếp tục.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
}
