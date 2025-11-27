// Ruta de Login
// Valida credenciales y devuelve token + datos de la tienda

const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

// Token que se enviará al cliente tras login exitoso
const TOKEN_PRIVADO = "TOKEN_SUPER_SECRETO_GYM_SHOP_2024";

router.post("/", (req, res) => {
    console.log('\n' + '='.repeat(60));
    console.log('📨 Petición POST recibida en /api/login');
    console.log('='.repeat(60));
    console.log('📦 Body recibido:', req.body);
    
    const { usuario, contrasena } = req.body;

    // Validar que se enviaron los campos requeridos
    if (!usuario || !contrasena) {
        console.log('❌ Faltan campos requeridos');
        return res.status(400).json({ 
            mensaje: 'Usuario y contraseña son requeridos' 
        });
    }

    console.log('🔍 Validando credenciales...');
    console.log('   Usuario:', usuario);
    console.log('   Contraseña:', contrasena ? '***' : '(vacío)');

    // Leer archivo de usuarios
    const usersPath = path.join(__dirname, "../data/usuarios.json");
    const tiendaPath = path.join(__dirname, "../data/tienda.json");

    console.log('📁 Rutas de archivos:');
    console.log('   Usuarios:', usersPath);
    console.log('   Tienda:', tiendaPath);

    try {
        // Verificar que los archivos existen
        if (!fs.existsSync(usersPath)) {
            console.error('❌ No existe el archivo usuarios.json en:', usersPath);
            return res.status(500).json({ 
                mensaje: 'Error de configuración del servidor (usuarios.json no encontrado)' 
            });
        }

        if (!fs.existsSync(tiendaPath)) {
            console.error('❌ No existe el archivo tienda.json en:', tiendaPath);
            return res.status(500).json({ 
                mensaje: 'Error de configuración del servidor (tienda.json no encontrado)' 
            });
        }

        console.log('✅ Archivos encontrados, leyendo...');

        const usuarios = JSON.parse(fs.readFileSync(usersPath, "utf8"));
        const tienda = JSON.parse(fs.readFileSync(tiendaPath, "utf8"));

        console.log('📋 Usuarios disponibles en el sistema:');
        usuarios.forEach((u, index) => {
            console.log(`   ${index + 1}. Usuario: "${u.usuario}" | Contraseña: "${u.contrasena}"`);
        });

        // Buscar usuario que coincida con las credenciales
        const existe = usuarios.find(
            u => u.usuario === usuario && u.contrasena === contrasena
        );

        if (!existe) {
            console.log('❌ Credenciales incorrectas');
            console.log('   Usuario enviado:', usuario);
            console.log('   Contraseña enviada:', contrasena);
            
            return res.status(401).json({ 
                mensaje: 'Credenciales incorrectas. Verifica tu usuario y contraseña.' 
            });
        }

        console.log('✅ Usuario autenticado correctamente:', usuario);
        console.log('📦 Preparando respuesta...');
        console.log('   Token:', TOKEN_PRIVADO.substring(0, 20) + '...');
        console.log('   Categorías:', tienda.categorias?.length || 0);
        console.log('   Productos:', tienda.productos?.length || 0);

        // Login exitoso: devolver token y datos de la tienda
        const respuesta = {
            mensaje: 'Login exitoso',
            token: TOKEN_PRIVADO,
            tienda: tienda
        };

        res.json(respuesta);
        console.log('✅ Respuesta enviada exitosamente');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error al procesar login:', error);
        console.error('   Tipo:', error.name);
        console.error('   Mensaje:', error.message);
        console.error('   Stack:', error.stack);
        
        res.status(500).json({ 
            mensaje: 'Error interno del servidor: ' + error.message 
        });
    }
});

module.exports = router;