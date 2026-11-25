// Mantém <title>, description, canonical e Open Graph em sincronia com a rota
// durante a navegação client-side. O HTML inicial de cada rota já sai do build
// com essas tags (scripts/vite-plugin-seo.ts); aqui só acompanhamos as trocas.
import { useEffect } from "react";
import { useLocation } from "react-router";
import { canonicalUrl, findRoute } from "./site";

function setMeta(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = findRoute(pathname);
    if (!route) return;
    const url = canonicalUrl(route.path);
    document.title = route.title;
    setMeta('meta[name="description"]', "content", route.description);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:title"]', "content", route.title);
    setMeta('meta[property="og:description"]', "content", route.description);
    setMeta('meta[name="twitter:title"]', "content", route.title);
    setMeta('meta[name="twitter:description"]', "content", route.description);
  }, [pathname]);

  return null;
}
