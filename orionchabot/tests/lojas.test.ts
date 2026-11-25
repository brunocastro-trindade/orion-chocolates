import { describe, expect, it, beforeAll } from "vitest";
import { executaTool } from "../api/_lib/agent/tools";

beforeAll(() => {
  process.env.ANTHROPIC_API_KEY = "test-key";
});

describe("info_lojas", () => {
  it("devolve as DUAS unidades com endereços distintos", () => {
    const r = executaTool("info_lojas", {});
    const dados = JSON.parse(r.conteudo) as Record<string, { endereco: string; maps_url: string; nome: string }>;
    const chaves = Object.keys(dados);
    expect(chaves).toContain("centro");
    expect(chaves).toContain("park_europeu");
    expect(dados.centro.endereco).toMatch(/Curt Hering, 226/);
    expect(dados.park_europeu.endereco).toMatch(/Paul Fritz Kuehnrich, 1600/);
    expect(dados.centro.endereco).not.toEqual(dados.park_europeu.endereco);
  });

  it("cada unidade tem um link do Google Maps", () => {
    const r = executaTool("info_lojas", {});
    const dados = JSON.parse(r.conteudo) as Record<string, { maps_url: string }>;
    expect(dados.centro.maps_url).toMatch(/google\.com\/maps|maps\.app\.goo\.gl/);
    expect(dados.park_europeu.maps_url).toMatch(/maps\.app\.goo\.gl\/z4fZXqnCMmYbg4La6/);
    expect(dados.centro.maps_url).not.toEqual(dados.park_europeu.maps_url);
  });
});

describe("whatsapp_url das lojas", () => {
  it("monta o wa.me com os dígitos exatos do config", () => {
    const dados = JSON.parse(executaTool("info_lojas", {}).conteudo) as Record<string, { whatsapp_url: string }>;
    expect(dados.centro.whatsapp_url).toBe("https://wa.me/5547996702584");
    expect(dados.park_europeu.whatsapp_url).toBe("https://wa.me/554789269780");
  });
});
