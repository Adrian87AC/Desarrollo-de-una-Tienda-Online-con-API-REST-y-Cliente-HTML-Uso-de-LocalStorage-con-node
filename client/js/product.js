document.addEventListener('DOMContentLoaded', () => {
            // 1. Obtener la ID del producto de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            
            if (!productId) {
                document.getElementById('loadingMessage').classList.add('d-none');
                document.getElementById('errorMessage').classList.remove('d-none');
                return;
            }

            // 2. Cargar los datos desde LocalStorage
            const { productos } = getTiendaData();
            const producto = productos.find(p => p.id === productId);
            const detailContainer = document.getElementById('productDetail');

            if (producto) {
                document.getElementById('loadingMessage').classList.add('d-none');
                
                // 3. Renderizar la ficha del producto
                detailContainer.innerHTML = `
                    <div class="col-md-6">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid product-detail-img">
                    </div>
                    <div class="col-md-6">
                        <h2>${producto.nombre}</h2>
                        <span class="badge bg-secondary mb-3">${producto.id_categoria === 1 ? 'Electrónica' : 'Ropa'}</span>
                        <p class="lead">Un producto de alta calidad con excelentes características...</p>
                        
                        <h3 class="text-success my-4">$${producto.precio.toFixed(2)}</h3>
                        
                        <button class="btn btn-primary btn-lg w-100" 
                                onclick="addToCart('${producto.id}', '${producto.nombre}', ${producto.precio}, '${producto.imagen}')">
                            Añadir al Carrito
                        </button>
                    </div>
                `;

                // 4. Almacenar el producto visto recientemente
                saveProductViewed(productId);
            } else {
                document.getElementById('loadingMessage').classList.add('d-none');
                document.getElementById('errorMessage').classList.remove('d-none');
            }
        });

        function saveProductViewed(productId) {
            let vistos = JSON.parse(localStorage.getItem('productos_vistos')) || [];
            
            // Eliminar duplicados para que el producto visto sea el más reciente
            vistos = vistos.filter(id => id !== productId);
            
            // Añadir el producto al principio de la lista
            vistos.unshift(productId);
            
            // Limitar la lista a, por ejemplo, los últimos 5 productos
            if (vistos.length > 5) {
                vistos.pop();
            }
            
            localStorage.setItem('productos_vistos', JSON.stringify(vistos));
            // Opcional: Notificar al servidor que se vio el producto
            // sendProductViewToServer(productId, localStorage.getItem('auth_token'));
        }