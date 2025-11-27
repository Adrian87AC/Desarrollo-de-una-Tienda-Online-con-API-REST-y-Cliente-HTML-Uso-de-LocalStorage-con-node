const express = require('express');
const cors = require('cors');

const loginRoute = require('./routes/login');
const carritosRoute = require('./routes/carrito');
const productosVistosRoute = require('./routes/productosVistos');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/login', loginRoute);
app.use('/api/carrito', carritosRoute);
app.use('/api/productosVistos', productosVistosRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));