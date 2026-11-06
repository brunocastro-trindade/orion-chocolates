// Carrega e cacheia config/*.yaml e knowledge/*.md.
// YAML é lido com uma dep mínima (js-yaml) para evitar escrever parser à mão.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load as loadYaml } from "js-yaml";

type ConfigYaml = {
  whatsapp_humano: string;
  lojas: Record<string, unknown>;
  atendimento_humano: {
    timezone: string;
    seg_sex: { inicio: string; fim: string };
    sab: { inicio: string; fim: string };
    dom: null | { inicio: string; fim: string };
    feriados: string[];
  };
  link_delivery: string;
  instagram: string;
  linktree: string;
};

type MensagensYaml = {
  boas_vindas: string;
  encerramento: string;
  fora_horario: string;
  informacao_ausente: string;
  falha_tecnica: string;
  aviso_alergia: string;
  label_whatsapp: string;
  produto_embalagens: string;
  produto_sazonal: string;
  produto_delivery: string;
  produto_escolha: string;
  produto_escolha_mais: string;
};

type AlergiaYaml = {
  gatilhos: string[];
  gatilhos_ingrediente: string[];
  verbos_composicao: string[];
  assuntos_humano: string[];
};

type TermosYaml = {
  termos_bloqueados: Array<{ termo: string; acao: string; substituir_por?: string }>;
  afirmacoes_seguranca_bloqueadas: string[];
  promessas_bloqueadas: string[];
};

const CONFIG_DIR = join(process.cwd(), "config");
const KNOWLEDGE_DIR = join(process.cwd(), "knowledge");

let cache: {
  config: ConfigYaml;
  mensagens: MensagensYaml;
  alergia: AlergiaYaml;
  termos: TermosYaml;
  knowledge: Record<string, string>;
} | null = null;

export function carregaConfig() {
  if (cache) return cache;
  const config = loadYaml(ler(join(CONFIG_DIR, "config.yaml"))) as ConfigYaml;
  const mensagens = loadYaml(ler(join(CONFIG_DIR, "mensagens.yaml"))) as MensagensYaml;
  const alergia = loadYaml(ler(join(CONFIG_DIR, "alergia.yaml"))) as AlergiaYaml;
  const termos = loadYaml(ler(join(CONFIG_DIR, "termos-proibidos.yaml"))) as TermosYaml;
  const knowledge: Record<string, string> = {};
  for (const f of readdirSync(KNOWLEDGE_DIR)) {
    if (!f.endsWith(".md")) continue;
    knowledge[f.replace(/\.md$/, "")] = ler(join(KNOWLEDGE_DIR, f));
  }
  cache = { config, mensagens, alergia, termos, knowledge };
  return cache;
}

function ler(p: string) {
  return readFileSync(p, "utf8");
}
