import imgArteOrionHistoria from "@/assets/images/arte-orion-historia.webp";
import { useLanguage } from "@/i18n/LanguageContext";

const PILL = "inline-flex h-[47px] items-center justify-center whitespace-nowrap rounded-[14px] px-8 text-[20px] leading-[1.1]";

export default function History() {
  const { t } = useLanguage();

  return (
    <div className="absolute contents">
      {/* Top edge fades in from transparent instead of a hard cut, so the
          photo blends smoothly out of the hero's white background above it
          rather than dropping in as an abrupt rectangle. */}
      <div
        className="absolute h-[595px] left-0 top-[1019px] w-[1446px]"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 180px)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 180px)",
        }}
      >
        <img alt="Arte Orion - história da marca" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full opacity-60" src={imgArteOrionHistoria} />
      </div>

      {/* Single absolute anchor, right-aligned, for title + lead + button —
          they stack in normal flow so a translation that wraps onto more
          lines pushes the next piece down instead of overlapping it (the
          three used to be independently top-positioned, which broke as soon
          as a translation needed a 3rd line where Portuguese only needed 2). */}
      <div className="absolute flex flex-col items-end" style={{ top: 869, right: 40, width: 1300 }}>
        <h2
          className="font-normal animate-g6 [word-break:break-word] text-right text-[89px] leading-[1.1] text-[#e29647]"
          style={{ fontFamily: "'Vesper Nocturne', serif" }}
        >
          {t.history.title}
        </h2>
        <p
          className="animate-g6 [word-break:break-word] mt-6 max-w-[1100px] text-right text-[24px] leading-[1.16] not-italic text-[#5c3d31]"
          style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
        >
          {t.history.lead}
        </p>
        <a
          href="/nossa-historia"
          className={`${PILL} animate-g6 mt-6 bg-[#e29647] text-[#5c3d31] no-underline transition-opacity hover:opacity-90`}
          style={{ fontFamily: "'Creato Display', sans-serif" }}
        >
          {t.history.cta}
        </a>
      </div>
    </div>
  );
}
