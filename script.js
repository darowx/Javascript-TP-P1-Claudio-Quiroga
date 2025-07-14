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
            // Si ya existe, incrementamos cantidad
            this.productos[index].cantidad += 1;
        } else {
            // Si no existe, lo agregamos con cantidad inicial 1
            this.productos.push({ ...producto, cantidad: 1 });
        }
        this.actualizarTotal();
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

// Productos predefinidos
const productosDisponibles = [
    new Producto(1, "Gaseosa", 250),
    new Producto(2, "Jugo", 180),
    new Producto(3, "Chocolatada", 300),
    new Producto(4, "Sandwich", 350),
    new Producto(5, "Yogurt", 220),
    new Producto(6, "Agua Mineral", 150)
];

let carrito = new Carrito();

// Cargar carrito desde localStorage si existe
document.addEventListener("DOMContentLoaded", () => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        const parsed = JSON.parse(carritoGuardado);
        carrito.productos = parsed.productos;
        carrito.total = parsed.total;
    }
    renderizarProductos();
    renderizarCarrito();
});

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

    // Agregar evento a los botones de agregar
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

// Renderizar carrito en el DOM
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

    // Botones de quitar individualmente
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

// Vaciar carrito
document.getElementById("vaciar-carrito-btn").addEventListener("click", () => {
    carrito.vaciar();
    guardarEnLocalStorage();
    renderizarCarrito();
});

// Finalizar compra
document.getElementById("finalizar-compra-btn").addEventListener("click", () => {
    const mensaje = document.getElementById("mensaje-exito");
    mensaje.classList.remove("hidden");
    carrito.vaciar();
    guardarEnLocalStorage();
    renderizarCarrito();
});

// Guardar carrito en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify({
        productos: carrito.productos,
        total: carrito.total
    }));
}