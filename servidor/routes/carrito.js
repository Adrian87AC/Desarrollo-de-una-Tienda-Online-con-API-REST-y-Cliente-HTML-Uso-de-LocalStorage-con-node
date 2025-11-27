const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const tiendaPath = path.join(__dirname, '../data/tienda.json');

// Función para leer datos
const leerDatos = () => {
    try {
        const data = fs.readFileSync(tiendaPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo datos:', error);
        return { productos: [], carritos: [] };
    }
};

// Función para guardar datos
const guardarDatos = (datos) => {
    fs.writeFileSync(tiendaPath, JSON.stringify(datos, null, 2));
};

// GET - Obtener carrito del usuario
router.get('/', (req, res) => {
    try {
        const datos = leerDatos();
        const usuarioId = 1; // Por ahora usuario fijo
        
        const carrito = datos.carritos.find(c => c.usuarioId === usuarioId);
        
        if (!carrito) {
            return res.json({ productos: [], total: 0 });
        }
        
        res.json(carrito);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// POST - Agregar producto al carrito
router.post('/agregar', (req, res) => {
    try {
        const datos = leerDatos();
        const usuarioId = 1;
        const { productoId, cantidad } = req.body;

        let carritoIndex = datos.carritos.findIndex(c => c.usuarioId === usuarioId);
        
        if (carritoIndex === -1) {
            datos.carritos.push({
                id: datos.carritos.length + 1,
                usuarioId: usuarioId,
                productos: [],
                total: 0
            });
            carritoIndex = datos.carritos.length - 1;
        }

        const producto = datos.productos.find(p => p.id === productoId);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const carrito = datos.carritos[carritoIndex];
        const productoEnCarrito = carrito.productos.find(p => p.id === productoId);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.productos.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidad
            });
        }

        carrito.total = carrito.productos.reduce((sum, p) => 
            sum + (p.precio * p.cantidad), 0
        );

        guardarDatos(datos);

        res.json({ mensaje: 'Producto agregado al carrito', carrito });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});

// DELETE - Eliminar producto del carrito
router.delete('/eliminar/:productoId', (req, res) => {
    try {
        const datos = leerDatos();
        const usuarioId = 1;
        const productoId = parseInt(req.params.productoId);

        const carritoIndex = datos.carritos.findIndex(c => c.usuarioId === usuarioId);
        
        if (carritoIndex === -1) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const carrito = datos.carritos[carritoIndex];
        carrito.productos = carrito.productos.filter(p => p.id !== productoId);

        carrito.total = carrito.productos.reduce((sum, p) => 
            sum + (p.precio * p.cantidad), 0
        );

        guardarDatos(datos);

        res.json({ mensaje: 'Producto eliminado', carrito });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// IMPORTANTE: Exportar el router
module.exports = router;