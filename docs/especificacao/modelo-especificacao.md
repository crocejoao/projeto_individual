# Implementação de funcionalidades: questionário, dashboard e integração back-end

## 1. Contexto

Meu projeto será sobre **Cyberpunk: Edgerunners (1ª temporada)**. Estou desenvolvendo um site para aproximar ainda mais as pessoas que já conhecem e gostam do anime.

Após realizar login, o usuário deverá ser direcionado a um questionário, cujo protótipo já existe. Os dados de login já são armazenados no banco de dados.

O questionário será baseado nas três classes de Cyberpunk 2077: **Nômade, Mercenário e Netrunner**. Não haverá respostas certas ou erradas. O objetivo é identificar com qual classe o usuário mais se identifica, de acordo com suas respostas.

Após responder, o usuário será direcionado a uma dashboard para visualizar seu perfil, suas pontuações e, se possível, comparar seus resultados com os demais usuários. O personagem favorito, informado durante o login e já armazenado no banco, também deverá aparecer na dashboard.

### Observação importante: arquivos de referência

Antes de planejar a implementação, analise a pasta `docs` e os itens existentes nela. Em especial:

- Analise os exemplos de redirecionamento para o questionário e identifique como o direcionamento dos usuários foi implementado.
- Analise os dois exemplos de dashboard disponíveis.
- Utilize a **Dashboard 01**, mais simplificada, como principal referência.
- Consulte a Dashboard 02 apenas como referência complementar.

Quero seguir a estrutura da Dashboard 01, priorizando código simples e padrões semelhantes aos já utilizados no projeto. Não reproduza a complexidade da Dashboard 02. Considere esses exemplos antes de elaborar o documento de implementação.

## 2. Objetivo

Permitir que o usuário descubra com qual classe mais se identifica no universo de Night City, visualize seu personagem favorito e tenha uma experiência mais próxima do anime.

A dashboard deverá representar visualmente o perfil individual. Uma possível tela de Comunidade poderá apresentar estatísticas agregadas para que o usuário compare seu perfil com os demais participantes.

## 3. Escopo

### Dentro do escopo

- Implementar um questionário com **8 perguntas e 3 alternativas por pergunta**, uma alternativa correspondente a cada classe.
- Armazenar as respostas no banco de dados, vinculadas ao usuário autenticado.
- Calcular a pontuação e a porcentagem de cada classe e identificar o perfil predominante.
- Exibir os resultados na dashboard por meio de KPIs e gráficos, preferencialmente um gráfico radar para o resultado individual.
- Exibir o personagem favorito do usuário, utilizando os dados já existentes no banco.
- Manter o CSS, o header e a identidade visual já presentes no site, alterando o header apenas para apresentar o nome do usuário quando estiver logado.
- Criar ou adaptar rotas, controllers e models necessários, respeitando a arquitetura atual.
- Atualizar o arquivo de script SQL já existente no projeto para incluir as alterações necessárias no banco. O script deverá ficar pronto para que eu possa copiá-lo e executá-lo manualmente no MySQL.
- Verificar, durante o login, se o usuário já respondeu ao questionário: se sim, direcioná-lo à dashboard; caso contrário, direcioná-lo ao questionário.

### Funcionalidade opcional: Comunidade

A ideia é ter uma segunda tela, acessível pela dashboard, chamada **Comunidade**. Ela poderá apresentar:

- Quantidade total de usuários que responderam ao questionário.
- Quantidade e porcentagem de participantes em cada classe.
- Um gráfico de barras comparando a distribuição dos perfis.

Não quero desenvolver um fórum completo, com publicações, comentários, curtidas, mensagens ou interações entre usuários. A Comunidade será somente uma área de comparação estatística.

