// Plugin de build que deixa o site legível para buscadores e motores de IA.
//
// O site é uma SPA: o index.html original só tem <div id="root"></div>, e
// crawlers de IA (GPTBot, ClaudeBot, PerplexityBot...) não executam JS. Depois
// do `vite build`, este plugin:
//
//  1. gera dist/<rota>.html para cada rota de src/seo/site.ts, com
//     title, description, canonical, Open Graph, Twitter, JSON-LD (@graph) e o
//     conteúdo da página em HTML estático dentro de #root (o React substitui
//     esse conteúdo ao montar);
//  2. gera dist/spa-fallback.html (noindex) para URLs desconhecidas — o
//     vercel.json reescreve para ele, evitando "soft 404" com canonical da home;
//  3. gera robots.txt, sitemap.xml, llms.txt, llms-full.txt,
//     .well-known/ai.txt e ai/summary.json.
//
// Fontes de dados (nada é duplicado à mão):
//  - textos visíveis: src/i18n/translations.ts (pt)
//  - lojas, telefones, horários, redes: config/config.yaml
//  - catálogo: data/produtos.csv
//  - metadados por rota e dados da marca: src/seo/site.ts
//  - entrega/pagamento/conservação: src/seo/llms-servicos.md
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { Plugin } from "vite";
import { translations } from "../src/i18n/translations";
import { flavors } from "../src/app/pages/produtos/flavors";
import {
  DEFAULT_OG_IMAGE,
  ORG,
  ROUTES,
  SITE_NAME,
  SITE_URL,
  canonicalUrl,
  type RouteSeo,
} from "../src/seo/site";

const t = translations.pt;
const ROOT = path.resolve(__dirname, "..");
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// Coordenadas das lojas (mesmas do mapa em src/app/sections/StoreLocator.tsx).
const STORE_GEO: Record<string, { lat: number; lng: number }> = {
  centro: { lat: -26.9210373, lng: -49.0653646 },
  park_europeu: { lat: -26.8866763, lng: -49.0685402 },
};

// Imagem de cada produto em destaque na página /produtos (mesma fonte da página).
const FLAVOR_IMAGES: Record<string, string> = Object.fromEntries(flavors.map((f) => [f.id, f.image]));

/** Tagline (em caixa alta no site) em frases normais, ignorando linhas vazias. */
function tagline(linhas: readonly string[]): string {
  return linhas
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/(^|[.!?]\s+)(\p{L})/gu, (_, sep, c) => sep + c.toUpperCase())
    .replace(/\bhalloween\b/g, "Halloween");
}

