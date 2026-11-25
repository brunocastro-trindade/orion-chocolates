import { type ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NavBarFrame from "@/app/components/NavBarFrame";
import Footer from "@/app/components/Footer";
import { useNavScale } from "@/app/hooks/useNavScale";

const PLAYFAIR = "'Vesper Nocturne', serif";
const DM_SANS = "'Creato Display', 'DM Sans', sans-serif";
const HEADER_BORDER = "#e8d9c8";

export function LegalHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 text-2xl first:mt-0" style={{ fontFamily: PLAYFAIR, color: "#5c3d31" }}>
      {children}
    </h2>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 leading-relaxed" style={{ fontFamily: DM_SANS, color: "#3a3a3a" }}>
      {children}
    </p>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul
      className="mt-4 list-disc space-y-2 pl-6 leading-relaxed"
      style={{ fontFamily: DM_SANS, color: "#3a3a3a" }}
    >
      {children}
    </ul>
  );
}

export default function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const scale = useNavScale();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".fade-in", { opacity: 0, y: 24 });
      gsap.to(".fade-in", { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative min-h-screen bg-white">
      <header
        className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur-sm"
        style={{ height: 64 * scale, borderColor: HEADER_BORDER }}
      >
        <NavBarFrame />
      </header>

      <main className="fade-in mx-auto max-w-3xl px-6 pt-20 pb-32">
        <h1
          className="text-[36px] leading-[1.1] sm:text-[48px]"
          style={{ fontFamily: PLAYFAIR, color: "#5c3d31" }}
        >
          {title}
        </h1>
        <p className="mt-3 text-sm" style={{ fontFamily: DM_SANS, color: "#8a8a8a" }}>
          Última atualização: {updated}
        </p>

        <div className="mt-10">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
