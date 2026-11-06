// Rate limit em memória por IP e truncagem do histórico.
// Para produção multi-região convém trocar por KV/Upstash. Em single-region, basta.
const JANELA_MS = 60_000;
const MAX_POR_JANELA = 20;
const HISTORICO_MAX = 10;

const contadores = new Map<string, { inicio: number; total: number }>();

export function dentroRateLimit(ip: string): boolean {
  const agora = Date.now();
  const atual = contadores.get(ip);
  if (!atual || agora - atual.inicio > JANELA_MS) {
    contadores.set(ip, { inicio: agora, total: 1 });
    return true;
  }
  atual.total += 1;
  return atual.total <= MAX_POR_JANELA;
}

// Mantém apenas as últimas N mensagens — protege contra prompts enormes e
// mantém o uso de tokens previsível.
// O corte não pode começar por resposta do assistente: a API exige que a
// conversa comece pelo usuário.
export function cortaHistorico<T extends { role: string }>(msgs: T[]): T[] {
  const cortado = msgs.slice(-HISTORICO_MAX);
  while (cortado.length > 1 && cortado[0].role !== "user") cortado.shift();
  return cortado;
}
