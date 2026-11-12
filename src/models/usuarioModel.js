const database = require("../database/config"); // config.js = conexão com o MySQL (função executar)

// Busca no banco o usuário que tenha esse e-mail E essa senha.
// Devolve uma lista (array): vazia = ninguém encontrado | 1 item = login correto.
function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)

    // JOIN = junta a linha do usuário com a linha do personagem favorito dele (liga usuario.fk_personagem com personagem.id)
    // AS = "apelido": a coluna chega no controller com o nome que vem depois do AS (ex.: personagem.nome chega como personagemNome)
    const instrucaoSql = `
        SELECT usuario.id, usuario.nome, usuario.email,
               usuario.fk_personagem AS personagemId,
               personagem.nome AS personagemNome,
               personagem.frase AS personagemFrase,
               personagem.descricao AS personagemDescricao,
               personagem.classe AS personagemClasse
        FROM usuario
        JOIN personagem ON usuario.fk_personagem = personagem.id
        WHERE usuario.email = '${email}' AND usuario.senha = '${senha}';
    `;

    // ANTES (sem JOIN): devolvia só o número do personagem (personagemId). Deixei comentado para você consultar.
    // const instrucaoSql = `
    //     SELECT id, nome, email, fk_personagem AS personagemId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    // `;

    // DESATIVADO (template AQUATECH): buscava a empresa do usuário. A coluna fk_empresa não existe mais na tabela usuario.
    // var instrucaoSql = `
    //     SELECT id, nome, email, fk_empresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    // `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql); // executa o SQL e devolve a resposta do banco para o controller
}

// Grava um usuário novo. A ordem das colunas no INSERT precisa bater com a ordem dos valores no VALUES.
function cadastrar(nome, email, senha, fkPersonagem) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, fkPersonagem);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    const instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fk_personagem) VALUES ('${nome}', '${email}', '${senha}', '${fkPersonagem}');
    `;

    // DESATIVADO (template AQUATECH): o usuário era ligado a uma empresa (fk_empresa). Agora é ligado a um personagem (fk_personagem).
    // var instrucaoSql = `
    //     INSERT INTO usuario (nome, email, senha, fk_empresa) VALUES ('${nome}', '${email}', '${senha}', '${fkEmpresa}');
    // `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = { // deixa as funções visíveis para o controller usar
    autenticar,
    cadastrar
};
