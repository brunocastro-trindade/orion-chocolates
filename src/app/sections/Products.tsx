import imgProdutoOrion1 from "@/assets/images/299.webp";
import imgProdutoOrion2 from "@/assets/images/296.webp";
import imgProdutoOrion3 from "@/assets/images/298.webp";
import { useLanguage } from "@/i18n/LanguageContext";

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

      <div className="absolute h-[475px] rounded-[48px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden animate-g5" style={{ left: 129, top: 1620, width: 380 }}>
        <img alt="Barra de chocolate Orion em embalagem vermelha" className="absolute inset-0 max-w-none object-contain bg-white size-full" src={imgProdutoOrion1} />
      </div>
      <div className="absolute h-[476px] rounded-[48px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden animate-g5" style={{ left: 532, top: 1619, width: 381 }}>
        <img alt="Barra de chocolate Orion em embalagem verde" className="absolute inset-0 max-w-none object-contain bg-white size-full" src={imgProdutoOrion2} />
      </div>
      <div className="absolute h-[476px] rounded-[48px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden animate-g5" style={{ left: 936, top: 1619, width: 381 }}>
        <img alt="Barra de chocolate Orion em embalagem azul" className="absolute inset-0 max-w-none object-contain bg-white size-full" src={imgProdutoOrion3} />
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
