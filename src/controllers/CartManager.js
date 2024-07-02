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

    // Funciones públicas
    addCart = async () => {
        try {
            const cart = new this.#cartModel({ products: [] });
            await cart.save();
            return "Carrito Agregado";
        } catch (error) {
            console.log("Error al agregar Carrito:", error.message);
        }
    };

    getCartById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        try {
            const cart = await this.#cartModel.findById(id).populate("products.productId");
            if (!cart) {
                return "Not found";
            } else {
                return cart;
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    addProductToCart = async (cartId, productId) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }
        try {
            const cart = await this.#cartModel.findById(cartId);
            const product = await PRODUCT.getProductById(productId);

            if (!cart) {
                return "Carrito no encontrado";
            }
            if (!product) {
                return "Producto no encontrado";
            }

            const productIndex = cart.products.findIndex((p) => p.productId === productId);
            if (productIndex === -1) {
                cart.products.push({ productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }
            await cart.save();
            return "Producto Agregado o Cantidad Incrementada";
        } catch (error) {
            console.log("Error al agregar producto al carrito:", error.message);
        }
    };

    deleteCartById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        try {
            await this.#cartModel.findByIdAndDelete(id);
            return "Carrito Eliminado";
        } catch (error) {
            console.log(error.message);
        }
    };

    getCarts = async () => {
        try {
            const carts = await this.#cartModel.find().lean();
            return carts;
        } catch (error) {
            console.log(error.message);
        }
    };
}