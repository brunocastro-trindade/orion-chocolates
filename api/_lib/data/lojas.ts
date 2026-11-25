// Dados das lojas para o modelo, com o link wa.me já montado a partir do
// config.yaml. O modelo errava dígitos ao montar o link sozinho.
import { carregaConfig } from "./carregaConfig";

export function lojasParaModelo(): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [chave, valor] of Object.entries(carregaConfig().config.lojas)) {
    const loja = { ...(valor as Record<string, unknown>) };
    if (typeof loja.whatsapp === "string") {
      loja.whatsapp_url = `https://wa.me/${loja.whatsapp.replace(/\D/g, "")}`;
    }
    out[chave] = loja;
  }
  return out;
}
