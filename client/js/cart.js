// ==========================================
// CART.JS - Funciones específicas del carrito
// ==========================================

console.log('✅ cart.js cargado');

// Función para obtener el total del carrito
function getCartTotal() {
    const carrito = getCartItems();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Función para vaciar completamente el carrito
function clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        saveCartItems([]);
        if (typeof renderCart === 'function') {
            renderCart();
        }
        showNotification('🗑️ Carrito vaciado');
    }
}

// Función para validar stock (placeholder - en una app real verificaría con el servidor)
function validateStock(productId, quantity) {
    // En una aplicación real, esto haría una petición al servidor
    // Por ahora, siempre retorna true
    return true;
}

// Hacer funciones globales
window.getCartTotal = getCartTotal;
window.clearCart = clearCart;
window.validateStock = validateStock;

console.log('✅ cart.js completamente cargado');