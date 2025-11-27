const TOKEN_PRIVADO = "TOKEN_SUPER_SECRETO";

module.exports = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ mensaje: "No se proporcionó un token de autenticación." });
    }
     next();
};