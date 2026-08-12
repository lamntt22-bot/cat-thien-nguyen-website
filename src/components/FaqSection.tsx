"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const FAQS = [
  {
    q: "Sản phẩm của Cát Thiên Nguyên có phải thuốc chữa bệnh không?",
    a: "Không. Trà Đông y, tinh dầu và dược mỹ phẩm của Cát Thiên Nguyên là sản phẩm hỗ trợ chăm sóc sức khỏe/làn da, không thay thế thuốc điều trị hoặc chỉ định của bác sĩ. Vui lòng tham khảo ý kiến chuyên gia y tế với các vấn đề bệnh lý cụ thể.",
  },
  {
    q: "Làm sao để trở thành Đại lý hoặc Đối tác độc quyền?",
    a: "Bấm nút “Đăng ký nhận ưu đãi” ở đầu trang, chọn sản phẩm/gói bạn quan tâm (Đại lý hoặc Đối tác độc quyền) — đội ngũ Cát Thiên Nguyên sẽ liên hệ tư vấn chi tiết.",
  },
  {
    q: "Trà Đông Y các dòng khác (dưỡng sinh, an thần, tiểu đường...) khi nào ra mắt?",
    a: "Các dòng này đang trong giai đoạn hoàn thiện. Đăng ký quan tâm ngay tại popup để được thông báo sớm nhất khi ra mắt chính thức.",
  },
  {
    q: "Chính sách đổi trả như thế nào?",
    a: "Chính sách đổi trả chi tiết sẽ được công ty xác nhận và công bố chính thức trước khi sản phẩm mở bán rộng — vui lòng liên hệ hotline để được tư vấn cụ thể theo từng thời điểm.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-blush-50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Câu hỏi thường gặp
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            Giải đáp nhanh
          </h2>
        </Reveal>

        <div className="mt-8 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-gold-500/25 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-maroon-900"
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <span className="shrink-0 text-red-600" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && <p className="px-5 pb-4 text-sm text-ink-700">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
