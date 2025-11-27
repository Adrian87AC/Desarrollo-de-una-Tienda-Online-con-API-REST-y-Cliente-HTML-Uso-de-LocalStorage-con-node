// ==========================================
// CART.JS - Funciones específicas del carrito
// ==========================================

// Esta archivo contiene funciones adicionales para el carrito
// Las funciones principales ya están en main.js

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
        let carrito = [];

        document.addEventListener('DOMContentLoaded', () => {
            renderCart();
        });

        function renderCart() {
            carrito = getCartItems();
            const listContainer = document.getElementById('cartItemsList');
            const emptyMessage = document.getElementById('emptyCartMessage');
            listContainer.innerHTML = '';
            
            let subtotal = 0;

            if (carrito.length === 0) {
                emptyMessage.classList.remove('d-none');
                document.getElementById('checkoutBtn').disabled = true;
                document.getElementById('subtotal').textContent = '0.00';
                document.getElementById('iva').textContent = '0.00';
                document.getElementById('total').textContent = '0.00';
                return;
            }
            
            emptyMessage.classList.add('d-none');
            document.getElementById('checkoutBtn').disabled = false;

            carrito.forEach((item, index) => {
                const itemTotal = item.precio * item.cantidad;
                subtotal += itemTotal;

                const itemHtml = `
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-2 col-3 text-center">
                                    <img src="${item.imagen || 'img/placeholder.jpg'}" 
                                         alt="${item.nombre}" 
                                         class="img-fluid cart-item-image">
                                </div>
                                <div class="col-md-4 col-9">
                                    <h6 class="mb-1">${item.nombre}</h6>
                                    <small class="text-muted">€${item.precio.toFixed(2)} c/u</small>
                                </div>
                                <div class="col-md-3 col-6 d-flex align-items-center justify-content-center mt-2 mt-md-0">
                                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                                    <span class="px-3 fw-bold">${item.cantidad}</span>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                                </div>
                                <div class="col-md-2 col-4 text-end mt-2 mt-md-0">
                                    <strong class="text-success">€${itemTotal.toFixed(2)}</strong>
                                </div>
                                <div class="col-md-1 col-2 text-end mt-2 mt-md-0">
                                    <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})" title="Eliminar">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                listContainer.innerHTML += itemHtml;
            });

            // Calcular IVA y total
            const iva = subtotal * 0.21;
            const total = subtotal + iva;

            document.getElementById('subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('iva').textContent = iva.toFixed(2);
            document.getElementById('total').textContent = total.toFixed(2);
        }

        function updateQuantity(index, delta) {
            carrito[index].cantidad += delta;
            
            if (carrito[index].cantidad <= 0) {
                removeItem(index);
            } else {
                saveCartItems(carrito);
                renderCart();
            }
        }

        function removeItem(index) {
            if (confirm('¿Eliminar este producto del carrito?')) {
                carrito.splice(index, 1);
                saveCartItems(carrito);
                renderCart();
            }
        }

        // FUNCIÓN CRÍTICA: Realizar compra con validación en el servidor
        async function performCheckout() {
            const token = localStorage.getItem('auth_token');
            const checkoutMessage = document.getElementById('checkoutMessage');
            const checkoutBtn = document.getElementById('checkoutBtn');
            
            // Validar que el carrito no esté vacío
            if (carrito.length === 0) {
                checkoutMessage.innerHTML = `<div class="alert alert-warning">El carrito está vacío.</div>`;
                return;
            }

            // Deshabilitar botón y mostrar mensaje de procesamiento
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
            checkoutMessage.innerHTML = `<div class="alert alert-info">⏳ Procesando pedido y validando precios en el servidor...</div>`;

            try {
                // Enviar carrito al servidor para validación
                const response = await fetch('/api/carrito', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ carrito: carrito })
                });

                const data = await response.json();

                if (response.ok) {
                    // Compra exitosa
                    saveCartItems([]);
                    renderCart();
                    checkoutMessage.innerHTML = `
                        <div class="alert alert-success">
                            <strong>✅ ¡Pedido realizado con éxito!</strong><br>
                            Total: €${data.total}<br>
                            <small>Recibirás un email de confirmación.</small>
                        </div>
                    `;
                    checkoutBtn.innerHTML = 'Realizar Compra';
                    
                } else if (response.status === 403) {
                    // Error de seguridad: precios manipulados
                    checkoutMessage.innerHTML = `
                        <div class="alert alert-danger">
                            <strong>❌ Error de Seguridad</strong><br>
                            ${data.mensaje || 'Se detectó manipulación en los precios.'}<br>
                            La compra ha sido cancelada por seguridad.
                        </div>
                    `;
                    checkoutBtn.disabled = false;
                    checkoutBtn.innerHTML = 'Realizar Compra';
                    
                } else {
                    // Otro error
                    checkoutMessage.innerHTML = `
                        <div class="alert alert-danger">
                            ${data.mensaje || 'Error al procesar el pedido. Intente nuevamente.'}
                        </div>
                    `;
                    checkoutBtn.disabled = false;
                    checkoutBtn.innerHTML = 'Realizar Compra';
                }

            } catch (error) {
                console.error('Error de red durante el checkout:', error);
                checkoutMessage.innerHTML = `
                    <div class="alert alert-danger">
                        ❌ Error de conexión con el servidor. Verifica tu conexión e intenta nuevamente.
                    </div>
                `;
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = 'Realizar Compra';
            }
        }
