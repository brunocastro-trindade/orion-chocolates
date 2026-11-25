// Fonte única dos metadados de SEO/GEO do site.
//
// Usado em dois lugares:
//  - no build (scripts/vite-plugin-seo.ts): gera um index.html por rota com
//    <title>, meta, canonical, Open Graph, JSON-LD e um conteúdo HTML estático
//    (o site é SPA; sem isso, crawlers de IA que não executam JS veem página vazia);
//  - no navegador (src/seo/SeoManager.tsx): atualiza title/description/canonical
//    a cada navegação client-side.
//
// Ao criar uma rota nova em src/main.tsx, cadastre-a em ROUTES. O build falha
// se encontrar uma rota em main.tsx que não esteja aqui.
//
// Não importar nada de browser aqui (window, document, CSS, imagens).

export const SITE_URL = "https://orionchocolatesfinos.com.br";
export const SITE_NAME = "Orion Chocolates";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const ORG: {
  name: string;
  alternateName: string[];
  description: string;
  foundingDate: string;
  founders: string[];
  foundingLocation: string;
  email?: string;
  logo: string;
  sameAs: string[];
} = {
  name: "Orion Chocolates",
  alternateName: ["ORION Chocolates Finos", "Chocolates Orion"],
  description:
    "Fábrica de chocolates finos fundada em 1958 por Ewald e Nina Hoeltgebaum em Blumenau (SC), com duas lojas próprias na cidade: Centro e Shopping Park Europeu.",
  foundingDate: "1958",
  founders: ["Ewald Hoeltgebaum", "Nina Hoeltgebaum"],
  foundingLocation: "Blumenau, Santa Catarina, Brasil",
  // E-mail de contato em aberto (o domínio novo é orionchocolatesfinos.com.br).
  // Quando definido, entra no schema, no llms.txt, no ai.txt e no HTML estático.
  email: undefined,
  logo: `${SITE_URL}/logo-512.png`,
  // Perfis oficiais. Acrescentar Facebook, Google Business Profile, LinkedIn,
  // Wikidata etc. quando existirem — reforçam a entidade para buscadores e IAs.
  sameAs: ["https://instagram.com/chocolatesorion", "https://linktr.ee/chocolatesorion"],
};

export type RouteSeo = {
  path: string;
  title: string;
  description: string;
  /** "website" na home, "article" não se aplica aqui. */
  ogType?: "website";
  /** Nome curto usado no breadcrumb. */
  breadcrumb: string;
  /** Prioridade/frequência para o sitemap. */
  priority: number;
  changefreq: "weekly" | "monthly" | "yearly";
};

export const ROUTES: RouteSeo[] = [
  {
    path: "/",
    title: "Orion Chocolates | Chocolates finos em Blumenau desde 1958",
    description:
      "Desde 1958, a Orion Chocolates produz chocolates finos em Blumenau (SC). Conheça nossos sabores, nossas lojas no Centro e no Shopping Park Europeu e as condições para empresas.",
    ogType: "website",
    breadcrumb: "Início",
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "/produtos",
    title: "Produtos | Orion Chocolates — chocolates finos de Blumenau",
    description:
      "Chocolates finos Orion em destaque, incluindo edições sazonais. Bombons, tabletes, trufas e presentes produzidos em Blumenau (SC) desde 1958.",
    breadcrumb: "Produtos",
    priority: 0.9,
    changefreq: "weekly",
  },
  {
    path: "/nossa-historia",
    title: "Nossa história | Orion Chocolates, Blumenau desde 1958",
    description:
      "Fundada em 1958 por Ewald e Nina Hoeltgebaum, a Orion Chocolates atravessa gerações em Blumenau: a fábrica de 1974, a enchente de 1980 e a loja de 2010.",
    breadcrumb: "Nossa história",
    priority: 0.8,
    changefreq: "yearly",
  },
  {
    path: "/qualidade",
    title: "Qualidade e sustentabilidade | Orion Chocolates",
    description:
      "Como a Orion Chocolates cuida da qualidade em cada etapa, da seleção dos ingredientes à produção, com uso consciente de recursos e respeito às pessoas.",
    breadcrumb: "Qualidade",
    priority: 0.6,
    changefreq: "yearly",
  },
  {
    path: "/trabalhe-conosco",
    title: "Trabalhe conosco | Orion Chocolates",
    description:
      "Faça parte da equipe Orion Chocolates em Blumenau (SC). Envie seu currículo e construa sua trajetória em uma empresa com mais de 65 anos de tradição.",
    breadcrumb: "Trabalhe conosco",
    priority: 0.5,
    changefreq: "monthly",
  },
  {
    path: "/politica-de-privacidade",
    title: "Política de Privacidade | Orion Chocolates",
    description: "Como a Orion Chocolates coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
    breadcrumb: "Política de Privacidade",
    priority: 0.2,
    changefreq: "yearly",
  },
  {
    path: "/politica-de-cookies",
    title: "Política de Cookies | Orion Chocolates",
    description: "Quais cookies o site da Orion Chocolates utiliza e como você pode gerenciá-los.",
    breadcrumb: "Política de Cookies",
    priority: 0.2,
    changefreq: "yearly",
  },
  {
    path: "/termos-de-uso",
    title: "Termos de Uso | Orion Chocolates",
    description: "Termos e condições de uso do site da Orion Chocolates.",
    breadcrumb: "Termos de Uso",
    priority: 0.2,
    changefreq: "yearly",
  },
];

export function canonicalUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export function findRoute(pathname: string): RouteSeo | undefined {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return ROUTES.find((r) => r.path === clean);
}
