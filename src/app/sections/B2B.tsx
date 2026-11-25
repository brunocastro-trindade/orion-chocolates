import { useLanguage } from "@/i18n/LanguageContext";

const PILL = "inline-flex h-[47px] items-center justify-center whitespace-nowrap rounded-[14px] px-8 text-[20px] leading-[1.1]";

export default function B2B() {
  const { t } = useLanguage();

  return (
    <div className="absolute contents">
      {/* Title + lead + button stack in normal flow inside one absolute
          anchor, so a translation that wraps onto an extra line pushes the
          next piece down instead of overlapping it. */}
      <div className="absolute" style={{ top: 2263, left: 121, width: 1092 }}>
        <h2
          className="font-normal animate-g4 [word-break:break-word] leading-[1.1] text-[#e29647] text-[72px]"
          style={{ fontFamily: "'Vesper Nocturne', serif" }}
        >
          {t.b2b.title}
        </h2>
        <p
          className="animate-g4 [word-break:break-word] mt-6 max-w-[943px] leading-[1.16] not-italic text-[#e29647] text-[24px]"
          style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
        >
          {t.b2b.lead}
        </p>
        <div className={`${PILL} animate-g4 mt-6 bg-[#63362c] text-[#e29647]`} style={{ fontFamily: "'Creato Display', sans-serif" }}>
          {t.b2b.cta}
        </div>
      </div>
    </div>
  );
}
