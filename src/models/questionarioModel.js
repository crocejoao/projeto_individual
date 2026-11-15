const database = require("../database/config");

function inserirResultadoQuestionario(idUsuario, respostas, contagens, porcentagens, classePredominante) {
    const instrucaoSql = `
        INSERT INTO resultado_questionario (
            fk_usuario,
            resposta1, resposta2, resposta3, resposta4, resposta5, resposta6, resposta7, resposta8,
            pontos_netrunner, pontos_mercenario, pontos_nomade,
            pct_netrunner, pct_mercenario, pct_nomade,
            classe_predominante
        ) VALUES (
            ${idUsuario},
            '${respostas[0]}', '${respostas[1]}', '${respostas[2]}', '${respostas[3]}',
            '${respostas[4]}', '${respostas[5]}', '${respostas[6]}', '${respostas[7]}',
            ${contagens.netrunner}, ${contagens.mercenario}, ${contagens.nomade},
            ${porcentagens.netrunner}, ${porcentagens.mercenario}, ${porcentagens.nomade},
            '${classePredominante}'
        );
    `;

    console.log("Executando a instrução SQL do questionário: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterResultadoPorUsuario(idUsuario) {
    const instrucaoSql = `SELECT * FROM resultado_questionario WHERE fk_usuario = ${idUsuario};`;
    console.log("Executando a instrução SQL de busca do resultado: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    inserirResultadoQuestionario,
    obterResultadoPorUsuario
};
