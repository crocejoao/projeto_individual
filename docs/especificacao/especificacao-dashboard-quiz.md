# Especificação — Reformulação do Questionário e Dashboard

## 1. Objetivo

Reformular o questionário e a dashboard do projeto Cyberpunk: Edgerunners, melhorando a experiência e a identidade visual, sem comprometer as funcionalidades existentes.

O fluxo atual já funciona: cadastro, login, questionário de 8 perguntas, cálculo, gravação no MySQL e dashboard individual.

**Antes de implementar, analise o projeto atual e seus arquivos.** Trabalhe diretamente na pasta aberta, sem clonar ou criar outra cópia do repositório.

Arquivos principais:
- `public/Questionario/questionario.html`
- `public/css-cyberpunk/questionario.css`
- `public/Dashboard/dashboard.html`
- `public/css-cyberpunk/dashboard.css`
- `public/css-cyberpunk/style.css`
- `public/css-cyberpunk/header.css`
- `src/routes/questionario.js`
- `src/controllers/questionarioController.js`
- `src/models/questionarioModel.js`
- `src/database/script-edgerunners.sql`

Consulte também o `especificacao-dashboard-quiz` que está dentro de docs que está dentro de especificacao e a pasta de exemplos. **A Dashboard 01 é a referência visual, e a Dashboard 02 é a referencia de código, pois está mais simples. Copie sua estrutura visual como base, adaptando-a ao projeto. Não reproduza complexidade, quero que o código esteja todo coerente**

## 2. Restrições importantes

Sou iniciante e preciso conseguir explicar todo o código.

- Priorize vetores, `if/else`, `while` e `for`.
- Evite ternários, `classList`, `createElement`, `Math.max`, `split`, `replace`,  `map`, `filter`, `reduce`, destructuring, spread, e `async/await`.
- Prefira `onload` e `onclick`.
- Utilize `let` quando precisar alterar valores e `const` quando não precisar, conforme o `AGENTS.md`.
- Não introduza bibliotecas ou estruturas avançadas sem necessidade e aprovação.
- Preserve comentários, organização e funcionalidades existentes.
- Não altere login, cadastro, home ou header além do estritamente necessário.
- Não crie autenticação nova.
- Não crie tabelas ou funcionalidades adicionais.
- Não execute scripts SQL nem acesse diretamente meu MySQL.
- Comente o código com explicações de funcionalidade.

Comente brevemente as funcionalidades novas e qualquer construção que eu ainda não conheça.

## 3. Questionário

### Funcionamento

Manter as 8 perguntas e alternativas que já existem no código. Não substituir por textos provisórios. Eu mesmo farei as alterações posteriormente.

O questionário continua baseado nas classes Netrunner, Mercenário e Nômade, sem respostas certas ou erradas.

**Nova experiência:**
1. Mostrar uma pergunta por vez, na mesma página.
2. Exibir três alternativas como botões de seleção única.
3. Ao clicar, destacar a alternativa escolhida, sem avançar automaticamente.
4. Exibir o botão PRÓXIMA para avançar.
5. Na última pergunta, substituir PRÓXIMA por FINALIZAR QUESTIONÁRIO.
6. Exibir VOLTAR a partir da segunda pergunta, permitindo alterar respostas anteriores.
7. Mostrar `PERGUNTA N / 8` e uma barra de progresso com oito blocos.
8. Impedir avanço sem selecionar uma alternativa.
9. Ao atualizar a página, recomeçar na pergunta 1.

As respostas devem permanecer armazenadas em vetores durante o preenchimento. Ao finalizar, enviar as oito respostas de uma vez.

Reaproveitar a verificação de usuário, o envio e a lógica existentes.

### Envio

Preservar:
- Rota `POST /questionario/responder`.
- Campos `idUsuario` e `resposta1` até `resposta8`.
- Valores das respostas: `Netrunner`, `Mercenário` e `Nômade`.

Mostrar mensagens de envio, sucesso e erro. Se houver erro, permitir tentar novamente.

## 4. Dashboard

A dashboard deve apresentar exclusivamente os resultados individuais já armazenados.

**Estrutura, seguindo a Dashboard 01:**

1. Três KPIs: classe predominante, pontos da classe predominante (ex.: 5 de 8) e porcentagem.
2. Gráfico: copiar o gráfico da dashboard 01 com as três pontuações, utilizando o Chart.js já existente.
3. Três blocos individuais, um para cada classe, contendo pontuação, porcentagem e barra proporcional.
4. Personagem favorito com imagem, nome, classe, frase e descrição.

O cartão do personagem será clicável para apresentar sua frase e características.

