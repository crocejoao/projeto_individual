var database = require("../database/config");

function buscarUltimoResultado(idUsuario) {

    // JOIN = junta o resultado com o usuário e com o personagem favorito dele (igual ao login)
    // FORMAT(valor, 1, 'pt_BR') = deixa a porcentagem com 1 casa e vírgula (37.5 vira 37,5)
    var instrucaoSql = `SELECT
                        resultado_questionario.pontos_netrunner,
                        resultado_questionario.pontos_mercenario,
                        resultado_questionario.pontos_nomade,
                        FORMAT(resultado_questionario.pct_netrunner, 1, 'pt_BR') AS pct_netrunner,
                        FORMAT(resultado_questionario.pct_mercenario, 1, 'pt_BR') AS pct_mercenario,
                        FORMAT(resultado_questionario.pct_nomade, 1, 'pt_BR') AS pct_nomade,
                        resultado_questionario.classe_predominante,
                        personagem.nome AS personagem_nome,
                        personagem.classe AS personagem_classe
                    FROM resultado_questionario
                    JOIN usuario ON resultado_questionario.fk_usuario = usuario.id
                    JOIN personagem ON usuario.fk_personagem = personagem.id
                    WHERE resultado_questionario.fk_usuario = ${idUsuario}`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimoResultado
}
