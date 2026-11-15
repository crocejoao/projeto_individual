<small>Nota: a pasta `docs/registros` foi criada para acomodar este registro de planejamento.</small>

# Plano de implementação — questionário + dashboard (fase de planejamento)

## 1. Visão geral

- Base técnico-conceitual: o protótipo do questionário (`docs/Exemplo-Dashboard-e-questionario/Exemplo-questionário`) e o layout simplificado da Dashboard 01 (com Chart.js, cores ciano/amarelo/verde neon) deverão nortear o HTML/CSS/JS das novas telas de `public/Questionario/questionario.html` e `public/Dashboard/dashboard.html`.
- Back-end atual: apenas rota de usuários (`/usuarios`) com login/cadastro; o banco atual já tem as tabelas `usuario` e `personagem` definidas em `src/database/script-edgerunners.sql`. 
- O objetivo nesta etapa é planejar em detalhes tudo o que precisa ser alterado, sem implementar nada.

## 2. Referências analisadas

- **Questionário de exemplo:** page `docs/Exemplo-Dashboard-e-questionario/Exemplo-questionário/public/Questionario/questionario.html` contém validações simples, uso de `sessionStorage` e botão de logout. Reaproveitar lógica de sessão (sem middleware) e a ideia de mostrar o personagem favorito na tela.
- **Dashboard 01:** layout principal (grid com card do personagem, gráfico de colunas, paleta, Chart.js). Usar estilos focados em cores neon e manter tipografias `Orbitron` e `Rajdhani`. 
- **Dashboard 02:** apenas referência complementar para fallback de gráficos e mensagens quando o Chart.js não carrega (`typeof Chart == "undefined"`). Será replicado o mesmo comportamento.
- **Banco/SQL:** `script-edgerunners.sql` define `personagem` e `usuario` (sem campos do questionário); a especificação exige adicionar lógica que guarda resultados e garante unicidade. ``

## 3. Arquivos que serão criados ou alterados

### Criar
- `docs/registros/plano-implementacao.md` (este arquivo).
- `public/Questionario/questionario.html` (HTML com header existente, 8 perguntas fixas + scripts para validar/responder, mensagem de erro e espaço para personagem favorito).
- `public/Dashboard/dashboard.html` (clone da Dashboard 01 com KPIs, gráfico radar ou, se radar indisponível, gráfico de barras, e espaço reservado para imagem do personagem). 
- `public/Questionario/questionario.js` / `public/Dashboard/dashboard.js` ou inline `<script>` que: 1) consulta o back-end ao carregar para saber se o usuário já respondeu; 2) exibe o estado do personagem; 3) chama `fetch` para enviar/resgatar resultados.
- `src/routes/questionario.js`, `src/controllers/questionarioController.js`, `src/models/questionarioModel.js` com respostas/post e consulta GET do resultado por `fk_usuario`.

### Alterar
- `src/controllers/usuarioController.js`: devolver na resposta do login apenas o campo `questionarioRespondido`; documentar que as frases/descrições atuais permanecem e serão substituídas futuramente.
- `src/models/usuarioModel.js`: ajustar `autenticar` para retornar o novo campo, usando JOIN com `resultado_questionario` (quando existir). 
- `src/database/script-edgerunners.sql`: incluir criação da tabela de resultados `resultado_questionario` (ver seção 8). Documentar o risco do `sessionStorage.ID_USUARIO` ser manipulado e que o back-end deve confiar apenas no ID da sessão atual (não há middleware). 

## 4. Componentes e funcionalidades envolvidas

