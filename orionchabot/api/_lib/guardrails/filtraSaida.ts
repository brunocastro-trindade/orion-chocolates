// Reescreve ou bloqueia a saída do modelo antes de enviar ao cliente.
// Operações: reescrever termo, remover termo, ou bloquear a resposta inteira
// (nesse caso devolvemos a mensagem padrão de informação ausente).
import { carregaConfig } from "../data/carregaConfig";

export type ResultadoFiltro =
  | { tipo: "ok"; texto: string }
  | { tipo: "bloqueado"; texto: string };

export function filtraSaida(texto: string, modoAlergia: boolean): ResultadoFiltro {
  const { termos, mensagens } = carregaConfig();
  let out = texto;

  // 1. Termos de marca
  for (const regra of termos.termos_bloqueados) {
    const re = new RegExp(escapaRegex(regra.termo), "gi");
    if (regra.acao === "reescrever" && regra.substituir_por) {
      out = out.replace(re, regra.substituir_por);
    } else if (regra.acao === "remover") {
      // Só colapsa espaços/tabs: \s apagaria as quebras de linha da resposta.
      out = out.replace(re, "").replace(/[ \t]{2,}/g, " ").trim();
    } else if (regra.acao === "bloquear_resposta" && re.test(out)) {
      return { tipo: "bloqueado", texto: mensagens.informacao_ausente };
    }
  }

  // 2. Afirmações de segurança proibidas (só bloqueiam no contexto de alergia)
  if (modoAlergia) {
    for (const frase of termos.afirmacoes_seguranca_bloqueadas) {
      if (contem(out, frase)) {
        return { tipo: "bloqueado", texto: mensagens.informacao_ausente };
      }
    }
  }

  // 3. Promessas (troca, reembolso, prazo, estoque) — bloqueiam sempre
  for (const frase of termos.promessas_bloqueadas) {
    if (contem(out, frase)) {
      return { tipo: "bloqueado", texto: mensagens.informacao_ausente };
    }
  }

  return { tipo: "ok", texto: out };
}

function contem(texto: string, frase: string): boolean {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return norm(texto).includes(norm(frase));
}

function escapaRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
