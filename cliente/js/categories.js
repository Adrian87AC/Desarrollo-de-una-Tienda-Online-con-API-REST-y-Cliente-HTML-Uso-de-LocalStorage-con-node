
        let allProducts = [];

        document.addEventListener('DOMContentLoaded', () => {
            const { categorias, productos } = getTiendaData();
            allProducts = productos;

            renderCategories(categorias);
            renderProducts(allProducts); // Mostrar todos los productos inicialmente
        });

        function renderCategories(categorias) {
            const listContainer = document.getElementById('categoryList');
            listContainer.innerHTML = '';
            
            // Opción para ver todos
            listContainer.innerHTML += `<a href="#" class="category-link list-group-item list-group-item-action active" data-id="all">Todas las Categorías</a>`;

            categorias.forEach(cat => {
                const link = document.createElement('a');
                link.href = "#";
                link.textContent = cat.nombre;
                link.classList.add('category-link', 'list-group-item', 'list-group-item-action');
                link.setAttribute('data-id', cat.id);
                link.addEventListener('click', () => filterProducts(cat.id, cat.nombre));
                listContainer.appendChild(link);
            });
            
            document.querySelector('[data-id="all"]').addEventListener('click', () => filterProducts('all', 'Todos los Productos'));
        }

        function filterProducts(categoryId, categoryName) {
            // Actualizar la clase "active"
            document.querySelectorAll('.category-link').forEach(link => link.classList.remove('active'));
            document.querySelector(`[data-id="${categoryId}"]`).classList.add('active');
            
            // Filtrar productos
            const filtered = categoryId === 'all' ? allProducts : allProducts.filter(p => p.id_categoria == categoryId);
            
            document.getElementById('productTitle').textContent = categoryName;
            renderProducts(filtered);
        }

        function renderProducts(productos) {
            const listContainer = document.getElementById('productList');
            listContainer.innerHTML = '';
            
            if (productos.length === 0) {
                document.getElementById('noProductsMessage').classList.remove('d-none');
                return;
            }
            document.getElementById('noProductsMessage').classList.add('d-none');


            productos.forEach(producto => {
                const col = document.createElement('div');
                col.classList.add('col');
                col.innerHTML = `
                    <div class="card h-100 shadow-sm product-card">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text text-success fw-bold">$${producto.precio.toFixed(2)}</p>
                            <a href="product.html?id=${producto.id}" class="btn btn-outline-primary mt-auto">Ver Detalles</a>
                            <button class="btn btn-success mt-2" 
                                onclick="addToCart('${producto.id}', '${producto.nombre}', ${producto.precio}, '${producto.imagen}')">
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                `;
                listContainer.appendChild(col);
            });
        }