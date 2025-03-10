document.getElementById("toggle-btn").addEventListener("click", function() {
    const sidebar = document.getElementById("menu");
    const content = document.getElementById("main-content");

    if (sidebar.style.left === "-250px") {
        sidebar.style.left = "0";
        content.style.marginLeft = "250px";
    } else {
        sidebar.style.left = "-250px";
        content.style.marginLeft = "0";
    }
});

document.getElementById("mode-toggle").addEventListener("click", function() {
    const body = document.body;

    // Cambiar entre los modos claro y oscuro
    if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        this.textContent = "🌞";  // Cambiar el icono al sol
    } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        this.textContent = "🌙";  // Cambiar el icono a la luna
    }
});

// Manejar el clic en el punto 2 para mostrar/ocultar el submenú
document.getElementById("menu-point-2").addEventListener("click", function() {
    const submenu = this.querySelector(".submenu");
    
    // Alternar la visibilidad del submenú
    if (submenu.style.display === "block") {
        submenu.style.display = "none";
    } else {
        submenu.style.display = "block";
    }
});
