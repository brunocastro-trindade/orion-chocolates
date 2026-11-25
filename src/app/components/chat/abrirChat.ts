// Abre o widget de chat de qualquer lugar do site e já envia uma opção do menu
// inicial ("Endereços", "Contatos"...), cujas respostas estão configuradas no
// agente (MENU INICIAL em api/_lib/agent/systemPrompt.ts).
// Usado pelos links "Onde encontrar" e "Contato" do menu e do rodapé.
import type { MouseEvent } from "react";

export const EVENTO_ABRIR_CHAT = "orion:abrir-chat";

export type OpcaoMenuChat = "Produtos" | "Contatos" | "Endereços" | "Pedidos";

export function abrirChat(mensagem: OpcaoMenuChat) {
  window.dispatchEvent(new CustomEvent<string>(EVENTO_ABRIR_CHAT, { detail: mensagem }));
}

/** onClick para um <a href="#"> que abre o chat em vez de navegar. */
export function linkDoChat(mensagem: OpcaoMenuChat) {
  return (e: MouseEvent) => {
    e.preventDefault();
    abrirChat(mensagem);
  };
}
