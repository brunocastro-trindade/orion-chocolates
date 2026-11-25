# PENDÊNCIAS — o que falta definir

Enquanto um item estiver pendente, o bot **não inventa**: usa a mensagem de informação ausente e encaminha ao humano. Ao resolver um item, mova-o para "Resolvidas" com a data e a resposta do cliente, e atualize `REGRAS-DE-NEGOCIO.md`.

## Com o cliente (Chocolates Orion)

| # | Origem | Pendência |
|---|---|---|
| 1 | P15 | Catálogo provisório importado da Planilha Sekoia (2026-11-06, 310 itens, sem preço). Falta: definir a fonte principal do catálogo e enviar a ficha de ingredientes e alergênicos por produto |
| 2 | P8 | Não foi enviada a lista das 10 perguntas mais frequentes com exemplos reais; só os temas (composição, alergênicos, tipos de chocolate, sazonais, encomendas) |
| 3 | P33 | Texto contraditório: diz que o chatbot "não deve encaminhar ao atendimento humano" e também não conceder soluções. Provável erro de digitação. Adotado: **encaminhar ao humano** e não prometer nada. Confirmar |
| 4 | P36 | Frase incompleta sobre grandes volumes e reservas ("as regras para grandes volumes são e as regras para reservas são..."). Adotado: humano atende. Confirmar |
| 5 | P37 | Regra do programa de fidelidade truncada ("após determinada 10 pedidos"). Confirmar: 10 pedidos → 10% no 11º? Cupom de boas-vindas de 10% é só intenção; confirmar se e quando vai existir |
| 6 | P4 × P39 | Horário do atendimento humano: P4 diz seg-sex ~10h às 18h30 e sáb 9h às 13h; P39 diz 10h às 18h. Unificar. Definir se o prazo de resposta (~30 min "em geral") pode ser comunicado |
| 7 | P39 | Quem recebe os atendimentos do WhatsApp não está definido |
| 8 | P25 × P4 | Retirada das 9h às 18h, mas o delivery do Centro funciona aos sábados só das 9h às 12h. Confirmar o horário de retirada no sábado |
| 9 | P7 | WhatsApp do Shopping Park Europeu (+55 47 8926-9780) tem 8 dígitos após o DDD; confirmar |
| 10 | P1 | Domínio oficial vai mudar; falta o **link do delivery** e do catálogo |
| 11 | P9 | Qual é o sistema de delivery e se ele tem API (necessário para consulta de pedidos, fase futura) |
| 12 | P23 | Sem tabela de frete, pedido mínimo ou regra de frete grátis |
| 13 | P28 | Prazos de solicitação de troca/problema vagos ("procuramos solucionar no mesmo dia") |
| 14 | P19 | Validade por produto: cadastrar no CSV |
| 15 | P20 | Faixa de preço por ocasião e pedido mínimo de personalizados: sem dados |
| 16 | P8 | Lei nº 15.404/2026 e os percentuais de composição foram informados pelo cliente; validar antes de o bot citar ao público |
| 17 | P6 | Comunicar por escrito que WhatsApp nativo, Instagram e consulta de pedidos ficam fora da Fase 1 |
| 18 | LGPD | Aprovar o aviso de privacidade do chat e o prazo de retenção de logs |
| 19 | Alergias | Indicar quem na loja valida as respostas de alergia e confere `info_alergenos_confirmada` |

## Técnicas (do desenvolvedor)

| # | Pendência |
|---|---|
| T1 | Ler `src/styles` (cores, fontes) e `src/main.tsx` do repositório do site para o widget herdar o tema e saber onde montar |
| T2 | Confirmar como as rotas são feitas (provável react-router) para manter o widget fora das rotas |
| T3 | Combinar com o dono do repositório (HugoMartins-D) o fluxo de branch/fork e as mudanças em `vercel.json` e `main.tsx` |
| T4 | Confirmar `includeFiles` da Vercel para empacotar `data/`, `knowledge/` e `config/` na função, e limites de streaming do plano |
| T5 | Definir o modelo (`ANTHROPIC_MODEL`) após rodar o conjunto de avaliação com um modelo pequeno |
| T6 | Criar conta/chave da Anthropic com alerta de gasto e projeto Sentry |

## Resolvidas

(nenhuma ainda)
