import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Sparkles, Factory, Tag, Waves, MapPin, Target, Eye, HeartHandshake } from "lucide-react";
import NavigationMenu4 from "@/app/components/ui/navigation-menu-4";
import Footer from "@/app/components/Footer";
import { useNavScale } from "@/app/hooks/useNavScale";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Translations } from "@/i18n/translations";
import imgHistoria1958 from "@/assets/images/historia-1958-fundadores.webp";
import imgHistoria1974 from "@/assets/images/historia-1974-loja.webp";
import imgHistoria1978 from "@/assets/images/historia-1978-embalagens-B0zFG-Te.webp";
import imgHistoria1980 from "@/assets/images/historia-1980-enchente.webp";
import imgHistoria2010 from "@/assets/images/historia-2010-loja-shopping.webp";

gsap.registerPlugin(ScrollTrigger);

const PLAYFAIR = "'Vesper Nocturne', serif";
const DM_SANS = "'Creato Display', 'DM Sans', sans-serif";

// Dark-mode palette for this page only — the rest of the site stays on the
// light ORION theme, so these are scoped hex values rather than the shared
// (light-only) theme.css tokens.
const DARK_BG = "#1b0f11";
const DARK_CARD_BG = "#241316";
const DARK_BORDER = "#3d2226";
const DARK_STEM = "#5a3336";
const DARK_TEXT = "#f8ecdf";
const DARK_MUTED = "#c9b3a4";
const DARK_HOVER_BORDER = "#e29647";

type Milestone = Translations["nossaHistoria"]["milestones"][number];

const ROAD_ICONS = [Sparkles, Factory, Tag, Waves, MapPin];
const MVV_ICONS = [Target, Eye, HeartHandshake];

// One slot per milestone (1958, 1974, 1978, 1980, 2010, in that order —
// matches the fixed order of `nossaHistoria.milestones` in every language).
const MILESTONE_IMAGES: (string | null)[] = [
  imgHistoria1958,
  imgHistoria1974,
  imgHistoria1978,
  imgHistoria1980,
  imgHistoria2010,
];

function MilestoneImage({ src, alt, placeholderLabel }: { src: string | null; alt: string; placeholderLabel: string }) {
  if (src) {
    return <img src={src} alt={alt} className="mb-4 h-40 w-full rounded-xl object-cover" />;
  }
  return (
    <div
      className="mb-4 flex h-40 w-full items-center justify-center rounded-xl"
      style={{ border: `1px dashed ${DARK_HOVER_BORDER}66` }}
      aria-hidden
    >
      <span className="text-xs" style={{ fontFamily: DM_SANS, color: DARK_MUTED }}>
        {placeholderLabel}
      </span>
    </div>
  );
}

// Catmull-Rom -> cubic Bézier: builds a smooth curve through every waypoint
// (as opposed to a Bézier fit that only approximates them), so the road
// always passes exactly through each milestone's anchor point.
function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const ROAD_WIDTH = 880;
const ROAD_LEFT_X = 140;
const ROAD_RIGHT_X = 460;
const ROAD_TOP = 220;
const ROAD_SEGMENT = 320;
const CARD_WIDTH = 300;

function handleCardEnter(e: React.MouseEvent<HTMLDivElement>) {
  gsap.to(e.currentTarget, {
    y: -6,
    boxShadow: "0px 20px 40px -16px rgba(0,0,0,0.5)",
    borderColor: DARK_HOVER_BORDER,
    duration: 0.35,
    ease: "power2.out",
  });
  const badge = e.currentTarget.closest(".road-item, .timeline-item")?.querySelector(".road-badge, .timeline-dot");
  if (badge) gsap.to(badge, { scale: 1.15, duration: 0.3, ease: "power2.out" });
}

function handleCardLeave(e: React.MouseEvent<HTMLDivElement>) {
  gsap.to(e.currentTarget, {
    y: 0,
    boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.3)",
    borderColor: DARK_BORDER,
    duration: 0.35,
    ease: "power2.out",
  });
  const badge = e.currentTarget.closest(".road-item, .timeline-item")?.querySelector(".road-badge, .timeline-dot");
  if (badge) gsap.to(badge, { scale: 1, duration: 0.3, ease: "power2.out" });
}

// Desktop/tablet: the winding "road" that draws itself in as the page
// scrolls down, with milestones branching off it — per the reference the
// user shared.
// How far each milestone's badge hangs above its own road point — purely a
// visual rhythm choice, doesn't affect card spacing (see layout effect
// below, which sizes gaps from each card's actual measured height). Only
// depends on position, not content, so it's keyed off a count rather than
// the (language-specific) milestones array itself.
const stemLengths = (count: number) => Array.from({ length: count }, (_, i) => 150 + (i % 3) * 50);

