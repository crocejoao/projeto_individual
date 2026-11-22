var express = require("express");
var router = express.Router();

var resultadoController = require("../controllers/resultadoController");

// Mesma ideia da rota /medidas/ultimas/:idAquario do AquaTech,
// mas aqui buscamos o resultado do questionário do usuário: GET /resultados/ultimo/:idUsuario
router.get("/ultimo/:idUsuario", function (req, res) {
    resultadoController.buscarUltimoResultado(req, res);
});

module.exports = router;
