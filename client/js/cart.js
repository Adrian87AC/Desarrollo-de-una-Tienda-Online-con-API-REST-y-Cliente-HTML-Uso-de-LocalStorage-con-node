// ==========================================
// CART.JS - Lógica de renderizado y cálculos
// ==========================================

console.log('cart.js cargado');

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// Función auxiliar segura para obtener el carrito (sea de main.js o localStorage)
function getCartSafe() {
    if (typeof getCartItems === 'function') {
        return getCartItems();
    }
    // Fallback si no existe main.js
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

// Función auxiliar segura para guardar el carrito
function saveCartSafe(cart) {
    if (typeof saveCartItems === 'function') {
        saveCartItems(cart);
    } else {
        localStorage.setItem('carrito', JSON.stringify(cart));
    }
    // Actualizar contador del navbar si existe la función
    if (typeof updateCartCount === 'function') updateCartCount();
}

// 1. Función principal para renderizar el carrito
function renderCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('subtotal');
    const ivaEl = document.getElementById('iva');
    const totalEl = document.getElementById('total');
    const emptyMsg = document.getElementById('emptyCartMessage');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Obtener datos
    const cart = getCartSafe();

    // Limpiar HTML actual
    cartItemsList.innerHTML = '';

    // Verificar si está vacío
    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('d-none');
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (subtotalEl) subtotalEl.innerText = '0.00';
        if (ivaEl) ivaEl.innerText = '0.00';
        if (totalEl) totalEl.innerText = '0.00';
        return;
    }

    if (emptyMsg) emptyMsg.classList.add('d-none');
    if (checkoutBtn) checkoutBtn.disabled = false;

    let subtotal = 0;

    // Generar HTML
    cart.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;

        // NOTA: Usamos 'item.id' tal cual viene.
        // --- MODIFICACIÓN AQUÍ PARA MEJORAR LAS IMÁGENES ---
        const cardHtml = `
    <div class="card mb-3 shadow-sm overflow-hidden">
        <div class="row g-0 align-items-center">
            <div class="col-auto p-3 bg-white text-center">
                 <div style="width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; border: 1px solid #eee; border-radius: 8px; padding: 5px;">
                    <img src="${item.imagen || 'https://via.placeholder.com/150'}"
                        alt="${item.nombre}" 
                        style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
            </div>
            
            <div class="col">
                <div class="card-body py-3 pe-3 ps-0">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                             <h5 class="card-title mb-1 text-truncate" style="max-width: 250px;">${item.nombre}</h5>
                             <p class="card-text text-muted small mb-0">Unitario: €${item.precio.toFixed(2)}</p>
                        </div>
                        <button class="btn btn-link text-danger p-0 text-decoration-none" onclick="removeFromCart('${item.id}')" title="Eliminar">
                            <small>Eliminar</small>
                        </button>
                    </div>

                    <div class="d-flex justify-content-between align-items-end mt-3">
                        <div class="input-group input-group-sm" style="width: 110px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <input type="text" class="form-control text-center bg-white" value="${item.cantidad}" readonly style="max-width: 50px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <span class="fw-bold text-primary fs-5">€${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
            </div>
    `;
        // --- FIN MODIFICACIÓN ---
        cartItemsList.innerHTML += cardHtml;
    });

    // Calcular Totales
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    // Actualizar DOM (con verificación por si acaso no existen los elementos en el HTML)
    if (subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);
    if (ivaEl) ivaEl.innerText = iva.toFixed(2);
    if (totalEl) totalEl.innerText = total.toFixed(2);
}

// 2. Función para cambiar cantidad (+ o -)
function updateQuantity(productId, change) {
    let cart = getCartSafe();

    // Usamos '==' en lugar de '===' para que coincida si uno es string y el otro número
    const product = cart.find(item => item.id == productId);

    if (product) {
        product.cantidad += change;

        // Si baja a 0, eliminar
        if (product.cantidad <= 0) {
            removeFromCart(productId);
            return;
        }

        saveCartSafe(cart);
        renderCart();
    } else {
        console.error('Producto no encontrado con ID:', productId);
    }
}

// 3. Función para eliminar un producto
function removeFromCart(productId) {
    let cart = getCartSafe();
    // Filtrar usando '!=' (no estricto) para asegurar que borra aunque el tipo de dato sea diferente
    const newCart = cart.filter(item => item.id != productId);

    saveCartSafe(newCart);
    renderCart();
    if (typeof showNotification === 'function') showNotification('🗑️ Producto eliminado');
}

// 4. Función para vaciar carrito
function clearCart(silent = false) {
    if (silent || confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        saveCartSafe([]);
        renderCart();
        if (!silent && typeof showNotification === 'function') showNotification('🛒 Carrito vaciado');
    }
}

// 5. Función para realizar checkout
async function performCheckout() {
    const cart = getCartSafe();

    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = true;

    // Simulación de checkout exitoso ya que no hay backend real
    setTimeout(() => {
        alert('✅ ¡Compra realizada con éxito! Gracias por tu pedido.');
        saveCartSafe([]);
        renderCart();
        if (checkoutBtn) checkoutBtn.disabled = false;
        // Opcional: redirigir al dashboard
        // window.location.href = 'dashboard.html';
    }, 1000);
}

// EXPORTAR FUNCIONES AL WINDOW (Crucial para que funcionen los onclick del HTML)
window.renderCart = renderCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.performCheckout = performCheckout;