Essa funcionalidade só deverá ser implementada se puder utilizar as tecnologias, bibliotecas e estruturas já existentes, preferencialmente com uma consulta SQL agregada e uma rota simples. Não crie novas dependências nem modifique a arquitetura para incluí-la. Caso aumente significativamente a complexidade ou possa prejudicar as funcionalidades principais, deixe-a para uma versão futura e explique o motivo no documento de implementação.

### Fora do escopo

- Alterar a estrutura geral do site ou modificar arquivos que não sejam necessários.
- Excluir linhas ou funcionalidades existentes sem necessidade.
- Alterar o sistema de login que já funciona, além das adaptações necessárias ao novo fluxo.
- Criar funcionalidades adicionais não solicitadas ou desenvolver um fórum/sistema de interação entre usuários.
- Introduzir estruturas, comandos ou bibliotecas avançadas sem necessidade. Preserve o nível de complexidade e os padrões de programação existentes. Caso algo novo seja necessário, justifique no documento de implementação.

Mantenha o CSS semelhante ao atual e preserve os comentários e a organização do código por partes.

## 4. Fluxo e funcionalidades

1. O usuário realiza cadastro e seus dados são armazenados no banco.
2. O usuário realiza login.
3. O sistema verifica se ele já respondeu ao questionário.
4. Se ainda não respondeu, é direcionado ao questionário. Se já respondeu, vai diretamente para a dashboard.
5. O usuário responde às 8 perguntas e envia as respostas.
6. O sistema armazena as respostas vinculadas ao usuário, calcula as pontuações e apresenta o resultado na dashboard.
7. Na dashboard, o usuário visualiza sua classe predominante, as pontuações, o personagem favorito e, caso seja viável, um acesso à tela Comunidade.

O header deverá apresentar o nome do usuário autenticado e manter os links de navegação existentes, permitindo que ele retorne às páginas iniciais do site.

## 5. Regras de negócio e requisitos técnicos

### 5.1. Login e direcionamento

- Após o login, verificar se o usuário autenticado já respondeu ao questionário.
- Se já respondeu, direcioná-lo diretamente à dashboard; caso contrário, direcioná-lo ao questionário.
- Cada usuário poderá responder ao questionário apenas uma vez nesta versão.
- Vincular as respostas ao identificador do usuário autenticado.
- Não permitir que um usuário visualize ou altere respostas pertencentes a outro usuário.

### 5.2. Cálculo das classes

Cada pergunta terá três alternativas, representando as classes:

- Netrunner: ciano.
- Mercenário: amarelo.
- Nômade: verde neon.

Cada resposta adicionará um ponto à classe correspondente. Ao final das 8 perguntas, o sistema deverá somar os pontos, calcular a porcentagem de cada classe e identificar a classe com maior pontuação.

Em caso de empate, apresentar as classes empatadas, sem escolher uma arbitrariamente. As perguntas e alternativas deverão considerar as características das três classes, sem respostas certas ou erradas.

### 5.3. Dashboard individual

A dashboard deverá apresentar:

- Classe predominante do usuário.
- Pontuação e porcentagem de cada classe.
- Gráfico radar para comparar as três pontuações individuais; se não for compatível com as bibliotecas existentes, propor uma alternativa simples, como gráfico de barras.
- KPIs com informações relevantes do resultado.
- Personagem favorito cadastrado durante o login.
- Imagem e frase correspondente ao personagem, caso os arquivos e conteúdos estejam disponíveis.

### 5.4. Comunidade (opcional)

Se a funcionalidade for viável, deverá:

- Mostrar a quantidade de participantes que responderam ao questionário.
- Mostrar a quantidade e a porcentagem de usuários de cada classe.
- Apresentar um gráfico de barras comparando a distribuição dos perfis.
- Utilizar consultas SQL agregadas, evitando buscar e processar individualmente todos os usuários e suas respostas.
- Não exibir dados pessoais nem respostas individuais de outros participantes.

