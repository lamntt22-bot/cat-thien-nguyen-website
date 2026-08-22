"use client";

import AmbientBackground from "@/components/AmbientBackground";
import { CraneCorner, CloudWisp } from "@/components/MotifAccents";
import { useLeadCapture } from "@/components/LeadCaptureContext";

export default function CtaFooterSection() {
  const { open } = useLeadCapture();

  return (
    <section className="relative overflow-hidden bg-maroon-950 py-16 text-center text-cream-50 sm:py-20">
      <div className="imperial-wave-divider absolute inset-x-0 top-0" />
      <AmbientBackground variant="light" />
      <CraneCorner position="top-right" className="hidden h-56 w-56 opacity-65 lg:-right-8 lg:-top-8 lg:block" />
      <CraneCorner position="bottom-left" className="hidden h-56 w-56 opacity-65 lg:-bottom-8 lg:-left-8 lg:block" />
      <CloudWisp className="left-[8%] top-[10%] h-28 w-36 opacity-25" rotate={6} />
      <CloudWisp className="right-[10%] bottom-[10%] h-24 w-32 opacity-20" rotate={-6} />
      <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Bắt đầu hành trình chăm sóc sức khỏe chủ động cùng Cát Thiên Nguyên
        </h2>
        <p className="mt-3 text-cream-100/80">
          Đăng ký ngay để nhận tư vấn sản phẩm, hoặc trở thành Đại lý/Đối tác — chỉ mất vài phút.
        </p>
        <button
          type="button"
          onClick={() => open()}
          className="mt-7 rounded-full bg-gold-500 px-8 py-3.5 text-base font-bold text-maroon-950 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400"
        >
          Đăng ký nhận ưu đãi
        </button>
      </div>
    </section>
  );
}
