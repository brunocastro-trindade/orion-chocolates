import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mail, MapPin, MessageSquare, Phone, Send, User } from "lucide-react";
import imgArteOrionHistoria from "@/assets/images/arte-orion-historia.webp";
import NavigationMenu4 from "@/app/components/ui/navigation-menu-4";
import { abrirChat } from "@/app/components/chat/abrirChat";
import { TituloHero, rolarParaContato } from "@/app/sections/Hero";
import { GaleriaProdutos } from "@/app/sections/Products";
import { STORES, StoreLocatorMap } from "@/app/sections/StoreLocator";
import { CONTATO_ID, ContactField } from "@/app/sections/Contact";
import { useLanguage } from "@/i18n/LanguageContext";

// Home no celular (< 768px). O desktop usa um canvas de 1440px com posições
// absolutas escalado para a largura da tela; no celular isso deixava tudo a
// ~27% do tamanho. Aqui as mesmas seções e textos (t.*) ficam em fluxo normal.

const SERIF = { fontFamily: "'Vesper Nocturne', serif" };
const SANS = { fontFamily: "'Creato Display', 'DM Sans', sans-serif" };
const PILL =
  "inline-flex h-12 items-center justify-center rounded-[14px] px-6 text-[16px] leading-[1.1] text-center";

