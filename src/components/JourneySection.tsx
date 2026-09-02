import Reveal from "@/components/Reveal";
import { getPageSection } from "@/lib/page-content-store";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

const DEFAULTS = {
  eyebrow: "Hành trình của chúng tôi",
  heading: "Những thước phim từ Cát Thiên Nguyên",
};

function PlaceholderSlot({ slotKey }: { slotKey: string }) {
  return (
    <div
      key={slotKey}
      className="relative aspect-video w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-maroon-900 to-maroon-950 shadow-sm sm:w-[380px]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-cream-100/70">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 text-2xl text-white shadow-lg">
          ▶
        </span>
        <span className="text-sm font-medium">Video đang được cập nhật</span>
      </div>
    </div>
  );
}

export default async function JourneySection() {
  const section = await getPageSection("hanh-trinh-cua-chung-toi").catch(() => null);
  const eyebrow = section?.eyebrow || DEFAULTS.eyebrow;
  const heading = section?.heading || DEFAULTS.heading;
  const videos = section?.items ?? [];
  const placeholderCount = Math.max(0, 3 - videos.length);

  return (
    <section className="bg-cream-100 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
            {eyebrow}
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-950 sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
      </div>

      <Reveal
        delayMs={100}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8"
      >
        {videos.map((video, i) => {
          const embedUrl = video.value ? getYoutubeEmbedUrl(video.value) : null;
          return (
            <div
              key={video.value ?? i}
              className="relative aspect-video w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl border border-gold-500/30 bg-maroon-950 shadow-sm sm:w-[380px]"
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title || `Video ${i + 1}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <PlaceholderSlot slotKey={`invalid-${i}`} />
              )}
            </div>
          );
        })}
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <PlaceholderSlot key={`placeholder-${i}`} slotKey={`placeholder-${i}`} />
        ))}
      </Reveal>

      {placeholderCount > 0 && (
        <p className="mx-auto mt-2 max-w-2xl px-5 text-center text-[11px] text-ink-700/45 sm:px-8">
          * Ô chờ video — Cát Thiên Nguyên sẽ cập nhật video thật trong thời gian tới.
        </p>
      )}
    </section>
  );
}
