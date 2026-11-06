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

// Campo de alergia: vazio = "não informado" (undefined), nunca "não contém".
const SimNaoOpt = z.preprocess((v) => {
  if (typeof v === "boolean") return v;
  if (typeof v !== "string") return undefined;
  const s = v.trim().toLowerCase();
  if (s === "") return undefined;
  if (s === "sim") return true;
  if (s === "nao" || s === "não") return false;
  return v;
}, z.boolean().optional());

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
  codigo: z.string().optional().default(""),
  nome: z.string().min(1),
  categoria: CategoriaSchema,
  formato: z.string().optional().default(""),
  descricao: z.string().min(1),
  embalagens: ListaPontoVirgula,
  sabor: z.string().optional().default(""),
  recheio: z.string().optional().default(""),
  tipo_chocolate_atual: z.string().optional().default(""),
  tipo_chocolate_novo: z.string().optional().default(""),
  teor_cacau: NumOpt,
  peso_g: NumOpt,
  qtd_embalagem: NumOpt,
  ingredientes: z.string().optional().default(""),
  contem_gluten: SimNaoOpt,
  contem_leite: SimNaoOpt,
  oleaginosas_na_receita: ListaPontoVirgula,
  contem_soja: SimNaoOpt,
  contem_ovo: SimNaoOpt,
  pode_conter: ListaPontoVirgula,
  adocante: z.string().optional().default(""),
  sem_acucar: SimNaoOpt,
  sem_lactose: SimNaoOpt,
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
}).superRefine((p, ctx) => {
  // Ficha confirmada pela equipe precisa estar completa; sem confirmação os
  // campos de alergia podem ficar vazios (o bot encaminha ao humano).
  if (!p.info_alergenos_confirmada) return;
  const obrigatorios = [p.contem_gluten, p.contem_leite, p.contem_soja, p.contem_ovo];
  if (!p.ingredientes || obrigatorios.some((v) => v === undefined)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ficha confirmada exige ingredientes e contem_gluten/leite/soja/ovo" });
  }
});
export type Produto = z.infer<typeof ProdutoSchema>;
