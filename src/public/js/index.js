/* Cliente */
console.log("Hola desde el server");

const SOCKET = io();
const FORM = document.getElementById("form");

// esto es para escuchar un mensaje
SOCKET.on("connect", () => {
    console.log("Conectado al Server");
});

// esto es para escuchar un mensaje
SOCKET.on("products", (products) => {
    const TBODY = document.getElementById("tbody");
    TBODY.innerHTML = "";
    let rowsHTML = ""; // Variable para acumular todas las filas
    products.forEach((product) => {
        rowsHTML += `
            <tr class="categories__item">
                <td class="id">${product.id}</td>
                <td class="code">${product.code}</td>
                <td class="category">${product.category}</td>
                <td class="title">${product.title}</td>
                <td class="thumbnail"><a href="${product.thumbnail[0]}" target="_blank">${product.thumbnail[0]}</a></td>
                <td class="price">${product.price}</td>
                <td class="stock">${product.stock}</td>
                <td class="available">${product.available}</td>
                <td><button class="delete" id=${product.id}>Delete</button></td>
            </tr>
        `;
    });
    TBODY.innerHTML = rowsHTML; // Establecer el innerHTML de TBODY una sola vez
    document.querySelectorAll(".delete").forEach((button) => {
        button.addEventListener("click", function() {
            const productId = this.getAttribute("id");
            SOCKET.emit("delete-product", productId);
        });
    });
});

FORM.addEventListener("submit", function(event) {
    event.preventDefault();
    // obtener valores del formulario
    const FILE = document.getElementById("file").value;
    const CODE = document.getElementById("code").value;
    const CATEGORY = document.getElementById("category").value;
    const TITLE = document.getElementById("title").value;
    const PRICE = document.getElementById("price").value;
    const STOCK = document.getElementById("stock").value;
    const DESCRIPTION = document.getElementById("description").value;
    // enviar el nuevo producto al servidor a traves de socket
    const product = {
        code: CODE,
        category: CATEGORY,
        title: TITLE,
        description: DESCRIPTION,
        price: Number(PRICE),
        stock: Number(STOCK),
        thumbnail: [FILE],
        available: true,
    };
    SOCKET.emit("add-product", product);
    FORM.reset();
});

// esto aparece al desconectar el servidor (control+C).
SOCKET.on("disconnect", () => {
    console.log("Se desconecto el server");
});