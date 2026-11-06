// Definição e execução das ferramentas do agente.
// Cada ferramenta recebe `input` já parseado pela Anthropic SDK e devolve
// o JSON serializado que o modelo vê como `tool_result`.
import { buscaProdutos, detalharProduto, fichaParaModelo } from "../data/buscaProdutos";
import { carregaConfig } from "../data/carregaConfig";
import { geraLinkWhatsapp } from "../handoff/geraLinkWhatsapp";

export type ToolDef = {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};

export const TOOLS: ToolDef[] = [
  {
    name: "buscar_produtos",
    description: "Busca produtos por texto. Devolve até N resumos (sku, nome, categoria, resumo).",
    input_schema: {
      type: "object",
      properties: {
        consulta: { type: "string" },
        categoria: { type: "string", description: "Opcional. Filtra por categoria exata." },
        limite: { type: "number", description: "Opcional. Default 6." },
      },
      required: ["consulta"],
    },
  },
  {
    name: "detalhar_produto",
    description: "Ficha completa de um produto pelo sku.",
    input_schema: {
      type: "object",
      properties: { sku: { type: "string" } },
      required: ["sku"],
    },
  },
  {
    name: "info_lojas",
    description: "Endereços, telefones e horários das lojas, vindos da configuração oficial.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "consultar_politica",
    description: "Texto oficial por tema: pagamento, entrega-retirada, trocas, conservacao, sazonais-encomendas, fidelidade, lojas, alergenos.",
    input_schema: {
      type: "object",
      properties: { tema: { type: "string" } },
      required: ["tema"],
    },
  },
  {
    name: "gerar_handoff",
    description: "Gera link wa.me com mensagem pré-preenchida para escalar ao atendimento humano.",
    input_schema: {
      type: "object",
      properties: {
        motivo: { type: "string" },
        resumo: { type: "string" },
        produto: { type: "string" },
        numero_pedido: { type: "string" },
      },
      required: ["motivo", "resumo"],
    },
  },
];

export type ToolResult = { conteudo: string; handoff?: { url: string; label: string } };

export function executaTool(nome: string, input: Record<string, unknown>): ToolResult {
  switch (nome) {
    case "buscar_produtos": {
      const consulta = String(input.consulta ?? "");
      const categoria = typeof input.categoria === "string" ? input.categoria : undefined;
      const limite = typeof input.limite === "number" ? input.limite : 6;
      return { conteudo: JSON.stringify(buscaProdutos(consulta, categoria, limite)) };
    }
    case "detalhar_produto": {
      const sku = String(input.sku ?? "");
      const p = detalharProduto(sku);
      return { conteudo: JSON.stringify(p ? fichaParaModelo(p) : { erro: "produto não encontrado" }) };
    }
    case "info_lojas": {
      return { conteudo: JSON.stringify(carregaConfig().config.lojas) };
    }
    case "consultar_politica": {
      const tema = String(input.tema ?? "");
      const k = carregaConfig().knowledge[tema];
      return { conteudo: k ?? JSON.stringify({ erro: "tema não encontrado" }) };
    }
    case "gerar_handoff": {
      const motivo = String(input.motivo ?? "contato");
      const resumo = String(input.resumo ?? "");
      const produto = typeof input.produto === "string" ? input.produto : undefined;
      const numeroPedido = typeof input.numero_pedido === "string" ? input.numero_pedido : undefined;
      const link = geraLinkWhatsapp({ motivo, resumo, produto, numeroPedido });
      return { conteudo: JSON.stringify({ ok: true, url: link.url }), handoff: link };
    }
    default:
      return { conteudo: JSON.stringify({ erro: `ferramenta desconhecida: ${nome}` }) };
  }
}