// ---------------------------------------------------------------- helpers

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (["de", "da", "do", "e", "or"].includes(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((r) => r.some((f) => f.trim()));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

// ---------------------------------------------------------------- dados

type Loja = {
  key: string;
  nome: string;
  endereco: string;
  street: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone?: string;
  whatsapp?: string;
  mapsUrl?: string;
  horarios: { dias: string[]; abre: string; fecha: string; rotulo: string }[];
  atendeDelivery: boolean;
};

const DIAS: Record<string, { dias: string[]; rotulo: string }> = {
  seg_sex: { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], rotulo: "Segunda a sexta" },
  seg_sab: {
    dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    rotulo: "Segunda a sábado",
  },
  sab: { dias: ["Saturday"], rotulo: "Sábado" },
  dom: { dias: ["Sunday"], rotulo: "Domingo" },
};

function carregaLojas(): { lojas: Loja[]; config: Record<string, any> } {
  const raw = fs.readFileSync(path.join(ROOT, "config/config.yaml"), "utf8");
  const config = yaml.load(raw) as Record<string, any>;
  // Telefones marcados "PENDENTE" em comentário no config.yaml não vão para o site.
  const pendente = (valor?: string) =>
    !!valor && raw.split("\n").some((line) => line.includes(`"${valor}"`) && line.includes("PENDENTE"));
  const lojas: Loja[] = Object.entries(config.lojas as Record<string, any>).map(([key, l]) => {
    const m = /^(.+), ([^,]+), ([^,/]+)\/([A-Z]{2}), CEP (\d{5}-\d{3})$/.exec(l.endereco);
    if (!m) throw new Error(`[seo] endereço fora do padrão em config.yaml (${key}): ${l.endereco}`);
    const horarios = Object.entries((l.horario_loja ?? {}) as Record<string, string>)
      .filter(([, v]) => /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(v))
      .map(([k, v]) => {
        const d = DIAS[k];
        if (!d) throw new Error(`[seo] chave de horário desconhecida em config.yaml (${key}): ${k}`);
        const [abre, fecha] = v.split("-");
        return { dias: d.dias, rotulo: d.rotulo, abre, fecha };
      });
    return {
      key,
      nome: l.nome,
      endereco: l.endereco,
      street: m[1],
      bairro: m[2],
      cidade: m[3],
      uf: m[4],
      cep: m[5],
      telefone: pendente(l.telefone_fixo) ? undefined : l.telefone_fixo,
      whatsapp: pendente(l.whatsapp) ? undefined : l.whatsapp,
      mapsUrl: l.maps_url,
      horarios,
      atendeDelivery: !!l.atende_delivery,
    };
  });
  return { lojas, config };
}

function carregaCatalogo(): Map<string, string[]> {
  const rows = parseCsv(fs.readFileSync(path.join(ROOT, "data/produtos.csv"), "utf8"));
  const LABEL: Record<string, string> = {
    bombom: "Bombons, pastilhas e caixas",
    tablete: "Tabletes e barrinhas",
    "chocolate-ao-leite": "Frutas e castanhas cobertas",
    dragea: "Drágeas",
    "sem-acucar": "Sem adição de açúcar",
    "pao-de-mel": "Pão de mel",
    trufa: "Trufas",
    outro: "Outros doces",
    sazonal: "Sazonais",
  };
  const out = new Map<string, string[]>();
  for (const r of rows) {
    if (r.ativo !== "sim") continue;
    const grupo =
      r.categoria === "sazonal" && r.periodo_sazonal
        ? `Sazonais: ${r.periodo_sazonal}`
        : (LABEL[r.categoria] ?? titleCase(r.categoria));
    const lista = out.get(grupo) ?? [];
    if (!lista.includes(r.nome)) lista.push(r.nome);
    out.set(grupo, lista);
  }
  return out;
}

function horarioTexto(l: Loja): string {
  return l.horarios.map((h) => `${h.rotulo}: ${h.abre.replace(":00", "h")} às ${h.fecha.replace(":00", "h")}`).join("; ");
}

// ---------------------------------------------------------------- JSON-LD

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function orgNode(lojas: Loja[]) {
  const principal = lojas.find((l) => l.key === "centro") ?? lojas[0];
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG.name,
    alternateName: ORG.alternateName,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: ORG.logo, width: 512, height: 512 },
    image: DEFAULT_OG_IMAGE,
    description: ORG.description,
    foundingDate: ORG.foundingDate,
    foundingLocation: { "@type": "Place", name: ORG.foundingLocation },
    founder: ORG.founders.map((name) => ({ "@type": "Person", name })),
    ...(ORG.email && { email: ORG.email }),
    telephone: principal.telefone,
    address: postalAddress(principal),
    areaServed: ["Blumenau", "Vale do Itajaí", "Santa Catarina"],
    knowsAbout: ["chocolates finos", "bombons", "trufas", "chocolate artesanal", "presentes corporativos"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: principal.whatsapp ?? principal.telefone,
        ...(ORG.email && { email: ORG.email }),
        areaServed: "BR",
        availableLanguage: ["Portuguese"],
      },
    ],
    sameAs: ORG.sameAs,
    subOrganization: lojas.map((l) => ({ "@id": `${SITE_URL}/#loja-${l.key}` })),
  };
}

function postalAddress(l: Loja) {
  return {
    "@type": "PostalAddress",
    streetAddress: l.street,
    addressLocality: l.cidade,
    addressRegion: l.uf,
    postalCode: l.cep,
    addressCountry: "BR",
  };
}

function lojaNode(l: Loja) {
  const geo = STORE_GEO[l.key];
  return {
    "@type": "Store",
    "@id": `${SITE_URL}/#loja-${l.key}`,
    name: `${ORG.name} — ${l.nome}`,
    url: `${SITE_URL}/`,
    image: DEFAULT_OG_IMAGE,
    parentOrganization: { "@id": ORG_ID },
    address: postalAddress(l),
    ...(geo && { geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng } }),
    ...(l.telefone && { telephone: l.telefone }),
    ...(l.mapsUrl && { hasMap: l.mapsUrl }),
    openingHoursSpecification: l.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.fecha,
    })),
    paymentAccepted: "Dinheiro, PIX, Transferência bancária, Cartão de crédito",
    currenciesAccepted: "BRL",
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: ROUTES[0].description,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

