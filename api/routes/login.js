const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const TOKEN_PRIVADO = "TOKEN_SUPER_SECRETO";

router.post("/", (req, res) => {
    const { usuario, password } = req.body;

    const usersPath = path.join(__dirname, "../data/usuarios.json");
    const tiendaPath = path.join(__dirname, "../data/tienda.json");

    const usuarios = JSON.parse(fs.readFileSync(usersPath, "utf8"));
    const tienda = JSON.parse(fs.readFileSync(tiendaPath, "utf8"));

    const existe = usuarios.find(u => u.usuario === usuario && u.password === password);

    if (!existe) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.json({
        token: TOKEN_PRIVADO,
        tienda
    });
});

module.exports = router;
