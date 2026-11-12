const usuarioModel = require("../models/usuarioModel"); // model = arquivo que conversa com o banco

// DESATIVADO: o aquarioModel buscava os aquários da empresa do usuário (template AQUATECH).
// Não faz sentido no Edgerunners. Deixei comentado para você consultar.
// var aquarioModel = require("../models/aquarioModel");

// Chamada pela rota POST /usuarios/autenticar (src/routes/usuarios.js)
function autenticar(req, res) {
    const email = req.body.emailServer; // req.body = dados que o fetch do login.html enviou (nomes precisam ser iguais!)
    const senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!"); // 400 = faltou dado na requisição
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha) // vai até o model, que faz o SELECT no banco
            .then(
                function (resultadoAutenticar) { // .then = roda quando o banco responder; resultadoAutenticar = lista de linhas achadas
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        // Devolve ao front-end só o que ele vai guardar na sessão.
                        // A senha NÃO é mais devolvida (o template devolvia, o que não é seguro).
                        res.json({
                            id: resultadoAutenticar[0].id,
                            nome: resultadoAutenticar[0].nome,
                            email: resultadoAutenticar[0].email,
                            personagemId: resultadoAutenticar[0].personagemId, // id do personagem favorito
                            personagemNome: resultadoAutenticar[0].personagemNome, // estes 4 campos vêm do JOIN feito no model
                            personagemFrase: resultadoAutenticar[0].personagemFrase,
                            personagemDescricao: resultadoAutenticar[0].personagemDescricao,
                            personagemClasse: resultadoAutenticar[0].personagemClasse
                        });

                        /* DESATIVADO (template AQUATECH): depois de logar, buscava os aquários da empresa e devolvia junto.
                        aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoAquarios) => {
                                if (resultadoAquarios.length > 0) {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        senha: resultadoAutenticar[0].senha,
                                        aquarios: resultadoAquarios
                                    });
                                } else {
                                    res.status(204).json({ aquarios: [] });
                                }
                            })
                        */
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)"); // 403 = acesso negado
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) { // .catch = roda se der erro (ex.: banco desligado)
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage); // 500 = erro no servidor
                }
            );
    }

}

// Chamada pela rota POST /usuarios/cadastrar (src/routes/usuarios.js)
function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    const nome = req.body.nomeServer;
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;
    const fkPersonagem = req.body.personagemServer; // id do personagem escolhido no <select> do cadastro.html

    // DESATIVADO (template AQUATECH): vínculo do usuário com uma empresa.
    // var fkEmpresa = req.body.idEmpresaVincularServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (fkPersonagem == undefined) {
        res.status(400).send("Seu personagem favorito está undefined!");

        // DESATIVADO (template AQUATECH): validação da empresa
        // } else if (fkEmpresa == undefined) {
        //     res.status(400).send("Sua empresa a vincular está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, senha, fkPersonagem)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    // ER_DUP_ENTRY = o MySQL recusou porque o e-mail já existe (a coluna email é UNIQUE no script do banco)
                    if (erro.code == "ER_DUP_ENTRY") {
                        res.status(409).send("Este e-mail já está cadastrado."); // 409 = conflito
                    } else {
                        res.status(500).json(erro.sqlMessage);
                    }
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}
