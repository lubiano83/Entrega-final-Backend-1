import CartModel from "../models/cart.model.js";
import ProductManager from "./ProductManager.js";
import mongoDB from "../config/mongoose.config.js";

const PRODUCT = new ProductManager();

export default class CartManager {
    #itemModel;

    // Constructor
    constructor() {
        this.#itemModel = CartModel;
    }

    // Funciones privadas
    #readItems = async () => {
        try {
            const items = await this.#itemModel.find().lean();
            return items;
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
        const itemId = await this.#itemModel.findById(id);
        return itemId;
    };

    // Funciones públicas
    addCart = async () => {
        try {
            const cart = new this.#itemModel({ products: [] });
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
            const productInCart = cart.products.find(product => product.id === productId);
            console.log(productInCart); // undefined
            if(productInCart){
                productInCart.quantity++;
                await this.#escribirArchivo(cart)
                return "Cantidad Incrementada";
            } else {
                cart.products.push({ productId, quantity: 1 });
                await this.#escribirArchivo(cart)
                return "Producto Agregado";
            }
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
            let carts = await this.#itemModel.findByIdAndDelete(id);
            return "Carrito Eliminado";
        } catch (error) {
            console.log(error.message);
        }
    };

    getCarts = async () => {
        try {
            return await this.#readItems();
        } catch (error) {
            console.log(error.message);
        }
    };
}