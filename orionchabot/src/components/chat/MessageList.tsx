// Lista rolável de mensagens. Auto-scroll para o fim quando novas mensagens
// chegam, usando um ref no último item.
import { useEffect, useRef } from "react";
import type { ChatAction, Message } from "./types";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: Message[];
  acoes: Record<string, ChatAction>;
  opcoes: Record<string, string[]>;
  onEscolher: (texto: string) => void;
  desativado: boolean;
};

export default function MessageList({ messages, acoes, opcoes, onEscolher, desativado }: Props) {
  const fimRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const ultimaId = messages[messages.length - 1]?.id;
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white">
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          msg={m}
          acao={acoes[m.id]}
          opcoes={m.id === ultimaId ? opcoes[m.id] : undefined}
          onEscolher={onEscolher}
          desativado={desativado}
        />
      ))}
      <div ref={fimRef} />
    </div>
  );
}
