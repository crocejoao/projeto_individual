let express = require("express");
let router = express.Router(); // Router = "mini-app" que guarda só as rotas de /questionario

let questionarioController = require("../controllers/questionarioController"); // controller = quem valida os dados e responde ao front-end

// POST /questionario/responder  <-- chamada pelo fetch do questionario.html ao clicar em FINALIZAR
// "/questionario" vem do app.js (app.use("/questionario", ...)) e "/responder" vem daqui: juntos formam o endereço completo.
router.post("/responder", questionarioController.responder);

// GET /questionario/resultado/:idUsuario  <-- chamada pelo fetch do questionario.html só para saber se o usuário já respondeu (a dashboard usa a rota /resultados/ultimo/:idUsuario, em resultados.js)
// ":idUsuario" é um pedaço variável do endereço; o controller lê com req.params.idUsuario
router.get("/resultado/:idUsuario", questionarioController.resultado);

module.exports = router; // "exporta" o router para o app.js conseguir importar com require
