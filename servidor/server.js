// Servidor principal de la aplicación
// Maneja las rutas y middleware de la API REST

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Importar rutas
const loginRoute = require('./routes/login');
const carritoRoute = require('./routes/carrito');
const productosVistosRoute = require('./routes/productosVistos');

// ==========================================
// MIDDLEWARE
// ==========================================

// Parser de JSON para peticiones
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos del cliente
app.use(express.static(path.join(__dirname, '..', 'client')));

// Logging de peticiones (opcional, útil para desarrollo)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ==========================================
// RUTAS DE LA API
// ==========================================

// Ruta de login
app.use('/api/login', loginRoute);

// Ruta de carrito (protegida con auth)
app.use('/api/carrito', carritoRoute);

// Ruta de productos vistos (protegida con auth)
app.use('/api/productos_vistos', productosVistosRoute);

// ==========================================
// RUTA PRINCIPAL (REDIRECCIÓN A LOGIN)
// ==========================================

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// ==========================================
// MANEJO DE ERRORES 404
// ==========================================

app.use((req, res) => {
    res.status(404).json({ 
        mensaje: 'Ruta no encontrada' 
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🏋️  GYM SHOP - Servidor Iniciado');
    console.log('='.repeat(50));
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📱 Accede al cliente en: http://localhost:${PORT}/login.html`);
    console.log(`📦 API REST disponible en: http://localhost:${PORT}/api/`);
    console.log('='.repeat(50));
    console.log('\n📋 Credenciales de prueba:');
    console.log('   Usuario: admin | Contraseña: 12345');
    console.log('   Usuario: cliente | Contraseña: password');
    console.log('\n⏹  Presiona CTRL+C para detener el servidor\n');
});