Em caso de empate no resultado de um participante, contabilizá-lo separadamente como empate, para não contar o mesmo usuário em mais de uma classe. A tela deverá seguir a capacidade e a estrutura atual do projeto.

### 5.5. Banco de dados e arquitetura

Será necessário configurar as rotas, controllers e models necessários para a comunicação entre frontend, backend e banco de dados. Respeite a organização existente e reutilize as estruturas disponíveis sempre que possível.

Localize o arquivo de script SQL já existente no projeto (por exemplo, `script.sql` ou o arquivo equivalente). **Durante a implementação**, atualize esse arquivo com as alterações necessárias, incluindo criação ou alteração de tabelas, chaves primárias, chaves estrangeiras e relacionamentos. Preserve os comandos e estruturas existentes que ainda forem necessários. O resultado deverá ficar organizado e pronto para que eu possa copiar e executar manualmente no MySQL.

Não conecte ao meu MySQL nem execute o script no banco. Apenas atualize o arquivo SQL do projeto para minha revisão e execução manual.

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

Apresentar a identificação do usuário, sua classe predominante com destaque visual, as pontuações, os gráficos, os KPIs e a área do personagem favorito. Incluir acesso à Comunidade somente se ela for implementada.

### Comunidade (opcional)

Seguir o padrão visual da dashboard individual, apresentando apenas os dados agregados da comunidade em gráficos e indicadores.

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
5. O sistema calcula corretamente a pontuação, a porcentagem e os empates entre classes.
6. A dashboard apresenta os resultados individuais e o personagem favorito, quando houver imagem disponível.
7. O header exibe corretamente o nome do usuário autenticado.
8. O arquivo SQL existente no projeto é atualizado com as tabelas e os relacionamentos necessários e fica pronto para execução manual no MySQL.
9. Os gráficos apresentam os dados corretos.
10. Se a Comunidade for viável e implementada, apresenta dados agregados corretos, sem expor informações pessoais.
11. A identidade visual e a estrutura existente do site são preservadas.
12. Os caminhos de imagens e GIFs são verificados antes de serem utilizados.
13. O comando `npm start` executa o projeto sem erros no ambiente disponível. Caso alguma configuração externa impeça o teste, registrar a limitação.
14. O fluxo completo, do login à visualização dos resultados, é testado.
15. As alterações realizadas são registradas na pasta `registros`.

## 8. Processo de desenvolvimento (SDLC)

O desenvolvimento deverá seguir as etapas do **Software Development Life Cycle (SDLC)**.

**Nesta primeira etapa, quero somente o planejamento, sem implementação.** O agente deverá:

1. Analisar todas as especificações deste documento.
2. Analisar a estrutura atual do projeto.
3. Identificar as tecnologias, bibliotecas e padrões utilizados.
4. Analisar integralmente a pasta `docs`, incluindo os exemplos de redirecionamento para o questionário e as duas dashboards. Utilizar a Dashboard 01 como principal referência.
5. Identificar as tabelas existentes e os relacionamentos do banco de dados, incluindo o arquivo SQL que deverá ser atualizado posteriormente.
6. Identificar quais arquivos precisarão ser criados ou modificados, incluindo rotas, controllers, models, telas e o arquivo SQL existente.
7. Verificar a viabilidade técnica da tela Comunidade.
8. Elaborar um documento de implementação com a ordem das alterações, rotas, controllers, models, tabelas, consultas SQL, mudanças de interface e testes necessários.
9. Apontar possíveis problemas, conflitos, riscos ou informações ausentes nas especificações.

Salvar o documento de planejamento na pasta `registros`, respeitando a organização existente. Se essa pasta não existir, informar isso no planejamento, sem criá-la nesta etapa.

**Não implemente nada nesta etapa. Não altere, exclua ou crie arquivos do sistema, exceto o documento de planejamento solicitado. Não modifique o arquivo SQL ainda.**

Após elaborar o documento, aguarde minha revisão e autorização antes de iniciar a implementação.