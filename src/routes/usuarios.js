var express = require("express");
var router = express.Router(); // Router = "mini-app" que guarda só as rotas de /usuarios

var usuarioController = require("../controllers/usuarioController"); // controller = quem valida os dados e responde ao front-end

// POST /usuarios/cadastrar  <-- chamada pelo fetch do cadastro.html
// "/usuarios" vem do app.js (app.use("/usuarios", ...)) e "/cadastrar" vem daqui: juntos formam o endereço completo.
//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res); // req = o que chegou do front-end | res = o que vamos devolver
})

// POST /usuarios/autenticar  <-- chamada pelo fetch do login.html
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router; // "exporta" o router para o app.js conseguir importar com require
