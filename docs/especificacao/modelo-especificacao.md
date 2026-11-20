# Implementação de funcionalidades: questionário, dashboard e integração back-end

## 1. Contexto

Meu projeto será sobre **Cyberpunk: Edgerunners (1ª temporada)**. Estou desenvolvendo um site para aproximar ainda mais as pessoas que já conhecem e gostam do anime.

Após realizar login, o usuário deverá ser direcionado a um questionário, cujo protótipo já existe. Os dados de login já são armazenados no banco de dados.

O questionário será baseado nas três classes de Cyberpunk 2077: **Nômade, Mercenário e Netrunner**. Não haverá respostas certas ou erradas. O objetivo é identificar com qual classe o usuário mais se identifica, de acordo com suas respostas.

Após responder, o usuário será direcionado a uma dashboard para visualizar seu perfil e suas pontuações. O personagem favorito do usuário, que já está armazenado no banco e é carregado no login, também deverá aparecer na dashboard.

### Observação importante: arquivos de referência

Antes de planejar a implementação, analise a pasta `docs` e os itens existentes nela. Em especial:

- Analise os exemplos de redirecionamento para o questionário e identifique como o direcionamento dos usuários foi implementado.
- Analise os dois exemplos de dashboard disponíveis.
- Utilize a **Dashboard 01**, mais simplificada, como principal referência.
- Consulte a Dashboard 02 apenas como referência complementar, e somente se for necessário.

Quero seguir a estrutura da Dashboard 01, priorizando código simples e padrões semelhantes aos já utilizados no projeto. Não reproduza a complexidade da Dashboard 02. Considere esses exemplos antes de elaborar o documento de implementação.

## 2. Objetivo

Permitir que o usuário descubra com qual classe mais se identifica no universo de Night City, visualize seu personagem favorito e tenha uma experiência mais próxima do anime.

A dashboard deverá representar visualmente o perfil individual do usuário.

## 3. Escopo

### Dentro do escopo

- Implementar um questionário com **8 perguntas e 3 alternativas por pergunta**, uma alternativa correspondente a cada classe.
- Armazenar as respostas no banco de dados, vinculadas ao usuário autenticado.
- Calcular a pontuação e a porcentagem de cada classe e identificar o perfil predominante.
- Exibir os resultados na dashboard por meio de KPIs e gráficos, preferencialmente um gráfico radar para o resultado individual.
- Exibir o personagem favorito do usuário, utilizando os dados já existentes no banco e na sessão.
- Manter o CSS, o header e a identidade visual já presentes no site, alterando o header apenas para apresentar o nome do usuário quando estiver logado.
- Criar ou adaptar rotas, controllers e models necessários, respeitando a arquitetura atual.
- Atualizar o arquivo de script SQL já existente no projeto para incluir as alterações necessárias no banco. O script deverá ficar pronto para que eu possa copiá-lo e executá-lo manualmente no MySQL.
- Verificar, durante o login, se o usuário já respondeu ao questionário: se sim, direcioná-lo à dashboard; caso contrário, direcioná-lo ao questionário.

### Fora do escopo

- Qualquer comparação entre usuários, estatísticas da comunidade ou tela de Comunidade. Isso fica para uma versão futura e **não deve ser planejado nem implementado agora**.
- Fórum, publicações, comentários, curtidas, mensagens ou qualquer interação entre usuários.
- Alterar a estrutura geral do site ou modificar arquivos que não sejam necessários.
- Excluir linhas ou funcionalidades existentes sem necessidade.
- Alterar o sistema de login que já funciona, além das adaptações necessárias ao novo fluxo.
- Criar funcionalidades adicionais não solicitadas.
- Criar sistema novo de autenticação (token, JWT, middleware de permissões ou similar). Use o mesmo mecanismo de identificação do usuário que o login atual já utiliza.
- Introduzir estruturas, comandos ou bibliotecas avançadas sem necessidade. Preserve o nível de complexidade e os padrões de programação existentes. Caso algo novo seja necessário, justifique no documento de implementação.

### Nível de complexidade do código (importante)

