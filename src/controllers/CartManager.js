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

    // Funciones públicas
    addCart = async () => {
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
        !respuesta ? console.log("Not found") : console.log(respuesta);
    };

    addProductToCart = async (cartId, productId) => {
        try {
            let cartById = this.getCartById(cartId);
            let productById = PRODUCT.getProductById(productId);
            if (cartById && !productById) {
                let carts = await this.#readCarts();
                const index = carts.findIndex(cart => cart.id === cartId);
                carts[index].products.push({productId, cantidad: 1});
                await this.#escribirArchivo(carts);
                return console.log("Producto Agregado");
            } else if(cartById && productById){
                let carts = await this.#readCarts();
                const index = carts.findIndex(cart => cart.id === cartId);
                const indexProduct = carts[index].products.findIndex(product => product.productId === productId);
                carts[index].products[indexProduct].cantidad += 1;
                await this.#escribirArchivo(carts);
                return console.log("Producto Sumado");
            }
        } catch (error) {
            return console.log("Carrito o Producto inexistente");
        }
    }

    deleteCartById = async (id) => {
        let carts = await this.#readCarts();
        carts = carts.filter(cart => cart.id !== id);
        await this.#escribirArchivo(carts);
        console.log("Carrito Eliminado");
    };
    
    getCarts = async () => {
        const carts = await this.#readCarts();
        return carts;
    };
};