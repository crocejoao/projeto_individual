# Plano de Implementação – Reformulação do Questionário e Dashboard

## 1. Arquivos
- `public/Questionario/questionario.html`: reorganizar o formulário para exibir uma única pergunta ativa, incluir os indicadores "PERGUNTA N / 8", barra de progresso com oito blocos e botões `VOLTAR`, `PRÓXIMA` e `FINALIZAR QUESTIONÁRIO`. Destacar as áreas de mensagem existentes e manter o `nav/header` atual.
- `public/css-cyberpunk/questionario.css`: refazer estilos usando a paleta (`#050816`, `#0b1026`, `#12304a`, `#e6f7ff`, `#9fb3c8`, `#ff32d2`) sem variáveis ou gradientes, aplicando cantos recortados por `clip-path` e sem bordas arredondadas. Estilizar as alternativas e os botões, garantindo melhor responsividade.
- `public/Dashboard/dashboard.html`: reconstruir o layout para refletir o visual da Dashboard 01 com três KPIs, o gráfico radar, cards individuais para cada classe com barras proporcionais e o cartão clicável do personagem. Conservar o `<canvas>` do Chart.js, o fallback e os blocos de status/aviso.
- `public/css-cyberpunk/dashboard.css`: reescrever para espelhar a identidade visual da Dashboard 01 (estofo escuro plano, painéis sólidos e cortes com `clip-path`), mantendo fontes Orbitron/Rajdhani, blocos de cada cor de classe e responsividade.
- `src/controllers/questionarioController.js`: estender `montarResposta`, `responder` e `resultado` para incluir os booleanos `netrunnerPredominante`, `mercenarioPredominante` e `nomadePredominante` a partir das contagens calculadas, sem usar `Math.max` ou recursos proibidos. Manter as validações existentes.
- `src/models/questionarioModel.js`: nenhuma alteração estrutural; as mesmas queries `INSERT`/`SELECT` continuam em uso para gravar e recuperar os resultados.
- `app.js`, `src/routes/questionario.js` e demais arquivos não mencionados: permanecerão intactos nesta primeira fase.

## 2. Componentes
- **Front-end do questionário**: pergunta única visível por vez, alternativa selecionável com `input type="radio"`, indicadores visuais de seleção via `className`/`setAttribute`, barra de progresso (oito blocos coloridos) e mensagens (`#div_msg`). `PRÓXIMA` e `FINALIZAR QUESTIONÁRIO` começam desabilitados e só entram em `enabled` após o usuário registrar uma alternativa. A navegação usa `onclick` e vetores para preservar as respostas e atualizar o progresso atual.
- **Front-end da dashboard**: KPIs com `classePredominante`, pontos/pct e a cor de destaque determinada pelos booleanos recebidos; cards de classe exibindo pontuação e porcentagem diretamente dos campos `dados.pontos*` e `dados.pct*`, com barras proporcionais. Gráfico radar usa os mesmos valores sem recalcular nada. Card do personagem usa `sessionStorage` e é clicável para revelar frase/descrição (controlado por `onclick`). Mensagens de status permanecem em `div_msg_dashboard` e `carregando-dashboard`.
- Use exatamente os campos retornados pelo backend (`dados.pontosNetrunner`, `dados.pontosMercenario`, `dados.pontosNomade`, `dados.pctNetrunner`, `dados.pctMercenario` e `dados.pctNomade`) para preencher KPIs, cards, barras e o radar, garantindo que os nomes batem com os `SELECT`/`INSERT` atuais. Card do personagem usa `sessionStorage` e é clicável para revelar frase/descrição (controlado por `onclick`). Mensagens de status permanecem em `div_msg_dashboard` e `carregando-dashboard`.
- **Backend**: rota `POST /questionario/responder` valida `idUsuario` e cada `resposta1` a `resposta8`, calcula contagens/porcentagens/classe predominante e grava no banco. Rota `GET /questionario/resultado/:idUsuario` retorna os mesmos campos e os três booleanos adicionais; nenhum novo cálculo acontece no frontend e não há mudanças nas tabelas (`usuario`, `personagem`, `resultado_questionario`).

## 3. Fluxo
1. A página do questionário valida `sessionStorage.ID_USUARIO`, consulta `/questionario/resultado/:idUsuario` e só mostra o formulário se o usuário ainda não respondeu. `PRÓXIMA` começa desativado.
2. O usuário escolhe uma alternativa; a seleção é salva em um vetor, destaca o botão correspondente e habilita o botão apropriado (`PRÓXIMA` ou `FINALIZAR QUESTIONÁRIO`). Não há avanço automático.
3. `VOLTAR`/`PRÓXIMA` ajustam o índice da pergunta, atualizam o texto `PERGUNTA N / 8` e o preenchimento dos oito blocos de progresso. Atualizações de página resetam o controle local para a pergunta 1.
4. Ao clicar em `FINALIZAR QUESTIONÁRIO`, o payload com `idUsuario` e as oito respostas é enviado em um só `fetch` para `/questionario/responder`. Exibe mensagens de envio/sucesso/erro e, em caso de sucesso, redireciona para a dashboard.
5. A dashboard consulta `/questionario/resultado/:idUsuario`; se o usuário não respondeu, redireciona de volta. Caso contrário, usa os valores `dados.pontos*` e `dados.pct*` já fornecidos para preencher KPIs, cards e o radar, enquanto os booleanos determinam quais classes recebem destaque visual sem recalcular nada.
- Antes de incluir qualquer imagem no card do personagem, confirmar no repositório (`public/Icons-cyberpunk/` ou outra pasta real) se o asset existe; se faltar imagem, o espaço permanece vazio conforme o layout atual.