function naiveRoadLayout(count: number) {
  const points = Array.from({ length: count }, (_, i) => ({
    x: i % 2 === 0 ? ROAD_LEFT_X : ROAD_RIGHT_X,
    y: ROAD_TOP + i * ROAD_SEGMENT,
  }));
  return { points, roadHeight: points[points.length - 1].y + 100 };
}

function RoadTimeline({ milestones }: { milestones: Milestone[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const STEM_LENGTHS = stemLengths(milestones.length);
  const { t } = useLanguage();

  // Card copy is real content now, not filler — its length (and therefore
  // each card's rendered height) isn't predictable, so fixed y-spacing
  // between milestones caused long cards to overlap the next one. This
  // starts from a naive evenly-spaced layout (first paint only) and, once
  // the cards are in the DOM, re-measures their actual heights and
  // recomputes spacing so consecutive cards never collide.
  const [{ points, roadHeight }, setLayout] = useState(() => naiveRoadLayout(milestones.length));

  useLayoutEffect(() => {
    const CARD_GAP = 56;
    let anchorTop = ROAD_TOP - STEM_LENGTHS[0] - 24;
    const measuredPoints = milestones.map((_, i) => {
      const x = i % 2 === 0 ? ROAD_LEFT_X : ROAD_RIGHT_X;
      const y = anchorTop + STEM_LENGTHS[i] + 24;
      const cardHeight = cardRefs.current[i]?.offsetHeight ?? 0;
      anchorTop += cardHeight + CARD_GAP;
      return { x, y };
    });
    const lastPoint = measuredPoints[measuredPoints.length - 1];
    setLayout({
      points: measuredPoints,
      roadHeight: Math.max(lastPoint.y, anchorTop - CARD_GAP) + 100,
    });
    // Card width is fixed (not viewport-relative), so measured heights never
    // change after mount — no need to re-measure on resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestones]);

  const pathD = buildSmoothPath(points);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      const length = path.getTotalLength();
      // +2 buffer on the initial dashoffset: with it exactly equal to the
      // dash/gap length, the pattern boundary lands precisely on the path's
      // start point, and the round linecap renders a stray dot artifact
      // right there in some browsers. A couple extra units avoids the exact
      // seam and is visually imperceptible once the line draws in.
      gsap.set(path, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length + 2 });

      const items = gsap.utils.toArray<HTMLElement>(".road-item");
      gsap.set(
        items.map((item) => item.querySelector(".road-dot")),
        { scale: 0 },
      );
      gsap.set(
        items.map((item) => item.querySelector(".road-stem")),
        { scaleY: 0 },
      );
      gsap.set(
        items.map((item) => item.querySelector(".road-badge")),
        { scale: 0 },
      );
      gsap.set(
        items.map((item) => item.querySelector(".road-card-inner")),
        { opacity: 0, y: 24 },
      );

      // Arc-length fraction at which each milestone sits along the road,
      // found by binary-searching the path's own (monotonically increasing)
      // y — so a milestone only reveals once the road has actually been
      // drawn as far as its own point, not on a generic scroll threshold.
      const milestoneProgress = points.map((point) => {
        let lo = 0;
        let hi = length;
        for (let iter = 0; iter < 30; iter++) {
          const mid = (lo + hi) / 2;
          const y = path.getPointAtLength(mid).y;
          if (y < point.y) lo = mid;
          else hi = mid;
        }
        return lo / length;
      });

      const revealed = items.map(() => false);
      const revealItem = (i: number) => {
        if (revealed[i]) return;
        revealed[i] = true;
        const item = items[i];
        gsap.to(item.querySelector(".road-dot"), { scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(item.querySelector(".road-stem"), { scaleY: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(item.querySelector(".road-badge"), { scale: 1, duration: 0.5, delay: 0.15, ease: "back.out(3)" });
        gsap.to(item.querySelector(".road-card-inner"), {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.25,
          ease: "power3.out",
        });
      };

      // The first milestone has no line leading up to it — waiting for
      // scroll to "reach" it just reads as a slow, unexplained delay before
      // anything shows up, so it reveals as soon as the page loads instead.
      revealItem(0);

      // Declared before the tween so `onUpdate` never hits a temporal-dead-
      // zone error — GSAP can invoke `onUpdate` synchronously while the
      // tween is still being constructed (before `drawTween` below would
      // otherwise be assigned), so the reference must already exist.
      let drawTween: gsap.core.Tween | undefined;
      drawTween = gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          // Anchored to the container's own top/bottom (not a fixed viewport
          // %) so progress is guaranteed to start at 0 on load — the road
          // only begins drawing once the user actually scrolls it into view.
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
        onUpdate: () => {
          // The tween's own progress (not ScrollTrigger's raw scroll
          // progress) — scrub smoothing makes the drawn line lag behind the
          // scroll position, so reading scroll progress here would reveal
          // cards before the line visually reaches them.
          const drawn = drawTween?.progress() ?? 0;
          milestoneProgress.forEach((p, i) => {
            if (drawn >= p) revealItem(i);
          });
        },
      });
    },
    { scope, dependencies: [points] },
  );

  return (
    <div ref={scope} className="relative mx-auto" style={{ width: ROAD_WIDTH, height: roadHeight }}>
      <svg className="absolute inset-0" width={ROAD_WIDTH} height={roadHeight} viewBox={`0 0 ${ROAD_WIDTH} ${roadHeight}`}>
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={DARK_BORDER}
          strokeWidth={26}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0px 0px 22px rgba(226,150,71,0.18))" }}
        />
      </svg>

      {milestones.map((milestone, i) => {
        const Icon = ROAD_ICONS[i % ROAD_ICONS.length];
        const point = points[i];
        const stemLength = STEM_LENGTHS[i];
        const badgeTop = point.y - stemLength;

        return (
          <div key={milestone.year} className="road-item">
            <div
              className="road-dot absolute h-3 w-3 rounded-full bg-primary"
              style={{ left: point.x - 6, top: point.y - 6, boxShadow: `0 0 0 2px ${DARK_BG}` }}
            />
            <div
              className="road-stem absolute w-[3px] origin-bottom"
              style={{ left: point.x - 1.5, top: badgeTop + 24, height: stemLength - 24, background: DARK_STEM }}
            />
            <div
              className="road-badge absolute flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg"
              style={{ left: point.x - 24, top: badgeTop - 24 }}
            >
              <Icon className="h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="absolute" style={{ left: point.x + 40, top: badgeTop - 24, width: CARD_WIDTH }}>
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="road-card-inner rounded-xl border p-5"
                style={{ borderColor: DARK_BORDER, background: DARK_CARD_BG, boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.3)" }}
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
              >
                <MilestoneImage src={MILESTONE_IMAGES[i]} alt={milestone.title} placeholderLabel={t.nossaHistoria.imagePlaceholder} />
                <span
                  className="inline-block rounded-full bg-primary px-3 py-1 text-sm font-bold text-secondary"
                  style={{ fontFamily: DM_SANS }}
                >
                  {milestone.year}
                </span>
                <h3 className="mt-3 text-xl leading-tight" style={{ fontFamily: PLAYFAIR, color: DARK_TEXT }}>
                  {milestone.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ fontFamily: DM_SANS, color: DARK_MUTED }}>
                  {milestone.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Mobile fallback: the road layout needs real horizontal room for the
// branching cards, so narrow viewports get a plain vertical timeline
// instead of a cramped road.
function SimpleTimeline({ milestones }: { milestones: Milestone[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const container = scope.current;
      const lineFill = lineFillRef.current;
      if (!container || !lineFill) return;

      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
      gsap.set(
        items.map((item) => item.querySelector(".timeline-card")),
        { opacity: 0, y: 32 },
      );
      gsap.set(
        items.map((item) => item.querySelector(".timeline-dot")),
        { scale: 0 },
      );

      // Fraction of the line's total height at which each item sits — a
      // milestone only reveals once the fill has actually reached it,
      // instead of a generic scroll threshold.
      const totalHeight = container.scrollHeight;
      const itemFractions = items.map((item) => item.offsetTop / totalHeight);
      const revealed = items.map(() => false);
      const revealItem = (i: number) => {
        if (revealed[i]) return;
        revealed[i] = true;
        const item = items[i];
        gsap.to(item.querySelector(".timeline-dot"), { scale: 1, duration: 0.5, ease: "back.out(3)" });
        gsap.to(item.querySelector(".timeline-card"), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "power3.out",
        });
      };

      // The first milestone has no line leading up to it — waiting for
      // scroll to "reach" it just reads as a slow, unexplained delay before
      // anything shows up, so it reveals as soon as the page loads instead.
      revealItem(0);

      // Declared before the tween so `onUpdate` never hits a temporal-dead-
      // zone error — GSAP can invoke `onUpdate` synchronously while the
      // tween is still being constructed (before `fillTween` below would
      // otherwise be assigned), so the reference must already exist.
      let fillTween: gsap.core.Tween | undefined;
      fillTween = gsap.fromTo(
        lineFill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            // Anchored to the container's own top/bottom so progress is
            // guaranteed to start at 0 on load — the line only starts
            // filling once the user actually scrolls it into view.
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
          onUpdate: () => {
            // The tween's own progress, not ScrollTrigger's raw scroll
            // progress — scrub smoothing makes the fill lag behind the
            // scroll position, so reading scroll progress here would reveal
            // cards before the fill visually reaches them.
            const filled = fillTween?.progress() ?? 0;
            itemFractions.forEach((f, i) => {
              if (filled >= f) revealItem(i);
            });
          },
        },
      );
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative">
      <div className="absolute top-0 bottom-0 left-[19px] w-[2px] rounded-full" style={{ background: DARK_BORDER }} />
      <div
        ref={lineFillRef}
        className="absolute top-0 left-[19px] w-[2px] origin-top rounded-full bg-primary"
        style={{ height: "100%" }}
      />

      <ul className="flex flex-col gap-14">
        {milestones.map((milestone, i) => (
          <li key={milestone.year} className="timeline-item relative pl-16">
            <span
              className="timeline-dot absolute top-1 left-[12px] z-10 block h-4 w-4 rounded-full bg-primary"
              style={{ boxShadow: `0 0 0 4px ${DARK_BG}` }}
            />
            <div
              className="timeline-card rounded-xl border p-6 sm:p-8"
              style={{ borderColor: DARK_BORDER, background: DARK_CARD_BG, boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.3)" }}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
            >
              <MilestoneImage src={MILESTONE_IMAGES[i]} alt={milestone.title} placeholderLabel={t.nossaHistoria.imagePlaceholder} />
              <span
                className="inline-block rounded-full bg-primary px-3 py-1 text-sm font-bold text-secondary"
                style={{ fontFamily: DM_SANS }}
              >
                {milestone.year}
              </span>
              <h3 className="mt-4 text-2xl leading-tight" style={{ fontFamily: PLAYFAIR, color: DARK_TEXT }}>
                {milestone.title}
              </h3>
              <p className="mt-2 leading-relaxed" style={{ fontFamily: DM_SANS, color: DARK_MUTED }}>
                {milestone.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useIsWide(breakpoint: number) {
  const [isWide, setIsWide] = useState(() => window.innerWidth >= breakpoint);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const onChange = () => setIsWide(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isWide;
}

export default function NossaHistoria() {
  const scale = useNavScale();
  const scope = useRef<HTMLDivElement>(null);
  const isWide = useIsWide(1024);
  const { t } = useLanguage();

  useGSAP(
    () => {
      gsap.set(".history-hero-eyebrow, .history-hero-title, .history-hero-lead", {
        opacity: 0,
        y: 24,
      });
      gsap.to(".history-hero-eyebrow, .history-hero-title, .history-hero-lead", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative min-h-screen" style={{ background: DARK_BG }}>
      <header
        className="sticky top-0 z-30 w-full border-b backdrop-blur-sm"
        style={{ height: 64 * scale, borderColor: DARK_BORDER, background: `${DARK_BG}f2` }}
      >
        <div style={{ width: 1440, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <NavigationMenu4 />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-20 pb-32">
        <section className="mx-auto max-w-2xl text-center">
          <p
            className="history-hero-eyebrow text-sm font-bold tracking-[0.2em] text-primary uppercase"
            style={{ fontFamily: DM_SANS }}
          >
            {t.nossaHistoria.eyebrow}
          </p>
          <h1
            className="history-hero-title mt-4 text-[42px] leading-[1.1] sm:text-[56px]"
            style={{ fontFamily: PLAYFAIR, color: DARK_TEXT }}
          >
            {t.nossaHistoria.title}
          </h1>
          <p
            className="history-hero-lead mt-6 text-lg leading-relaxed"
            style={{ fontFamily: DM_SANS, color: DARK_MUTED }}
          >
            {t.nossaHistoria.lead}
          </p>
        </section>

        <section className="history-timeline mt-24 overflow-x-auto">
          {isWide ? (
            <RoadTimeline milestones={t.nossaHistoria.milestones} />
          ) : (
            <SimpleTimeline milestones={t.nossaHistoria.milestones} />
          )}
        </section>

        <section className="mt-24 grid gap-8 sm:grid-cols-3">
          {t.nossaHistoria.mvv.map(({ title, text }, i) => {
            const Icon = MVV_ICONS[i];
            return (
              <div
                key={title}
                className="rounded-xl border p-8 text-center"
                style={{ borderColor: DARK_BORDER, background: DARK_CARD_BG }}
              >
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary"
                >
                  <Icon className="h-5 w-5 text-secondary" strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-xl" style={{ fontFamily: PLAYFAIR, color: DARK_TEXT }}>
                  {title}
                </h3>
                <p className="mt-3 leading-relaxed" style={{ fontFamily: DM_SANS, color: DARK_MUTED }}>
                  {text}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-24 text-center">
          <p className="text-lg" style={{ fontFamily: DM_SANS, color: DARK_MUTED }}>
            {t.nossaHistoria.ctaText}
          </p>
          <a
            href="/produtos"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-[14px] bg-primary px-8 font-bold text-secondary transition-opacity hover:opacity-90"
            style={{ fontFamily: DM_SANS }}
          >
            {t.nossaHistoria.ctaButton}
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