Sou iniciante e preciso conseguir explicar todo o código. Por isso:

- Use apenas **vetores, if/else, while e for**. Evite construções avançadas (por exemplo: arrow functions encadeadas, map, filter, reduce, destructuring, spread, classes, async/await complexo). Se algo assim for realmente inevitável, justifique no plano.
- Quando o código precisar de algo que eu possa não conhecer, comente ao lado explicando o que faz.
- Buscar os dados ao carregar a página, no mesmo padrão que o projeto já usa. Não é necessário atualizar a dashboard automaticamente.
- A dashboard apenas **busca e mostra dados já salvos no banco ou na sessão**. Ela não deve fazer cálculos nem laços só para descobrir algo que já esteja salvo.
- Prefira elementos individuais e simples (um bloco para cada classe, por exemplo) em vez de componentes genéricos compartilhados.

Mantenha o CSS semelhante ao atual e preserve os comentários e a organização do código por partes.

## 4. Fluxo e funcionalidades

1. O usuário realiza cadastro e seus dados são armazenados no banco.
2. O usuário realiza login. Os dados do usuário e do personagem favorito (nome, frase, descrição e classe) são carregados na sessão.
3. O sistema verifica se ele já respondeu ao questionário.
4. Se ainda não respondeu, é direcionado ao questionário. Se já respondeu, vai diretamente para a dashboard.
5. O usuário responde às 8 perguntas e envia as respostas.
6. O sistema armazena as respostas vinculadas ao usuário, calcula as pontuações **uma única vez, no momento do envio**, salva o resultado no banco e direciona o usuário à dashboard.
7. Na dashboard, o usuário visualiza sua classe predominante, as pontuações e o personagem favorito.

O header deverá apresentar o nome do usuário autenticado e manter os links de navegação existentes, permitindo que ele retorne às páginas iniciais do site.

## 5. Regras de negócio e requisitos técnicos

### 5.1. Login e direcionamento

- Após o login, verificar se o usuário autenticado já respondeu ao questionário.
- Se já respondeu, direcioná-lo diretamente à dashboard; caso contrário, direcioná-lo ao questionário.
- Cada usuário poderá responder ao questionário apenas uma vez nesta versão. Garantir isso no banco (por exemplo, com restrição de unicidade por usuário) e também na verificação do back-end.
- Se um usuário que já respondeu tentar abrir o questionário de novo, direcioná-lo à dashboard. Se um usuário que ainda não respondeu tentar abrir a dashboard, direcioná-lo ao questionário. Se não houver usuário logado, direcioná-lo ao login.
- Vincular as respostas ao identificador do usuário autenticado.
- Não permitir que um usuário visualize ou altere respostas pertencentes a outro usuário. Usar o identificador do usuário do mesmo mecanismo que o login atual já usa. Se esse mecanismo tiver alguma limitação de segurança, registrar como risco no plano, sem criar solução complexa.

### 5.2. Questionário

- 8 perguntas, cada uma com 3 alternativas (uma por classe), no formato de seleção única (um clique escolhe uma alternativa).
- As perguntas ficam fixas no arquivo da tela do questionário. Não criar tabelas de perguntas nem de alternativas no banco.
- Não deve haver respostas certas ou erradas. O tom das perguntas deve ser do universo de Cyberpunk: Edgerunners e Night City, sem pergunta que "entregue" qual alternativa é de qual classe.
- A posição de cada classe entre as alternativas deve variar de uma pergunta para outra, para que a mesma classe não apareça sempre na mesma posição.
- Todas as 8 perguntas são obrigatórias. Se faltar alguma, mostrar uma mensagem clara na tela e não enviar. Após o envio, mostrar mensagem de sucesso ou de erro.
- O protótipo do questionário já existe e deve ser adaptado, não refeito do zero.
- **Não escreva as perguntas definitivas no código ainda.** No plano, proponha as 8 perguntas e as 24 alternativas em uma seção separada, indicando a classe de cada alternativa, para minha revisão.

### 5.3. Cálculo das classes

Cada pergunta terá três alternativas, representando as classes:

