var resultadoModel = require("../models/resultadoModel");

// Mesma estrutura do medidaController do AquaTech:
// pega o id da URL -> chama o model -> devolve 200 (achou), 204 (não achou) ou 500 (erro)
function buscarUltimoResultado(req, res) {

    var idUsuario = req.params.idUsuario;

    console.log("Recuperando o resultado do questionário do usuário " + idUsuario);

    resultadoModel.buscarUltimoResultado(idUsuario).then(function (resultado) {
        if (resultado.length > 0) {

            // REGRA DE NEGÓCIO (fica aqui no controller, como no AquaTech):
            // descobre qual é a maior pontuação e quais classes empataram nela.
            // A página só mostra o que chega pronto daqui, sem fazer conta.
            var registro = resultado[0];

            var maior = registro.pontos_netrunner;
            if (registro.pontos_mercenario > maior) {
                maior = registro.pontos_mercenario;
            }
            if (registro.pontos_nomade > maior) {
                maior = registro.pontos_nomade;
            }

            registro.pontos_maior = maior;

            // porcentagem da classe predominante (já vem formatada do banco). Se empatar, as duas têm a mesma porcentagem.
            if (registro.pontos_netrunner == maior) {
                registro.pct_maior = registro.pct_netrunner;
            } else if (registro.pontos_mercenario == maior) {
                registro.pct_maior = registro.pct_mercenario;
            } else {
                registro.pct_maior = registro.pct_nomade;
            }
            registro.netrunner_predominante = registro.pontos_netrunner == maior;
            registro.mercenario_predominante = registro.pontos_mercenario == maior;
            registro.nomade_predominante = registro.pontos_nomade == maior;

            // NOVA KPI: a classe do personagem favorito está entre as classes predominantes?
            registro.combina_favorito = false;
            if (registro.personagem_classe == "Netrunner" && registro.netrunner_predominante) {
                registro.combina_favorito = true;
            } else if (registro.personagem_classe == "Mercenário" && registro.mercenario_predominante) {
                registro.combina_favorito = true;
            } else if (registro.personagem_classe == "Nômade" && registro.nomade_predominante) {
                registro.combina_favorito = true;
            }

            res.status(200).json(resultado);
        } else {
            // 204 = usuário ainda não respondeu o questionário (a dashboard manda ele para lá)
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar o resultado do questionário.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    buscarUltimoResultado
}
