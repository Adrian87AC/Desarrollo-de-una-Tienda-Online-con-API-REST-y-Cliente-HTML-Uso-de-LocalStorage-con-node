const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Token simple (la clave privada de la comunicación) [cite: 102]
const SERVER_TOKEN = "CLAVE_SECRETA_TIENDA_ONLINE";

// Cargar datos de usuarios y tienda
const usuarios = require('./data/usuarios.json');
const tiendaData = require('./data/tienda.json');

// Middleware
app.use(bodyParser.json());
// Permitir el acceso al cliente (asume que el cliente se sirve estáticamente)
app.use(express.static(path.join(__dirname, '..', 'client')));

// --- MiddleWare de Autenticación (para endpoints seguros) ---
function validarToken(req, res, next) {
    const token = req.headers['authorization'];

    // El token debe venir en el formato 'Bearer <token>'
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    const clientToken = token.substring(7); // Quitar 'Bearer '

    if (clientToken !== SERVER_TOKEN) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token inválido.' });
    }

    // Si el token es válido, continúa con la ruta
    next();
}

// ------------------------------------------------------------------
// --- ENDPOINT: LOGIN ---
// ------------------------------------------------------------------
app.post('/api/login', (req, res) => {
    const { usuario, contrasena } = req.body; // Recibe credenciales [cite: 56]

    const usuarioValido = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);

    if (usuarioValido) {
        // Devuelve el token y la información completa de la tienda [cite: 56, 168]
        return res.json({
            mensaje: 'Login exitoso',
            token: SERVER_TOKEN,
            tienda: tiendaData // Información completa (productos, categorías) [cite: 56]
        });
    } else {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
});

// ------------------------------------------------------------------
// --- ENDPOINT: CARRITO (VALIDACIÓN DE PRECIOS) ---
// ------------------------------------------------------------------
app.post('/api/carrito', validarToken, (req, res) => {
    const carritoCliente = req.body.carrito; // Recibe información del carrito [cite: 57]
    let preciosManipulados = false;
    let totalCalculado = 0;

    // Buscar productos de la tienda para la validación [cite: 57, 103]
    const productosServidor = tiendaData.productos;

    for (const itemCliente of carritoCliente) {
        const productoOriginal = productosServidor.find(p => p.id === itemCliente.id);

        if (!productoOriginal) {
            preciosManipulados = true;
            break;
        }

        // Validación: El precio unitario reportado por el cliente debe coincidir
        // con el precio original almacenado en el servidor [cite: 57, 104]
        if (parseFloat(itemCliente.precio) !== productoOriginal.precio) {
            console.warn(`Alerta de manipulación de precio: ID ${itemCliente.id}`);
            preciosManipulados = true;
            break;
        }

        totalCalculado += productoOriginal.precio * itemCliente.cantidad;
    }

    if (preciosManipulados) {
        // Si hay manipulación, se deniega la compra
        return res.status(403).json({ mensaje: 'Error de validación: Se detectó manipulación de precios.' });
    } else {
        // Compra exitosa
        return res.json({
            mensaje: 'Pedido procesado con éxito.',
            total: totalCalculado.toFixed(2)
        });
    }
});

// ------------------------------------------------------------------
// --- ENDPOINT OPCIONAL: Productos Vistos Recientemente ---
// ------------------------------------------------------------------
// El cliente gestiona esto en LocalStorage, pero este endpoint puede ser un placeholder
app.post('/api/productos_vistos', validarToken, (req, res) => {
    // Aquí se podría implementar la persistencia en una base de datos real.
    // Para esta práctica, solo confirmamos la recepción.
    return res.status(200).json({ mensaje: 'Lista de productos vistos recibida.' });
});

// ------------------------------------------------------------------
// --- Iniciar Servidor ---
// ------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js iniciado en http://localhost:${PORT}`);
    console.log(`Accede al cliente en http://localhost:${PORT}/login.html`);
});