- Netrunner: ciano.
- Mercenário: amarelo.
- Nômade: verde neon.

Cada resposta adicionará um ponto à classe correspondente. Ao final das 8 perguntas:

- Somar os pontos de cada classe (a soma sempre será 8).
- Calcular a porcentagem de cada classe: `pontos ÷ 8 × 100`, exibida com uma casa decimal (por exemplo, 37,5%).
- Identificar a classe com maior pontuação.

Este questionário não é uma competição. Não usar linguagem de vencedor, perdedor, ranking ou “1º lugar”. Usar termos como “afinidade”, “perfil” e “combina com você”. Um empate é um resultado válido e não deve ser desempatado nem tratado como erro.

**Empate:** com 8 perguntas e 3 classes, só pode haver empate entre **duas** classes (por exemplo, 3-3-2). Empate entre as três é impossível. Em caso de empate, apresentar as duas classes empatadas, sem escolher uma arbitrariamente, com o destaque mostrando as duas, cada uma na sua cor.

O cálculo é feito no back-end no momento do envio e o resultado é salvo no banco, para que a dashboard só precise ler.

### 5.4. Dashboard individual

A dashboard deverá apresentar:

- Classe predominante do usuário, com destaque visual na cor da classe.
- Pontuação (de 0 a 8) e porcentagem de cada classe.
- Gráfico radar para comparar as três pontuações individuais. A biblioteca de gráficos já usada no projeto (Chart.js) deve ser verificada quanto à versão e ao suporte a radar. Se não for compatível, propor uma alternativa simples, como gráfico de barras.
- Três KPIs simples, por exemplo: classe predominante, pontos da classe predominante (ex.: 5 de 8) e porcentagem da classe predominante. O plano pode sugerir outros KPIs, desde que sejam apenas dados já salvos.
- Personagem favorito cadastrado, usando os dados que já estão na sessão (nome, frase, descrição e classe).
- Imagem e frase correspondente ao personagem, caso os arquivos e conteúdos estejam disponíveis.

### 5.5. Banco de dados e arquitetura

Será necessário configurar as rotas, controllers e models necessários para a comunicação entre frontend, backend e banco de dados. Respeite a organização existente e reutilize as estruturas disponíveis sempre que possível.

- Proponha o **menor número de tabelas possível** e justifique. Uma possibilidade a avaliar, não obrigatória: uma tabela com o identificador do usuário (único), as 8 respostas e os pontos de cada classe, ou então uma tabela de respostas e outra de resultado, se isso combinar melhor com os padrões do projeto.
- Identifique as tabelas existentes (como usuário e personagem) e verifique se a coluna de classe do personagem usa os mesmos nomes de classe desta especificação (Netrunner, Mercenário e Nômade). Se houver divergência, liste no plano como conflito.
- Localize o arquivo de script SQL já existente no projeto (por exemplo, `script.sql` ou o arquivo equivalente). **Durante a implementação**, atualize esse arquivo com as alterações necessárias, incluindo criação ou alteração de tabelas, chaves primárias, chaves estrangeiras e relacionamentos. Preserve os comandos e estruturas existentes que ainda forem necessários. O resultado deverá ficar organizado e pronto para que eu possa copiar e executar manualmente no MySQL.
- Não conecte ao meu MySQL nem execute o script no banco. Apenas atualize o arquivo SQL do projeto para minha revisão e execução manual.

### 5.6. Comentários e organização do código

- Mantenha os comentários organizados por partes, seguindo o padrão existente.
- Identifique como **DESATIVADO**, com uma breve explicação, somente os trechos que realmente precisarem ser desativados por causa da implementação.
- Não comente ou exclua código antigo sem necessidade.
- Comente brevemente as novas funcionalidades para explicar o que cada parte realiza.
- Preserve o código que não estiver relacionado às alterações.

## 6. Interface

A interface deverá seguir a identidade visual já existente no site de Cyberpunk: Edgerunners.

### Questionário

