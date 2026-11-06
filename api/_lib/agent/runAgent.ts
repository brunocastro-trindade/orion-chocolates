// Loop do agente: chama o modelo, resolve tool_use localmente, repete até
// receber end_turn, e emite os pedaços como eventos SSE para o cliente.
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../env";
import { systemPrompt } from "./systemPrompt";
import { TOOLS, executaTool } from "./tools";
import { detectaIntencao } from "../guardrails/detectaAlergia";
import { avisoAlergia } from "../guardrails/avisoAlergia";
import { filtraSaida } from "../guardrails/filtraSaida";
import { estaAberto } from "../guardrails/estaAberto";
import { geraLinkWhatsapp } from "../handoff/geraLinkWhatsapp";
import { carregaConfig } from "../data/carregaConfig";
import type { Message } from "../schemas";

type Evento =
  | { tipo: "delta"; texto: string }
  | { tipo: "action"; url: string; label: string }
  | { tipo: "error"; mensagem: string }
  | { tipo: "done" };

export async function* runAgent(historico: Message[]): AsyncGenerator<Evento> {
  const { ANTHROPIC_API_KEY, ANTHROPIC_MODEL } = env();
  const { mensagens } = carregaConfig();
  const ultima = historico[historico.length - 1];
  const intencao = detectaIntencao(ultima?.content ?? "");

  // Assunto que sempre vai pro humano: curto-circuito, sem chamar o modelo.
  if (intencao.assuntoHumano) {
    const link = geraLinkWhatsapp({
      motivo: "Dúvida que precisa da equipe",
      resumo: ultima?.content.slice(0, 200) ?? "",
    });
    yield { tipo: "delta", texto: mensagens.informacao_ausente };
    yield { tipo: "action", url: link.url, label: link.label };
    if (!estaAberto()) yield { tipo: "delta", texto: `\n\n${mensagens.fora_horario}` };
    yield { tipo: "done" };
    return;
  }

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  type ApiMsg = { role: "user" | "assistant"; content: unknown };
  const msgs: ApiMsg[] = historico.map((m) => ({ role: m.role, content: m.content }));

  // Curto-circuito simples do system prompt + knowledge para cache.
  const systemBlocks = [
    { type: "text" as const, text: systemPrompt(), cache_control: { type: "ephemeral" as const } },
  ];

  let pendingHandoff: { url: string; label: string } | null = null;
  let textoCompleto = "";

  for (let passo = 0; passo < 6; passo++) {
    const resp = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      // Teto, não alvo: só tokens gerados são cobrados. 400 cortava respostas
      // de alergia no meio da frase quando havia tool_use de handoff.
      max_tokens: 1024,
      system: systemBlocks,
      tools: TOOLS,
      messages: msgs as Anthropic.MessageParam[],
    });

    const blocosAssistant: Anthropic.ContentBlockParam[] = [];
    const toolUses: Anthropic.ToolUseBlock[] = [];
    for (const bloco of resp.content) {
      if (bloco.type === "text") {
        blocosAssistant.push({ type: "text", text: bloco.text });
        textoCompleto += bloco.text;
      } else if (bloco.type === "tool_use") {
        blocosAssistant.push(bloco);
        toolUses.push(bloco);
      }
    }
    msgs.push({ role: "assistant", content: blocosAssistant });

    if (resp.stop_reason === "end_turn" || toolUses.length === 0) break;

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const uso of toolUses) {
      const r = executaTool(uso.name, uso.input as Record<string, unknown>);
      if (r.handoff) pendingHandoff = r.handoff;
      toolResults.push({ type: "tool_result", tool_use_id: uso.id, content: r.conteudo });
    }
    msgs.push({ role: "user", content: toolResults });
  }

  // Guardrails de saída: alergia e termos proibidos.
  const filtrado = filtraSaida(textoCompleto, intencao.modoAlergia);
  let finalTexto = filtrado.texto;
  if (intencao.modoAlergia) finalTexto = `${finalTexto}\n\n${avisoAlergia()}`;

  yield { tipo: "delta", texto: finalTexto };

  // Handoff: ativa quando o modelo pediu, quando a resposta foi bloqueada ou quando é modo alergia.
  const precisaHandoff = pendingHandoff || filtrado.tipo === "bloqueado" || intencao.modoAlergia;
  if (precisaHandoff) {
    const link = pendingHandoff ?? geraLinkWhatsapp({
      motivo: intencao.modoAlergia ? "Dúvida sobre alergia/restrição" : "Contato",
      resumo: ultima?.content.slice(0, 200) ?? "",
    });
    yield { tipo: "action", url: link.url, label: link.label };
    if (!estaAberto()) yield { tipo: "delta", texto: `\n\n${mensagens.fora_horario}` };
  }

  yield { tipo: "done" };
}
