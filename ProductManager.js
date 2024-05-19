/* Ejercicio */

import fs from 'fs';
import path from 'path';

export default class ProductManager {
    
    constructor() {
        this.products = [];
        this.path = path.join("productos.json");
    };

    #generarId = () => {
        let idMayor = 0;
        this.products.forEach(product => {
            if (product.id > idMayor) {
                idMayor = product.id;
            }
        });
        return idMayor + 1;
    };

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        const product = {
            id: this.#generarId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        if(!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios");
        } else {
            if(!this.#validateCode(code)) {
                this.products.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            } 
        }
    };

    #validateCode = (code) => {
        const validate = this.products.find(product => product.code === code);
        if(validate){
            console.log("El codigo ya existe")
        }
        return validate;
    };

    #identifyId = async (id) => {
        let respuesta = await this.#readProductos();
        let productId = respuesta.find(product => product.id === id);
        return productId;
    };

    getProductById = async (id) => {
        let respuesta = await this.#identifyId(id);
        !respuesta ? console.log("Not found") : console.log(respuesta);
    };

    #readProductos = async () => {
        let respuesta = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(respuesta);
    };

    deleteProductById = async (id) => {
        let respuesta = await this.#readProductos();
        let productDeleted = respuesta.filter(product => product.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(productDeleted, null, "\t"));
    };

    updateProduct = async ({id, ...product}) => {
        if(this.#identifyId()) {
            await this.deleteProductById(id)
            let productsOld = await this.#readProductos();
            let productUpdated = [{id, ...product}, ...productsOld];
            await fs.promises.writeFile(this.path, JSON.stringify(productUpdated, null, "\t"));
        }
    };

    getProducts = async () => {
        let respuesta = await this.#readProductos();
        console.log(respuesta);
    };
};