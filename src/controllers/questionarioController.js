const questionarioModel = require("../models/questionarioModel");

function calcularPredominancias(contagens) {
    var maior = contagens.netrunner;
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
    var idUsuario = req.body.idUsuario;
    if (idUsuario == undefined) {
        res.status(400).send("ID do usuário está ausente.");
        return;
    }

    var respostas = [];
    for (var i = 1; i <= 8; i++) {
        var chave = "resposta" + i;
        var valor = req.body[chave];
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

    var contagens = {
        netrunner: 0,
        mercenario: 0,
        nomade: 0
    };

    for (var j = 0; j < respostas.length; j++) {
        var escolha = respostas[j];
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

    var soma = contagens.netrunner + contagens.mercenario + contagens.nomade;
    if (soma != 8) {
        res.status(400).send("As respostas precisam somar oito pontos.");
        return;
    }

    var porcentagens = {
        netrunner: parseFloat(((contagens.netrunner / 8) * 100).toFixed(1)),
        mercenario: parseFloat(((contagens.mercenario / 8) * 100).toFixed(1)),
        nomade: parseFloat(((contagens.nomade / 8) * 100).toFixed(1))
    };

    var predominancias = calcularPredominancias(contagens);
    var maior = predominancias.maior;
    var classesVencedoras = [];
    if (contagens.netrunner == maior) {
        classesVencedoras.push("Netrunner");
    }
    if (contagens.mercenario == maior) {
        classesVencedoras.push("Mercenário");
    }
    if (contagens.nomade == maior) {
        classesVencedoras.push("Nômade");
    }

    var classePredominante = classesVencedoras.join(" e ");

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
                    res.status(500).json(erro.sqlMessage);
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function resultado(req, res) {
    var idUsuario = req.params.idUsuario;
    if (idUsuario == undefined) {
        res.status(400).send("ID do usuário está ausente.");
        return;
    }

    questionarioModel.obterResultadoPorUsuario(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                var registro = resultado[0];
                var respostas = [
                    registro.resposta1,
                    registro.resposta2,
                    registro.resposta3,
                    registro.resposta4,
                    registro.resposta5,
                    registro.resposta6,
                    registro.resposta7,
                    registro.resposta8
                ];
                var contagens = {
                    netrunner: registro.pontos_netrunner,
                    mercenario: registro.pontos_mercenario,
                    nomade: registro.pontos_nomade
                };
                var porcentagens = {
                    netrunner: parseFloat(registro.pct_netrunner),
                    mercenario: parseFloat(registro.pct_mercenario),
                    nomade: parseFloat(registro.pct_nomade)
                };
                var contagens = {
                    netrunner: registro.pontos_netrunner,
                    mercenario: registro.pontos_mercenario,
                    nomade: registro.pontos_nomade
                };
                var predominancias = calcularPredominancias(contagens);
                res.json(montarResposta(respostas, contagens, porcentagens, registro.classe_predominante));
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
