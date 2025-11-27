const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const tiendaPath = path.join(__dirname, '../data/tienda.json');

const leerDatos = () => {
    try {
        const data = fs.readFileSync(tiendaPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo datos:', error);
        return { productos: [] };
    }
};

// GET - Obtener todos los productos
router.get('/', (req, res) => {
    try {
        const datos = leerDatos();
        res.json(datos.productos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// GET - Obtener un producto por ID
router.get('/:id', (req, res) => {
    try {
        const datos = leerDatos();
        const producto = datos.productos.find(p => p.id === parseInt(req.params.id));
        
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(producto);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// IMPORTANTE: Exportar el router
module.exports = router;