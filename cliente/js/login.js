document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío estándar del formulario

    const usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    const mensajeError = document.getElementById('mensajeError');

    // 1. Limpiar LocalStorage antes de un nuevo login [cite: 134]
    localStorage.clear();

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, contrasena })
        });

        const data = await response.json();

        if (response.ok) {
            // 2. Login exitoso: Almacenar token y datos de la tienda [cite: 65, 117, 118, 170]
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('tienda_data', JSON.stringify(data.tienda));
            
            // Inicializar el carrito y productos vistos si no existen [cite: 119, 120]
            if (!localStorage.getItem('carrito')) {
                localStorage.setItem('carrito', JSON.stringify([]));
            }
            if (!localStorage.getItem('productos_vistos')) {
                localStorage.setItem('productos_vistos', JSON.stringify([]));
            }
            
            // 3. Redirigir al Dashboard [cite: 66]
            window.location.href = 'dashboard.html';
        } else {
            // Error de credenciales
            mensajeError.textContent = data.mensaje || 'Error de autenticación.';
            mensajeError.classList.remove('d-none');
        }
    } catch (error) {
        mensajeError.textContent = 'Error de conexión con el servidor.';
        mensajeError.classList.remove('d-none');
        console.error('Error en el login:', error);
    }
});