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

// POST - Realizar checkout (compra)
router.post('/checkout', (req, res) => {
    try {
        console.log('🛒 INICIANDO CHECKOUT');
        const datos = leerDatos();
        const { carrito } = req.body; // Esperamos recibir el array de items del carrito

        console.log('📦 Carrito recibido:', JSON.stringify(carrito, null, 2));

        if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
            console.log('❌ Carrito inválido o vacío');
            return res.status(400).json({ error: 'El carrito está vacío o es inválido' });
        }

        const productosActualizados = [];
        const errores = [];

        // Validar stock para todos los items primero
        for (const item of carrito) {
            console.log(`🔍 Buscando producto ID: "${item.id}" (Tipo: ${typeof item.id})`);

            // Intentar búsqueda flexible (string vs number)
            const producto = datos.productos.find(p => String(p.id) === String(item.id));

            if (!producto) {
                console.log(`❌ Producto no encontrado: ${item.id}`);
                errores.push(`Producto ${item.nombre} no encontrado`);
                continue;
            }

            console.log(`✅ Producto encontrado: ${producto.nombre}, Stock actual: ${producto.stock}, Solicitado: ${item.cantidad}`);

            if (producto.stock < item.cantidad) {
                console.log(`❌ Stock insuficiente para ${producto.nombre}`);
                errores.push(`Stock insuficiente para ${item.nombre}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`);
            }
        }

        if (errores.length > 0) {
            console.log('❌ Errores de validación:', errores);
            return res.status(400).json({ error: 'Error de stock', detalles: errores });
        }

        // Si todo está bien, restar stock
        console.log('📉 Restando stock...');
        carrito.forEach(item => {
            // Búsqueda flexible de nuevo
            const producto = datos.productos.find(p => String(p.id) === String(item.id));
            if (producto) {
                const stockAnterior = producto.stock;
                producto.stock -= item.cantidad;
                console.log(`   ⬇️ ${producto.nombre}: ${stockAnterior} -> ${producto.stock}`);

                productosActualizados.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    nuevoStock: producto.stock
                });
            }
        });

        // Guardar cambios en tienda.json
        console.log('💾 Guardando cambios en tienda.json...');
        guardarDatos(datos);
        console.log('✅ Cambios guardados correctamente');

        res.json({
            mensaje: 'Compra realizada con éxito',
            productos: productosActualizados
        });

    } catch (error) {
        console.error('❌ Error CRÍTICO en checkout:', error);
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
});

// DELETE - Eliminar producto del carrito
router.delete('/eliminar/:productoId', (req, res) => {
    try {
        const datos = leerDatos();
        const usuarioId = 1;
        const productoId = req.params.productoId; // No convertimos a int todavía para comparar flexiblemente

        const carritoIndex = datos.carritos.findIndex(c => c.usuarioId === usuarioId);

        if (carritoIndex === -1) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const carrito = datos.carritos[carritoIndex];

        // Filtrar usando comparación flexible
        carrito.productos = carrito.productos.filter(p => String(p.id) !== String(productoId));

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

module.exports = router;