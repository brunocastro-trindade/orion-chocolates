import { useEffect, useState } from "react";
import { MOBILE_BREAKPOINT } from "./useIsMobile";

// Same 1440px reference width the whole site's Figma-derived layout is
// designed at — keeps the navbar's logo/text size in lockstep with the
// home page and produtos page, whatever the actual viewport width is.
// No celular o navbar não é escalado (escala 1): ele tem layout próprio.
const NAV_CANVAS_WIDTH = 1440;

const calcScale = () =>
  window.innerWidth < MOBILE_BREAKPOINT ? 1 : window.innerWidth / NAV_CANVAS_WIDTH;

export function useNavScale() {
  const [scale, setScale] = useState(calcScale);

  useEffect(() => {
    const updateScale = () => setScale(calcScale());
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return scale;
}
