// ==========================================
// CART.JS - Lógica de renderizado y cálculos
// ==========================================

console.log('✅ cart.js cargado');

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// Función principal para renderizar el carrito
function renderCart() {
    // 1. Obtener elementos del DOM
    const cartItemsList = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('subtotal');
    const ivaEl = document.getElementById('iva');
    const totalEl = document.getElementById('total');
    const emptyMsg = document.getElementById('emptyCartMessage');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // 2. Obtener datos del carrito (asumiendo que getCartItems está en main.js)
    // Si no tienes main.js, usa: JSON.parse(localStorage.getItem('carrito')) || [];
    const cart = typeof getCartItems === 'function' ? getCartItems() : [];

    // 3. Limpiar contenido actual
    cartItemsList.innerHTML = '';

    // 4. Verificar si está vacío
    if (cart.length === 0) {
        emptyMsg.classList.remove('d-none');
        checkoutBtn.disabled = true;
        subtotalEl.innerText = '0.00';
        ivaEl.innerText = '0.00';
        totalEl.innerText = '0.00';
        return;
    }

    emptyMsg.classList.add('d-none');
    checkoutBtn.disabled = false;

    let subtotal = 0;

    // 5. Recorrer productos y generar HTML
    cart.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;

        const cardHtml = `
            <div class="card mb-3 shadow-sm">
                <div class="row g-0 align-items-center">
                    <div class="col-md-3 text-center p-2">
                        <img src="${item.imagen || 'https://via.placeholder.com/150'}" 
                             class="img-fluid rounded-start" alt="${item.nombre}" style="max-height: 100px;">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title mb-0">${item.nombre}</h5>
                                <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                                    🗑️ Eliminar
                                </button>
                            </div>
                            
                            <p class="card-text text-muted mb-1">Precio unitario: €${item.precio}</p>
                            
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="input-group input-group-sm" style="width: 120px;">
                                    <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                                    <input type="text" class="form-control text-center" value="${item.cantidad}" readonly>
                                    <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                                </div>
                                <span class="fw-bold fs-5 text-primary">€${itemTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cartItemsList.innerHTML += cardHtml;
    });

    // 6. Calcular Totales (IVA 21%)
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    // 7. Actualizar el DOM de precios
    subtotalEl.innerText = subtotal.toFixed(2);
    ivaEl.innerText = iva.toFixed(2);
    totalEl.innerText = total.toFixed(2);
    
    // Actualizar contador del navbar si existe la función
    if(typeof updateCartCount === 'function') updateCartCount();
}

// Función para cambiar cantidad (+ o -)
function updateQuantity(productId, change) {
    let cart = typeof getCartItems === 'function' ? getCartItems() : [];
    const product = cart.find(item => item.id === productId);

    if (product) {
        product.cantidad += change;
        
        // Si la cantidad llega a 0 o menos, eliminar el producto
        if (product.cantidad <= 0) {
            removeFromCart(productId);
            return;
        }

        // Guardar cambios
        if (typeof saveCartItems === 'function') {
            saveCartItems(cart);
        } else {
            localStorage.setItem('carrito', JSON.stringify(cart));
        }
        
        renderCart(); // Volver a dibujar para actualizar precios
    }
}

// Función para eliminar un producto específico
function removeFromCart(productId) {
    let cart = typeof getCartItems === 'function' ? getCartItems() : [];
    cart = cart.filter(item => item.id !== productId);
    
    if (typeof saveCartItems === 'function') {
        saveCartItems(cart);
    } else {
        localStorage.setItem('carrito', JSON.stringify(cart));
    }
    
    renderCart();
    showNotification('🗑️ Producto eliminado');
}

// Función para vaciar todo el carrito
function clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        if (typeof saveCartItems === 'function') {
            saveCartItems([]);
        } else {
            localStorage.setItem('carrito', JSON.stringify([]));
        }
        renderCart();
        showNotification('🗑️ Carrito vaciado');
    }
}

// Helpers globales para notificaciones (si no existen en main.js)
function showNotification(msg) {
    // Si tienes un sistema de alertas en main.js, úsalo, sino un alert simple
    // alert(msg); 
    console.log(msg);
}

// Exponer funciones al objeto window para que funcionen los onclick del HTML
window.renderCart = renderCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;