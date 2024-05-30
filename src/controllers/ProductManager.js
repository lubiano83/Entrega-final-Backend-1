import fs from 'fs';
import path from 'path';

export default class ProductManager {
    // Constructor
    constructor() {
        this.path = path.join("./src/database/productos.json");
        this.products = [];
        this.#initializeProducts();
    }

    // Inicializar productos leyendo desde el archivo
    #initializeProducts = async () => {
        await this.#ensureFileExists();
        try {
            this.products = await this.#readProductos();
        } catch (error) {
            console.error("Error al inicializar productos:", error);
        }
    };

    #ensureFileExists = async () => {
        try {
            await fs.promises.access(this.path, fs.constants.F_OK); // fs.promises.access verifica la accesibilidad de un archivo o directorio y fs.constants.F_OK comprueba si el archivo es accesible. No intenta leer ni escribir en el archivo, solo verifica si el archivo existe.
        } catch (error) {
            await this.#escribirArchivo([]);
        }
    };

    // Funciones privadas
    #generarId = (products) => {
        let idMayor = 0;
        products.forEach(product => {
            if (product.id > idMayor) {
                idMayor = product.id;
            }
        });
        return idMayor + 1;
    };

    #readProductos = async () => {
        await this.#ensureFileExists();
        const respuesta = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(respuesta);
    };

    #escribirArchivo = async (datos) => {
        return await fs.promises.writeFile(this.path, JSON.stringify(datos, null, "\t")); // Escribir los productos combinados en el archivo
    };

    #validateCode = (products, code) => {
        const validate = products.find(product => product.code === code);
        if (validate) {
            console.log("El codigo ya existe");
        }
        return !validate;
    };

    #identifyId = async (id) => {
        const respuesta = await this.#readProductos();
        const productId = respuesta.find(product => product.id === id);
        return productId;
    };

    // Funciones públicas
    addProduct = async (category, title, description, price, thumbnail, code, stock, available) => {
        await this.#ensureFileExists();
        let products = await this.#readProductos();
        const product = {
            id: this.#generarId(products),
            category,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            available: available !== undefined ? available : true
        };
        if (!category || !title || !description || !price || !code || !stock) {
            console.log("Todos los campos son obligatorios");
        } else {
            if (this.#validateCode(products, code)) {
                products.push(product);
                await this.#escribirArchivo(products);
                console.log("Producto Agregado");
            }
        }
    };

    getProductById = async (id) => {
        await this.#ensureFileExists();
        const respuesta = await this.#identifyId(id);
        !respuesta ? console.log("Not found") : console.log(respuesta);
    };

    deleteProductById = async (id) => {
        await this.#ensureFileExists();
        let products = await this.#readProductos();
        products = products.filter(product => product.id !== id);
        await this.#escribirArchivo(products);
        console.log("Producto Eliminado");
    };

    updateProduct = async ({ id, ...product }) => {
        await this.#ensureFileExists();
        const existingProduct = await this.#identifyId(id);
        if (existingProduct) {
            let products = await this.#readProductos();
            products = products.map(p => p.id === id ? { id, ...product } : p);
            await this.#escribirArchivo(products);
            console.log("Producto Modificado");
        } else {
            console.log("Producto no encontrado");
        }
    };

    toggleAvailability = async (id) => {
        await this.#ensureFileExists();
        let products = await this.#readProductos();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            return { error: "Producto no encontrado" };
        }
        products[index].available = !products[index].available;
        await this.#escribirArchivo(products);
        return products[index];
    };

    getProducts = async () => {
        await this.#ensureFileExists();
        const products = await this.#readProductos();
        return products;
    };
}
