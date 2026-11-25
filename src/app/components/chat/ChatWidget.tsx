// Entry point do widget: botão flutuante + painel aberto.
// Montagem recomendada: fora de <App /> (ex.: em src/main.tsx), para não
// herdar transforms do canvas do site.
import { useEffect, useState } from "react";
import ChatPanel, { type MensagemPendente } from "./ChatPanel";
import { EVENTO_ABRIR_CHAT } from "./abrirChat";

export default function ChatWidget() {
  const [aberto, setAberto] = useState(false);
  const [pendente, setPendente] = useState<MensagemPendente | null>(null);

  // Links do site (abrirChat) abrem o painel e já enviam a opção do menu.
  useEffect(() => {
    const onAbrir = (e: Event) => {
      const texto = (e as CustomEvent<string>).detail;
      setAberto(true);
      if (texto) setPendente({ id: Date.now(), texto });
    };
    window.addEventListener(EVENTO_ABRIR_CHAT, onAbrir);
    return () => window.removeEventListener(EVENTO_ABRIR_CHAT, onAbrir);
  }, []);

  return (
    <>
      {aberto ? (
        <ChatPanel onFechar={() => setAberto(false)} pendente={pendente} onPendenteEnviada={() => setPendente(null)} />
      ) : null}
      <button
        type="button"
        aria-label={aberto ? "Fechar chat" : "Abrir chat"}
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
        className="fixed bottom-4 right-4 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-[#532118] text-[#e29647] shadow-xl transition hover:bg-[#3d2226]"
      >
        {aberto ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  );
}