function webPageNode(r: RouteSeo) {
  const url = canonicalUrl(r.path);
  const type = r.path === "/nossa-historia" ? "AboutPage" : "WebPage";
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: r.title,
    description: r.description,
    inLanguage: "pt-BR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE, width: 1200, height: 630 },
    dateModified: BUILD_DATE,
    ...(r.path !== "/" && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
  };
}

function breadcrumbNode(r: RouteSeo) {
  const url = canonicalUrl(r.path);
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ROUTES[0].breadcrumb, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: r.breadcrumb, item: url },
    ],
  };
}

function faqNode() {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: t.faq.items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

function produtosNode() {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/produtos#sabores`,
    name: "Produtos Orion em destaque",
    itemListElement: Object.entries(t.produtosFlavors).map(([id, f], i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `Chocolate Orion ${titleCase(f.name)}`,
        description: tagline(f.tagline),
        image: `${SITE_URL}${FLAVOR_IMAGES[id]}`,
        brand: { "@type": "Brand", name: ORG.name },
        manufacturer: { "@id": ORG_ID },
        category: "Chocolate fino",
      },
    })),
  };
}

function jsonLd(r: RouteSeo, lojas: Loja[]): string {
  const graph: unknown[] = [orgNode(lojas), websiteNode(), webPageNode(r)];
  if (r.path !== "/") graph.push(breadcrumbNode(r));
  if (r.path === "/") graph.push(...lojas.map(lojaNode), faqNode());
  if (r.path === "/produtos") graph.push(produtosNode());
  // "</" dentro de JSON-LD fecharia o <script>.
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

// ---------------------------------------------------------------- conteúdo estático

function navHtml(): string {
  const links = ROUTES.map((r) => `<li><a href="${r.path}">${esc(r.breadcrumb)}</a></li>`).join("");
  return `<nav aria-label="Navegação principal"><ul>${links}</ul></nav>`;
}

function lojasHtml(lojas: Loja[]): string {
  return lojas
    .map(
      (l) =>
        `<section><h3>${esc(l.nome)}</h3><p>${esc(l.endereco)}</p><p>Horário: ${esc(horarioTexto(l))}</p>` +
        (l.telefone ? `<p>Telefone: <a href="tel:${l.telefone.replace(/[^\d+]/g, "")}">${esc(l.telefone)}</a></p>` : "") +
        (l.whatsapp
          ? `<p>WhatsApp: <a href="https://wa.me/${l.whatsapp.replace(/\D/g, "")}">${esc(l.whatsapp)}</a></p>`
          : "") +
        `</section>`,
    )
    .join("");
}

function corpoHtml(r: RouteSeo, lojas: Loja[]): string {
  const flavors = Object.entries(t.produtosFlavors)
    .map(([id, f]) => `<li><img src="${FLAVOR_IMAGES[id]}" alt="Chocolate Orion ${esc(titleCase(f.name))}" width="120" height="180" loading="lazy"> <strong>${esc(titleCase(f.name))}</strong>: ${esc(tagline(f.tagline))}</li>`)
    .join("");

  switch (r.path) {
    case "/":
      return [
        `<h1>${esc(t.hero.title)}</h1><p>${esc(t.hero.lead)}</p>`,
        `<section><h2>${esc(t.history.title)}</h2><p>${esc(t.history.lead)}</p><p><a href="/nossa-historia">${esc(t.history.cta)}</a></p></section>`,
        `<section><h2>${esc(t.products.title)}</h2><p>${esc(`${t.products.leadLine1} ${t.products.leadLine2}`)}</p><ul>${flavors}</ul><p><a href="/produtos">${esc(t.products.ctaProducts)}</a></p></section>`,
        `<section><h2>${esc(t.b2b.title)}</h2><p>${esc(t.b2b.lead)}</p></section>`,
        `<section><h2>${esc(t.storeLocator.title)}</h2><p>${esc(t.storeLocator.lead)}</p>${lojasHtml(lojas)}</section>`,
        `<section><h2>${esc(t.faq.title)}</h2>${t.faq.items.map((i) => `<h3>${esc(i.question)}</h3><p>${esc(i.answer)}</p>`).join("")}</section>`,
      ].join("");
    case "/produtos":
      return `<h1>Produtos Orion Chocolates</h1><p>${esc(t.products.title)} ${esc(`${t.products.leadLine1} ${t.products.leadLine2}`)}</p><h2>Em destaque</h2><ul>${flavors}</ul>`;
    case "/nossa-historia": {
      const h = t.nossaHistoria;
      return (
        `<h1>${esc(h.title)}</h1><p>${esc(h.lead)}</p>` +
        h.milestones.map((m) => `<section><h2>${esc(m.year)}: ${esc(m.title)}</h2><p>${esc(m.text)}</p></section>`).join("") +
        h.mvv.map((v) => `<section><h2>${esc(v.title)}</h2><p>${esc(v.text)}</p></section>`).join("")
      );
    }
    case "/qualidade": {
      const q = t.qualidade;
      return (
        `<h1>${esc(`${q.titleLine1} ${q.titleLine2}`)}</h1>` +
        `<section><h2>${esc(q.section1Title)}</h2><p>${esc(q.section1Text)}</p></section>` +
        `<section><h2>${esc(q.section2Title)}</h2><p>${esc(q.section2Text)}</p></section>` +
        `<ul>${q.stats.map((s) => `<li><strong>${esc(s.value)}</strong> ${esc(s.label)}</li>`).join("")}</ul>`
      );
    }
    case "/trabalhe-conosco": {
      const w = t.trabalheConosco;
      return (
        `<h1>${esc(w.title)}</h1><h2>${esc(w.subtitle)}</h2><p>${esc(w.text)}</p>` +
        (ORG.email ? `<p><a href="mailto:${ORG.email}?subject=Curr%C3%ADculo">${esc(w.cta)}</a></p>` : "") +
        `<h2>${esc(w.valuesTitle)}</h2><ul>${w.values.map((v) => `<li><strong>${esc(v.title)}</strong>: ${esc(v.text)}</li>`).join("")}</ul>`
      );
    }
    default:
      return `<h1>${esc(r.breadcrumb)}</h1><p>${esc(r.description)}</p>`;
  }
}

function shellHtml(r: RouteSeo, lojas: Loja[]): string {
  return (
    `<div id="seo-shell"><header><a href="/"><strong>${esc(ORG.name)}</strong></a>${navHtml()}</header>` +
    `<main>${corpoHtml(r, lojas)}</main>` +
    `<footer><p>${esc(t.footer.tagline)}</p><p>${ORG.email ? `Contato: <a href="mailto:${ORG.email}">${ORG.email}</a> · ` : ""}` +
    ORG.sameAs.map((u) => `<a href="${u}" rel="me">${esc(new URL(u).hostname.replace("www.", ""))}</a>`).join(" · ") +
    `</p></footer></div>`
  );
}

// ---------------------------------------------------------------- <head>

function headHtml(r: RouteSeo, lojas: Loja[]): string {
  const url = canonicalUrl(r.path);
  return [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Logotipo da Orion Chocolates: chocolates finos em Blumenau desde 1958" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
    `<meta name="geo.region" content="BR-SC" />`,
    `<meta name="geo.placename" content="Blumenau" />`,
    `<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />`,
    jsonLd(r, lojas),
  ].join("\n  ");
}

const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

function renderPage(template: string, r: RouteSeo, lojas: Loja[]): string {
  if (!SEO_BLOCK.test(template)) throw new Error("[seo] index.html sem o bloco <!-- seo:start --> ... <!-- seo:end -->");
  return template
    .replace(SEO_BLOCK, `<!-- seo:start -->\n  ${headHtml(r, lojas)}\n  <!-- seo:end -->`)
    .replace('<div id="root"></div>', `<div id="root">${shellHtml(r, lojas)}</div>`);
}

function renderFallback(template: string): string {
  const home = ROUTES[0];
  return template.replace(
    SEO_BLOCK,
    `<!-- seo:start -->\n  <title>${esc(home.title)}</title>\n  <meta name="description" content="${esc(home.description)}" />\n  <meta name="robots" content="noindex, follow" />\n  <!-- seo:end -->`,
  );
}

// ---------------------------------------------------------------- arquivos de descoberta

function robotsTxt(): string {
  // Política escolhida: tudo liberado, inclusive bots de treino de IA, para
  // maximizar presença da marca em buscadores e respostas de IA. Para sair do
  // treino e continuar nas buscas de IA, troque "Allow" por "Disallow" em
  // GPTBot, ClaudeBot, Google-Extended, Applebot-Extended e CCBot.
  const bots = [
    "# Buscadores",
    "Googlebot",
    "Bingbot",
    "Applebot",
    "DuckDuckBot",
    "# Busca e citação em assistentes de IA",
    "OAI-SearchBot",
    "ChatGPT-User",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "DuckAssistBot",
    "meta-externalagent",
    "Meta-ExternalFetcher",
    "Amazonbot",
    "# Treino de modelos de IA",
    "GPTBot",
    "ClaudeBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "AI2Bot",
    "Bytespider",
  ];
  const blocks = bots
    .map((b) => (b.startsWith("#") ? `\n${b}` : `User-agent: ${b}\nAllow: /\nDisallow: /api/\n`))
    .join("\n");
  return `# robots.txt — ${SITE_URL}\n${blocks}\n\n# Demais robôs\nUser-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function sitemapXml(): string {
  const urls = ROUTES.map(
    (r) =>
      `  <url>\n    <loc>${canonicalUrl(r.path)}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function fatosEssenciais(lojas: Loja[]): string {
  return [
    `- Fundação: 1958, em Blumenau (Santa Catarina, Brasil), por Ewald e Nina Hoeltgebaum.`,
    `- Atividade: fabricação e venda de chocolates finos, bombons, trufas, tabletes e presentes.`,
    `- Lojas próprias: ${lojas.length}, ambas em Blumenau (SC).`,
    `- Vendas para empresas: condições especiais para presentes corporativos e revenda, com orçamento personalizado.`,
    ...(ORG.email ? [`- E-mail: ${ORG.email}`] : []),
    ...ORG.sameAs.map((u) => `- Perfil oficial: ${u}`),
  ].join("\n");
}

function llmsTxt(lojas: Loja[]): string {
  const paginas = ROUTES.filter((r) => r.priority >= 0.5)
    .map((r) => `- [${r.breadcrumb}](${canonicalUrl(r.path)}): ${r.description}`)
    .join("\n");
  const legais = ROUTES.filter((r) => r.priority < 0.5)
    .map((r) => `- [${r.breadcrumb}](${canonicalUrl(r.path)}): ${r.description}`)
    .join("\n");
  const lojasTxt = lojas
    .map((l) => `- ${l.nome}: ${l.endereco}. ${horarioTexto(l)}.${l.telefone ? ` Telefone ${l.telefone}.` : ""}`)
    .join("\n");
  return `# ${ORG.name}

> ${ORG.description}

${t.hero.lead}

## Fatos essenciais

${fatosEssenciais(lojas)}

## Lojas

${lojasTxt}

## Páginas

${paginas}

## Referência completa

- [Conteúdo completo em texto](${SITE_URL}/llms-full.txt): história, produtos, catálogo, lojas, entrega, pagamento e perguntas frequentes em um único arquivo.

## Optional

${legais}
`;
}

function llmsFullTxt(lojas: Loja[]): string {
  const catalogo = [...carregaCatalogo().entries()]
    .sort(([a], [b]) => Number(a.startsWith("Sazonais")) - Number(b.startsWith("Sazonais")) || a.localeCompare(b, "pt"))
    .map(([grupo, nomes]) => `### ${grupo}\n\n${nomes.map((n) => `- ${n}`).join("\n")}`)
    .join("\n\n");
  const h = t.nossaHistoria;
  const lojasTxt = lojas
    .map(
      (l) =>
        `### ${l.nome}\n\n- Endereço: ${l.endereco}\n- Horário da loja: ${horarioTexto(l)}\n` +
        (l.telefone ? `- Telefone: ${l.telefone}\n` : "") +
        (l.whatsapp ? `- WhatsApp: ${l.whatsapp}\n` : "") +
        (l.mapsUrl ? `- Mapa: ${l.mapsUrl}\n` : "") +
        `- Faz entregas: ${l.atendeDelivery ? "sim" : "não"}`,
    )
    .join("\n\n");
  const servicos = fs.readFileSync(path.join(ROOT, "src/seo/llms-servicos.md"), "utf8").trim();

  return `# ${ORG.name}: conteúdo completo

> ${ORG.description}

Site oficial: ${SITE_URL}/
Atualizado em: ${BUILD_DATE}

## Resumo

${t.hero.title} ${t.hero.lead}

${fatosEssenciais(lojas)}

## Nossa história

${h.lead}

${h.milestones.map((m) => `### ${m.year}: ${m.title}\n\n${m.text}`).join("\n\n")}

### Missão, visão e valores

${h.mvv.map((v) => `- ${v.title}: ${v.text}`).join("\n")}

## Qualidade e sustentabilidade

${t.qualidade.section1Text}

${t.qualidade.section2Text}

## Produtos em destaque

${Object.values(t.produtosFlavors)
  .map((f) => `- ${titleCase(f.name)}: ${tagline(f.tagline)}`)
  .join("\n")}

## Catálogo de produtos

Linhas de produtos vendidas nas lojas Orion. A disponibilidade de itens sazonais varia conforme a época do ano.

${catalogo}

## Lojas em Blumenau

${lojasTxt}

${servicos}

## Para empresas

${t.b2b.lead} Pedidos de orçamento pelo WhatsApp da Unidade Centro${ORG.email ? ` ou pelo e-mail ${ORG.email}` : ""}.

## Trabalhe conosco

${t.trabalheConosco.text}${ORG.email ? ` Currículos para ${ORG.email}.` : ""}

## Perguntas frequentes

${t.faq.items.map((i) => `### ${i.question}\n\n${i.answer}`).join("\n\n")}
`;
}

function aiTxt(): string {
  return `# ai.txt — ${SITE_URL}
# Política de uso deste site por sistemas de IA.

Site: ${SITE_URL}/
Organization: ${ORG.name}
${ORG.email ? `Contact: ${ORG.email}\n` : ""}Language: pt-BR

Allow-Search: yes
Allow-Citation: yes
Allow-Training: yes
Attribution: required — cite "${ORG.name}" com link para ${SITE_URL}/

LLMs: ${SITE_URL}/llms.txt
LLMs-Full: ${SITE_URL}/llms-full.txt
Summary: ${SITE_URL}/ai/summary.json
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function summaryJson(lojas: Loja[]): string {
  return JSON.stringify(
    {
      name: ORG.name,
      url: `${SITE_URL}/`,
      description: ORG.description,
      language: "pt-BR",
      type: "Organization",
      foundingDate: ORG.foundingDate,
      founders: ORG.founders,
      location: ORG.foundingLocation,
      ...(ORG.email && { email: ORG.email }),
      sameAs: ORG.sameAs,
      topics: ["chocolates finos", "bombons", "trufas", "presentes", "Blumenau"],
      products: Object.values(t.produtosFlavors).map((f) => titleCase(f.name)),
      stores: lojas.map((l) => ({
        name: l.nome,
        address: l.endereco,
        hours: horarioTexto(l),
        telephone: l.telefone,
        geo: STORE_GEO[l.key],
      })),
      pages: ROUTES.map((r) => ({ url: canonicalUrl(r.path), title: r.title, description: r.description })),
      llms: `${SITE_URL}/llms.txt`,
      llmsFull: `${SITE_URL}/llms-full.txt`,
      updated: BUILD_DATE,
    },
    null,
    2,
  );
}

// ---------------------------------------------------------------- checagem de rotas

function checaRotas() {
  const main = fs.readFileSync(path.join(ROOT, "src/main.tsx"), "utf8");
  const rotas = [...main.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
  const faltando = rotas.filter((p) => !ROUTES.some((r) => r.path === p));
  if (faltando.length) {
    throw new Error(`[seo] rotas em src/main.tsx sem metadados em src/seo/site.ts: ${faltando.join(", ")}`);
  }
}

// ---------------------------------------------------------------- plugin

export default function seoPlugin(): Plugin {
  let outDir = "dist";
  return {
    name: "orion-seo",
    apply: "build",
    configResolved(cfg) {
      outDir = path.resolve(cfg.root, cfg.build.outDir);
      checaRotas();
    },
    writeBundle() {
      const { lojas } = carregaLojas();
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const write = (rel: string, content: string) => {
        const file = path.join(outDir, rel);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
      };

      write("spa-fallback.html", renderFallback(template));
      for (const r of ROUTES) {
        // /produtos -> produtos.html (servido em /produtos via "cleanUrls" no vercel.json).
        write(r.path === "/" ? "index.html" : `${r.path.slice(1)}.html`, renderPage(template, r, lojas));
      }
      write("robots.txt", robotsTxt());
      write("sitemap.xml", sitemapXml());
      write("llms.txt", llmsTxt(lojas));
      write("llms-full.txt", llmsFullTxt(lojas));
      write(".well-known/ai.txt", aiTxt());
      write("ai/summary.json", summaryJson(lojas));
    },
  };
}
