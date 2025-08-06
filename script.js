// Clase Producto
class Producto {
    constructor(id, nombre, precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
    }
}

// Clase Carrito
class Carrito {
    constructor() {
        this.productos = [];
        this.total = 0;
    }

    agregar(producto) {
        const index = this.productos.findIndex(p => p.id === producto.id);
        if (index !== -1) {
            this.productos[index].cantidad += 1;
        } else {
            this.productos.push({ ...producto, cantidad: 1 });
        }
        this.actualizarTotal();
        Toastify({
            text: `${producto.nombre} agregado al carrito`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#007bff"
        }).showToast();
    }

    quitar(id) {
        this.productos = this.productos.filter(item => item.id !== id);
        this.actualizarTotal();
    }

    vaciar() {
        this.productos = [];
        this.actualizarTotal();
    }

    actualizarTotal() {
        this.total = this.productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    }
}

let productosDisponibles = []; // Se cargará desde fetch
let carrito = new Carrito();

// Cargar datos del carrito desde localStorage si existen
document.addEventListener("DOMContentLoaded", async () => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        const parsed = JSON.parse(carritoGuardado);
        carrito.productos = parsed.productos;
        carrito.total = parsed.total;
    }

    // Cargar productos desde JSON externo
    await cargarProductos();
    renderizarCarrito();
});

// Cargar productos desde archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch("productos.json");
        const data = await response.json();
        productosDisponibles = data.map(p => new Producto(p.id, p.nombre, p.precio));
        renderizarProductos();
    } catch (error) {
        alert("Error al cargar los productos. Intente más tarde.");
    }
}

// Renderizar productos en el DOM
function renderizarProductos() {
    const contenedor = document.getElementById("productos-container");
    contenedor.innerHTML = "";

    productosDisponibles.forEach(producto => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <button data-id="${producto.id}">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });

    // Evento para cada botón "Agregar al carrito"
    document.querySelectorAll(".producto button").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            const producto = productosDisponibles.find(p => p.id === id);
            if (producto) {
                carrito.agregar(producto);
                guardarEnLocalStorage();
                renderizarCarrito();
            }
        });
    });
}

// Renderizar el carrito en el DOM
function renderizarCarrito() {
    const contenedor = document.getElementById("carrito-container");
    const totalContenedor = document.getElementById("total-container");
    const btnFinalizar = document.getElementById("finalizar-compra-btn");
    const btnVaciar = document.getElementById("vaciar-carrito-btn");
    const mensajeExito = document.getElementById("mensaje-exito");

    contenedor.innerHTML = "";
    mensajeExito.classList.add("hidden");

    btnFinalizar.disabled = carrito.productos.length === 0;
    btnVaciar.disabled = carrito.productos.length === 0;

    if (carrito.productos.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        totalContenedor.textContent = "Total: $0.00";
        return;
    }

    carrito.productos.forEach(item => {
        const div = document.createElement("div");
        div.className = "carrito-item";
        div.innerHTML = `
            <h3>${item.nombre}</h3>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Precio unitario: $${item.precio.toFixed(2)}</p>
            <p>Total: $${(item.precio * item.cantidad).toFixed(2)}</p>
            <button data-id="${item.id}">Quitar</button>
        `;
        contenedor.appendChild(div);
    });

    // Evento para cada botón "Quitar"
    document.querySelectorAll(".carrito-item button").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            carrito.quitar(id);
            guardarEnLocalStorage();
            renderizarCarrito();
        });
    });

    totalContenedor.textContent = `Total: $${carrito.total.toFixed(2)}`;
}

// Vaciar el carrito completamente
document.getElementById("vaciar-carrito-btn").addEventListener("click", () => {
    carrito.vaciar();
    guardarEnLocalStorage();
    renderizarCarrito();
});

// Finalizar compra
document.getElementById("finalizar-compra-btn").addEventListener("click", () => {
    const mensaje = document.getElementById("mensaje-exito");
    mensaje.classList.remove("hidden");

    Toastify({
        text: "¡Gracias por tu compra!",
        duration: 4000,
        gravity: "top",
        position: "center",
        backgroundColor: "green"
    }).showToast();

    carrito.vaciar();
    guardarEnLocalStorage();
    renderizarCarrito();
});

// Guardar en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify({
        productos: carrito.productos,
        total: carrito.total
    }));
}
