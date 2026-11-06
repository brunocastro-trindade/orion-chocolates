import { describe, expect, it } from "vitest";
import { ChatRequestSchema } from "../api/_lib/schemas";
import { cortaHistorico } from "../api/_lib/guardrails/limites";

const sessionId = "8f14e45f-ceea-4e7a-9b4b-2f1d3c5a6b7c";
const conversa = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ role: i % 2 === 0 ? ("user" as const) : ("assistant" as const), content: `msg ${i}` }));

describe("ChatRequestSchema", () => {
  it("aceita resposta longa do bot no histórico (lista de produtos)", () => {
    const messages = [{ role: "user" as const, content: "oi" }, { role: "assistant" as const, content: "x".repeat(1500) }, { role: "user" as const, content: "ovos de páscoa" }];
    expect(ChatRequestSchema.safeParse({ messages, sessionId }).success).toBe(true);
  });

  it("aceita conversa com mais de 10 mensagens", () => {
    expect(ChatRequestSchema.safeParse({ messages: conversa(21), sessionId }).success).toBe(true);
  });

  it("mantém o limite de 500 caracteres na mensagem nova do cliente", () => {
    const messages = [{ role: "user" as const, content: "x".repeat(501) }];
    expect(ChatRequestSchema.safeParse({ messages, sessionId }).success).toBe(false);
  });

  it("rejeita quando a última mensagem não é do cliente", () => {
    expect(ChatRequestSchema.safeParse({ messages: conversa(2), sessionId }).success).toBe(false);
  });
});

describe("cortaHistorico", () => {
  it("corta e sempre começa pelo cliente", () => {
    const r = cortaHistorico(conversa(21));
    expect(r.length).toBeLessThanOrEqual(10);
    expect(r[0].role).toBe("user");
    expect(r[r.length - 1].content).toBe("msg 20");
  });
});
