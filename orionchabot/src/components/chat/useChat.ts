// Estado e consumo do stream do backend.
// Mantém a lista de mensagens, a mensagem do assistant em progresso e a ação
// (botão WhatsApp) que acompanha a resposta atual.
import { useCallback, useMemo, useRef, useState } from "react";
import { streamChat } from "./chatApi";
import type { ChatAction, Message } from "./types";

function uid() {
  return (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random())) as string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [acoes, setAcoes] = useState<Record<string, ChatAction>>({});
  const [opcoes, setOpcoes] = useState<Record<string, string[]>>({});
  const [carregando, setCarregando] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const sessionId = useMemo(() => uid(), []);

  const enviar = useCallback(async (texto: string) => {
    const t = texto.trim();
    if (!t || carregando) return;

    const userMsg: Message = { id: uid(), role: "user", content: t };
    const assistantId = uid();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setCarregando(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const historico = [...messages, userMsg];
      for await (const ev of streamChat(historico, sessionId, ctrl.signal)) {
        if (ev.event === "delta") {
          setMessages((m) =>
            m.map((msg) => (msg.id === assistantId ? { ...msg, content: msg.content + ev.data.text } : msg)),
          );
        } else if (ev.event === "action") {
          setAcoes((a) => ({ ...a, [assistantId]: ev.data }));
        } else if (ev.event === "opcoes") {
          setOpcoes((o) => ({ ...o, [assistantId]: ev.data.opcoes }));
        } else if (ev.event === "error") {
          setMessages((m) =>
            m.map((msg) => (msg.id === assistantId ? { ...msg, content: ev.data.message } : msg)),
          );
        } else if (ev.event === "done") {
          break;
        }
      }
    } catch (e) {
      console.error("[chat] erro:", e);
    } finally {
      setCarregando(false);
      abortRef.current = null;
    }
  }, [messages, sessionId, carregando]);

  const cancelar = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // Volta ao estado inicial: limpa histórico e ações, cancela stream em curso.
  // Usado pelo botão "Voltar ao menu" no header do painel.
  const resetar = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setAcoes({});
    setOpcoes({});
    setCarregando(false);
  }, []);

  return { messages, acoes, opcoes, carregando, enviar, cancelar, resetar };
}