- **Questão de sessão:** `sessionStorage` continua guardando apenas os dados de login (id, nome, email, personagem, frase, descrição, classe). O novo fluxo deve consultar o back-end em cada tela para saber se o questionário já foi respondido e para obter os dados das pontuações (sem depender do `sessionStorage` para isso). 
- **Questionário:** 8 perguntas, 3 alternativas (cada alternativa associada a uma classe e cor). Todas as perguntas são obrigatórias; o envio só ocorre se todos os campos estiverem preenchidos; feedback visual (mensagem de erro ou de sucesso). O envio dispara `POST /questionario/responder` com o `id_usuario` e as alternativas escolhidas (um payload simples). O front apenas exibe o resultado (sem calcular porcentagens). 
- **Back-end:** a rota POST valida campos, calcula contagens (pontos), porcentagens (`pontos ÷ 8 × 100`, 1 casa decimal), detecta empates (duas classes com mesma pontuação maior) e armazena tudo em `resultado_questionario`. A rota GET retorna os dados prontos (classe predominante, pontos, porcentagens, empates). 
- **Dashboard:** ao carregar, faz `GET /questionario/resultado/:idUsuario`. Exibe KPIs: (1) classe predominante, (2) pontos da classe predominante em `x de 8`, (3) porcentagem da classe predominante, além da fração (ex.: `5/8`). Mostra o gráfico radar (caso o Chart.js suporte; se não, gráfico de barras simples). Mostra o card com personagem favorito, frase e descrição retirados do `sessionStorage`, e mantém o espaço reservado para a imagem (uma `<div>` com borda, vazia). Inclui o tratamento para `typeof Chart == "undefined"` com mensagens tipo “Não foi possível carregar o Chart.js (confira a internet).” 
- **Navegação e redirecionamento:** o front controla o redirecionamento (sem middleware). Após login, se o campo `questionarioRespondido` for `false`, direcionar para `/Questionario/questionario.html`; se `true`, para `/Dashboard/dashboard.html`. A nova tela precisa também verificar, ao carregar, o status no back-end para evitar acesso manual: se o usuário tentar abrir o dashboard sem ter respondido, redirecionar para o questionário; vice-versa, quem já respondeu não deve poder abrir o questionário. 

## 5. Fluxo completo do sistema

1. **Cadastro:** tela `public/Login-Cadastro/cadastro.html` envia `POST /usuarios/cadastrar` (sem alterações). 
2. **Login:** `POST /usuarios/autenticar` continua sendo usado, mas agora retorna apenas `questionarioRespondido` (booleano). O `sessionStorage` guarda apenas id, nome, email, personagem favorito e a frase/descrição da tabela (mesmo que futuramente mudem; manter como estão).
3. **Redirecionamento:** o script do login lê `questionarioRespondido` e redireciona para `Questionario` ou `Dashboard`. 
4. **Questionário:** ao abrir `questionario.html`, carregar o header com dados do login e consultar `GET /questionario/resultado/:idUsuario`; se o endpoint indicar existência de resultado, redirecionar para a dashboard automaticamente (evitar respostas duplicadas). Caso contrário, renderizar as perguntas. O envio do formulário aciona `POST /questionario/responder`, que salva as respostas (após conferir que a soma das pontuações dá 8) e retorna os KPIs.
5. **Dashboard:** `dashboard.html` (inspirado em Dashboard 01) consulta `GET /questionario/resultado/:idUsuario`; se não houver resposta, redireciona ao questionário. Se houver, exibe KPIs, gráfico e card do personagem. Mensagens de erro são mostradas caso o Chart.js falhe (sem internet).
6. **Novo login:** o usuário autentica novamente; o login retorna apenas o flag `questionarioRespondido = true`, e o script do login direciona diretamente para a dashboard.

## 6. Regras de negócio e requisitos técnicos

1. Cada usuário só responde ao questionário uma vez. O banco garante isso com `UNIQUE(fk_usuario)` e o back-end verifica antes de inserir. 
2. O questionário tem 8 perguntas fixas (no front-end). Cada pergunta possui 3 alternativas, posicionadas de forma rotativa. 
3. Todas as perguntas são obrigatórias; o front exibe mensagem clara e impede o envio sem resposta completa. 
4. O cálculo dos pontos e porcentagens é feito no back-end ao enviar as respostas (não há loops adicionais no dashboard). 
5. A dashboard só exibe dados armazenados; não refaz cálculos. 
6. A linguagem da experiência evita termos competitivos (“afinidade”, “perfil”). 
7. Empates entre duas classes são possíveis e devem ser exibidos com ambas as cores (ciano, amarelo, verde neon); não há desempatador automático. 
8. O `sessionStorage` guarda somente o que o login já enviava; o novo status `questionarioRespondido` vem da API e não fica armazenado no `sessionStorage` (para evitar manipulação direta) — o front consulta o status no back-end ao carregar cada tela. Registrar o risco de outro usuário alterar `sessionStorage.ID_USUARIO` manualmente e impedir acesso indevido (documentado no plano). 
9. Não há novos middlewares de autenticação. Toda verificação (questionário respondido / não respondido) é feita no front via chamadas ao back-end baseadas no id autenticado. 