/** Entrada suave ao rolar até o bloco (respeita prefers-reduced-motion). */
function Revelar({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisivel(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`motion-safe:transition-[opacity,translate] motion-safe:duration-700 ${
        visivel ? "translate-y-0 opacity-100" : "motion-safe:translate-y-6 motion-safe:opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomeMobile() {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden bg-white">
      <div className="relative z-30">
        <NavigationMenu4 />
      </div>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16">
        <Revelar>
          <h1 className="text-[40px] leading-[1.1] font-normal text-[#e29647] [word-break:break-word]" style={SERIF}>
            <TituloHero title={t.hero.title} />
          </h1>
          <p className="mt-6 text-[17px] leading-[1.4] text-[#e29647]" style={SANS}>
            {t.hero.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => abrirChat("Produtos")}
              className={`${PILL} cursor-pointer bg-[#281016] text-[#e29647]`}
              style={SANS}
            >
              {t.hero.ctaProducts}
            </button>
            <a
              href={`#${CONTATO_ID}`}
              onClick={rolarParaContato}
              className={`${PILL} bg-[#e29647] text-[#5c3d31] no-underline`}
              style={SANS}
            >
              {t.hero.ctaContact}
            </a>
          </div>
        </Revelar>
      </section>

      {/* História */}
      <section className="relative">
        <Revelar className="px-6">
          <h2 className="text-[40px] leading-[1.1] font-normal text-[#e29647] [word-break:break-word]" style={SERIF}>
            {t.history.title}
          </h2>
          <p className="mt-5 text-[17px] leading-[1.4] text-[#5c3d31]" style={SANS}>
            {t.history.lead}
          </p>
          <a
            href="/nossa-historia"
            className={`${PILL} mt-6 bg-[#e29647] text-[#5c3d31] no-underline`}
            style={SANS}
          >
            {t.history.cta}
          </a>
        </Revelar>
        <div
          className="mt-8 h-[260px]"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          }}
        >
          <img
            alt="Arte Orion - história da marca"
            src={imgArteOrionHistoria}
            loading="lazy"
            className="size-full object-cover opacity-60"
          />
        </div>
      </section>

      {/* Produtos */}
      <section className="px-6 pt-10 pb-16">
        <Revelar className="text-center">
          <h2 className="text-[40px] leading-[1.1] font-normal text-[#5c3d31] [word-break:break-word]" style={SERIF}>
            {t.products.title}
          </h2>
          <div className="mt-5 text-[17px] leading-[1.4] text-[#e29647]" style={SANS}>
            <p>{t.products.leadLine1}</p>
            <p>{t.products.leadLine2}</p>
          </div>
        </Revelar>
        <Revelar className="mt-10">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <GaleriaProdutos />
          </div>
          <h3 className="mt-8 text-[32px] leading-[1.1] font-normal text-[#5c3d31]" style={SERIF}>
            {t.products.galleryTitle}
          </h3>
          <p className="mt-4 text-[17px] leading-[1.4] text-[#e29647]" style={SANS}>
            {t.products.galleryLead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <div className={`${PILL} bg-[#281016] text-[#e29647]`} style={SANS}>
              {t.products.ctaProducts}
            </div>
            <div className={`${PILL} border border-[#e29647] text-[#5c3d31]`} style={SANS}>
              {t.products.ctaShop}
            </div>
          </div>
        </Revelar>
      </section>

      {/* B2B */}
      <section className="px-6 py-12">
        <Revelar>
          <h2 className="text-[36px] leading-[1.1] font-normal text-[#e29647] [word-break:break-word]" style={SERIF}>
            {t.b2b.title}
          </h2>
          <p className="mt-5 text-[17px] leading-[1.4] text-[#e29647]" style={SANS}>
            {t.b2b.lead}
          </p>
          <div className={`${PILL} mt-6 bg-[#63362c] text-[#e29647]`} style={SANS}>
            {t.b2b.cta}
          </div>
        </Revelar>
      </section>

      {/* Onde encontrar */}
      <section className="px-6 py-12">
        <Revelar className="text-center">
          <h2 className="text-[36px] leading-[1.1] font-normal text-[#e29647] [word-break:break-word]" style={SERIF}>
            {t.storeLocator.title}
          </h2>
          <p className="mt-5 text-[17px] leading-[1.4] text-[#e29647]" style={SANS}>
            {t.storeLocator.lead}
          </p>
        </Revelar>
        <div className="mt-8 h-[360px] overflow-hidden rounded-[28px] bg-[#e29647]">
          <StoreLocatorMap />
        </div>
      </section>

      {/* Contato */}
      <section className="px-6 pt-12">
        <Revelar>
          <h2 id={CONTATO_ID} className="scroll-mt-6 text-[40px] leading-[1.1] font-normal text-[#5c3d31]" style={SERIF}>
            {t.contact.title}
          </h2>
          <div className="mt-4 text-[17px] leading-[1.4] text-[#e09748]" style={SANS}>
            <p>{t.contact.leadLine1}</p>
            <p>{t.contact.leadLine2}</p>
          </div>
        </Revelar>

        <Revelar className="mt-8 flex flex-col gap-6">
          {STORES.map((store) => (
            <div key={store.id} className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#fdf1e3]">
                <MapPin className="h-5 w-5 text-[#e29647]" />
              </div>
              <div style={SANS}>
                <p className="text-lg font-bold text-[#5c3d31]">{t.stores[store.id]}</p>
                <p className="text-base text-[#6a6a6a]">{store.address}</p>
                {store.hours.map((hours) => (
                  <p key={hours} className="text-base text-[#6a6a6a]">
                    {hours}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </Revelar>

        <Revelar className="mt-10 flex flex-col gap-4 rounded-[28px] bg-[#5c3d31] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]">
          <ContactField icon={User} placeholder={t.contact.namePlaceholder} />
          <ContactField icon={Mail} placeholder={t.contact.emailPlaceholder} type="email" />
          <ContactField icon={Phone} placeholder={t.contact.phonePlaceholder} type="tel" />
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute top-5 left-5 h-5 w-5 text-[#e29647]/70" />
            <textarea
              placeholder={t.contact.messagePlaceholder}
              rows={5}
              className="w-full resize-none rounded-2xl border border-[#e29647]/40 bg-[#3d2226] py-4 pr-5 pl-14 text-lg text-white placeholder:text-white/50 outline-none transition-colors focus:border-[#e29647]"
              style={SANS}
            />
          </div>
          <button
            type="button"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#e29647] px-8 text-lg font-bold text-[#5c3d31]"
            style={SANS}
          >
            {t.contact.send}
            <Send className="h-4 w-4" />
          </button>
        </Revelar>
      </section>
    </div>
  );
}
