import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NavBarFrame from "@/app/components/NavBarFrame";
import Footer from "@/app/components/Footer";
import { useNavScale } from "@/app/hooks/useNavScale";
import { useLanguage } from "@/i18n/LanguageContext";
import imgEmbalagemPresente from "@/assets/images/qualidade-embalagem-presente.webp";
import imgLataDecorada from "@/assets/images/qualidade-lata-decorada.webp";

const PLAYFAIR = "'Vesper Nocturne', serif";
const DM_SANS = "'Creato Display', 'DM Sans', sans-serif";

const BG = "#ffffff";
const HEADER_BG = "#fffffff2";
const HEADER_BORDER = "#e8d9c8";
const BODY_TEXT = "#5c3d31";

export default function Qualidade() {
  const scale = useNavScale();
  const scope = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      gsap.set(".fade-in", { opacity: 0, y: 24 });
      gsap.to(".fade-in", { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative min-h-screen" style={{ background: BG }}>
      <header
        className="sticky top-0 z-30 w-full border-b backdrop-blur-sm"
        style={{ height: 64 * scale, borderColor: HEADER_BORDER, background: HEADER_BG }}
      >
        <NavBarFrame />
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-20 pb-32">
        <h1
          className="fade-in text-[42px] leading-[1.1] text-[#e29647] sm:text-[56px]"
          style={{ fontFamily: PLAYFAIR }}
        >
          {t.qualidade.titleLine1}
          <br />
          {t.qualidade.titleLine2}
        </h1>

        <div className="mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2">
          <div className="flex flex-col gap-14">
            <div className="fade-in">
              <h2 className="text-2xl text-[#e29647]" style={{ fontFamily: PLAYFAIR }}>
                {t.qualidade.section1Title}
              </h2>
              <p className="mt-6 leading-relaxed" style={{ fontFamily: DM_SANS, color: BODY_TEXT }}>
                {t.qualidade.section1Text}
              </p>
            </div>
            <div className="fade-in h-72 overflow-hidden rounded-xl">
              <img
                alt="Caixa de chocolates finos Orion embalada para presente, com laço de cetim"
                src={imgEmbalagemPresente}
                className="size-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-14 md:mt-16">
            <div className="fade-in h-72 overflow-hidden rounded-xl">
              <img
                alt="Lata decorativa de chocolates Orion com estampa floral"
                src={imgLataDecorada}
                className="size-full object-cover"
              />
            </div>
            <div className="fade-in text-right">
              <h2 className="text-2xl text-[#e29647]" style={{ fontFamily: PLAYFAIR }}>
                {t.qualidade.section2Title}
              </h2>
              <p className="mt-6 leading-relaxed" style={{ fontFamily: DM_SANS, color: BODY_TEXT }}>
                {t.qualidade.section2Text}
              </p>
            </div>
          </div>
        </div>

        <div className="fade-in mt-24 grid grid-cols-3 gap-y-12 border-t border-[#e8d9c8] pt-16">
          {t.qualidade.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[40px] leading-none text-[#e29647] sm:text-[48px]" style={{ fontFamily: PLAYFAIR }}>
                {stat.value}
              </p>
              <p className="mt-3 px-2 text-sm leading-snug" style={{ fontFamily: DM_SANS, color: BODY_TEXT }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="fade-in mt-24 text-center">
          <p className="text-lg" style={{ fontFamily: DM_SANS, color: BODY_TEXT }}>
            {t.qualidade.ctaText}
          </p>
          <a
            href="/produtos"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-[14px] bg-[#e29647] px-8 font-bold text-[#5c3d31] transition-opacity hover:opacity-90"
            style={{ fontFamily: DM_SANS }}
          >
            {t.qualidade.ctaButton}
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