## 7. Alterações necessárias no banco e no arquivo SQL

- Adicionar ao `script-edgerunners.sql` a tabela `resultado_questionario` com os seguintes campos:
  - `id INT PRIMARY KEY AUTO_INCREMENT`,
  - `fk_usuario INT NOT NULL`, restrição `UNIQUE` e `FOREIGN KEY` para `usuario(id)`,
  - `resposta1`…`resposta8` (VARCHAR ou ENUM) para guardar a alternativa escolhida, cada uma indicando a classe (`netrunner`, `mercenario`, `nomade`),
- `pontos_netrunner`, `pontos_mercenario`, `pontos_nomade` (INT),
- `pct_netrunner`, `pct_mercenario`, `pct_nomade` (DECIMAL(4,1) ou similar para permitir 1 casa decimal),
- `classe_predominante VARCHAR(30)` (valores como `Netrunner`, `Mercenário`, `Nômade`, `Netrunner e Mercenário` etc.),
- `created_at DATETIME DEFAULT CURRENT_TIMESTAMP` (opcional, para auditoria). 
- Observação: quando houver empate entre duas classes, o texto de `classe_predominante` deve conter ambas (ex: `"Netrunner e Mercenário"`).
- Antes de inserir o registro, o back-end confere se a soma dos pontos (`pontos_netrunner + pontos_mercenario + pontos_nomade`) resulta exatamente em 8; caso contrário, rejeita o envio.
- O arquivo deverá conter comentários explicativos e, se já houver um `USE cyberpunk_edgerunners`, acrescentar os novos comandos logo após a criação das tabelas existentes. 
- Essa tabela será povoada somente a partir do momento em que o usuário responde; para testes locais pode-se inserir manualmente um registro de exemplo. 
- Documentar no plano o risco de manipulação do `sessionStorage` (ID) e mencionar que o back-end, por precisar da ID do usuário, deverá confiar apenas no que vier da sessão ativa (no caso, o login atual) e não em dados alterados no navegador. 

## 8. Decisões técnicas e justificativas

1. **Cálculo no servidor:** evita lógica complicada no front e garante consistência (porcentagens prontas para exibição). Os dados já calculados ficam disponíveis na rota GET para o dashboard e para o login. 
2. **Uso do Chart.js:** mantemos o radar (caso o CDN continue válido). Se o radar não for compatível, caímos para um gráfico de barras colorido com as três classes e cores definidas. Reaproveitamos a verificação `if (typeof Chart == "undefined")` da Dashboard 02 para mostrar mensagens de falha de internet. 
3. **Layouts simples:** os novos HTML reutilizam o header e o estilo existente (`public/css-cyberpunk/header.css` e `style.css`), mantendo a mesma tipografia e apenas replicando o grid da Dashboard 01. 
4. **SessionStorage limitado:** mantido exclusivamente para dados de login; qualquer outro estado (`questionarioRespondido`) é consultado ao carregar cada página, impedindo que o usuário altere manualmente esse flag. 
5. **Empates:** o back-end identifica empates entre duas classes e devolve ambas (ex: `classe_predominante = "Netrunner e Mercenário"`); o front destaca as duas cores e as mostra na mesma seção. 

## 9. Etapas numeradas de implementação com validações

