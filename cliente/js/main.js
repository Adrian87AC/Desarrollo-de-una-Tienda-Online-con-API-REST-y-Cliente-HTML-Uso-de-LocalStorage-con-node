// ==========================================
// MAIN.JS - Funciones principales y comunes
// ==========================================

// Verificar autenticación del usuario
function checkAuth() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        alert('⚠️ Sesión expirada o no iniciada. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Obtener datos de la tienda desde LocalStorage
function getTiendaData() {
    const dataString = localStorage.getItem('tienda_data');
    
    if (dataString) {
        try {
            return JSON.parse(dataString);
        } catch (error) {
            console.error('Error al parsear datos de la tienda:', error);
            return { categorias: [], productos: [] };
        }
    }
    
    return { categorias: [], productos: [] };
}

// Función de cierre de sesión
function logout() {
    // Confirmar cierre de sesión
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Eliminar TODOS los datos del LocalStorage por seguridad
        localStorage.removeItem('auth_token');
        localStorage.removeItem('tienda_data');
        localStorage.removeItem('carrito');
        localStorage.removeItem('productos_vistos');
        
        alert('✅ Sesión cerrada correctamente.');
        window.location.href = 'login.html';
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
}

// Añadir producto al carrito
function addToCart(id, nombre, precio, imagen = 'img/placeholder.jpg') {
    let carrito = getCartItems();
    
    // Buscar si el producto ya existe en el carrito
    const itemExistente = carrito.find(item => item.id === id);
    
    if (itemExistente) {
        // Si existe, incrementar cantidad
        itemExistente.cantidad += 1;
    } else {
        // Si no existe, agregarlo como nuevo item
        carrito.push({
            id: id,
            nombre: nombre,
            precio: parseFloat(precio),
            imagen: imagen,
            cantidad: 1
        });
    }
    
    // Guardar en LocalStorage
    saveCartItems(carrito);
    
    // Mostrar notificación
    showNotification(`✅ "${nombre}" añadido al carrito`);
}

// Mostrar notificación temporal
function showNotification(mensaje) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <strong>${mensaje}</strong>
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Verificar autenticación al cargar la página (excepto en login.html)
if (window.location.pathname.indexOf('login.html') === -1) {
    // No estamos en login, verificar auth
    if (checkAuth()) {
        // Actualizar contador del carrito
        updateCartCount();
    }
}

// Hacer funciones globales disponibles
window.logout = logout;
window.addToCart = addToCart;
window.getTiendaData = getTiendaData;
window.getCartItems = getCartItems;
window.saveCartItems = saveCartItems;
window.updateCartCount = updateCartCount;