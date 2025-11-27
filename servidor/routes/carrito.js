const fs = require("fs");
const path = require("path");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, (req, res) => {
    const carritoCliente = req.body;

    const tiendaPath = path.join(__dirname, "../data/tienda.json");
    const tienda = JSON.parse(fs.readFileSync(tiendaPath, "utf8"));

    for (const item of carritoCliente) {
        const productoOriginal = tienda.productos.find(p => p.id === item.id);

        if (!productoOriginal) {
            return res.status(400).json({ error: "Producto inexistente" });
        }

        if (productoOriginal.precio !== item.precio) {
            return res.status(400).json({
                error: "Manipulación detectada en el precio del producto " + item.id
            });
        }
    }

    res.json({ ok: true, mensaje: "Compra validada correctamente" });
});

module.exports = router;
