import imgOrionLogo from "@/assets/figma/orion-logo.svg";
import { useLanguage } from "@/i18n/LanguageContext";
import { linkDoChat } from "@/app/components/chat/abrirChat";
import type { MouseEvent } from "react";

const DM_SANS = "'Creato Display', 'DM Sans', sans-serif";

type FooterLink = { href: string; label: string; onClick?: (e: MouseEvent) => void };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p
        className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase"
        style={{ fontFamily: DM_SANS }}
      >
        {title}
      </p>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              onClick={link.onClick}
              className="text-[#e29647] no-underline transition-opacity hover:opacity-70"
              style={{ fontFamily: DM_SANS }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  const siteLinks = [
    { href: "/", label: t.footer.siteLinks.inicio },
    { href: "/produtos", label: t.footer.siteLinks.produtos },
    // Abrem o chatbot já com a resposta da opção correspondente do menu.
    { href: "#", label: t.footer.siteLinks.ondeEncontrar, onClick: linkDoChat("Endereços") },
    { href: "#", label: t.footer.siteLinks.contato, onClick: linkDoChat("Contatos") },
  ];

  const orionLinks = [
    { href: "/nossa-historia", label: t.nav.nossaHistoria },
    { href: "/qualidade", label: t.nav.qualidade },
    { href: "/trabalhe-conosco", label: t.nav.trabalheConosco },
  ];

  const legalLinks = [
    { href: "/politica-de-privacidade", label: t.footer.legalLinks.privacidade },
    { href: "/politica-de-cookies", label: t.footer.legalLinks.cookies },
    { href: "/termos-de-uso", label: t.footer.legalLinks.termos },
  ];

  return (
    <footer className="w-full bg-[#251116] px-6 pt-16 pb-8">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href="/" className="inline-block">
            <img alt="ORION Chocolates" src={imgOrionLogo} className="h-16 w-auto" />
          </a>
          <p className="mt-5 max-w-[260px] text-sm leading-relaxed text-white/50" style={{ fontFamily: DM_SANS }}>
            {t.footer.tagline}
          </p>
        </div>

        <FooterColumn title={t.footer.navTitle} links={siteLinks} />
        <FooterColumn title={t.footer.aOrionTitle} links={orionLinks} />
        <FooterColumn title={t.footer.legalTitle} links={legalLinks} />
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-white/40" style={{ fontFamily: DM_SANS }}>
          © {new Date().getFullYear()} ORION Chocolates. {t.footer.rights}
        </p>
        <a
          href="https://sekoiamarketing.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/40 no-underline transition-opacity hover:opacity-70"
          style={{ fontFamily: DM_SANS }}
        >
          {t.footer.madeBy}
        </a>
      </div>
    </footer>
  );
}
