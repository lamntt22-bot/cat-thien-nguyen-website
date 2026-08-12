import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream-100 px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-gold-500/25 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
          ✓
        </div>
        <h1 className="mt-4 font-display text-xl font-semibold text-maroon-900">
          Đặt hàng thành công!
        </h1>
        <p className="mt-2 text-sm text-ink-700">
          Cảm ơn bạn đã tin tưởng Cát Thiên Nguyên. Đội ngũ của chúng tôi sẽ liên hệ xác nhận đơn
          hàng trong thời gian sớm nhất.
        </p>
        {id && <p className="mt-3 text-xs text-ink-700/60">Mã đơn hàng: {id}</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="rounded-full bg-maroon-900 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-maroon-800"
          >
            Xem đơn hàng của tôi
          </Link>
          <Link
            href="/"
            className="rounded-full border border-maroon-900/20 px-5 py-2.5 text-sm font-semibold text-maroon-900 transition hover:bg-maroon-900/5"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