1. **Atualizar script SQL primeiro** – criar a tabela `resultado_questionario` com todas as constraints necessárias antes de tocar nas rotas/login, garantindo que a estrutura já exista para as próximas etapas. **Validação:** revisar o `script-edgerunners.sql`, confirmar que a criação da tabela e as restrições (FK, UNIQUE) funcionam em MySQL 8.0 e preparar o script para execução manual.
2. **Ajustar autenticação para expor apenas o flag** – `usuarioController.autenticar` e modelo retornam exclusivamente `questionarioRespondido`; o front continua guardando os mesmos dados de login no `sessionStorage`. **Validação:** fazer login com usuários que já responderam e que ainda não responderam e verificar que apenas o campo `questionarioRespondido` muda, e que o redirecionamento no front corresponde ao valor.
3. **Criar rota/controller/model do questionário** – `POST /questionario/responder` (valida entradas, bloqueia múltiplos envios, confirma que a soma dos pontos dá 8 e calcula pontos/pct, devolvendo os resultados) e `GET /questionario/resultado/:idUsuario` para retornar os dados prontos. **Validação:** usar Postman ou console do front para confirmar que o POST responde 201 na primeira tentativa, 409 se já respondeu e que o GET responde com os KPIs e a fração correta.
4. **Construir o questionário (front-end)** – HTML com header existente, 8 perguntas fixas e 3 alternativas cada (sem embaralhar), mensagem de erro clara, botão de envio que usa `fetch` para o POST e, ao receber resposta positiva, guarda o que for necessário em `sessionStorage` e redireciona à dashboard. **Validação:** deixar um campo em branco para confirmar que o front impede o envio, verificar as mensagens de erro/sucesso e o redirecionamento após a submissão.
5. **Construir a dashboard** – replicar a Dashboard 01 com KPIs, gráfico radar/barras e card do personagem; incluir a fração (ex: `5/8 = 62,5%`) na apresentação dos dados e o fallback (`typeof Chart == "undefined"`). **Validação:** abrir a dashboard com dados reais e confirmar KPIs, fracionamento e gráfico, além da presença do card com espaço reservado para imagem.
6. **Bloquear navegação indevida** – cada página consulta `GET /questionario/resultado/:idUsuario` e força o redirecionamento correto (por exemplo, quem já respondeu não pode abrir o questionário e vice-versa). **Validação:** acessar diretamente as URLs com diferentes estados deve levar ao fluxo esperado (questionário ou dashboard). 
7. **Documentação e registros** – manter este plano atualizado, incluindo os testes manuais recomendados (cadastro, login, questionário, dashboard, novo login). **Validação:** revisar o plano para confirmar que todas as informações solicitadas (perguntas novas, tabela de personagens, dúvidas, riscos) continuam presentes.

## 10. Formas de validar cada etapa

- Contato manual com a API: teste de login com/sem resultado, GET/POST da rota do questionário e visualização dos dados. 
- Nos HTML, preencher valores, deixar algum campo em branco para confirmar validações, observar mensagens de erro/sucesso. 
- Confirmar que o script SQL contém constraints e pode ser executado sem erros (isolado). 
- No dashboard, simular falha de internet desativando acesso ao CDN de Chart.js e verificar mensagem de erro de carregamento. 
- Testar o redirecionamento forçando a abertura de URL direta (sem login ou com status incorreto). 

## 11. Perguntas do questionário & alternativas (para revisão)

> No front, não embaralhar as alternativas; mantenha as letras e as classes exatamente nesta ordem.

1. Lucy sonha em chegar à Lua para escapar de Night City. Qual seria o seu sonho?
   - A) Escapar pela rede e encontrar um lugar onde ninguém consiga me rastrear ou controlar. (Netrunner)
   - B) Ficar tão famoso que a cidade nunca mais me ignore, mesmo que o preço seja alto. (Mercenário)
   - C) Partir por terra, com quem eu amo, e encontrar um lar longe do alcance das corporações. (Nômade)
2. A equipe de Maine funciona quase como uma família. O que você espera de um grupo?
   - A) Profissionalismo: cada um cumpre sua função e o trabalho sai limpo, sem drama. (Mercenário)
   - B) Lealdade acima de tudo: o grupo é minha família e ninguém fica para trás. (Nômade)
   - C) Que confiem na informação que eu trago, porque um bom plano evita metade das balas. (Netrunner)
3. David recebe um implante poderoso que cobra um preço do corpo e da mente. O que você faria?
   - A) Usaria o mínimo possível, preferindo confiar na equipe, no veículo e no instinto. (Nômade)
   - B) Estudaria cada risco e cada falha antes de instalar, tratando meu corpo como um sistema. (Netrunner)
   - C) Instalaria sem hesitar, porque em Night City quem não evolui fica para trás. (Mercenário)
4. Um trabalho dá errado e o plano desmorona. Qual é o seu primeiro movimento?
   - A) Invadir o sistema do local para fechar portas, cortar câmeras e abrir uma saída. (Netrunner)
   - B) Reunir a equipe, garantir que todos saiam vivos e escapar no veículo. (Nômade)
   - C) Abrir caminho à força e terminar o serviço, mesmo saindo ferido. (Mercenário)
