// Tipos trafegados entre o widget, o hook useChat e o chatApi.
// Estrutura mínima; a mesma `Message` vira payload da requisição.
export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
};

export type ChatAction = {
  type: "whatsapp";
  url: string;
  label: string;
};

export type StreamEvent =
  | { event: "delta"; data: { text: string } }
  | { event: "action"; data: ChatAction }
  | { event: "opcoes"; data: { opcoes: string[] } }
  | { event: "error"; data: { message: string } }
  | { event: "done"; data: Record<string, never> };
