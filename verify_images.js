const fs = require('fs');
const path = require('path');

const tiendaPath = path.join(__dirname, 'servidor/data/tienda.json');
const imgBasePath = path.join(__dirname, 'servidor');

try {
    const data = JSON.parse(fs.readFileSync(tiendaPath, 'utf8'));
    const productos = data.productos;
    let missingImages = 0;
    let totalImages = 0;

    console.log('Verifying images...');

    productos.forEach(producto => {
        if (producto.imagen) {
            totalImages++;
            // Remove leading slash if present to join correctly
            const relativePath = producto.imagen.startsWith('/') ? producto.imagen.substring(1) : producto.imagen;
            const fullPath = path.join(imgBasePath, relativePath);

            if (!fs.existsSync(fullPath)) {
                console.error(`Missing: ${producto.imagen} (ID: ${producto.id})`);
                missingImages++;
            } else {
                // console.log(`Found: ${producto.imagen}`);
            }
        }
    });

    console.log('\n' + '='.repeat(30));
    console.log(`Total Images Checked: ${totalImages}`);
    console.log(`Missing Images: ${missingImages}`);

    if (missingImages === 0) {
        console.log('All images exist!');
    } else {
        console.log('Some images are missing.');
    }

} catch (err) {
    console.error('Error reading or parsing tienda.json:', err);
}
