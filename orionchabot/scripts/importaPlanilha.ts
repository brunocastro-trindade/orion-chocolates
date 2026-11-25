// Importa a Planilha Sekoia (fonte provisória do catálogo) para data/produtos.csv.
// Uso: pnpm import:planilha [caminho.xlsx] [saida.csv]
// Rodar manualmente; não faz parte do deploy. Revisar os avisos impressos.
import ExcelJS from "exceljs";
import { writeFileSync } from "node:fs";
import { converteProdutos, paraCsv, type Celula } from "./planilha/converte";

const COLUNAS = [
  "sku", "codigo", "nome", "categoria", "formato", "descricao", "embalagens", "tipo_chocolate_atual", "peso_g",
  "ingredientes", "contem_gluten", "contem_leite", "oleaginosas_na_receita", "contem_soja", "contem_ovo", "pode_conter",
  "adocante", "sem_acucar", "sem_lactose", "info_alergenos_confirmada", "sazonal", "periodo_sazonal", "sob_encomenda",
  "link_delivery", "ativo", "atualizado_em",
];

// Lê a aba Produtos como matriz de valores (pula as 2 linhas de cabeçalho).
async function leAba(caminho: string): Promise<Celula[][]> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(caminho);
  const aba = wb.getWorksheet("Produtos");
  if (!aba) throw new Error('aba "Produtos" não encontrada');
  const linhas: Celula[][] = [];
  aba.eachRow({ includeEmpty: false }, (row, n) => {
    if (n <= 2) return;
    const valores: Celula[] = [];
    for (let c = 1; c <= aba.columnCount; c++) {
      const v = row.getCell(c).value;
      valores.push(typeof v === "string" || typeof v === "number" ? v : v === null ? null : String(row.getCell(c).text));
    }
    linhas.push(valores);
  });
  return linhas;
}

async function main(): Promise<void> {
  const entrada = process.argv[2] ?? "docs/Planilha Sekoia.xlsx";
  const saida = process.argv[3] ?? "data/produtos.csv";
  const hoje = new Date().toISOString().slice(0, 10);
  const { produtos, avisos } = converteProdutos(await leAba(entrada), hoje);
  writeFileSync(saida, paraCsv(produtos, COLUNAS));
  console.log(`${produtos.length} produtos gravados em ${saida}`);
  if (avisos.length) console.log(`\n${avisos.length} avisos para revisar:\n- ${avisos.join("\n- ")}`);
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
