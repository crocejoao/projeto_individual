var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    // res.render("index"); // DESATIVADO: exige um motor de templates (EJS, Pug...) que o projeto não usa, e por isso dava o erro "No default engine"
    res.redirect("/index-cyberpunk.html"); // redirect = manda o navegador ir para outro endereço, aqui a home do site
});

module.exports = router;