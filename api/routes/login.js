const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const TOKEN_PRIVADO = "TOKEN_SUPER_SECRETO";

router.post('/', (req, res) => {
    const { usuario, password } = req.body;

    const usuarios = JSON.parse(fs).readFileSync(path.join(__dirname, '../data/usuarios.json'), 'utf-8');

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.password === password);
    if (usuarioEncontrado) {
        return res.json({ token: TOKEN_PRIVADO });
    } else {
        return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }
});

module.exports = router;