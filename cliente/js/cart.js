async function comprar() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const resp = await fetch("http://localhost:3000/carrito", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify(carrito)
    });

    const data = await resp.json();

    if (!data.ok) {
        alert(data.error);
        return;
    }

    alert("Compra realizada correctamente");
    localStorage.removeItem("carrito");
}
