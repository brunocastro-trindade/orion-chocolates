import { describe, expect, it } from "vitest";
import { categoria, converteProdutos, limpa, paraCsv, type Celula } from "../scripts/planilha/converte";

// Linha no layout da Planilha Sekoia: A código, B nome, C unidade, D datas,
// E tipo, F formato, G descrição, H peso, I preço, J+ (nome, preço, peso).
function linha(parcial: Record<number, Celula>): Celula[] {
  const l: Celula[] = new Array(15).fill(null);
  for (const [i, v] of Object.entries(parcial)) l[Number(i)] = v;
  return l;
}

describe("converteProdutos", () => {
  const { produtos, avisos } = converteProdutos(
    [
      linha({ 0: "B100", 1: "Bomboniere  Sortida", 4: "Ao Leite", 5: "Bombom Maciço", 6: "Bombons ao leite", 9: "Lata (E042)", 10: 92.7, 11: "250g", 12: "Pacote", 13: "R$ 25,45", 14: "140g" }),
      linha({ 0: "B100", 1: "Bomboniere Sortida", 3: "Dia do Namorados; Dia das Mães", 4: "Ao Leite" }),
      linha({ 0: "DB - MA", 5: "Drágeas", 6: "Drágea de Banana" }),
      linha({ 2: "Unidade" }),
    ],
    "2026-11-06",
  );

  it("ignora preço e remove códigos internos das embalagens", () => {
    expect(produtos[0].embalagens).toBe("Lata (250g);Pacote (140g)");
    expect(JSON.stringify(produtos)).not.toMatch(/92|25,45/);
  });

  it("gera SKU único mesmo com código e nome repetidos", () => {
    expect(produtos[0].sku).toBe("B100-bomboniere-sortida");
    expect(produtos[1].sku).toBe("B100-bomboniere-sortida-2");
  });

  it("marca sazonal e corrige o nome da data", () => {
    expect(produtos[1].sazonal).toBe("sim");
    expect(produtos[1].periodo_sazonal).toBe("Dia dos Namorados, Dia das Mães");
  });

  it("usa a descrição como nome quando falta o nome e avisa", () => {
    expect(produtos[2].nome).toBe("Drágea de Banana");
    expect(avisos.some((a) => a.includes("DB - MA"))).toBe(true);
  });

  it("alergênicos sempre como não confirmados", () => {
    for (const p of produtos) expect(p.info_alergenos_confirmada).toBe("nao");
  });

  it("descarta linha sem código e avisa", () => {
    expect(produtos).toHaveLength(3);
    expect(avisos.some((a) => a.includes("sem código"))).toBe(true);
  });
});

describe("auxiliares", () => {
  it("categoria prioriza o formato", () => {
    expect(categoria("Ao Leite", "Drágeas", "Drágea de Caju", false)).toBe("dragea");
    expect(categoria("Ao Leite", "Ovos", "Ovo Trufado", true)).toBe("trufa");
    expect(categoria("Ao Leite", "Ovos", "Ovo de Chocolate", true)).toBe("sazonal");
  });

  it("limpa espaços e CSV escapa vírgula e ponto e vírgula", () => {
    expect(limpa("  Lata   Alta (E051A) ")).toBe("Lata Alta");
    expect(paraCsv([{ a: "x, y", b: "1;2" }], ["a", "b"])).toBe('a,b\n"x, y","1;2"\n');
  });
});
