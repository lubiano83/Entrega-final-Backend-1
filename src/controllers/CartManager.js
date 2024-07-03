import CartModel from "../models/cart.model.js";
import ProductManager from "./ProductManager.js";
import mongoDB from "../config/mongoose.config.js";

const PRODUCT = new ProductManager();

export default class CartManager {
    #cartModel;

    // Constructor
    constructor() {
        this.#cartModel = CartModel;
    }

    // Funciones privadas
    #readCarts = async () => {
        try {
            const carts = await this.#cartModel.find().lean();
            return carts;
        } catch (error) {
            console.log(error.message);
        }
    };

    #escribirArchivo = async (datos) => {
        try {
            return await datos.save();
        } catch (error) {
            console.log(error.message);
        }    
    };

    #identifyId = async (id) => {
        const cartId = await this.#cartModel.findById(id);
        return cartId;
    };

    // Funciones públicas
    addCart = async () => {
        try {
            const cart = new this.#cartModel({ products: [] });
            await this.#escribirArchivo(cart)
            return "Carrito Agregado";
        } catch (error) {
            console.log(error.message);
        }
    };

    getCartById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        const respuesta = await this.#identifyId(id);
        if(!respuesta){
            return "Not found";
        } else {
            return respuesta;
        }
    };

    addProductToCart = async (cartId, productId) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }
        try {
            const cart = await this.#identifyId(cartId);
            const product = await PRODUCT.getProductById(productId);

            if (!cart) {
                return "Carrito no encontrado";
            }
            if (!product) {
                return "Producto no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.productId === productId);
            console.log(productIndex);
            if (productIndex === -1) {
                cart.products.push({ productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }
            await this.#escribirArchivo(cart)
            return "Producto Agregado o Cantidad Incrementada";
        } catch (error) {
            console.log(error.message);
            return "Error al agregar el producto al carrito";
        }
    };

    deleteCartById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        try {
            let carts = await this.#cartModel.findByIdAndDelete(id);
            await this.#escribirArchivo(carts);
            return "Carrito Eliminado";
        } catch (error) {
            console.log(error.message);
        }
    };

    getCarts = async () => {
        try {
            return await this.#readCarts();
        } catch (error) {
            console.log(error.message);
        }
    };
}