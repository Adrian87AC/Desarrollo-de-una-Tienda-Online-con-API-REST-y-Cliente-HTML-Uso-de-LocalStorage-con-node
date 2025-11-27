// ==========================================
// LOGIN.JS - Gestión del inicio de sesión
// ==========================================

console.log('✅ Script login.js cargado correctamente');

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM completamente cargado');
    
    // Obtener referencias a los elementos del formulario
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const mensajeError = document.getElementById('mensajeError');
    
    // Verificar que todos los elementos existen
    if (!loginForm) {
        console.error('❌ ERROR: No se encontró el formulario con id "loginForm"');
        alert('Error crítico: Formulario no encontrado');
        return;
    }
    
    if (!usernameInput) {
        console.error('❌ ERROR: No se encontró el input con id "username"');
        alert('Error crítico: Campo de usuario no encontrado');
        return;
    }
    
    if (!passwordInput) {
        console.error('❌ ERROR: No se encontró el input con id "password"');
        alert('Error crítico: Campo de contraseña no encontrado');
        return;
    }
    
    if (!mensajeError) {
        console.error('❌ ERROR: No se encontró el div con id "mensajeError"');
    }
    
    console.log('✅ Todos los elementos encontrados correctamente');
    console.log('   - Formulario:', loginForm);
    console.log('   - Input usuario:', usernameInput);
    console.log('   - Input password:', passwordInput);
    console.log('   - Mensaje error:', mensajeError);
    
    // Agregar evento al formulario
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evitar envío estándar del formulario
        
        console.log('🔥 Formulario enviado - Iniciando proceso de login');
        
        // Obtener valores de los campos
        const usuario = usernameInput.value.trim();
        const contrasena = passwordInput.value;
        
        console.log('📝 Datos del formulario:');
        console.log('   - Usuario:', usuario);
        console.log('   - Contraseña:', contrasena ? '***' : '(vacío)');
        
        // Validar que los campos no estén vacíos
        if (!usuario || !contrasena) {
            mostrarError('⚠️ Por favor, completa todos los campos.');
            return;
        }
        
        // Deshabilitar botón de submit durante la petición
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Iniciando sesión...';
        
        // Limpiar LocalStorage antes de un nuevo login
        console.log('🗑️ Limpiando LocalStorage...');
        localStorage.clear();
        
        try {
            console.log('📡 Enviando petición al servidor...');
            
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, contrasena })
            });
            
            console.log('📥 Respuesta recibida - Status:', response.status);
            
            const data = await response.json();
            console.log('📦 Datos recibidos:', data);
            
            if (response.ok) {
                console.log('✅ LOGIN EXITOSO');
                
                // 1. Almacenar token de autenticación
                console.log('💾 Guardando token...');
                localStorage.setItem('auth_token', data.token);
                
                // 2. Almacenar datos completos de la tienda
                console.log('💾 Guardando datos de la tienda...');
                localStorage.setItem('tienda_data', JSON.stringify(data.tienda));
                
                // 3. Inicializar carrito vacío
                console.log('💾 Inicializando carrito...');
                if (!localStorage.getItem('carrito')) {
                    localStorage.setItem('carrito', JSON.stringify([]));
                }
                
                // 4. Inicializar productos vistos
                console.log('💾 Inicializando productos vistos...');
                if (!localStorage.getItem('productos_vistos')) {
                    localStorage.setItem('productos_vistos', JSON.stringify([]));
                }
                
                console.log('📊 Estado de LocalStorage:');
                console.log('   - Token:', localStorage.getItem('auth_token') ? 'Guardado ✓' : 'NO guardado ✗');
                console.log('   - Tienda:', localStorage.getItem('tienda_data') ? 'Guardada ✓' : 'NO guardada ✗');
                console.log('   - Carrito:', localStorage.getItem('carrito') ? 'Inicializado ✓' : 'NO inicializado ✗');
                
                // 5. Redirigir al Dashboard
                console.log('🔄 Redirigiendo a dashboard.html...');
                window.location.href = 'dashboard.html';
                
            } else {
                // Error de autenticación
                console.log('❌ ERROR DE AUTENTICACIÓN');
                console.log('   - Status:', response.status);
                console.log('   - Mensaje:', data.mensaje);
                
                mostrarError(data.mensaje || '❌ Error de autenticación. Verifica tus credenciales.');
                
                // Rehabilitar botón
                submitBtn.disabled = false;
                submitBtn.textContent = 'Entrar a la Tienda';
            }
            
        } catch (error) {
            console.error('❌ ERROR DE CONEXIÓN:', error);
            console.error('   - Tipo:', error.name);
            console.error('   - Mensaje:', error.message);
            
            mostrarError('❌ Error de conexión con el servidor. Verifica que el servidor esté ejecutándose en http://localhost:3000');
            
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar a la Tienda';
        }
    });
    
    // Función para mostrar mensajes de error
    function mostrarError(mensaje) {
        console.log('⚠️ Mostrando error:', mensaje);
        
        if (mensajeError) {
            mensajeError.textContent = mensaje;
            mensajeError.classList.remove('d-none');
            
            // Ocultar el error después de 5 segundos
            setTimeout(() => {
                mensajeError.classList.add('d-none');
            }, 5000);
        } else {
            alert(mensaje);
        }
    }
    
    console.log('✅ Event listener agregado al formulario');
});

console.log('✅ Script login.js completamente ejecutado');