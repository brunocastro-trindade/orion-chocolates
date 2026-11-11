import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import { BLOB_PATH, BLOB_VIEWBOX, BLOB_LAYOUT, SPRING, flavors } from "@/app/pages/produtos/flavors";
import NavigationMenu4 from "@/app/components/ui/navigation-menu-4";
import { useLanguage } from "@/i18n/LanguageContext";

const N = flavors.length;
// 1440px reference frame, same as the main site's canvas — the whole scene is
// authored at this fixed size and scaled as a single block (transform: scale)
// to fill the viewport, instead of positioning individual elements in vw/vh.
const CANVAS_WIDTH = 1440;
const PRODUCT_W = 460;
const PRODUCT_H = Math.round((PRODUCT_W * 1527) / 1024);
const SLICE = 4;
const EDGE_FADE = 24;
const SWIPE_DISTANCE = 260; // px of drag needed to fully preview one neighboring flavor (real screen px, unaffected by canvas scale)
const SWIPE_COMMIT = 90; // px of drag needed to commit to the neighbor on release
const TITLE_FONT_SIZE = 126.72; // == 8.8vw at the 1440 reference width
const AUTO_ADVANCE_MS = 10000;
const FONT_DISPLAY = "'Vesper Nocturne', serif";
const FONT_NAV = "'Creato Display', 'DM Sans', sans-serif";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const mod = (n: number, m: number) => ((n % m) + m) % m;


