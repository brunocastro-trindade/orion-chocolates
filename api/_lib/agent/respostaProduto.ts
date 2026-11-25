// Resposta automática curta quando o cliente cita um produto do catálogo
// ("quero um pão de mel"). Montada por código, sem chamar o modelo: zero custo
// e nada inventado. Na dúvida devolve null e o modelo assume.
import { carregaProdutos } from "../data/carregaProdutos";
import { normaliza } from "../data/buscaProdutos";
import { carregaConfig } from "../data/carregaConfig";
import type { Produto } from "../schemas";

export type RespostaProduto = { texto: string; opcoes: string[] };

const MAX_PALAVRAS = 8;
const MAX_OPCOES = 6;
const MAX_EMBALAGENS = 6;

// Palavras de pedido/ligação que não identificam produto.
const VAZIAS = new Set(
  ("a o as os um uma uns umas de da do das dos e em no na com para pra por me eu voce voces vcs " +
    "quero queria gostaria tem tens teria vende vendem vendo comprar compra encomendar pedir pedido " +
    "ver mostrar mostra saber sobre info informacao chocolate chocolates produto produtos orion ai la ola oi " +
    // Preço: a ficha já manda ao delivery, que é a resposta certa para preço.
    "quanto custa custam preco precos valor valores qual").split(" "),
);

// Duas palavras casam se iguais, uma é prefixo da outra ou dividem 5 letras iniciais.
function casa(token: string, palavra: string): boolean {
  if (token === palavra) return true;
  if (palavra.length >= 3 && token.startsWith(palavra)) return true;
  return token.length >= 5 && palavra.length >= 5 && token.slice(0, 5) === palavra.slice(0, 5);
}

function palavrasUteis(texto: string): string[] {
  return normaliza(texto).split(" ").filter((w) => w.length > 1 && !VAZIAS.has(w));
}

// Ficha curta do produto: nome, descrição, embalagens, sazonal e link do delivery.
function ficha(p: Produto): string {
  const { mensagens, config } = carregaConfig();
  const linhas = [p.descricao && p.descricao !== p.nome ? `**${p.nome}** — ${p.descricao}` : `**${p.nome}**`];
  if (p.embalagens.length) {
    const extra = p.embalagens.length > MAX_EMBALAGENS ? ` · +${p.embalagens.length - MAX_EMBALAGENS}` : "";
    const lista = p.embalagens.slice(0, MAX_EMBALAGENS).join(" · ") + extra;
    linhas.push(mensagens.produto_embalagens.replace("{lista}", lista));
  }
  if (p.sazonal && p.periodo_sazonal) linhas.push(mensagens.produto_sazonal.replace("{periodo}", p.periodo_sazonal));
  const link = p.link_delivery || config.link_delivery || config.linktree;
  linhas.push(mensagens.produto_delivery.replace("{link}", link));
  return linhas.join("\n");
}

export function respostaProduto(mensagem: string): RespostaProduto | null {
  if (normaliza(mensagem).split(" ").length > MAX_PALAVRAS) return null;
  const uteis = palavrasUteis(mensagem);
  if (uteis.length === 0) return null;

  const produtos = carregaProdutos();
  const exato = produtos.find((p) => palavrasUteis(p.nome).join(" ") === uteis.join(" "));
  if (exato) return { texto: ficha(exato), opcoes: [] };

  const candidatos = produtos.filter((p) => {
    const tokens = normaliza(`${p.nome} ${p.formato} ${p.periodo_sazonal}`).split(" ");
    return uteis.every((w) => tokens.some((t) => casa(t, w)));
  });
  if (candidatos.length === 0) return null;
  // Quem tem as palavras no próprio nome vem antes de quem casou só pelo formato.
  const noNome = (nome: string) => uteis.filter((w) => normaliza(nome).split(" ").some((t) => casa(t, w))).length;
  const nomes = [...new Set(candidatos.map((p) => p.nome))].sort(
    (a, b) => noNome(b) - noNome(a) || a.length - b.length,
  );
  if (nomes.length === 1) return { texto: ficha(candidatos[0]), opcoes: [] };

  const { mensagens } = carregaConfig();
  const texto = mensagens.produto_escolha.replace("{n}", String(nomes.length));
  const mais = nomes.length > MAX_OPCOES ? `\n${mensagens.produto_escolha_mais}` : "";
  return { texto: texto + mais, opcoes: nomes.slice(0, MAX_OPCOES) };
}
