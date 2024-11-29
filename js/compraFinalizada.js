const btnVolver = document.getElementById("btn-fin");
btnVolver.onclick = function () {
    volverASuper();
};

const volverASuper = () => {
    window.location.href = "../index.html";
}

const getStorage = (key) => {
    let dataStorage = localStorage.getItem(key);
    return JSON.parse(dataStorage);
}

const finalizaCompra = () => {
    const tit = getStorage("titular");
    if (tit != null) {
        const elementTit = document.getElementById("titular");
        elementTit.innerText = tit.nombre;
        localStorage.removeItem("titular");
        localStorage.removeItem("MisProductosCarrito");
    }
}

finalizaCompra();