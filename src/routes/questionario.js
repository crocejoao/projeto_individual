var express = require("express");
var router = express.Router();
var questionarioController = require("../controllers/questionarioController");

router.post("/responder", questionarioController.responder);
router.get("/resultado/:idUsuario", questionarioController.resultado);

module.exports = router;
