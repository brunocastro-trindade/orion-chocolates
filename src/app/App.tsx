import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NavigationMenu4 from "@/app/components/ui/navigation-menu-4";
import Footer from "@/app/components/Footer";
import { useNavScale } from "@/app/hooks/useNavScale";
import Hero from "@/app/sections/Hero";
import History from "@/app/sections/History";
import Products from "@/app/sections/Products";
import B2B from "@/app/sections/B2B";
import StoreLocator from "@/app/sections/StoreLocator";
import Contact from "@/app/sections/Contact";
import FAQ from "@/app/sections/FAQ";
import HomeMobile from "@/app/sections/HomeMobile";
import { useIsMobile } from "@/app/hooks/useIsMobile";

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 4300;

export default function App() {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? <HomeMobile /> : <HomeDesktop />}
      <div style={{ background: '#ffffff', height: 80 }} />
      <FAQ />
      <Footer />
    </>
  );
}

// Canvas de 1440px escalado para a largura da tela (layout do Figma).
function HomeDesktop() {
  const container = useRef<HTMLDivElement>(null);
  const scale = useNavScale();

  useGSAP(() => {
    gsap.set(".animate-g7, .animate-g6, .animate-g5, .animate-g4, .animate-g8, .animate-contact", { opacity: 0, y: 30 });
    gsap.to(".animate-g7", { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.2 });
  }, { scope: container });

  const animatedRef = useRef({
    group6: false,
    group5: false,
    group4: false,
    group8: false,
    contact: false,
  });

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      const animateSection = (selector: string, flag: keyof typeof animatedRef.current, threshold: number, stagger: number = 0.2) => {
        if (!animatedRef.current[flag] && scrollY + viewportHeight > threshold * scale) {
          animatedRef.current[flag] = true;
          gsap.to(selector, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger });
        }
      };

      animateSection(".animate-g6", "group6", 869);
      animateSection(".animate-g5", "group5", 1298, 0.15);
      animateSection(".animate-g4", "group4", 2263);
      animateSection(".animate-g8", "group8", 2672);
      animateSection(".animate-contact", "contact", 3633, 0.15);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [scale]);

  return (
    <div style={{ background: '#ffffff', width: '100%', height: CANVAS_HEIGHT * scale, overflow: 'hidden', position: 'relative' }}>
      <div className="absolute top-0 left-0 z-30" style={{ width: CANVAS_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <NavigationMenu4 />
      </div>

      <div
        ref={container}
        className="relative"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <Hero />
        <History />
        <Products />
        <B2B />
        <StoreLocator />
        <Contact />
      </div>
    </div>
  );
}
