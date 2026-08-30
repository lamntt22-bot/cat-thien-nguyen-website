import Reveal from "@/components/Reveal";

// Nháp — chờ Cát Thiên Nguyên tải video thật lên để thay thế từng ô.
const VIDEO_SLOTS = [1, 2, 3];

export default function JourneySection() {
  return (
    <section className="bg-cream-100 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Hành trình của chúng tôi
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            Những thước phim từ Cát Thiên Nguyên
          </h2>
        </Reveal>
      </div>

      <Reveal
        delayMs={100}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8"
      >
        {VIDEO_SLOTS.map((slot) => (
          <div
            key={slot}
            className="relative aspect-video w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-maroon-900 to-maroon-950 shadow-sm sm:w-[380px]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-cream-100/70">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 text-2xl text-white shadow-lg">
                ▶
              </span>
              <span className="text-sm font-medium">Video đang được cập nhật</span>
            </div>
          </div>
        ))}
      </Reveal>
      <p className="mx-auto mt-2 max-w-2xl px-5 text-center text-[11px] text-ink-700/45 sm:px-8">
        * Ô chờ video — Cát Thiên Nguyên sẽ cập nhật video thật trong thời gian tới.
      </p>
    </section>
  );
}