- Utilizar o mesmo header do site.
- Manter a identidade visual existente.
- Apresentar as 8 perguntas e suas alternativas.
- Permitir que o usuário responda e conclua o questionário.
- Exibir mensagens adequadas para validação e envio.

### Dashboard individual

Apresentar a identificação do usuário, sua classe predominante com destaque visual, as pontuações, o gráfico radar, os KPIs e a área do personagem favorito.

### Identidade visual e imagens

- Netrunner: ciano.
- Mercenário: amarelo.
- Nômade: verde neon.

Não crie um novo padrão visual. Utilize as cores, fontes, espaçamentos, header e componentes já existentes. Verifique os caminhos das imagens e GIFs nos arquivos do projeto. Caso a imagem do personagem favorito não esteja disponível, mantenha o espaço vazio; não invente caminhos nem utilize imagens aleatórias.

## 7. Critérios de aceitação

1. O login verifica corretamente se o usuário já respondeu ao questionário.
2. Usuários sem respostas são direcionados ao questionário; usuários que já responderam vão diretamente à dashboard.
3. As 8 respostas são armazenadas e vinculadas ao usuário correto.
4. O usuário não consegue responder novamente nesta versão nem acessar respostas de outros usuários.
5. O sistema calcula corretamente a pontuação, a porcentagem e os empates entre duas classes.
6. A dashboard apresenta os resultados individuais e o personagem favorito, quando houver imagem disponível.
7. O header exibe corretamente o nome do usuário autenticado.
8. O arquivo SQL existente no projeto é atualizado com as tabelas e os relacionamentos necessários e fica pronto para execução manual no MySQL.
9. O gráfico radar (ou a alternativa aprovada) apresenta os dados corretos.
10. A identidade visual e a estrutura existente do site são preservadas.
11. Os caminhos de imagens e GIFs são verificados antes de serem utilizados.
12. O comando `npm start` executa o projeto sem erros no ambiente disponível. Caso alguma configuração externa impeça o teste, registrar a limitação.
13. O plano e, depois, a implementação trazem um **roteiro de teste manual** do fluxo completo (cadastro, login, questionário, dashboard, novo login), para eu executar com o meu MySQL.
14. As alterações realizadas são registradas na pasta `registros`.

## 8. Processo de desenvolvimento (SDLC)

O desenvolvimento deverá seguir as etapas do **Software Development Life Cycle (SDLC)**.

**Nesta primeira etapa, quero somente o planejamento, sem implementação.** O agente deverá:

1. Analisar todas as especificações deste documento.
2. Analisar a estrutura atual do projeto.
3. Identificar as tecnologias, bibliotecas e padrões utilizados.
4. Ler primeiro o exemplo de redirecionamento para o questionário e a Dashboard 01 da pasta `docs`. Consultar a Dashboard 02 apenas se for necessário.
5. Identificar as tabelas existentes e os relacionamentos do banco de dados, incluindo o arquivo SQL que deverá ser atualizado posteriormente.
6. Identificar quais arquivos precisarão ser criados ou modificados, incluindo rotas, controllers, models, telas e o arquivo SQL existente.
7. Elaborar um documento de implementação com a ordem das alterações, rotas, controllers, models, tabelas, consultas SQL, mudanças de interface e testes necessários, com etapas numeradas e a forma de validar cada etapa.
8. Incluir no documento: as 8 perguntas e 24 alternativas propostas (seção 5.2) e uma tabela dos personagens existentes indicando se a imagem e a frase de cada um já existem no projeto.
9. Apontar possíveis problemas, conflitos, riscos ou informações ausentes nas especificações. No final do documento, listar as dúvidas que precisam da minha resposta antes da implementação, em vez de assumir respostas.

Salvar o documento de planejamento em `registros/plano-implementacao.md`. Se a pasta `registros` não existir, criar somente essa pasta, apenas para salvar o plano, e avisar isso no início do documento.

**Não implemente nada nesta etapa. Não altere, exclua ou crie arquivos do sistema, exceto o documento de planejamento solicitado. Não modifique o arquivo SQL ainda.**

Após elaborar o documento, aguarde minha revisão e autorização antes de iniciar a implementação.