Se a imagem não estiver disponível, deixar o espaço vazio. Verificar os caminhos reais antes de utilizar imagens.

### Regras de resultado

- Cada resposta adiciona um ponto à classe correspondente.
- Total de pontos: 8.
- Porcentagem: pontos ÷ 8 × 100.
- Exibir porcentagens com `toFixed(1)`, utilizando ponto decimal.
- Não alterar o cálculo existente no backend.

Empates são válidos. Exemplos: 3-3-2 e 4-4-0. A dashboard deve apresentar as duas classes predominantes, cada uma com sua própria cor.

**A dashboard não deve calcular resultados.** O backend deverá fornecer três indicadores booleanos:
- `netrunnerPredominante`
- `mercenarioPredominante`
- `nomadePredominante`

Assim, o frontend apenas consulta os dados e utiliza `if` para apresentar as classes correspondentes.

## 5. Backend e banco de dados

Preservar a arquitetura e o funcionamento atual.

- Manter as tabelas existentes: `usuario`, `personagem` e `resultado_questionario`.
- Não criar tabelas.
- Não alterar o cálculo das pontuações.
- Manter a restrição de uma resposta por usuário.
- Manter a identificação atual por `sessionStorage`.
- Preservar as rotas existentes.
- Manter `questionario.js` no singular.

**Ajuste aprovado:** incluir os três indicadores de predominância nas respostas das rotas `POST /questionario/responder` e `GET /questionario/resultado/:idUsuario`, calculados no backend a partir das pontuações já existentes.

Não alterar o SQL, salvo necessidade técnica comprovada. Caso seja necessário, apresentar o script para execução manual.

## 6. Identidade visual

Seguir a identidade visual existente no site e substituir o visual atual do questionário e da dashboard.

**Paleta:**
- Fundo: `#050816`
- Painéis: `#0b1026`
- Bordas: `#12304a`
- Texto: `#e6f7ff`
- Texto secundário: `#9fb3c8`
- Destaque: `#ff32d2`

**Cores das classes:**
- Netrunner: ciano.
- Mercenário: amarelo.
- Nômade: `#39ff88`.

**Fontes:**
- Orbitron para títulos e botões.
- Rajdhani para textos.

**Estilo:**
- Cantos recortados com `clip-path`.
- Sem bordas arredondadas.
- Sem degradês.
- Sem variáveis CSS.
- Manter o header atual e a identificação do usuário.

Todas as cores das classes devem ser consistentes em botões, indicadores, barras, gráficos e resultados.


## 7. Fluxo de acesso

Preservar as verificações atuais:

- Sem usuário autenticado: direcionar ao login.
- Usuário que ainda não respondeu: direcionar ao questionário.
- Usuário que já respondeu: direcionar à dashboard.
- Não permitir responder novamente.

## 8. Processo de desenvolvimento

**Implementar em 2 grandes etapas 1 a 4 e 4 a 7 aguardar minha aprovação antes de continuar.**

| Etapa | Atividade |
|---|---|
| 1 | Inspecionar arquivos, Dashboard 01, `AGENTS.md` e apresentar o plano de alterações. |
| 2 | Alterar HTML e JavaScript do questionário, ainda sem envio. |
| 3 | Implementar e testar o envio das oito respostas. |
| 4 | Reformular o CSS do questionário. |
| 5 | Ajustar o backend para fornecer os indicadores de predominância. |
| 6 | Reformular HTML, CSS e JavaScript da dashboard. |
| 7 | Revisar e validar o projeto completo. |

Ao concluir cada etapa, apresentar:
- Arquivos modificados.
- O que foi implementado.
- Testes realizados e resultados.
- Eventuais limitações.
- Registrando o que foi feito dentro da pasta registros

Não iniciar a próxima etapa sem minha confirmação.

## 9. Critérios finais

- Questionário funcional com seleção, PRÓXIMA, VOLTAR e FINALIZAR.
- CSS coerente ao site inteiro. Utilizando o CSS da dashboard 01 de exemplo
- Respostas preservadas durante a navegação entre perguntas.
- Envio correto das oito respostas.
- Redirecionamentos funcionando.
- Resultados e empates apresentados corretamente.
- Dashboard sem cálculos de pontuação ou predominância.
- Gráfico radar e personagem funcionando.
- Visual coerente com o restante do site e com a Dashboard 01.
- Código dentro das restrições de complexidade.
- Funcionamento em computador e celular.
- `npm start` sem erros no ambiente disponível.
- Alterações registradas na pasta `registros`.
- Diário de Prompts atualizado. (Crie um arquivo dentro de registros e documente.)
- Roteiro de testes manuais entregue para execução com meu MySQL.