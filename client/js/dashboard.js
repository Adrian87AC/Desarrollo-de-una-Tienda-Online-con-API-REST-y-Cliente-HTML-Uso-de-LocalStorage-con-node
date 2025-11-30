// ==========================================
// DASHBOARD.JS - Lógica específica del Dashboard
// ==========================================

console.log('✅ dashboard.js cargado');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Inicializando dashboard...');

    try {
        // Cargar datos desde LocalStorage
        const { productos } = getTiendaData();

        if (!productos || productos.length === 0) {
            console.error('❌ No hay productos disponibles');
            document.getElementById('noProductsMessage')?.classList.remove('d-none');
            return;
        }

        console.log('📦 Total de productos:', productos.length);

        // Filtrar productos destacados
        const destacados = productos.filter(p => p.destacado);
        console.log('⭐ Productos destacados:', destacados.length);

        const contenedor = document.getElementById('productosDestacados');

        if (!contenedor) {
            console.error('❌ No se encontró el contenedor de productos');
            return;
        }

        if (destacados.length === 0) {
            console.log('⚠️ No hay productos destacados');
            document.getElementById('noProductsMessage')?.classList.remove('d-none');
            return;
        }

        // Renderizar cada producto destacado
        destacados.forEach(producto => {
            console.log('➕ Renderizando:', producto.nombre);

            const col = document.createElement('div');
            col.classList.add('col');

            const card = `
                <div class="card h-100 shadow-sm product-card">
                    <img src="${producto.imagen}" 
                         class="card-img-top" 
                         alt="${producto.nombre}"
                         onerror="this.src='https://via.placeholder.com/300x200?text=Sin+imagen'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text text-success fw-bold fs-4">€${producto.precio.toFixed(2)}</p>
                        <!-- <p class="card-text text-muted small">${producto.descripcion ? producto.descripcion.substring(0, 80) + '...' : 'Producto de alta calidad'}</p> -->
                        <div class="mt-auto">
                            <a href="product.html?id=${producto.id}" class="btn btn-outline-primary w-100 mb-2">
                                Ver Detalles
                            </a>
                            <button class="btn btn-success w-100" 
                                onclick="addToCart('${producto.id}', '${producto.nombre}', ${producto.precio}, '${producto.imagen}')">
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;

            col.innerHTML = card;
            contenedor.appendChild(col);
        });

        console.log('✅ Dashboard cargado correctamente');

    } catch (error) {
        console.error('❌ Error al cargar dashboard:', error);
        alert('Error al cargar los productos. Por favor, recarga la página.');
    }
});

console.log('✅ dashboard.js completamente cargado');