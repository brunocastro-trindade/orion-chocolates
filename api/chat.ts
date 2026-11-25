// Vercel Function: POST /api/chat
// Recebe o histórico da conversa, aplica guardrails de entrada e devolve
// eventos SSE (delta, action, done, error) consumidos pelo widget.
import { ChatRequestSchema } from "./_lib/schemas";
import { carregaConfig } from "./_lib/data/carregaConfig";
import { cortaHistorico, dentroRateLimit } from "./_lib/guardrails/limites";
import { runAgent } from "./_lib/agent/runAgent";
import { env } from "./_lib/env";

// Declaração inline em vez de @vercel/node, para a função ser portável.
type Req = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> };
type Res = {
  status(code: number): Res;
  setHeader(name: string, value: string): Res;
  write(chunk: string): boolean;
  end(data?: string): void;
};

export default async function handler(req: Req, res: Res) {
  const { ALLOWED_ORIGIN } = env();
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const ip = String(req.headers["x-forwarded-for"] ?? req.headers["x-real-ip"] ?? "anon").split(",")[0].trim();
  if (!dentroRateLimit(ip)) {
    res.status(429).end();
    return;
  }

  const parsed = ChatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).end();
    return;
  }

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const { mensagens } = carregaConfig();
  const historico = cortaHistorico(parsed.data.messages);

  try {
    for await (const ev of runAgent(historico)) {
      if (ev.tipo === "delta") escreveSSE(res, "delta", { text: ev.texto });
      else if (ev.tipo === "action") escreveSSE(res, "action", { type: "whatsapp", url: ev.url, label: ev.label });
      else if (ev.tipo === "opcoes") escreveSSE(res, "opcoes", { opcoes: ev.opcoes });
      else if (ev.tipo === "error") escreveSSE(res, "error", { message: ev.mensagem });
      else if (ev.tipo === "done") escreveSSE(res, "done", {});
    }
    res.end();
  } catch (e) {
    console.error("[chat] erro no agente:", e);
    escreveSSE(res, "error", { message: mensagens.falha_tecnica });
    escreveSSE(res, "done", {});
    res.end();
  }
}

function escreveSSE(res: Res, event: string, data: unknown) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}
