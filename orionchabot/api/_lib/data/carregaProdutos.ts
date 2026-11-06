// Lê e valida data/produtos.csv. Linhas inválidas são descartadas e registradas.
// Carregamento é cacheado por processo: a função Vercel reaproveita entre invocações quentes.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ProdutoSchema, type Produto } from "../schemas";

let cache: Produto[] | null = null;

export function carregaProdutos(): Produto[] {
  if (cache) return cache;
  // PRODUTOS_CSV só é usado nos testes (fixture fixa, independente do catálogo).
  const caminho = process.env.PRODUTOS_CSV ?? join(process.cwd(), "data", "produtos.csv");
  const raw = readFileSync(caminho, "utf8").replace(/^﻿/, "");
  const sep = detectaSeparador(raw);
  const linhas = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (linhas.length < 2) {
    cache = [];
    return cache;
  }
  const header = parseLinha(linhas[0], sep);
  const produtos: Produto[] = [];
  for (let i = 1; i < linhas.length; i++) {
    const cols = parseLinha(linhas[i], sep);
    if (cols.length !== header.length) continue;
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => (obj[h] = cols[idx] ?? ""));
    const parsed = ProdutoSchema.safeParse(obj);
    if (!parsed.success) {
      console.warn(`[produtos] linha ${i + 1} inválida: ${parsed.error.message}`);
      continue;
    }
    if (parsed.data.ativo) produtos.push(parsed.data);
  }
  cache = produtos;
  return cache;
}

function detectaSeparador(csv: string): string {
  const linha1 = csv.split(/\r?\n/)[0] ?? "";
  return (linha1.match(/;/g)?.length ?? 0) > (linha1.match(/,/g)?.length ?? 0) ? ";" : ",";
}

// CSV parser mínimo com suporte a aspas duplas e separador configurável.
// Evita dep de uma lib externa só para isso.
function parseLinha(linha: string, sep: string): string[] {
  const out: string[] = [];
  let atual = "";
  let dentroAspas = false;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (dentroAspas) {
      if (c === '"' && linha[i + 1] === '"') {
        atual += '"';
        i++;
      } else if (c === '"') {
        dentroAspas = false;
      } else {
        atual += c;
      }
    } else {
      if (c === '"') dentroAspas = true;
      else if (c === sep) {
        out.push(atual);
        atual = "";
      } else atual += c;
    }
  }
  out.push(atual);
  return out;
}