5. Um amigo está se perdendo por causa do excesso de implantes, como acontece com Maine. O que você faz?
   - A) Respeito a escolha dele e luto ao seu lado até o fim, mesmo sabendo como termina. (Mercenário)
   - B) Procuro uma solução técnica: dados, médicos, qualquer brecha que freie o processo. (Netrunner)
   - C) Tento tirá-lo da cidade e afastá-lo do ritmo que o destrói, nem que ele fique bravo comigo. (Nômade)
6. O que mais te incomoda em Night City?
   - A) Perder o direito de partir quando quiser, preso a um ciclo sem saída. (Nômade)
   - B) Viver e morrer sem que ninguém lembre o seu nome. (Mercenário)
   - C) Corporações esconderem a verdade e decidirem quem vive e quem morre. (Netrunner)
7. A equipe enfrenta um inimigo muito mais forte, como Adam Smasher. Qual é a sua postura?
   - A) Procuro a única fraqueza dele: um acesso, uma falha de sistema, um ponto cego. (Netrunner)
   - B) Enfrento mesmo assim: se for para cair, que seja lutando no auge. (Mercenário)
   - C) Evito o confronto e tiro todos de lá, porque sobreviver vale mais que vencer. (Nômade)
8. Como você gostaria de ser lembrado em Night City?
   - A) Como uma lenda que viveu intensamente e fez a cidade ouvir o meu nome. (Mercenário)
   - B) Como alguém que protegeu os seus e deixou a família mais segura. (Nômade)
   - C) Como quem descobriu o que ninguém via e abriu caminhos para outros saírem. (Netrunner)

## 12. Tabela de personagens existentes (dados do banco)

| Personagem       | Classe      | Frase atual                                | Descrição atual                                  | Imagem disponível? |
|------------------|-------------|--------------------------------------------|--------------------------------------------------|--------------------|
| David Martinez   | Mercenário  | “Escreva aqui a frase do David”             | “Garoto de rua que entra para a equipe de Maine.” | Não (reservar área vazia) |
| Lucy             | Netrunner   | “Escreva aqui a frase da Lucy”              | “Netrunner misteriosa que sonha em chegar à Lua.” | Não (reservar área vazia) |
| Maine            | Nômade     | “Escreva aqui a frase do Maine”              | “Líder da equipe, protege quem está sob seu comando.” | Não (reservar área vazia) |
| Rebecca          | Nômade     | “Escreva aqui a frase da Rebecca”           | “Atiradora explosiva da equipe de Maine.”         | Não (reservar área vazia) |

> Observação: as frases e descrições acima são temporárias, conforme indicado — manter como estão até que o conteúdo atualizado seja fornecido.

## 13. Dúvidas, conflitos e riscos pendentes

1. **Risco de manipulação do ID:** o `sessionStorage.ID_USUARIO` pode ser alterado manualmente no navegador; isso será apontado no plano como risco de segurança (sem solução complexa neste momento) e registrado para futuras etapas. (Resposta: não se preocupe com isso. O projeto é acadêmico.)
2. **Imagem do personagem:** confirmar depois onde o arquivo concreto estará; por ora, deixar o espaço reservado e não inventar caminhos. (Resposta: a imagem ficará no código, if FK_personagem == a fk da lucy, ira mostrar a imagem da lucy, ao menos essa é a ideia, caso não funcione, mude)
3. **Falha de internet:** replicar o comportamento da Dashboard 02 com mensagens do tipo “Não foi possível carregar o Chart.js (confira a internet).” 
4. **Atualização das frases:** manter as frases atuais no front-end, documentando que sofrerão alterações no futuro. 
5. **Perguntas/card:** qualquer ajuste nas perguntas deverá ser feito após minha revisão (já foram propostas acima). 
6. **Controle do questionário:** garantir que o front sempre valide com o back-end (via GET) se já existe resposta — nenhum dado assume automaticamente que a resposta foi enviada. 
7. **Dependência do Chart.js:** confirmar que a versão usada suporta gráfico radar; caso contrário, o plano prevê gráfico de barras com as mesmas cores (ciano, amarelo, verde neon) como alternativa. 
