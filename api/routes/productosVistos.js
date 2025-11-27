const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

let productosVistos = [];

router.get("/", auth, (req, res) => {
    res.json(productosVistos);
});

router.post("/", auth, (req, res) => {
    const { idProducto } = req.body;
    productosVistos.unshift(idProducto);

    productosVistos = productosVistos.slice(0, 10);

    res.json({ ok: true, productosVistos });
});

module.exports = router;