export default function Produtos() {
  const [index, setIndex] = useState(0);
  const flavor = flavors[index];
  const { t } = useLanguage();
  const flavorText = t.produtosFlavors[flavor.id as keyof typeof t.produtosFlavors];
  const productW = flavor.productW ?? PRODUCT_W;
  const productH = flavor.productH ?? PRODUCT_H;

  // Scale the 1440-wide canvas to fill the viewport, same technique as the
  // main site. canvasHeight is derived from the live viewport aspect ratio
  // (not a fixed number, unlike the main site's tall scrolling page) so the
  // scaled canvas always covers exactly 100% width AND height — this page is
  // "tela cheia, sem scroll".
  const [scale, setScale] = useState(() => window.innerWidth / CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(() => window.innerHeight / (window.innerWidth / CANVAS_WIDTH));

  useEffect(() => {
    const updateSize = () => {
      const s = window.innerWidth / CANVAS_WIDTH;
      setScale(s);
      setCanvasHeight(window.innerHeight / s);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const blobSize = Math.min(CANVAS_WIDTH, canvasHeight) * 0.7;

  // ---- continuous "flavor progress" driving canvas + background + title ----
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const goToRef = useRef<(next: number) => void>(() => {});

  // 10s auto-advance, cyclic — restarted from scratch after every navigation
  // (manual or automatic) so it never fires right on top of a fresh action.
  const scheduleAutoAdvance = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goToRef.current(indexRef.current + 1);
    }, AUTO_ADVANCE_MS);
  }, []);

  const goTo = useCallback((next: number) => {
    // stepping one past either end (N or -1) plays the transition into the
    // duplicated loop panel, then silently snaps back to the real index —
    // that's what makes the wrap read as a forward slide, not a rewind.
    const wrapping = next === N || next === -1;
    const real = mod(next, N);
    setIndex(real);
    indexRef.current = real;
    controls.current?.stop();
    controls.current = animate(progress, wrapping ? next : clamp(next, 0, N - 1), {
      ...SPRING,
      onComplete: wrapping ? () => progress.set(real) : undefined,
    });
    scheduleAutoAdvance();
  }, [progress, scheduleAutoAdvance]);

  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

  // start the initial countdown on mount
  useEffect(() => {
    scheduleAutoAdvance();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [scheduleAutoAdvance]);

  // ---- keyboard ----
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  // ---- mouse parallax ----
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.6 });
  const parallaxY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.6 });
  const productParallaxX = useTransform(parallaxX, (v) => -v * 0.5);
  const productParallaxY = useTransform(parallaxY, (v) => -v * 0.5);
  const decorParallaxX = useTransform(parallaxX, (v) => v * 0.2);
  const decorParallaxY = useTransform(parallaxY, (v) => v * 0.2);

  useEffect(() => {
    function onMove(e: globalThis.PointerEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(nx * 18);
      mouseY.set(ny * 18);
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseX, mouseY]);

  // ---- drag to change flavor ----
  const dragState = useRef({ dragging: false, moved: false, startX: 0, startIndex: 0 });

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    dragState.current = { dragging: true, moved: false, startX: e.clientX, startIndex: index };
    controls.current?.stop();
    (e.target as Element).setPointerCapture(e.pointerId);
  }, [index]);

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    const s = dragState.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    progress.set(clamp(s.startIndex - dx / SWIPE_DISTANCE, -1, N));
  }, [progress]);

  const onPointerUp = useCallback((e: ReactPointerEvent) => {
    const s = dragState.current;
    if (!s.dragging) return;
    s.dragging = false;
    const dx = e.clientX - s.startX;
    if (s.moved && Math.abs(dx) > SWIPE_COMMIT) {
      goTo(s.startIndex + (dx < 0 ? 1 : -1));
    } else {
      goTo(s.startIndex);
    }
  }, [goTo]);

  // a drag already committed its own goTo on release — swallow the click
  // that follows so the root's click-to-advance doesn't also fire for it.
  const onClickProduct = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (dragState.current.moved) e.stopPropagation();
  }, []);

  // clicking anywhere on screen advances to the next flavor, cyclically
  const onClickScreen = useCallback(() => {
    goTo(indexRef.current + 1);
  }, [goTo]);

  // ---- canvas: the sliding "faixa" of product photos, masked to their own alpha ----
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [boxSize, setBoxSize] = useState({ w: productW, h: productH });
  // Gates the title/tagline/product reveal so they always appear together —
  // without this, the giant title (pure text, instant) flashes on screen for
  // a beat before the product photo (an async image load) catches up.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    imagesRef.current = flavors.map((f) => {
      const img = new Image();
      img.src = f.image;
      return img;
    });
    const firstImg = imagesRef.current[0];
    if (firstImg.complete) setReady(true);
    else firstImg.addEventListener("load", () => setReady(true), { once: true });
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const box = entries[0].contentRect;
      if (box.width > 0 && box.height > 0) setBoxSize({ w: box.width, h: box.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(
    (p: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const { w, h } = boxSize;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // no clamping here — p ranges slightly past [0, N-1] while animating
      // into the wrap, so images are looked up modulo N instead
      const i0 = Math.floor(p);
      const i1 = i0 + 1;
      const frac = clamp(p - i0, 0, 1);
      const offset = frac * w;

      const drawPanel = (img: HTMLImageElement, destX: number) => {
        if (!img.complete || img.naturalWidth === 0) return;
        if (destX + w < 0 || destX > w) return; // fully outside the canvas box
        const sw = img.naturalWidth;
        const sh = img.naturalHeight;
        for (let x = 0; x < w; x += SLICE) {
          const dx = destX + x;
          if (dx + SLICE < 0 || dx > w) continue;
          const sliceW = Math.min(SLICE, w - x);
          const sx = (x / w) * sw;
          const sSliceW = (sliceW / w) * sw;
          ctx.drawImage(img, sx, 0, sSliceW, sh, dx, 0, sliceW, h);
        }
      };

      drawPanel(imagesRef.current[mod(i0, N)], -offset);
      if (i1 !== i0) drawPanel(imagesRef.current[mod(i1, N)], w - offset);

      // fade the left/right edges so the neighboring photo never looks like a hard slab
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      const f = clamp(EDGE_FADE / w, 0, 0.49);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(f, "rgba(0,0,0,1)");
      grad.addColorStop(1 - f, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    },
    [boxSize],
  );

  useMotionValueEvent(progress, "change", (p) => draw(p));
  useEffect(() => draw(progress.get()), [draw, progress]);

  // redraw once each image finishes loading (first paint might race the network)
  useEffect(() => {
    const imgs = imagesRef.current;
    const handlers = imgs.map((img) => {
      const onLoad = () => draw(progress.get());
      img.addEventListener("load", onLoad);
      return { img, onLoad };
    });
    return () => handlers.forEach(({ img, onLoad }) => img.removeEventListener("load", onLoad));
  }, [draw, progress]);

  const blobs = BLOB_LAYOUT[index];

  return (
    <div
      className="relative h-dvh w-dvw overflow-hidden select-none"
      style={{ touchAction: "none" }}
      onClick={onClickScreen}
    >
      {/* shadcn navigation-menu-4, adapted to the ORION brand — wrapped so it
          overlays the scene (z-30, absolute) and clicking it doesn't also
          trigger the whole-screen click-to-advance-flavor handler. Scaled by
          the same `scale` factor as the canvas below (and as the main site's
          navbar) so it stays the same physical size on both pages at any
          viewport width, instead of rendering at a fixed native size here. */}
      <div
        className="absolute top-0 left-0 z-30"
        style={{ width: CANVAS_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
        onClick={(e) => e.stopPropagation()}
      >
        <NavigationMenu4 />
      </div>

      {/* 1440px reference canvas, scaled as a single block to always cover
          exactly 100% of the viewport width AND height (canvasHeight is
          derived from the live aspect ratio for that reason) */}
      <div className="absolute top-0 left-0" style={{ width: CANVAS_WIDTH, height: canvasHeight, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {/* background — locked in place, only the color cross-fades between
            flavors (no lateral slide; only the product bar below animates) */}
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: flavor.bg }}
          transition={{ duration: 0.5 }}
        />

        {/* two blobs, glued to the composition, sliding/rotating/mirroring per flavor */}
        <Blob position={blobs.left} color={flavor.blob} size={blobSize} parallaxX={decorParallaxX} parallaxY={decorParallaxY} />
        <Blob position={blobs.right} color={flavor.blob} size={blobSize} parallaxX={decorParallaxX} parallaxY={decorParallaxY} />

        {/* giant flavor title — locked in place, cross-fades between flavors
            instead of sliding (only the product bar animates laterally).
            Same fixed size for every flavor — long names simply run past the
            edges (whitespace-nowrap), same as the original Figma exports. */}
        <div className="absolute inset-y-0 left-0 flex h-full w-full items-center justify-center" style={{ zIndex: 4 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={flavor.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute leading-none font-normal whitespace-nowrap text-white/90"
              style={{ fontSize: TITLE_FONT_SIZE, fontFamily: FONT_DISPLAY }}
            >
              {flavorText.name}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* season label (e.g. "DIA DAS BRUXAS") — upper-left, above the product */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}>
          <AnimatePresence mode="wait">
            {flavor.seasonLabel && (
              <motion.p
                key={`season-${flavor.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute font-medium text-[#e29647]"
                style={{
                  left: CANVAS_WIDTH * 0.104,
                  top: canvasHeight * 0.25,
                  fontSize: 13,
                  fontFamily: FONT_NAV,
                  letterSpacing: "0.1em",
                }}
              >
                {flavor.seasonLabel}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* tagline, bottom-left — locked in place, cross-fades with the title */}
        <div className="absolute inset-0" style={{ zIndex: 6 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={flavor.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute text-xl font-medium whitespace-pre-line text-white"
              style={{ left: CANVAS_WIDTH * 0.08, bottom: canvasHeight * 0.18, fontFamily: FONT_NAV }}
            >
              {flavorText.tagline.filter(Boolean).join("\n")}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* product photo, canvas-composited and mouse-parallaxed, click/drag to change flavor */}
        <motion.div
          ref={boxRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={onClickProduct}
          className="absolute top-1/2 left-1/2 z-10 cursor-grab active:cursor-grabbing"
          style={{
            width: productW,
            height: productH,
            x: productParallaxX,
            y: productParallaxY,
            translateX: "-50%",
            // shifted down (instead of up) so the product clears the ORION
            // medallion hanging down from the navbar above it
            translateY: `calc(-50% + ${canvasHeight * 0.06}px)`,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </motion.div>

        {/* stroke-only duplicate of the title, drawn above the product so the
            letters crossing the wrapper read as a hollow outline instead of
            being hidden behind the opaque photo — same locked/cross-fade
            treatment as the solid title above */}
        <div className="absolute inset-y-0 left-0 flex h-full w-full items-center justify-center" style={{ zIndex: 11 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={flavor.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute leading-none font-normal whitespace-nowrap"
              style={{
                fontSize: TITLE_FONT_SIZE,
                fontFamily: FONT_DISPLAY,
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.95)",
              }}
            >
              {flavorText.name}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* pagination dots — stop propagation so picking a dot doesn't also advance again */}
        <div
          className="absolute z-20 flex items-center gap-1"
          style={{ right: 64, bottom: 32 }}
          onClick={(e) => e.stopPropagation()}
        >
          {flavors.map((f, i) => (
            <button
              key={f.id}
              aria-label={t.produtosFlavors[f.id as keyof typeof t.produtosFlavors].name}
              onClick={() => goTo(i)}
              className="cursor-pointer rounded-full transition-[width] duration-300"
              style={{
                width: i === index ? 44 : 12,
                height: 12,
                backgroundColor: i === index ? flavor.dotActive : flavor.dotInactive,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Blob({
  position,
  color,
  size,
  parallaxX,
  parallaxY,
}: {
  position: { x: number; y: number; rotate: number; mirror: boolean };
  color: string;
  size: number;
  parallaxX: ReturnType<typeof useTransform<number, number>>;
  parallaxY: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: size,
        height: size,
        x: parallaxX,
        y: parallaxY,
        zIndex: 1,
      }}
      animate={{ rotate: position.rotate, scaleX: position.mirror ? -1 : 1 }}
      transition={SPRING}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox={BLOB_VIEWBOX}
        fill="none"
        animate={{ fill: color }}
        transition={SPRING}
      >
        <motion.path d={BLOB_PATH} fillRule="evenodd" clipRule="evenodd" animate={{ fill: color }} transition={SPRING} />
      </motion.svg>
    </motion.div>
  );
}
