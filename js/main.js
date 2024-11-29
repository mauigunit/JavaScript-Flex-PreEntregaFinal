const tituloAPP = "Supermercado";

/* RESCATO IDS */
const elementTitulo = document.getElementById("tituloAPP");
const elementCarrito = document.getElementById("totalCarrito");
const totalProdCarrito = document.getElementById("totalProdCarrito");

/* ASIGNO TITULOS */
elementTitulo.innerText = tituloAPP;

/* MODAL CARRITO */
const tituloVerCarrito = document.getElementById("tituloModalCarrito");
tituloVerCarrito.innerText = "Productos Carrito";

const btnVerCarrito = document.getElementById('btnProductosDelCarrito');
btnVerCarrito.onclick = function () {
    fnVerProductosCarrito();
};

const btnComprar = document.getElementById('btn-comprar');
btnComprar.onclick = function () {
    resumenCompra();
};

const getStorage = (key) => {
    let dataStorage = localStorage.getItem(key);
    if (dataStorage === null) {
        dataStorage = JSON.stringify([]);
    }
    return JSON.parse(dataStorage);
}

const addStorageTotal = (key, valor) => {
    localStorage.setItem(key, valor);
}

const getCarritoStorage = (key) => {
    let dataStorage = getStorage(key);
    if (dataStorage != null) {
        let elementProdCarrito = document.getElementById("totalProdCarrito");
        elementProdCarrito.innerText = dataStorage.length;
    }
}

const resumenCompra = () => {
    window.location.href = "./pages/verificarCompra.html";
}

const actualizarProductoCarrito = (idProducto, accion) => {
    const productosCarrito = getStorage("MisProductosCarrito");
    let unProducto = productosCarrito.find(producto => producto.idProducto == idProducto);
    if (!unProducto) {
        Swal.fire({
            title: "Oops...",
            text: "El producto no existe en el carrito.",
            icon: "error"
        });
    }
    else if (accion == "+") {
        unProducto.cantidad = unProducto.cantidad + 1;

    }
    else if (accion == "-") {
        unProducto.cantidad = unProducto.cantidad - 1;
        if (unProducto.cantidad <= 0) {
            let indice = productosCarrito.findIndex(producto => producto.idProducto == idProducto);
            if (indice != -1) {
                productosCarrito.splice(indice, 1);
            }
        }
    }
    else if (accion == "x") {
        let indice = productosCarrito.findIndex(producto => producto.idProducto == idProducto);
        if (indice != -1) {
            productosCarrito.splice(indice, 1);
        }

    }
    GuardarStorage(productosCarrito, "MisProductosCarrito");
    fnVerProductosCarrito();
}

const fnVerProductosCarrito = () => {
    const productosCarrito = getStorage("MisProductosCarrito");
    const elementUL = document.getElementById('productosDelCarrito');
    elementUL.innerHTML = "";
    calcularValorAPagar(productosCarrito);
    if (productosCarrito.length > 0) {
        productosCarrito.forEach(producto => {
            let itemLI = document.createElement("li");
            itemLI.className = "list-group-item";
            itemLI.innerHTML = "<div class='row'>" +
                `<div class="col-6">${producto.nombreProducto}</div>` +
                `<div class="col-3"><input type="number" class="form-control form-control-sm" disabled value="${producto.cantidad}"/></div>` +
                `<div class="col-3 d-flex justify-content-end">` +
                `<button class="btn btn-sm btn-success btn-horizontal" title="Aumentar Producto" value="${producto.idProducto}">+</button>&nbsp;` +
                `<button class="btn btn-sm btn-warning btn-horizontal" title="Disminuir Producto" value="${producto.idProducto}">-</button>&nbsp;` +
                `<button class="btn btn-sm btn-danger btn-horizontal" title="Eliminar Producto" value="${producto.idProducto}"><i class="fa fa-user"></i>x</button>` +
                "</div>" +
                "</div>";
            elementUL.appendChild(itemLI);
            const botones = itemLI.querySelectorAll('button.btn.btn-sm.btn-horizontal');
            botones.forEach(boton => {
                boton.addEventListener('click', function () {
                    actualizarProductoCarrito(this.value, this.innerText);
                });
            });
        });
    }
    else {
        let item = document.createElement("li");
        item.className = "list-group-item";
        item.innerText = "Carrito Vacio";
        elementUL.appendChild(item);
    }
}

const GetCategorias = async () => {
    try {
        const response = await fetch("data/dataCategorias.json");
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

const GuardarStorage = (object, nombreObjectStorage) => {
    let elementProdCarrito = document.getElementById("totalProdCarrito");
    elementProdCarrito.innerText = object.length;
    localStorage.setItem(nombreObjectStorage, JSON.stringify(object));
}

const AgregarProductoCarrito = (idProducto) => {
    GetCategorias()
        .then(data => {
            let unProducto = data.supermercado.productos.find(producto => producto.id == idProducto);
            if (!unProducto) {
                throw Error("El producto no existe.");
            }
            let productosCarrito = getStorage("MisProductosCarrito");
            let elProductoCarrito = productosCarrito.find(prod => prod.idProducto == idProducto);
            if (!elProductoCarrito) {
                let nuevoProducto = {
                    idProducto: idProducto,
                    nombreProducto: unProducto.producto,
                    cantidad: 1
                };
                productosCarrito.push(nuevoProducto);
            }
            else {
                elProductoCarrito.cantidad = elProductoCarrito.cantidad + 1;
            }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Producto agregado",
                showConfirmButton: false,
                timer: 500
            });
            GuardarStorage(productosCarrito, "MisProductosCarrito");
        })
        .catch(error => {
            Swal.fire({
                title: "Oops...!",
                text: error,
                icon: "error"
            });
        });
}

// LISTAR CATEGORIAS
const listarCategorias = () => {
    let cardsCategorias = document.getElementById("cards-categorias");
    GetCategorias()
        .then(data => {
            data.supermercado.categorias.forEach(element => {
                // CREO CARDS DE CATEGORIA
                let elementDivCard = document.createElement("div");
                elementDivCard.className = "card";
                elementDivCard.style.width = "25rem";
                elementDivCard.style.marginBottom = "1rem";

                let contenedorCard =
                    "<div class='card-body'>" +
                    "<h5 class='card-title'>" + element.nombre + "</h5>" +
                    "<div class='card-text'>" +
                    "<ul class='list-group' id='categoria-id" + element.id + "'>";
                let listProductos = data.supermercado.productos.filter(producto => producto.idCategoria == element.id);
                listProductos.forEach(producto => {
                    contenedorCard += "<li class='list-group-item'>" +
                        "<div class='row'>" +
                        "<div class='col-7'>" + producto.producto + "</div>" +
                        "<div class='col-3'>$" + producto.Precio + "</div>" +
                        "<div class='col-2 text-end'><button class='btn btn-sm btn-success' value='" + producto.id + "'>+</button></div>" +
                        "</div>" +
                        "</li>";
                });
                contenedorCard += "</ul>" +
                    "</div>" +
                    "</div>";
                elementDivCard.innerHTML = contenedorCard;
                cardsCategorias.appendChild(elementDivCard);

                const botones = elementDivCard.querySelectorAll('button.btn.btn-sm.btn-success');
                botones.forEach(boton => {
                    boton.addEventListener('click', function () {
                        AgregarProductoCarrito(this.value);
                    });
                });
            });
        })
        .catch(error => {
            Swal.fire({
                title: "Oops...",
                text: error,
                icon: "error"
            });
        });
}

listarCategorias();
getCarritoStorage("MisProductosCarrito");
