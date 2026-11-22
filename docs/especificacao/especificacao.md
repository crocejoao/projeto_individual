# Especificação: Integração do Questionário com a Dashboard

## 1. Contexto

O sistema já possui o login funcionando e o armazenamento das respostas do questionário no banco de dados. Entretanto, existe um problema na comunicação entre o envio das respostas, as rotas e a dashboard, fazendo com que os dados não sejam apresentados corretamente ao usuário.

O objetivo é corrigir exclusivamente essa integração, aproveitando a estrutura e as funcionalidades que já existem no projeto.

Antes de qualquer alteração, analise o código existente e identifique como o questionário envia e armazena as respostas, como as rotas estão organizadas e como a dashboard recebe os dados.

Também será necessário ajustar o visual da dashboard utilizando os arquivos de referência disponíveis na pasta `exemplo-dashboard-e-questionario`:

- **Dashboard 01:** utilizar como referência visual, preservando sua identidade, organização e aparência.
- **Dashboard 02:** utilizar como referência para a estrutura do código, priorizando sua implementação mais simples.

As perguntas do questionário são modelos de exemplo e **não devem ser modificadas**. Sua ordem, estrutura, conteúdo, ligações e funcionamento atual devem ser preservados.

**Importante:** nesta etapa, realize somente a análise do projeto e elabore um plano de ação dentro da pasta `docs`. Não implemente as alterações antes da validação desse plano.

## 2. Objetivo

Garantir que as respostas enviadas pelo usuário no questionário sejam corretamente disponibilizadas e apresentadas na dashboard.

A dashboard deverá apresentar essas informações utilizando o visual da Dashboard 01 de referência, mas mantendo a simplicidade estrutural e os padrões de implementação encontrados na Dashboard 02.

O resultado esperado é uma integração funcional entre questionário, banco de dados, rotas e dashboard, sem comprometer as funcionalidades já existentes.

## 3. Escopo

### Dentro do escopo

- Analisar o fluxo atual de envio e armazenamento das respostas do questionário.
- Identificar e corrigir o problema de comunicação entre as rotas e a dashboard.
- Garantir que a dashboard consiga recuperar e apresentar as respostas já armazenadas no banco de dados.
- Adaptar o visual da dashboard conforme a Dashboard 01 de referência.
- Utilizar a estrutura mais simples da Dashboard 02 como referência para a implementação.
- Preservar o padrão de código e as tecnologias que já são utilizados no projeto.
- Criar um plano de ação detalhado dentro da pasta `docs`, para validação antes da implementação.

### Fora do escopo

- Modificar as perguntas, alternativas ou textos do questionário.
- Alterar a ordem das perguntas ou suas ligações.
- Refazer o sistema de login ou cadastro.
- Modificar funcionalidades que já estão funcionando corretamente.
- Criar novos módulos, recursos ou funcionalidades desnecessárias.
- Adicionar bibliotecas, frameworks ou tecnologias que não estejam sendo utilizados no projeto.
- Alterar a estrutura do banco de dados sem necessidade comprovada e sem aprovação prévia.
- Refazer a lógica de envio e armazenamento das respostas quando ela já estiver funcionando corretamente.

## 4. Funcionalidades

A implementação deverá contemplar somente as seguintes operações:

1. **Envio das respostas:** preservar o funcionamento atual do questionário e seu processo de armazenamento no banco de dados.

2. **Recuperação das respostas:** corrigir a comunicação entre as rotas e a dashboard para que as respostas armazenadas possam ser recuperadas corretamente.

3. **Apresentação na dashboard:** disponibilizar as respostas do questionário na interface do usuário, respeitando a estrutura de dados já existente.

4. **Identificação do usuário:** preservar a lógica existente de autenticação e garantir que a dashboard apresente os dados correspondentes ao usuário autenticado, conforme as regras atuais do sistema.

5. **Adequação visual:** adaptar a dashboard ao modelo visual da Dashboard 01, utilizando como referência de implementação o código mais simples da Dashboard 02.

## 5. Regras de negócio e restrições técnicas

- Preservar integralmente o funcionamento atual do login e do cadastro.
- Não modificar o conteúdo, a ordem, as alternativas ou as ligações das perguntas do questionário.
- Não duplicar o armazenamento de respostas nem criar registros desnecessários.
- Respeitar a estrutura atual do banco de dados e os relacionamentos já implementados.
- Manter as rotas existentes sempre que possível, realizando apenas as correções necessárias.
- Não reescrever funcionalidades que já estejam funcionando.
- Utilizar exclusivamente as tecnologias, bibliotecas e padrões já presentes no projeto.
- Seguir o estilo de programação utilizado nos arquivos existentes.
- Caso seja necessário utilizar uma estrutura de repetição ou outra construção de código, respeitar os recursos e padrões que já aparecem no projeto. Não introduzir estruturas ou abordagens desnecessariamente diferentes.
- Caso encontre declarações utilizando `var`, substituí-las por `let`, respeitando o funcionamento do código.
- Evitar alterações amplas quando uma correção pontual for suficiente.

### Verificação da arquitetura e segurança dos dados

- Verificar se o fluxo de envio e recuperação das respostas respeita a arquitetura já existente no projeto, passando pelas camadas de **Routes, Controllers e Models**.
- Analisar como essas três camadas já estão organizadas e como se comunicam entre si, seguindo os padrões existentes.
- Conferir se as respostas são encaminhadas corretamente entre essas camadas até sua persistência e posterior recuperação para a dashboard.
- Verificar se a identificação do usuário autenticado é respeitada durante a recuperação dos dados, evitando que um usuário tenha acesso às respostas de outro.
- Analisar a modelagem atual do banco de dados, incluindo tabelas, chaves e relacion