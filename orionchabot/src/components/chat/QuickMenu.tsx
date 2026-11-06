// Menu inicial (P13): 4 botões que enviam o nome da opção; o agente responde
// só o escopo daquela opção (ver MENU INICIAL no systemPrompt).
const OPCOES = [
  { titulo: "Produtos", detalhe: "Linhas e catálogo", icone: "🍫" },
  { titulo: "Contatos", detalhe: "WhatsApp e telefones", icone: "📞" },
  { titulo: "Endereços", detalhe: "Lojas e horários", icone: "📍" },
  { titulo: "Pedidos", detalhe: "Delivery e retirada", icone: "🛵" },
];

export default function QuickMenu({ onEscolher, desativado }: { onEscolher: (texto: string) => void; desativado: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2 px-4 pb-3">
      {OPCOES.map((o) => (
        <button
          key={o.titulo}
          type="button"
          disabled={desativado}
          onClick={() => onEscolher(o.titulo)}
          className="flex items-center gap-2 rounded-xl border border-[#e29647]/60 bg-[#fdf1e3] px-3 py-2 text-left hover:bg-[#f7e2c7] disabled:opacity-50"
        >
          <span aria-hidden="true" className="text-lg">{o.icone}</span>
          <span>
            <span className="block text-sm font-semibold text-[#532118]">{o.titulo}</span>
            <span className="block text-[11px] text-[#532118]/70">{o.detalhe}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
