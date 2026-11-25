// Detecta intenção de alergia/restrição e assuntos de humano no texto do cliente.
// Comparação insensível a acento e case, por substring — alvo é intenção, não match exato.
import { carregaConfig } from "../data/carregaConfig";

export type IntencaoEntrada = {
  // Qualquer gatilho (forte ou ingrediente). Vale quando não é pedido de produto.
  modoAlergia: boolean;
  // Só gatilhos fortes: bloqueia a resposta automática de produto.
  alergiaForte: boolean;
  assuntoHumano: boolean;
};

export function detectaIntencao(texto: string): IntencaoEntrada {
  const { alergia } = carregaConfig();
  const norm = normaliza(texto);
  const casa = (lista: string[]) => lista.some((g) => norm.includes(normaliza(g)));
  const forte = casa(alergia.gatilhos) || perguntaComposicao(norm, alergia.verbos_composicao, alergia.gatilhos_ingrediente);
  return {
    modoAlergia: forte || casa(alergia.gatilhos_ingrediente),
    alergiaForte: forte,
    assuntoHumano: alergia.assuntos_humano.some((a) => norm.includes(normaliza(a))),
  };
}

// "o bombom tem amendoim?": algo antes do verbo e ingrediente depois dele.
// "vocês têm ovo de páscoa?" não conta: o verbo abre a frase (é um pedido).
function perguntaComposicao(norm: string, verbos: string[], ingredientes: string[]): boolean {
  const palavras = norm.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const inicio = palavras[0] === "voces" || palavras[0] === "vcs" || palavras[0] === "voce" ? 1 : 0;
  const verbosNorm = verbos.map(normaliza);
  const i = palavras.findIndex((p, idx) => idx > inicio && verbosNorm.includes(p));
  if (i < 0) return false;
  const depois = palavras.slice(i + 1).join(" ");
  return ingredientes.some((g) => depois.includes(normaliza(g)));
}

function normaliza(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
