// Converte as linhas da aba "Produtos" da Planilha Sekoia em linhas do
// produtos.csv. Layout fixo: A código, B nome, D datas, E tipo, F formato,
// G descrição, H peso base, J+ trios (nome, preço, peso) de embalagem.
// Preço é ignorado de propósito: o bot sempre manda ao delivery.

export type Celula = string | number | null | undefined;
export type LinhaCsv = Record<string, string>;

const COL = { codigo: 0, nome: 1, datas: 3, tipo: 4, formato: 5, descricao: 6, peso: 7, embalagens: 9 };

const CORRECOES: Record<string, string> = { "Dia do Namorados": "Dia dos Namorados" };

// Texto limpo: sem espaços duplicados e sem os códigos internos "(E042)".
export function limpa(v: Celula): string {
  if (v === null || v === undefined) return "";
  return String(v).replace(/\s*\(E\d+\w*\)/g, "").replace(/\s+/g, " ").trim();
}

// Slug para compor o SKU: o código da planilha sozinho não é único.
export function slug(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

// Categoria do bot (enum do schema) a partir de tipo, formato e nome.
export function categoria(tipo: string, formato: string, nome: string, sazonal: boolean): string {
  const t = `${tipo} ${formato} ${nome}`.toLowerCase();
  if (t.includes("pão de mel")) return "pao-de-mel";
  if (t.includes("trufa")) return "trufa";
  if (t.includes("drágea") || t.includes("dragea")) return "dragea";
  if (t.includes("bombom")) return "bombom";
  if (t.includes("tablete") || t.includes("barrinha")) return "tablete";
  if (t.includes("sem adição de açúcar")) return "sem-acucar";
  if (sazonal) return "sazonal";
  if (tipo.toLowerCase().includes("alto teor")) return "alto-cacau";
  if (tipo === "Branco") return "chocolate-branco";
  if (tipo.toLowerCase().includes("ao leite")) return "chocolate-ao-leite";
  return "outro";
}

// Lista "Nome (peso)" das embalagens; ignora a coluna de preço do trio.
function embalagens(linha: Celula[]): string[] {
  const out: string[] = [];
  for (let i = COL.embalagens; i < linha.length; i += 3) {
    const nome = limpa(linha[i]);
    const peso = limpa(linha[i + 2]);
    if (nome) out.push(peso ? `${nome} (${peso})` : nome);
  }
  return out;
}

// Converte todas as linhas; devolve também avisos para revisão humana.
export function converteProdutos(linhas: Celula[][], hoje: string): { produtos: LinhaCsv[]; avisos: string[] } {
  const produtos: LinhaCsv[] = [];
  const avisos: string[] = [];
  const skus = new Set<string>();
  linhas.forEach((linha, i) => {
    const codigo = limpa(linha[COL.codigo]);
    let nome = limpa(linha[COL.nome]);
    if (codigo && !nome && limpa(linha[COL.descricao])) {
      nome = limpa(linha[COL.descricao]);
      avisos.push(`linha ${i + 3} (${codigo}): sem nome, usando a descrição`);
    }
    if (!codigo || !nome) {
      if (linha.some((c) => limpa(c))) avisos.push(`linha ${i + 3}: sem código ou nome`);
      return;
    }
    const datas = limpa(linha[COL.datas]).split(";").map((d) => CORRECOES[d.trim()] ?? d.trim()).filter(Boolean);
    const tipo = limpa(linha[COL.tipo]);
    const formato = limpa(linha[COL.formato]);
    let sku = `${codigo}-${slug(nome)}`;
    for (let n = 2; skus.has(sku); n++) sku = `${codigo}-${slug(nome)}-${n}`;
    skus.add(sku);
    const descricao = limpa(linha[COL.descricao]);
    if (!descricao) avisos.push(`linha ${i + 3} (${codigo}): sem descrição, usando o nome`);
    const tipoMin = tipo.toLowerCase();
    produtos.push({
      sku,
      codigo,
      nome,
      categoria: categoria(tipo, formato, nome, datas.length > 0),
      formato,
      descricao: descricao || nome,
      embalagens: embalagens(linha).join(";"),
      tipo_chocolate_atual: tipo,
      peso_g: /^\d+\s*g$/i.test(limpa(linha[COL.peso])) ? limpa(linha[COL.peso]).replace(/\D/g, "") : "",
      sem_acucar: tipoMin.includes("sem adição de açúcar") ? "sim" : "",
      sem_lactose: tipoMin.includes("sem lactose") ? "sim" : "",
      info_alergenos_confirmada: "nao",
      sazonal: datas.length > 0 ? "sim" : "nao",
      periodo_sazonal: datas.join(", "),
      sob_encomenda: "nao",
      ativo: "sim",
      atualizado_em: hoje,
    });
  });
  return { produtos, avisos };
}

// Serializa em CSV com aspas quando necessário.
export function paraCsv(linhas: LinhaCsv[], colunas: string[]): string {
  const esc = (v: string) => (/[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [colunas.join(","), ...linhas.map((l) => colunas.map((c) => esc(l[c] ?? "")).join(","))].join("\n") + "\n";
}
