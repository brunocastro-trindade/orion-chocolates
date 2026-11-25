import type { MouseEvent } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { abrirChat } from "@/app/components/chat/abrirChat";
import { CONTATO_ID } from "@/app/sections/Contact";

// Pills auto-size to their own text (px padding, no fixed width) — a fixed
// width tuned for the Portuguese copy would either clip or overflow the
// English/Spanish translations, which run shorter or longer.
// Rolagem suave até a seção de contato (o canvas da home é escalado, então a
// posição vem do próprio elemento, não de um offset fixo).
function rolarParaContato(e: MouseEvent<HTMLAnchorElement>) {
  const alvo = document.getElementById(CONTATO_ID);
  if (!alvo) return;
  e.preventDefault();
  const top = alvo.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({ top, behavior: "smooth" });
}

const PILL = "inline-flex h-[47px] items-center justify-center whitespace-nowrap rounded-[14px] px-8 text-[20px] leading-[1.1]";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <div className="absolute contents">
      {/* Single absolute anchor for the whole text block — title, lead and
          buttons stack in normal flow inside it, so a translation that wraps
          onto more lines pushes the next piece down instead of overlapping
          it. Each child keeps its own `animate-g7` class so the entrance
          stagger (driven by a global gsap.to(".animate-g7", ...)) still
          animates title → lead → buttons in sequence. */}
      <div className="absolute" style={{ top: 179, left: 123, width: 1092 }}>
        <h1
          className="font-normal hero-title animate-g7 [word-break:break-word] text-[72px] leading-[1.1] text-[#e29647]"
          style={{ fontFamily: "'Vesper Nocturne', serif", fontKerning: "normal" }}
        >
          {t.hero.title.split(/(chocolates)/i).map((part, index) =>
            part.toLowerCase() === "chocolates" ? (
              <span key={`${part}-${index}`}>
                <span className="mr-[0.01em]">{part[0]}</span>
                {part.slice(1)}
              </span>
            ) : (
              part
            ),
          )}
        </h1>
        <p
          className="animate-g7 [word-break:break-word] mt-10 max-w-[943px] text-[24px] leading-[1.16] not-italic text-[#e29647]"
          style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
        >
          {t.hero.lead}
        </p>
        <div className="animate-g7 mt-10 flex flex-wrap items-center gap-4">
          {/* Abre o chatbot já com o resumo de produtos (opção "Produtos" do menu). */}
          <button
            type="button"
            onClick={() => abrirChat("Produtos")}
            className={`${PILL} cursor-pointer bg-[#281016] font-normal text-[#e29647] transition-opacity hover:opacity-90`}
            style={{ fontFamily: "'Creato Display', sans-serif" }}
          >
            {t.hero.ctaProducts}
          </button>
          <a
            href={`#${CONTATO_ID}`}
            onClick={rolarParaContato}
            className={`${PILL} bg-[#e29647] not-italic text-[#5c3d31] no-underline transition-opacity hover:opacity-90`}
            style={{ fontFamily: "'Creato Display', sans-serif" }}
          >
            {t.hero.ctaContact}
          </a>
        </div>
      </div>
    </div>
  );
}
