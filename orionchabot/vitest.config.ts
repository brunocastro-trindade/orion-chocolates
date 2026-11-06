// Testes usam um catálogo fixo (fixture), independente do produtos.csv real.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { PRODUTOS_CSV: "tests/fixtures/produtos.csv" },
  },
});
