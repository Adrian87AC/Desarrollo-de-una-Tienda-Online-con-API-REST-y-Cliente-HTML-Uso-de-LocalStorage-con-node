// Servidor principal de la aplicación
// Maneja las rutas y middleware de la API REST

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

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

// IMPORTANTE: Servir archivos estáticos ANTES de las rutas API
// Esto permite que los archivos HTML, CSS, JS se sirvan correctamente
const clientPath = path.join(__dirname, '..', 'client');
console.log('Sirviendo archivos estáticos desde:', clientPath);
app.use(express.static(clientPath));

// Servir imágenes desde la carpeta servidor/img
const imgPath = path.join(__dirname, 'img');
console.log('Sirviendo imágenes desde:', imgPath);
app.use('/img', express.static(imgPath));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Logging de peticiones
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
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
    console.log('Ruta no encontrada:', req.path);
    res.status(404).json({
        mensaje: 'Ruta no encontrada: ' + req.path
    });
});

// ==========================================
// MANEJO DE ERRORES GENERALES
// ==========================================

app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({
        mensaje: 'Error interno del servidor',
        error: err.message
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(70));
    console.log('GYM SHOP - Servidor Iniciado');
    console.log('='.repeat(70));
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`Accede al cliente en: http://localhost:${PORT}/login.html`);
    console.log(`API REST disponible en: http://localhost:${PORT}/api/`);
    console.log('='.repeat(70));
    console.log('\nCredenciales de prueba:');
    console.log('   Usuario: admin | Contraseña: 12345');
    console.log('   Usuario: cliente | Contraseña: password');
    console.log('\n⏹  Presiona CTRL+C para detener el servidor\n');

    // Verificar que los archivos de datos existen
    const usuariosPath = path.join(__dirname, 'data', 'usuarios.json');
    const tiendaPath = path.join(__dirname, 'data', 'tienda.json');

    console.log('Verificando archivos de datos...');
    console.log('   usuarios.json:', fs.existsSync(usuariosPath) ? 'Existe' : 'NO EXISTE');
    console.log('   tienda.json:', fs.existsSync(tiendaPath) ? 'Existe' : 'NO EXISTE');

    // Verificar que la carpeta client existe
    console.log('\nVerificando carpeta client...');
    console.log('   Ruta:', clientPath);
    console.log('   Existe:', fs.existsSync(clientPath) ? 'Sí' : 'NO');

    if (fs.existsSync(clientPath)) {
        const loginPath = path.join(clientPath, 'login.html');
        const dashboardPath = path.join(clientPath, 'dashboard.html');
        console.log('   login.html:', fs.existsSync(loginPath) ? 'Existe' : 'NO EXISTE');
        console.log('   dashboard.html:', fs.existsSync(dashboardPath) ? 'Existe' : 'NO EXISTE');
    }

    console.log('');
});