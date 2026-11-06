// Busca tolerante a acentos e erros simples de digitação sobre o catálogo.
// Objetivo: um "pao de mel" achar "Pão de Mel"; "sem acucar" achar "sem-acucar".
import { carregaProdutos } from "./carregaProdutos";
import type { Produto } from "../schemas";

export type ResumoProduto = Pick<Produto, "sku" | "nome" | "categoria"> & {
  resumo: string;
};

export function buscaProdutos(consulta: string, categoria?: string, limite = 8): ResumoProduto[] {
  const q = normaliza(consulta);
  const todos = carregaProdutos();
  const filtrados = categoria
    ? todos.filter((p) => p.categoria === categoria)
    : todos;

  const pontuados = filtrados
    .map((p) => ({ p, score: pontua(p, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite);

  return pontuados.map(({ p }) => ({
    sku: p.sku,
    nome: p.nome,
    categoria: p.categoria,
    resumo: p.descricao.slice(0, 140),
  }));
}

export function detalharProduto(sku: string): Produto | null {
  const todos = carregaProdutos();
  return todos.find((p) => p.sku === sku) ?? null;
}

const CAMPOS_ALERGIA = [
  "ingredientes",
  "contem_gluten",
  "contem_leite",
  "oleaginosas_na_receita",
  "contem_soja",
  "contem_ovo",
  "pode_conter",
  "adocante",
  "sem_acucar",
  "sem_lactose",
] as const;

// Ficha enviada ao modelo. Sem conferência da equipe, os campos de alergia
// saem da ficha para o modelo não ter o que afirmar e ser forçado ao handoff.
export function fichaParaModelo(p: Produto): Record<string, unknown> {
  if (p.info_alergenos_confirmada) return p;
  const ficha: Record<string, unknown> = { ...p };
  for (const campo of CAMPOS_ALERGIA) delete ficha[campo];
  ficha.alergenos = "NÃO CONFIRMADOS pela equipe: não responda sobre composição ou alergia deste produto; chame gerar_handoff.";
  return ficha;
}

function normaliza(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Pontuação simples: match no nome vale mais, depois categoria, depois descrição e ingredientes.
// Cada palavra da consulta soma pontos quando aparece como substring nos campos.
function pontua(p: Produto, q: string): number {
  if (!q) return 0;
  const alvo = {
    nome: normaliza(p.nome),
    categoria: normaliza(p.categoria),
    descricao: normaliza(p.descricao),
    ingredientes: normaliza(p.ingredientes),
  };
  const palavras = q.split(" ").filter(Boolean);
  let s = 0;
  for (const w of palavras) {
    if (alvo.nome.includes(w)) s += 5;
    if (alvo.categoria.includes(w)) s += 3;
    if (alvo.descricao.includes(w)) s += 2;
    if (alvo.ingredientes.includes(w)) s += 1;
  }
  return s;
}
