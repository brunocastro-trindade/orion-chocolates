// Painel aberto do chat (header, lista, atalhos e input).
// Fica num container `fixed` isolado — não herda transform do site.
import { useChat } from "./useChat";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import QuickMenu from "./QuickMenu";

// Mesmo texto de config/mensagens.yaml (boas_vindas); o front não lê o YAML.
const BOAS_VINDAS = "Olá! Sou o assistente virtual da Chocolates Orion. Como posso ajudar? 🍫";

export default function ChatPanel({ onFechar }: { onFechar: () => void }) {
  const { messages, acoes, carregando, enviar, resetar } = useChat();

  return (
    <div
      role="dialog"
      aria-label="Assistente da Chocolates Orion"
      className="fixed bottom-24 right-4 z-[9999] flex h-[560px] max-h-[80dvh] w-[360px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
    >
      <header className="flex items-center justify-between bg-gradient-to-r from-[#532118] to-[#8c3a24] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={resetar}
              aria-label="Voltar ao menu inicial"
              title="Voltar ao menu"
              className="rounded-full p-1 hover:bg-white/10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          ) : null}
          <div>
            <p className="text-sm font-semibold leading-tight">Chocolates Orion</p>
            <p className="text-[11px] opacity-90">Assistente virtual</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar chat"
          className="rounded-full p-1 hover:bg-white/10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {messages.length === 0 ? (
        <div className="px-4 pt-4 pb-2 text-sm leading-relaxed text-neutral-700">
          <p>{BOAS_VINDAS}</p>
          <p className="mt-1 text-xs text-neutral-500">Escolha uma opção ou digite sua pergunta.</p>
        </div>
      ) : null}

      <MessageList messages={messages} acoes={acoes} />

      {messages.length === 0 ? <QuickMenu onEscolher={enviar} desativado={carregando} /> : null}

      <ChatInput onEnviar={enviar} desativado={carregando} />
    </div>
  );
}
