// servidor/middleware/auth.js

const jwt = require('jsonwebtoken');

// Clave secreta para JWT (en producción usar variable de entorno)
const SECRET_KEY = 'tu_clave_secreta_super_segura_2024';

/**
 * Middleware para verificar el token JWT
 */
const verificarToken = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Acceso denegado. No se proporcionó token.' 
            });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Agregar la información del usuario al request
        req.usuario = decoded;
        
        // Continuar con la siguiente función
        next();
        
    } catch (error) {
        return res.status(401).json({ 
            error: 'Token inválido o expirado.' 
        });
    }
};

/**
 * Middleware para verificar si el usuario es administrador
 */
const verificarAdmin = (req, res, next) => {
    try {
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ 
                error: 'Acceso denegado. Se requieren permisos de administrador.' 
            });
        }
        next();
    } catch (error) {
        return res.status(403).json({ 
            error: 'Error de autorización.' 
        });
    }
};

/**
 * Función para generar un token JWT
 */
const generarToken = (usuario) => {
    const payload = {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol || 'usuario'
    };
    
    // Token expira en 24 horas
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};

module.exports = {
    verificarToken,
    verificarAdmin,
    generarToken,
    SECRET_KEY
};