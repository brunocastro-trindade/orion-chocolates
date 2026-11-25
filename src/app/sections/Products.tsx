import { useEffect, useState } from "react";
import imgCobertos from "@/assets/images/galeria/1-cobertos-castanhas.webp";
import imgBarras from "@/assets/images/galeria/2-barras-cobertas.webp";
import imgDecorados from "@/assets/images/galeria/3-bombons-decorados.webp";
import imgSortidos from "@/assets/images/galeria/4-bombons-sortidos.webp";
import imgCereja from "@/assets/images/galeria/5-bombom-cereja.webp";
import { useLanguage } from "@/i18n/LanguageContext";

// Galeria da home: uma foto por vez, trocando a cada INTERVALO_MS com fade.
const GALERIA = [
  { src: imgCobertos, alt: "Chocolates Orion ao leite e branco com castanhas e passas" },
  { src: imgBarras, alt: "Barrinhas de chocolate ao leite Orion empilhadas" },
  { src: imgDecorados, alt: "Bombons Orion decorados com fios de chocolate branco" },
  { src: imgSortidos, alt: "Bombons finos Orion sortidos" },
  { src: imgCereja, alt: "Bombom de cereja Orion aberto, com a cereja e a calda à mostra" },
];
const INTERVALO_MS = 5000;

function GaleriaProdutos() {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAtual((i) => (i + 1) % GALERIA.length), INTERVALO_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {GALERIA.map((foto, i) => (
        <img
          key={foto.src}
          src={foto.src}
          alt={foto.alt}
          aria-hidden={i !== atual}
          loading={i === 0 ? "eager" : "lazy"}
          className="absolute inset-0 size-full max-w-none bg-white object-cover motion-safe:transition-opacity motion-safe:duration-1000"
          style={{ opacity: i === atual ? 1 : 0 }}
        />
      ))}
    </>
  );
}

const PILL = "inline-flex h-[47px] items-center justify-center whitespace-nowrap rounded-[14px] px-8 text-[20px] leading-[1.1]";

export default function Products() {
  const { t } = useLanguage();

  return (
    <div className="absolute contents">
      {/* Title + lead stack in normal flow inside one absolute anchor, so a
          translation that wraps onto an extra line pushes the lead down
          instead of overlapping it — the two used to be independently
          top-positioned with just enough room for the Portuguese copy. */}
      <div className="absolute flex flex-col items-center text-center" style={{ top: 1298, left: 70, width: 1300 }}>
        <h2
          className="font-normal animate-g5 [word-break:break-word] leading-[1.1] not-italic text-[89px] text-[#5c3d31]"
          style={{ fontFamily: "'Vesper Nocturne', serif" }}
        >
          {t.products.title}
        </h2>
        <div
          className="animate-g5 [word-break:break-word] mt-6 max-w-[1100px] leading-[1.16] not-italic text-[#e29647] text-[24px]"
          style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
        >
          <p className="mb-0">{t.products.leadLine1}</p>
          <p className="mb-0">{t.products.leadLine2}</p>
        </div>
      </div>

      {/* Card único (3:2, mesma altura da antiga fileira de 3 barras) + copy ao lado. */}
      <div className="absolute h-[476px] rounded-[48px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden animate-g5" style={{ left: 129, top: 1619, width: 714 }}>
        <GaleriaProdutos />
      </div>
      <div className="absolute flex h-[476px] flex-col justify-center animate-g5" style={{ left: 903, top: 1619, width: 414 }}>
        <h3
          className="[word-break:break-word] text-[56px] leading-[1.1] font-normal text-[#5c3d31]"
          style={{ fontFamily: "'Vesper Nocturne', serif" }}
        >
          {t.products.galleryTitle}
        </h3>
        <p
          className="mt-6 text-[22px] leading-[1.3] text-[#e29647]"
          style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
        >
          {t.products.galleryLead}
        </p>
      </div>

      <div className="absolute flex items-center justify-center gap-4 animate-g5" style={{ left: 0, top: 2169, width: 1440 }}>
        <div className={`${PILL} bg-[#281016] text-[#e29647]`} style={{ fontFamily: "'Creato Display', sans-serif" }}>
          {t.products.ctaProducts}
        </div>
        <div className={`${PILL} border border-[#e29647] border-solid not-italic text-[#5c3d31]`} style={{ fontFamily: "'Creato Display', sans-serif" }}>
          {t.products.ctaShop}
        </div>
      </div>
    </div>
  );
}
