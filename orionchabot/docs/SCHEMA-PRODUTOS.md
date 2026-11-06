# SCHEMA DO CSV DE PRODUTOS

Arquivo: `data/produtos.csv`, UTF-8, separador `,` (ou `;` se o Excel do cliente exportar assim; detectar na carga). Uma linha por produto/apresentação.

**Status:** proposta nossa. A pergunta 15 do questionário (campos de cada item) ficou **sem resposta** do cliente. Validar com ele antes de fechar. Os dados reais virão do cliente; nada neste arquivo é dado real de produto.

## Colunas

| Coluna | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `sku` | texto | sim | Código único do produto |
| `nome` | texto | sim | Nome comercial |
| `categoria` | texto | sim | Uma de: pastilha, chocolate-ao-leite, alto-cacau, chocolate-branco, sem-acucar, bombom, tablete, trufa, pao-de-mel, dragea, sazonal, outro |
| `descricao` | texto | sim | Descrição curta |
| `sabor` | texto | não | Sabor |
| `recheio` | texto | não | Recheio |
| `tipo_chocolate_atual` | texto | não | Nome usado hoje (ex.: ao leite, meio amargo, amargo, branco) |
| `tipo_chocolate_novo` | texto | não | Nome após a adequação à lei (ex.: Chocolate) |
| `teor_cacau` | número | não | Percentual, se informado no rótulo |
| `peso_g` | número | não | Peso em gramas |
| `qtd_embalagem` | número | não | Unidades por embalagem |
| `ingredientes` | texto | sim | Texto literal do rótulo |
| `contem_gluten` | sim/nao | sim | Tem ingrediente com glúten na receita |
| `contem_leite` | sim/nao | sim | Tem leite ou derivados na receita |
| `oleaginosas_na_receita` | lista (`;`) | sim | Ex.: castanha-de-caju;amendoim. Vazio se nenhuma |
| `contem_soja` | sim/nao | sim | Tem soja na receita (ex.: lecitina de soja) |
| `contem_ovo` | sim/nao | sim | Tem ovo ou derivados na receita |
| `pode_conter` | lista (`;`) | não | Vestígios declarados no rótulo ("pode conter …"). Ex.: leite;amendoim;glúten |
| `adocante` | texto | não | Adoçante usado, se houver (ex.: maltitol) |
| `sem_acucar` | sim/nao | sim | Produto sem adição de açúcar (maltitol) |
| `sem_lactose` | sim/nao | sim | Produto sem lactose |
| `info_alergenos_confirmada` | sim/nao | sim | A equipe conferiu os campos de alergia com o rótulo. Se `nao`, o bot encaminha ao humano |
| `validade_dias` | número | não | Validade em dias, por produto |
| `conservacao` | texto | não | Se diferente do padrão (até 27 °C, fresco e seco) |
| `sazonal` | sim/nao | sim | Produto sazonal |
| `periodo_sazonal` | texto | não | Ex.: maio-setembro (trufas), natal (Stollen) |
| `sob_encomenda` | sim/nao | sim | Feito mediante encomenda |
| `link_delivery` | URL | não | Página do produto no delivery |
| `url_foto` | URL | não | Foto oficial |
| `ativo` | sim/nao | sim | Produto visível ao bot |
| `atualizado_em` | data (AAAA-MM-DD) | sim | Última revisão |

## Regras de validação (zod, na carga)

- `sku` único; `categoria` dentro da lista; booleanos só `sim`/`nao`.
- `ingredientes`, `contem_gluten`, `contem_leite`, `oleaginosas_na_receita`, `contem_soja`, `contem_ovo` e `info_alergenos_confirmada` são obrigatórios: sem eles o produto **não** é carregado e a carga registra o erro.
- Linhas com `ativo = nao` não aparecem nas buscas.
- Produto com `sazonal = sim` fora do `periodo_sazonal` (comparando com a data atual no fuso de Brasília) é tratado como indisponível na temporada.

## Preço e estoque ficam de fora de propósito

Os preços oficiais e o estoque estão no delivery e mudam manualmente. Colocá-los no CSV geraria informação desatualizada. O bot usa `link_delivery` e não afirma preço ou disponibilidade como definitivos. Se o cliente exigir preço no bot, incluir `preco_referencia` com `atualizado_em` e o bot sempre dizer "valor de referência, confirme no delivery".

## Como o bot usa os campos de alergia

Os campos `contem_*`, `oleaginosas_na_receita` e `ingredientes` descrevem a **receita**, não garantem ausência de vestígios. Qualquer resposta sobre alergia deve ser acompanhada do aviso fixo de contaminação cruzada (ver `REGRAS-DE-NEGOCIO.md`, seção 4). `info_alergenos_confirmada = nao` força encaminhamento ao humano: o código remove os campos de alergia da ficha enviada ao modelo (`fichaParaModelo` em `api/_lib/data/buscaProdutos.ts`), então ele não tem o que afirmar.

Soja e ovo entram como alergênicos de declaração obrigatória (ANVISA RDC 26/2015). `pode_conter` deve copiar a frase de vestígios do rótulo.

## Linha de exemplo (apenas ilustrativa, com marcadores)

```
sku,nome,categoria,descricao,ingredientes,contem_gluten,contem_leite,oleaginosas_na_receita,contem_soja,contem_ovo,pode_conter,adocante,sem_acucar,sem_lactose,info_alergenos_confirmada,sazonal,sob_encomenda,ativo,atualizado_em
<SKU>,<Nome do produto>,pao-de-mel,<descrição>,<texto do rótulo>,sim,sim,castanha-de-caju,sim,nao,amendoim;avelã,,nao,nao,nao,nao,nao,sim,2026-11-06
```
