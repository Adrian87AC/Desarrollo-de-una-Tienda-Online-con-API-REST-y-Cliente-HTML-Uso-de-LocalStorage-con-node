// ==========================================
// CART.JS - Lógica de renderizado y cálculos
// ==========================================

console.log('✅ cart.js cargado');

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
        emptyMsg.classList.remove('d-none');
        if (checkoutBtn) checkoutBtn.disabled = true;
        subtotalEl.innerText = '0.00';
        ivaEl.innerText = '0.00';
        totalEl.innerText = '0.00';
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
                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart('${item.id}')">
                            🗑️ Eliminar
                        </button>
                    </div>

                    <p class="card-text text-muted mb-1">Precio unitario: €${item.precio}</p>

                    <div class="d-flex justify-content-between align-items-center">
                        <div class="input-group input-group-sm" style="width: 120px;">
                            <button class="btn btn-outline-secondary" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <input type="text" class="form-control text-center" value="${item.cantidad}" readonly>
                                <button class="btn btn-outline-secondary" onclick="updateQuantity('${item.id}', 1)">+</button>
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

    // Calcular Totales
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    // Actualizar DOM
    subtotalEl.innerText = subtotal.toFixed(2);
    ivaEl.innerText = iva.toFixed(2);
    totalEl.innerText = total.toFixed(2);
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
    showNotification('🗑️ Producto eliminado');
}

// 4. Función para vaciar carrito
function clearCart(silent = false) {
    if (silent || confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        saveCartSafe([]);
        renderCart();
        if (!silent) showNotification('🛒 Carrito vaciado');
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

    try {
        const response = await fetch('/api/carrito/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ carrito: cart })
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ ' + data.mensaje);
            // Limpiar carrito local
            saveCartSafe([]);
            renderCart();
            // Redirigir o actualizar UI
        } else {
            console.error('Error en checkout:', data);
            let errorMsg = data.error || 'Error al procesar la compra';
            if (data.detalles) {
                errorMsg += '\n' + data.detalles.join('\n');
            }
            alert('❌ ' + errorMsg);
        }

    } catch (error) {
        console.error('Error de red:', error);
        alert('❌ Error de conexión al procesar la compra');
    } finally {
        if (checkoutBtn) checkoutBtn.disabled = false;
    }
}

// EXPORTAR FUNCIONES AL WINDOW (Crucial para que funcionen los onclick del HTML)
window.renderCart = renderCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.performCheckout = performCheckout;