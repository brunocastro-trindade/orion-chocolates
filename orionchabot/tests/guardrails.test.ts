import { describe, expect, it } from "vitest";
import { detectaIntencao } from "../api/_lib/guardrails/detectaAlergia";
import { filtraSaida } from "../api/_lib/guardrails/filtraSaida";

describe("detectaIntencao", () => {
  it("ativa modo alergia por glúten", () => {
    expect(detectaIntencao("tem glúten no pão de mel?").modoAlergia).toBe(true);
  });
  it("ativa modo alergia com texto sem acento", () => {
    expect(detectaIntencao("meu filho é celiaco").modoAlergia).toBe(true);
  });
  it("não falsa-positiva em pergunta comum", () => {
    expect(detectaIntencao("qual o endereço da loja?").modoAlergia).toBe(false);
  });
  it("marca assuntoHumano para troca", () => {
    expect(detectaIntencao("quero trocar o produto").assuntoHumano).toBe(true);
  });
});

describe("filtraSaida", () => {
  it("reescreve 'artesanal' para 'fino'", () => {
    const r = filtraSaida("Nosso chocolate artesanal é incrível", false);
    expect(r.tipo).toBe("ok");
    if (r.tipo === "ok") {
      expect(r.texto).toMatch(/\bfino\b/i);
      expect(r.texto).not.toMatch(/artesanal/i);
    }
  });

  it("bloqueia 'é seguro' em contexto de alergia", () => {
    const r = filtraSaida("Este produto é seguro para quem tem alergia", true);
    expect(r.tipo).toBe("bloqueado");
  });

  it("não bloqueia 'é seguro' fora de contexto de alergia", () => {
    const r = filtraSaida("O pagamento é seguro pelo site", false);
    expect(r.tipo).toBe("ok");
  });

  it("bloqueia promessa de reembolso", () => {
    const r = filtraSaida("Vamos reembolsar o valor", false);
    expect(r.tipo).toBe("bloqueado");
  });

  it("bloqueia menção ao cupom de boas-vindas", () => {
    const r = filtraSaida("Use o cupom de boas-vindas", false);
    expect(r.tipo).toBe("bloqueado");
  });
});

describe("filtraSaida preserva formatação", () => {
  it("mantém quebras de linha entre parágrafos e itens", () => {
    const texto = "**Unidade Centro**\n- WhatsApp\n\n**Unidade Park Europeu**\n- Telefone";
    expect(filtraSaida(texto, false).texto).toBe(texto);
  });
});
