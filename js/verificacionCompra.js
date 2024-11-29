const btnVolver = document.getElementById("btn-mod-compra");
btnVolver.onclick = function () {
    modificarCompra();
};

const modificarCompra = () => {
    window.location.href = "../index.html";
}

const btnComprar = document.getElementById("btn-comprar");
btnComprar.onclick = function () {
    pagarCompra();
};

const pagarCompra = () => {
    let formaPago = document.getElementById("txt-forma-pago");
    let nombre = document.getElementById("txt-nombre");
    let tarjeta = document.getElementById("txt-tarjeta");
    let fecha = document.getElementById("txt-fecha");

    if(formaPago.value == "0") {
        mensajeAlerta("error", "Ingrese la forma de pago");
        return;
    }
    if(nombre.value == "") {
        mensajeAlerta("error", "Ingrese nombre de titular");
        return;
    }
    if(tarjeta.value == "") {
        mensajeAlerta("error", "Ingrese el número de tarjea");
        return;
    }
    if(fecha.value == "") {
        mensajeAlerta("error", "Ingrese fecha de expiración");
        return;
    }
    localStorage.setItem("titular", JSON.stringify(
        {"nombre" : nombre.value }
    ));
    window.location.href = "compraFinalizada.html";
}

const mensajeAlerta = (icon, message, title) => {
    Swal.fire({
        title: title,
        text: message,
        icon: icon
    });
}


const getStorage = (key) => {
    let dataStorage = localStorage.getItem(key);
    if (dataStorage === null) {
        dataStorage = JSON.stringify([]);
    }
    return JSON.parse(dataStorage);
}

const GetCategorias = async () => {
    try {
        const response = await fetch("../data/dataCategorias.json"); 
        if (!response.ok) {
            throw new Error('No fue posible cargar las categorias de productos: cod.status(' + response.status + ")");
        }
        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

const calcularValorAPagar = async (productosCarrito) => {
    GetCategorias()
        .then(data => {
            const elementTotalCarrito = document.getElementById("totalCarrito");
            let acumulado = 0;
            productosCarrito.forEach(producto => {
                let idProducto = producto.idProducto;
                let cantidad = producto.cantidad;
                const productoData = data.supermercado.productos.find(prod => prod.id == idProducto);
                if (!productoData)
                    throw error(`No se encontro el producto ${producto.nombreProducto}, por favor actualice carrito.`);
                acumulado = acumulado + (productoData.Precio * cantidad);
            });
            elementTotalCarrito.innerText = acumulado;
        })
        .catch(error => {
            Swal.fire({
                title: "Oops...",
                text: error,
                icon: "error"
            });
        });
}

const listarProductos = () => {
    
    const elementUL = document.getElementById("carrito");
    const productosCarrito = getStorage("MisProductosCarrito");
    calcularValorAPagar(productosCarrito);
    let elementLITitulo = document.createElement("li");
    elementLITitulo.className = "list-group-item";
    elementLITitulo.innerHTML = "<div class='row'>" +
    `<div class="col-5"><b>Producto</b></div>` +
    `<div class="col-2"><b>Cantidad</b></div>` +
    `<div class="col-2"><b>Precio</b></div>` +
    `<div class="col-3"><b>Total</b></div>` +
    "</div>";
    elementUL.appendChild(elementLITitulo);
    productosCarrito.forEach(element => {
        let precio = 0;
        let total = 0;
        GetCategorias()
        .then(data => {
            const productoData = data.supermercado.productos.find(prod => prod.id == element.idProducto);
            if(!productoData)
                throw error ("Producto no Encontrado.");
            precio = productoData.Precio;
            total = productoData.Precio * element.cantidad;
            let elementLI = document.createElement("li");
            elementLI.className = "list-group-item";
            elementLI.innerHTML = "<div class='row'>" +
                    `<div class="col-5">${element.nombreProducto}</div>` +
                    `<div class="col-2"><input type="number" class="form-control form-control-sm" disabled value="${element.cantidad}"/></div>` +
                    `<div class="col-2">$ ${precio}</div>` +
                    `<div class="col-3">$ ${total}</div>` +
                    "</div>";
                elementUL.appendChild(elementLI);
            })
        .catch(error => {
            Swal.fire({
                title: "Oops...",
                text: error,
                icon: "error"
            });
        });
    });
}

listarProductos();