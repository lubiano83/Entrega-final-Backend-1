/* Servidor Express */
import express from "express";
import productRouter from "./src/router/product.routes.js";
import cartRouter from "./src/router/cart.routes.js";

const PORT = 8080;
const HOST = "localhost"; // 127.0.0.1
const APP = express();

APP.use(express.urlencoded({extended: true})); // para recibir los datos en urlencoded desde postman
APP.use(express.json());

APP.use("/api/products", productRouter);
APP.use("/api/carts", cartRouter);

// Metodo que gestiona las rutas inexistentes.
APP.use("*", (req, res) => { 
    return res.status(404).send("<h1>Error 404: Not Found</h1>");
});

APP.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});