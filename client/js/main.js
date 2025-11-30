// ==========================================
// MAIN.JS - Funciones principales y comunes
// ==========================================

console.log('main.js cargado');

// Verificar autenticación del usuario
function checkAuth() {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        console.log('No hay token - Redirigiendo a login');
        alert('Sesión expirada o no iniciada. Por favor, inicie sesión.');
        window.location.href = '/login.html';
        return false;
    }

    console.log('Token encontrado');
    return true;
}

// Obtener datos de la tienda desde LocalStorage
function getTiendaData() {
    const dataString = localStorage.getItem('tienda_data');

    if (dataString) {
        try {
            const data = JSON.parse(dataString);
            console.log('Datos de tienda cargados:', {
                categorias: data.categorias?.length || 0,
                productos: data.productos?.length || 0
            });
            return data;
        } catch (error) {
            console.error('Error al parsear datos de la tienda:', error);
            return { categorias: [], productos: [] };
        }
    }

    console.log('No hay datos de tienda en localStorage');
    return { categorias: [], productos: [] };
}

// Función de cierre de sesión
function logout() {
    console.log('Cerrando sesión...');

    // Confirmar cierre de sesión
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Eliminar TODOS los datos del LocalStorage por seguridad
        console.log('Limpiando localStorage...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('tienda_data');
        localStorage.removeItem('carrito');
        localStorage.removeItem('productos_vistos');

        console.log('Sesión cerrada');
        alert('Sesión cerrada correctamente.');
        window.location.href = '/login.html';
    }
}

// Actualizar contador del carrito en el navbar
function updateCartCount() {
    const carrito = getCartItems();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });

    console.log('Contador actualizado:', totalItems);
}

// Obtener items del carrito desde LocalStorage
function getCartItems() {
    const carritoString = localStorage.getItem('carrito');

    if (carritoString) {
        try {
            return JSON.parse(carritoString);
        } catch (error) {
            console.error('Error al parsear carrito:', error);
            return [];
        }
    }

    return [];
}

// Guardar items del carrito en LocalStorage
function saveCartItems(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    updateCartCount();
    console.log('Carrito guardado:', carrito.length, 'items');
}

// Añadir producto al carrito
function addToCart(id, nombre, precio, imagen = 'https://via.placeholder.com/300x200') {
    console.log('Añadiendo al carrito:', nombre);

    let carrito = getCartItems();

    // Buscar si el producto ya existe en el carrito
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        // Si existe, incrementar cantidad
        itemExistente.cantidad += 1;
        console.log('Cantidad actualizada:', itemExistente.cantidad);
    } else {
        // Si no existe, agregarlo como nuevo item
        carrito.push({
            id: id,
            nombre: nombre,
            precio: parseFloat(precio),
            imagen: imagen,
            cantidad: 1
        });
        console.log('Nuevo item agregado');
    }

    // Guardar en LocalStorage
    saveCartItems(carrito);

    // Mostrar notificación
    showNotification(`"${nombre}" añadido al carrito`);
}

// Mostrar notificación temporal
function showNotification(mensaje) {
    console.log('Notificación:', mensaje);

    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideIn 0.3s ease;';
    notification.innerHTML = `<strong>${mensaje}</strong>`;

    document.body.appendChild(notification);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Verificar autenticación al cargar la página (excepto en login.html)
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM cargado - Inicializando...');

    const currentPath = window.location.pathname;
    console.log('Ruta actual:', currentPath);

    // Si no estamos en login, verificar autenticación
    if (!currentPath.includes('login.html') && !currentPath.includes('login-test.html')) {
        console.log('Verificando autenticación...');

        if (checkAuth()) {
            // Actualizar contador del carrito
            updateCartCount();
            console.log('Autenticación OK');
        }
    } else {
        console.log('Página de login - No se verifica autenticación');
    }
});

// Hacer funciones globales disponibles
window.logout = logout;
window.addToCart = addToCart;
window.getTiendaData = getTiendaData;
window.getCartItems = getCartItems;
window.saveCartItems = saveCartItems;
window.updateCartCount = updateCartCount;
window.checkAuth = checkAuth;

console.log('main.js completamente cargado');