// Balão de uma mensagem. Mantém estilos locais (classes Tailwind) para não
// depender de nada do canvas escalado do site.
import type { Message, ChatAction } from "./types";
import WhatsappButton from "./WhatsappButton";
import { renderText } from "./renderText";

type Props = {
  msg: Message;
  acao?: ChatAction;
  opcoes?: string[];
  onEscolher: (texto: string) => void;
  desativado: boolean;
};

// Opções (produtos) só aparecem na última resposta; clicar envia o nome.
export default function MessageBubble({ msg, acao, opcoes, onEscolher, desativado }: Props) {
  const ehUsuario = msg.role === "user";
  return (
    <div className={`flex ${ehUsuario ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          ehUsuario ? "bg-[#532118] text-white" : "bg-[#fdf1e3] text-[#3d2226] border border-amber-100"
        }`}
      >
        <div className="break-words">
          {msg.content ? renderText(msg.content) : (ehUsuario ? "" : "…")}
        </div>
        {opcoes && opcoes.length ? (
          <div className="mt-3 flex flex-col gap-1.5">
            {opcoes.map((o) => (
              <button
                key={o}
                type="button"
                disabled={desativado}
                onClick={() => onEscolher(o)}
                className="rounded-lg border border-[#e29647]/60 bg-white px-3 py-1.5 text-left text-xs font-medium text-[#532118] hover:bg-[#f7e2c7] disabled:opacity-50"
              >
                {o}
              </button>
            ))}
          </div>
        ) : null}
        {acao ? (
          <div className="mt-3">
            <WhatsappButton url={acao.url} label={acao.label} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
