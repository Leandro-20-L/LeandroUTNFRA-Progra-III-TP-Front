//================= ARRAY DE OBJETOS=============
//Punto 1 

async function cargarProductosDesdeAPI() {
    try {
        const response = await fetch("http://localhost:3000/api/productos");
        const data = await response.json();

        productos = data.payload; // ✅ guardás los productos globalmente

        mostrarProductos(productos); // mostrás normalmente
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

let productos = [];
// ===================MOSTRAR DATOS DEL ALUMNO=============
// punto 2

/*En este Punto se pide mostrar de forma visible lo que son mis datos,asique 
lo que hice fue definir un objeto alumno con los datos basicos y ya despues mostrarlo con un  `console.log`. Tambien 
lo muestro en el DOM seleccionando la clase `.nombreAlumno` 
function imprimirDatosAlumno() {
  const alumno = {
    dni: 46363895,
    nombre: "Leandro",
    apellido: "Escobar"
  };

  console.log(`Alumno: ${alumno.nombre} ${alumno.apellido} - DNI: ${alumno.dni}`);

  const nombreAlumnoDiv = document.querySelector(".nombreAlumno");
  if (nombreAlumnoDiv) {
    nombreAlumnoDiv.textContent = `${alumno.nombre} ${alumno.apellido}`;
  }
}

*/

//====================MOSTRAR PRODUCTO====================
//punto 3
/* En este punto se pedia imprimir los productos(frutas),
lo que hice fue recorrer el array de objetos con un forEach y dibujarlo en el DOM */
function mostrarProductos(array){
    const contenedorProductos =document.getElementById("contenedor-productos");
    let htmlProductos = "";
    
    array.forEach(producto => {
        htmlProductos += `
                <div class="card-producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <button onclick="agregarCarritos(${producto.id})">Agregar a carrito</button>
            </div>
                `;
    });

    contenedorProductos.innerHTML = htmlProductos;
}

// =============================== FILTRAR PRODUCTOS =============================== 
// Punto 4
/* En este punto se pide Filtrar segun la busqueda. Para eso, primero seleccionamos el input de busqueda por su ID y le asigne
 un evento `keyup`, que se dispara cada vez que el usuario presiona una tecla. y con el filter creo un nuevo array nuevo el cual lo muestro al final */

const inputBuscar = document.getElementById("inputbuscar");
inputBuscar.addEventListener("keyup",filtrarProductos);
function filtrarProductos() {
    let valorInput = inputBuscar.value;
    let listaProductosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(valorInput.toLowerCase())
    );
    mostrarProductos(listaProductosFiltrados);
}

//=========================FUNCIONALIDAD CARRITO============================
//Punto 5
/* En este punto se muestra lo que es el circuito del carrito
    tanto como mostrar datos agregar y eliminar, Tambien inicialize un array carrito en el cual se va almacenar los 
    productos  */
function mostrarCarrito(array){
    const itemsCarrito = document.getElementById("items-carrito");
    let htmlCarrito = "";
    
    array.forEach(producto =>{
        htmlCarrito += `
            <li class="bloque-item">
            <p class="nombre-item"> <img src="${producto.imagen}" alt="${producto.nombre}"> Nombre:${producto.nombre}  - Precio: ${producto.precio}</p>
            <button class="boton-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </li>
        `;
    })
    itemsCarrito.innerHTML = htmlCarrito;
}

/*tanto agregar carrito y eliminar carrito se guian por el id 
si quiero agregar hago un push y si quiero eliminar uso un splice */
let carrito = [];
function agregarCarritos(id) {
    const productoEncontrado = productos.find(producto => producto.id === id);
    if (productoEncontrado) {
        carrito.push(productoEncontrado);
        mostrarCarrito(carrito);
        
        actualizarPrecioTotal();
    }
}


function eliminarProducto(id){
    const index = carrito.findIndex(producto => producto.id === id);
    if (index !== -1) {
        carrito.splice(index, 1); 
        mostrarCarrito(carrito);
        actualizarContadorCarrito();
        actualizarPrecioTotal();
    }
}

//====================ACTUALIZAR PRECIO Y CONTADOR HEADER==================
//Punto 7
function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    contador.textContent = carrito.length;
}
function actualizarPrecioTotal() {
    let total = carrito.reduce((acum, producto) => acum + producto.precio, 0);
    const spanTotal = document.getElementById("precio-total");
    spanTotal.textContent = `$${total.toFixed(2)}`;
    console.log("Carrito:", carrito);
console.log("Total calculado:", total);
}

//================= ORDENAMIENTO DE PRODUCTOS SEGUN EL PARAMETRO==============
//Punto 8
/*En este punto pide agregar botones para ordenar los botones entonces usando un sort lo ordeno segun 
el criterio y finalmete uso un evento listener para cuando el usuario haga click en los botones*/ 
function ordenamiento(criterio) {
    productos.sort((a, b) => {
        if (criterio === "precio") {
            return a.precio - b.precio;
        } else if (criterio === "nombre") {
            return a.nombre.localeCompare(b.nombre);
        }
        return 0;
    });

    mostrarProductos(productos); 
}


function vaciarCarrito() {
    carrito = []; 
    mostrarCarrito(carrito);
    actualizarContadorCarrito();
    actualizarPrecioTotal();
}

 function verificarNombreUsuario() {
  const nombre = sessionStorage.getItem("nombreUsuario");

  if (!nombre) {
    window.location.href = "login.html"; 
    return false; 
  } else {
    const divNombre = document.querySelector(".nombreAlumno");
    if (divNombre) {
      divNombre.textContent = `Bienvenido, ${nombre}`;
    }
    return true; // usuario sí existe
  }
}
async function init(){
    //sessionStorage.removeItem("nombreUsuario");
    verificarNombreUsuario();
    
    //imprimirDatosAlumno();
    await cargarProductosDesdeAPI();
    
    document.getElementById("btn-vaciar-carrito").addEventListener("click", vaciarCarrito);
    document.getElementById("ordenar-nombre").addEventListener("click", () => ordenamiento("nombre"));
    document.getElementById("ordenar-precio").addEventListener("click", () => ordenamiento("precio"));
    const contenedorUsuario = document.getElementById("contenedor-usuario");
    const btnCerrarSesion = document.createElement("button");
    btnCerrarSesion.textContent = "Cerrar sesión";
    btnCerrarSesion.addEventListener("click", () => {
        sessionStorage.removeItem("nombreUsuario");
        window.location.href = "login.html";
    });
    contenedorUsuario.appendChild(btnCerrarSesion);
}

init();

console.log("Productos recibidos desde API:", productos);
