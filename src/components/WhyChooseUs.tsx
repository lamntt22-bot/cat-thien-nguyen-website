import Reveal from "@/components/Reveal";

const LAYERS = [
  {
    step: "1",
    title: "Thầy Huỳnh trực tiếp chọn nguyên liệu",
    description: "Biết phân biệt dược liệu thật/giả, đạt chuẩn/kém chất lượng.",
  },
  {
    step: "2",
    title: "Sản xuất tại nhà máy có kiểm soát",
    description: "Không qua trung gian chợ dược liệu trôi nổi.",
  },
  {
    step: "3",
    title: "Đầy đủ giấy tờ, chứng nhận",
    description: "Công bố sản phẩm, chứng nhận nguồn gốc rõ ràng, truy vết được.",
  },
  {
    step: "4",
    title: "Đóng gói sẵn theo liều dùng chuẩn",
    description: "Không cần tự mua dược liệu rời về pha, không tự chịu rủi ro.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="chuoi-kiem-soat" className="bg-cream-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Vì sao chọn Cát Thiên Nguyên
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            Chuỗi Kiểm Soát Nguồn Gốc 4 Lớp
          </h2>
          <p className="mt-3 text-ink-700">
            Thị trường trà/dược liệu Đông y hiện chưa có đơn vị nào làm chuẩn hóa bài bản. Mua
            dược liệu rời ngoài chợ dễ gặp hàng bã dược liệu, hàng nấm mốc, không giấy tờ truy vết.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LAYERS.map((layer, i) => (
            <Reveal key={layer.step} delayMs={i * 80}>
              <div className="h-full rounded-2xl border border-gold-500/30 border-t-2 border-t-gold-500 bg-white p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-900 font-display text-base font-semibold text-gold-400">
                  {layer.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-maroon-900">
                  {layer.title}
                </h3>
                <p className="mt-2 text-sm text-ink-700">{layer.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
