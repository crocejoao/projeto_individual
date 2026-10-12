# AGENTS.md

## Visão geral

Este projeto é uma aplicação web (Web-Data-Viz) temática baseada no universo de Cyberpunk Edgerunners. O objetivo da aplicação é apresentar dados, estatísticas e interações sobre o anime, conectando um front-end dinâmico a um back-end estruturado em Node.js e banco de dados MySQL. O projeto segue uma estrutura acadêmica focada em demonstrar a lógica de integração entre as camadas de front-end, back-end e persistência de dados. O principal usuário será (eu) mesmo, pois será um projeto pessoal que irá refletir meus gostos e valores através do anime. 

O projeto tem o propósito de contextualizar sobre o anime, compartilhar valores, e utilizar uma dashboard para compartilhar estatísticas ou fazer questionários e compartilhar o resultado em forma de gráficos, com a finalidade de conectar o usuário com o universo cyberpunk. 

## Tecnologias

HTML;
CSS;
JavaScript;
Chart.Js;
Node.js;
MySQL.

## Comandos

Para rodar o projeto:
-npm i - instala as dependências
-npm start - inicia a API

## Arquitetura

O projeto é dividido em back-end (pasta src e arquivos na raiz) e front-end (pasta public):

app.js - arquivo principal, configura o framework Express e registra as rotas.

src/routes - define os endpoints da aplicação e encaminha para os controllers.

src/controllers - recebe a requisição, realiza as validações de dados e envia a resposta ao cliente.

src/models - monta as querys SQL e as executa diretamente no banco de dados.

src/database - contém a configuração de conexão com o MySQL (config.js) e scripts do banco.

public - armazena as páginas HTML, estilos (css), lógica de interface (js) e imagens (assets) de Cyberpunk Edgerunners.

Fluxo de uma requisição:
Front-end (fetch) > app.js > routes > controllers > models > Banco de dados. (A resposta faz o caminho inverso).

Onde criar novos arquivos:
Ao criar uma nova funcionalidade, crie o arquivo de rota, o controller e o model correspondentes. Em seguida, importe e registre a nova rota no arquivo app.js.

## Padrões de desenvolvimento

Utilizar const por padrão e let apenas quando houver necessidade de reatribuição (evitar var).

Convenção de mensagens para commits:

- Feat: - para adição de novas funcionalidades.
- Fix: - para correção de bugs e erros.
- Refactor: - para refatoração de código sem alterar o comportamento.
- Arquivos de rota no plural (ex: usuarios.js) e arquivos de controller/model no singular (ex:  usuarioController.js, usuarioModel.js).
- Funções e variáveis devem ser escritas em camelCase e em português.
- Tabelas do banco de dados no singular; chaves estrangeiras devem possuir o prefixo fk_ (ex: fk_usuario).
- Métodos HTTP: POST para cadastros/inserções, GET para listagens/buscas, PUT para edições e DELETE para exclusões.
- Usar um breve comentário e um verbo para coisas pequenas, exemplo: Subindo imagem, Alterando fontes, etc.


## Cuidados e restrições

Gestão de Dependências: É expressamente proibida a alteração do arquivo package.json ou a instalação de bibliotecas de terceiros sem aprovação prévia.

Proteção de Credenciais: É terminantemente proibido versionar dados sensíveis, chaves de API ou senhas reais de banco de dados nos arquivos .env e .env.dev.

Não alterar a lógica de escolha de ambiente (desenvolvimento vs produção) configurada no topo do app.js.

Não commitar dados sensíveis ou senhas reais do banco nos arquivos .env e .env.dev.

Sempre que renomear rotas, parâmetros ou campos de retorno no back-end, lembre-se de atualizar imediatamente os arquivos da pasta public (front-end) que dependem deles.


## Regra geral: 
Antes de implementar uma alteração, siga as tecnologias, arquitetura, convenções e restrições descritas neste documento. Caso alguma informação esteja ausente, analise o código existente e siga os padrões já adotados no projeto. 
