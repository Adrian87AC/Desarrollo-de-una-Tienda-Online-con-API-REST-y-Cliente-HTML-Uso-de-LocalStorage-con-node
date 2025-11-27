document.getElementById("btnLogin").addEventListener("click", async () => {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    const resp = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password })
    });

    const data = await resp.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("tienda", JSON.stringify(data.tienda));

    window.location.href = "dashboard.html";
});
