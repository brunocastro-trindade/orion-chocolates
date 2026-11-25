import { describe, expect, it } from "vitest";
import { buscaProdutos, detalharProduto, fichaParaModelo } from "../api/_lib/data/buscaProdutos";

describe("buscaProdutos", () => {
  it("acha pão de mel mesmo sem acento", () => {
    const r = buscaProdutos("pao de mel");
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].nome.toLowerCase()).toContain("pão de mel");
  });

  it("filtra por categoria", () => {
    const r = buscaProdutos("chocolate", "tablete");
    for (const item of r) expect(item.categoria).toBe("tablete");
  });

  it("devolve ficha completa via sku", () => {
    const p = detalharProduto("EXEMPLO-001");
    expect(p).not.toBeNull();
    expect(p?.contem_gluten).toBe(true);
  });

  it("lê soja, ovo, pode_conter e adoçante", () => {
    const p = detalharProduto("EXEMPLO-002");
    expect(p?.contem_soja).toBe(true);
    expect(p?.contem_ovo).toBe(false);
    expect(p?.pode_conter).toContain("leite");
    expect(p?.adocante).toBe("");
  });
});

describe("fichaParaModelo", () => {
  it("remove campos de alergia quando não confirmados", () => {
    const p = detalharProduto("EXEMPLO-001");
    if (!p) throw new Error("fixture ausente");
    const ficha = fichaParaModelo({ ...p, info_alergenos_confirmada: false });
    expect(ficha.ingredientes).toBeUndefined();
    expect(ficha.contem_gluten).toBeUndefined();
    expect(ficha.pode_conter).toBeUndefined();
    expect(String(ficha.alergenos)).toContain("NÃO CONFIRMADOS");
  });

  it("mantém a ficha completa quando confirmada", () => {
    const p = detalharProduto("EXEMPLO-001");
    if (!p) throw new Error("fixture ausente");
    const ficha = fichaParaModelo({ ...p, info_alergenos_confirmada: true });
    expect(ficha.contem_soja).toBe(true);
    expect(ficha.alergenos).toBeUndefined();
  });
});