## 4. Regras de negócio
- As oito perguntas originais permanecem intactas, com respostas válidas `Netrunner`, `Mercenário` e `Nômade`.
- Cada pergunta só permite uma resposta, e só é possível avançar quando há seleção. `PRÓXIMA` e `FINALIZAR QUESTIONÁRIO` começam desabilitados e são habilitados apenas após escolher uma alternativa. O fluxo nunca muda automaticamente de pergunta.
- As respostas ficam armazenadas em vetores até o envio final; os dados são transmitidos todos de uma vez na requisição `POST /questionario/responder`.
- O backend continua calculando os pontos totais, porcentagens (`toFixed(1)` com ponto decimal) e classes predominantes. Os campos booleanos adicionais sinalizam quais classes devems ser destacadas no front-end; a dashboard não recomputa pontuações.
- Empates são válidos (ex.: 3-3-2, 4-4-0) e refletem nas tags coloridas baseadas nos booleanos. Mensagens de erro/timeout devem permitir nova tentativa.
- O `sessionStorage` atual (`ID_USUARIO`, `NOME_USUARIO`, `PERSONAGEM_*`) e o fluxo de redirecionamento (login → questionário → dashboard) permanecem inalterados, evitando novos pontos de quebra.

## 5. Decisões técnicas
- Seguir restrições do AGENTS.md: evitar `classList`, `createElement`, `Math.max`, `ternários`, `map/filter/reduce`, destructuring e `async/await`; preferir `onload`/`onclick`, `for` e `if/else`. Usar `setAttribute` ou atribuição direta de `className` para destacar elementos.
- O controle de habilitação dos botões em cada pergunta usa uma variável booleana que ativa o atributo `disabled` apenas após encontrar uma alternativa selecionada; os mesmos blocos visuais são atualizados sem `classList`.
- O dashboard utiliza somente os dados recebidos (`dados.pontos*`, `dados.pct*`) e os booleanos para colorir as classes; não há lógica de recálculo, respeitando o pedido para manter o front sem tarefas matemáticas.
- O Chart.js permanece carregado via CDN, enquanto o fallback em texto/barra é mantido caso o `Chart` não esteja disponível. As barras proporcionais são definidas com `width` calculado no JS com base em `dados.pontos*`, mas sem recalcular contagens.
- O registro das etapas ocorrerá em `docs/registros/progresso.md` e no novo `docs/registros/plano-implementação-dashboard-quiz`, garantindo rastreabilidade das aprovações exigidas para etapas 4–7.

## 6. Etapas numeradas
1. **Análise e planejamento** (concluído): revisar especificação, AGENTS.md e exemplos (Dashboard 01/02) e elaborar este plano. Registrar riscos no novo arquivo de registros antes de tocar código.
2. **Reestruturar HTML/JS do questionário (sem envio)**: mostrar uma pergunta por vez, manter vetor de respostas, habilitar botões apenas após seleção e atualizar progresso. Validar que `PRÓXIMA`/`FINALIZAR QUESTIONÁRIO` começam desabilitados e não forçam avanço.
3. **Enviar respostas**: ativar `fetch` com as oito respostas e mensagens. Garantir o envio único e o redirecionamento para a dashboard, assim como mensagens de erro/retentativa.
4. **Refatorar CSS do questionário** (após aprovação): aplicar a identidade visual derivada da Dashboard 01, destacar alternativas selecionadas e garantir responsividade. Validar no desktop e mobile.
5. **Backend – incluir booleanos** (após aprovação): acrescentar `netrunnerPredominante`, `mercenarioPredominante`, `nomadePredominante` aos JSONs das rotas, usando as contagens já existentes. Validar com inspeção das respostas.
6. **Reformulação completa da dashboard** (após aprovação): reconstruir HTML/CSS/JS para KPIs, cards de classe, barra proporcional, radar e card do personagem clicável; consumir somente os dados fornecidos. Testar fallback do gráfico e as cores das classes.
7. **Revisão geral e entrega** (após aprovação): rodar `npm start`, testar o fluxo completo, registrar os resultados nos arquivos de registro e montar o roteiro de testes manuais solicitado.

Cada etapa exige registro em `docs/registros/progresso.md` e atualização em `docs/registros/plano-implementação-dashboard-quiz` para cumprir a exigência de documentação.
