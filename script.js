// Simulador de compra en un kiosco

// Array de objetos literales con los productos del kiosco
const productos = [
    { nombre: "Gaseosa", precio: 500 },
    { nombre: "Alfajor", precio: 350 },
    { nombre: "Galletitas", precio: 400 },
    { nombre: "Caramelo", precio: 100 },
    { nombre: "Chicle", precio: 150 }
];

// Array vacío para almacenar los productos seleccionados por el usuario
let carrito = [];

// Función para mostrar los productos disponibles en consola
function mostrarProductos() {
    console.log("Productos disponibles:");
    for (const producto of productos) {
        console.log(`${producto.nombre} - $${producto.precio}`);
    }
}

// Función para agregar un producto al carrito
const agregarProducto = (nombreProducto) => {
    const producto = productos.find(item => item.nombre.toLowerCase() === nombreProducto.toLowerCase());
    if (producto) {
        carrito.push(producto);
        alert(`${producto.nombre} fue agregado al carrito.`);
    } else {
        alert("Producto no encontrado. Por favor, ingresá un producto válido.");
    }
};

// Función flecha para calcular el total de la compra
const calcularTotal = () => carrito.reduce((total, producto) => total + producto.precio, 0);

// Función para mostrar el contenido del carrito en consola
const mostrarCarrito = () => {
    console.log("Productos en tu carrito:");
    for (const producto of carrito) {
        console.log(`${producto.nombre} - $${producto.precio}`);
    }
};

// Mensaje de bienvenida
alert("¡Bienvenido al simulador de compras del kiosco!");

// Mostrar productos en consola
mostrarProductos();

// Confirmación inicial para empezar a comprar
let deseaComprar = confirm("¿Deseás realizar una compra en el kiosco?");

while (deseaComprar) {
    // Mostrar lista de productos al usuario con prompt
    let listaProductos = "¿Qué producto querés comprar?\n";
    for (const producto of productos) {
        listaProductos += `${producto.nombre} - $${producto.precio}\n`;
    }

    // do...while para validar que ingrese un producto válido
    let productoElegido;
    let productoValido = false;

    do {
        productoElegido = prompt(listaProductos);

        // Si el usuario cancela el prompt
        if (productoElegido === null) {
            alert("Cancelaste la selección.");
            continue; // Salta a la siguiente iteración del while
        }

        productoValido = productos.some(item => item.nombre.toLowerCase() === productoElegido.toLowerCase());
        if (!productoValido) {
            alert("Producto no válido. Intentá nuevamente.");
        }
    } while (!productoValido);

    // Agregamos el producto válido al carrito
    agregarProducto(productoElegido);

    // Mostrar cantidad de productos en el carrito usando .length
    alert(`Llevás ${carrito.length} producto(s) en el carrito.`);

    // Confirmación para seguir comprando o no
    deseaComprar = confirm("¿Querés agregar otro producto?");
}

// Mostrar carrito final en consola
mostrarCarrito();

// Calcular total de la compra
const totalCompra = calcularTotal();

// Mostrar resumen final al usuario con join()
const nombresCarrito = carrito.map(item => item.nombre);
alert("Gracias por tu compra.\nCompraste: " + nombresCarrito.join(", ") + `.\nTotal a abonar: $${totalCompra}`);

console.log("Total de la compra: $" + totalCompra);
