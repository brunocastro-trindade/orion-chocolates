import { describe, expect, it } from "vitest";
import { respostaProduto } from "../api/_lib/agent/respostaProduto";

describe("respostaProduto", () => {
  it("responde a ficha curta para um produto citado pelo nome", () => {
    const r = respostaProduto("quero um pão de mel");
    expect(r?.texto).toContain("**Pão de Mel Tradicional**");
    expect(r?.texto).toContain("[Ir ao delivery](");
    expect(r?.opcoes).toEqual([]);
  });

  it("nunca mostra preço", () => {
    const r = respostaProduto("tem tablete meio amargo?");
    expect(r?.texto).not.toMatch(/R\$|\d+,\d{2}/);
  });

  it("pede para escolher quando vários produtos casam", () => {
    const r = respostaProduto("vocês têm ovo?");
    expect(r?.opcoes).toEqual(["Ovo de Chocolate ao Leite", "Ovo de Chocolate ao Leite com Bombons Sortidos"]);
  });

  it("nome exato vindo do botão resolve a ambiguidade", () => {
    const r = respostaProduto("Ovo de Chocolate ao Leite");
    expect(r?.texto).toContain("**Ovo de Chocolate ao Leite**");
    expect(r?.texto).toContain("Páscoa");
  });

  it("acha produto sazonal pelo período", () => {
    expect(respostaProduto("ovo de páscoa")?.opcoes.length).toBe(2);
  });

  it("pergunta de preço recebe a ficha com o link do delivery, sem preço", () => {
    const r = respostaProduto("quanto custa o pão de mel?");
    expect(r?.texto).toContain("[Ir ao delivery](");
    expect(r?.texto).not.toMatch(/R\$/);
  });

  it("devolve null quando nada casa ou quando há palavras fora do catálogo", () => {
    expect(respostaProduto("o pão de mel é bom pra presente?")).toBeNull();
    expect(respostaProduto("vocês entregam em Joinville?")).toBeNull();
    expect(respostaProduto("Contatos")).toBeNull();
  });

  it("frase longa vai para o modelo", () => {
    expect(respostaProduto("quero algo parecido com pão de mel mas que seja mais leve e menor")).toBeNull();
  });
});
