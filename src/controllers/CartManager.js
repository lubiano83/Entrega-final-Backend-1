import fs from 'fs';
import path from 'path';
import ProductManager from './ProductManager.js';

const PRODUCT = new ProductManager();

export default class CartManager {
    // Constructor
    constructor() {
        this.path = path.join("./src/database/carrito.json");
    }

    // Funciones privadas
    #generarId = (carts) => {
        let idMayor = 0;
        carts.forEach(cart => {
            if (cart.id > idMayor) {
                idMayor = cart.id;
            }
        });
        return idMayor + 1;
    };

    #readCarts = async () => {
        await this.#ensureFileExists();
        const respuesta = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(respuesta);
    };

    #escribirArchivo = async (datos) => {
        return await fs.promises.writeFile(this.path, JSON.stringify(datos, null, "\t")); // Escribir los productos combinados en el archivo
    };

    #identifyId = async (id) => {
        const respuesta = await this.#readCarts();
        const cartId = respuesta.find(cart => cart.id === id);
        return cartId;
    };

    #ensureFileExists = async () => {
        try {
            await fs.promises.access(this.path, fs.constants.F_OK);
        } catch (error) {
            await this.#escribirArchivo([]);
        }
    };

    // Funciones públicas
    addCart = async () => {
        await this.#ensureFileExists();
        let carts = await this.#readCarts();

        const cart = {
            id: this.#generarId(carts),
            products: []
        }
        
        let allCarts = [...carts, cart];
        await this.#escribirArchivo(allCarts);
        return "Carrito Agregado"
    };

    getCartById = async (id) => {
        const respuesta = await this.#identifyId(id);
        if(!respuesta){
            return "Not found"
        } else {
            return respuesta;
        } 
    };

    addProductToCart = async (cartId, productId) => {
        await this.#ensureFileExists(); // Asegura que el archivo exista antes de cualquier operación
        try {
            let cartById = await this.getCartById(cartId);
            let productById = await PRODUCT.getProductById(productId);
    
            if (!cartById) {
                return "Carrito no encontrado";
            }
    
            if (!productById) {
                return "Producto no encontrado";
            }
    
            let carts = await this.#readCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);
            const productIndex = carts[cartIndex].products.findIndex(product => product.productId === productId);
    
            if (productIndex === -1) {
                carts[cartIndex].products.push({ productId, cantidad: 1 });
                await this.#escribirArchivo(carts);
                return "Producto Agregado";
            } else {
                carts[cartIndex].products[productIndex].cantidad += 1;
                await this.#escribirArchivo(carts);
                return "Cantidad del Producto Incrementada";
            }
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return "Error interno";
        }
    };
    
    deleteCartById = async (id) => {
        await this.#ensureFileExists();
        let carts = await this.#readCarts();
        carts = carts.filter(cart => cart.id !== id);
        await this.#escribirArchivo(carts);
        console.log("Carrito Eliminado");
    };
    
    getCarts = async () => {
        await this.#ensureFileExists();
        const carts = await this.#readCarts();
        return carts;
    };
};