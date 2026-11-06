// Schemas zod de todas as entradas e saídas trafegadas pela API e das linhas
// do CSV de produtos. Centralizado aqui para que request, resposta e produto
// tenham UMA única fonte de verdade.
import { z } from "zod";

const MAX_MESSAGE_CHARS = 500;
const MAX_MESSAGES = 10;

export const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(MAX_MESSAGE_CHARS),
});
export type Message = z.infer<typeof MessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(MAX_MESSAGES),
  sessionId: z.string().uuid(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Coerce "sim"/"nao" do CSV para boolean. Preserva o valor original se já for
// booleano (facilita testes com fixtures).
const SimNao = z.preprocess((v) => {
  if (typeof v === "boolean") return v;
  if (typeof v !== "string") return v;
  const s = v.trim().toLowerCase();
  if (s === "sim") return true;
  if (s === "nao" || s === "não" || s === "") return false;
  return v;
}, z.boolean());

const NumOpt = z.preprocess((v) => {
  if (v === "" || v == null) return undefined;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}, z.number().optional());

const ListaPontoVirgula = z.preprocess((v) => {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return [];
  return v.split(";").map((s) => s.trim()).filter(Boolean);
}, z.array(z.string()));

export const CategoriaSchema = z.enum([
  "pastilha",
  "chocolate-ao-leite",
  "alto-cacau",
  "chocolate-branco",
  "sem-acucar",
  "bombom",
  "tablete",
  "trufa",
  "pao-de-mel",
  "dragea",
  "sazonal",
  "outro",
]);

export const ProdutoSchema = z.object({
  sku: z.string().min(1),
  nome: z.string().min(1),
  categoria: CategoriaSchema,
  descricao: z.string().min(1),
  sabor: z.string().optional().default(""),
  recheio: z.string().optional().default(""),
  tipo_chocolate_atual: z.string().optional().default(""),
  tipo_chocolate_novo: z.string().optional().default(""),
  teor_cacau: NumOpt,
  peso_g: NumOpt,
  qtd_embalagem: NumOpt,
  ingredientes: z.string().min(1),
  contem_gluten: SimNao,
  contem_leite: SimNao,
  oleaginosas_na_receita: ListaPontoVirgula,
  contem_soja: SimNao,
  contem_ovo: SimNao,
  pode_conter: ListaPontoVirgula,
  adocante: z.string().optional().default(""),
  sem_acucar: SimNao,
  sem_lactose: SimNao,
  info_alergenos_confirmada: SimNao,
  validade_dias: NumOpt,
  conservacao: z.string().optional().default(""),
  sazonal: SimNao,
  periodo_sazonal: z.string().optional().default(""),
  sob_encomenda: SimNao,
  link_delivery: z.string().optional().default(""),
  url_foto: z.string().optional().default(""),
  ativo: SimNao,
  atualizado_em: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Produto = z.infer<typeof ProdutoSchema>;
