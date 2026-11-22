const questionarioModel = require("../models/questionarioModel");

function calcularPredominancias(contagens) {
    let maior = contagens.netrunner;
    if (contagens.mercenario > maior) {
        maior = contagens.mercenario;
    }
    if (contagens.nomade > maior) {
        maior = contagens.nomade;
    }
    return {
        maior: maior,
        netrunnerPredominante: contagens.netrunner == maior,
        mercenarioPredominante: contagens.mercenario == maior,
        nomadePredominante: contagens.nomade == maior
    };
}

function montarResposta(respostas, contagens, porcentagens, classePredominante, predominancias) {
    return {
        respondido: true,
        classePredominante: classePredominante,
        pontosNetrunner: contagens.netrunner,
        pontosMercenario: contagens.mercenario,
        pontosNomade: contagens.nomade,
        pctNetrunner: porcentagens.netrunner,
        pctMercenario: porcentagens.mercenario,
        pctNomade: porcentagens.nomade,
        netrunnerPredominante: predominancias.netrunnerPredominante,
        mercenarioPredominante: predominancias.mercenarioPredominante,
        nomadePredominante: predominancias.nomadePredominante,
        respostas: respostas
    };
}

function responder(req, res) {
    let idUsuario = req.body.idUsuario;
    if (idUsuario == undefined) {
        res.status(400).send("ID do usuário está ausente.");
        return;
    }
    // SEGURANÇA: mesma checagem da função resultado (o id entra direto no SQL do model)
    if (isNaN(idUsuario) || idUsuario == "") {
        res.status(400).send("ID do usuário inválido.");
        return;
    }

    let respostas = [];
    for (let i = 1; i <= 8; i++) {
        let chave = "resposta" + i;
        let valor = req.body[chave];
        if (valor == undefined) {
            res.status(400).send("A pergunta " + i + " precisa ser respondida.");
            return;
        }
        if (typeof valor == "string") {
            valor = valor.trim();
        }
        if (valor.length == 0) {
            res.status(400).send("A pergunta " + i + " precisa ser respondida.");
            return;
        }
        respostas.push(valor);
    }

    let contagens = {
        netrunner: 0,
        mercenario: 0,
        nomade: 0
    };

    for (let j = 0; j < respostas.length; j++) {
        let escolha = respostas[j];
        if (escolha == "Netrunner") {
            contagens.netrunner++;
        } else if (escolha == "Mercenário") {
            contagens.mercenario++;
        } else if (escolha == "Nômade") {
            contagens.nomade++;
        } else {
            res.status(400).send("Resposta inválida detectada.");
            return;
        }
    }

    let soma = contagens.netrunner + contagens.mercenario + contagens.nomade;
    if (soma != 8) {
        res.status(400).send("As respostas precisam somar oito pontos.");
        return;
    }

    let porcentagens = {
        netrunner: parseFloat(((contagens.netrunner / 8) * 100).toFixed(1)),
        mercenario: parseFloat(((contagens.mercenario / 8) * 100).toFixed(1)),
        nomade: parseFloat(((contagens.nomade / 8) * 100).toFixed(1))
    };

    let predominancias = calcularPredominancias(contagens);
    let maior = predominancias.maior;
    let classesVencedoras = [];
    if (contagens.netrunner == maior) {
        classesVencedoras.push("Netrunner");
    }
    if (contagens.mercenario == maior) {
        classesVencedoras.push("Mercenário");
    }
    if (contagens.nomade == maior) {
        classesVencedoras.push("Nômade");
    }

    let classePredominante = classesVencedoras.join(" e ");

    questionarioModel.obterResultadoPorUsuario(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(409).send("Questionário já respondido.");
                return;
            }

            questionarioModel.inserirResultadoQuestionario(idUsuario, respostas, contagens, porcentagens, classePredominante)
                .then(function () {
                    res.status(201).json(montarResposta(respostas, contagens, porcentagens, classePredominante, predominancias));
                })
                .catch(function (erro) {
                    console.log(erro);
                    // ER_DUP_ENTRY = o banco recusou porque este usuário já tem resultado (fk_usuario é UNIQUE).
                    // Acontece, por exemplo, com duplo clique no botão FINALIZAR. Mesmo padrão do usuarioController.
                    if (erro.code == "ER_DUP_ENTRY") {
                        res.status(409).send("Questionário já respondido.");
                    } else {
                        res.status(500).json(erro.sqlMessage);
                    }
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function resultado(req, res) {
    let idUsuario = req.params.idUsuario;
    if (idUsuario == undefined) {
        res.status(400).send("ID do usuário está ausente.");
        return;
    }
    // SEGURANÇA: o model monta o SQL juntando o id no texto, então só aceitamos número
    // (isNaN = "is Not a Number": devolve true se o valor não for um número)
    if (isNaN(idUsuario)) {
        res.status(400).send("ID do usuário inválido.");
        return;
    }

    questionarioModel.obterResultadoPorUsuario(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                let registro = resultado[0];
                let respostas = [
                    registro.resposta1,
                    registro.resposta2,
                    registro.resposta3,
                    registro.resposta4,
                    registro.resposta5,
                    registro.resposta6,
                    registro.resposta7,
                    registro.resposta8
                ];
                let contagens = {
                    netrunner: registro.pontos_netrunner,
                    mercenario: registro.pontos_mercenario,
                    nomade: registro.pontos_nomade
                };
                let porcentagens = {
                    netrunner: parseFloat(registro.pct_netrunner),
                    mercenario: parseFloat(registro.pct_mercenario),
                    nomade: parseFloat(registro.pct_nomade)
                };
                // CORREÇÃO: o bloco "let contagens" estava repetido aqui (com let, repetir o nome dá erro de sintaxe), então foi removido
                let predominancias = calcularPredominancias(contagens); // descobre no backend quais classes empataram/ganharam
                // CORREÇÃO PRINCIPAL: faltava passar "predominancias" como 5º argumento.
                // Sem ele, montarResposta dava erro (predominancias.netrunnerPredominante em algo undefined),
                // a rota respondia 500 e a dashboard nunca recebia os dados de quem já respondeu.
                res.json(montarResposta(respostas, contagens, porcentagens, registro.classe_predominante, predominancias));
            } else {
                res.json({
                    respondido: false
                });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    responder,
    resultado
};
