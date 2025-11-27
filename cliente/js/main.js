// Función para verificar el token de autenticación
function checkAuth() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        // Redirigir al login si no hay token
        alert('Sesión expirada o no iniciada. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Función para cargar los datos de la tienda desde LocalStorage
function getTiendaData() {
    const dataString = localStorage.getItem('tienda_data');
    if (dataString) {
        return JSON.parse(dataString);
    }
    return { categorias: [], productos: [] };
}

// Función de Cierre de Sesión [cite: 132]
function logout() {
    // Eliminar todos los datos sensibles del LocalStorage [cite: 134, 135, 136, 137, 138]
    localStorage.removeItem('auth_token');
    localStorage.removeItem('tienda_data');
    localStorage.removeItem('productos_vistos');
    localStorage.removeItem('carrito');
    
    alert('Cierre de sesión exitoso.');
    window.location.href = 'login.html';
}

// Verificar la autenticación inmediatamente al cargar la página
if (window.location.pathname.indexOf('login.html') === -1) {
    checkAuth();
}