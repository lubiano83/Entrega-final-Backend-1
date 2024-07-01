import ProductManager from "./ProductManager.js";
import CartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";

const PRODUCT = new ProductManager();

export default class CartManager {
    // Constructor
    constructor() {
        this.cartModel = CartModel;
    }

    // Funciones privadas
    #generateId = async () => {
        const cartCount = await this.cartModel.countDocuments();
        return cartCount + 1;
    };

    // Funciones públicas
    addCart = async () => {
        const cart = new this.cartModel({ products: [] });
        await cart.save();
        return "Carrito Agregado";
    };

    getCartById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        const cart = await this.cartModel.findById(id).populate("products.productId");
        if (!cart) {
            return "Not found";
        } else {
            return cart;
        }
    };

    addProductToCart = async (cartId, productId) => {
        if (!mongoDB.isValidId(cartId) || !mongoDB.isValidId(productId)) {
            return "ID no válido";
        }

        const cart = await this.cartModel.findById(cartId);
        const product = await PRODUCT.getProductById(productId);

        if (!cart) {
            return "Carrito no encontrado";
        }
        if (!product) {
            return "Producto no encontrado";
        }

        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
        if (productIndex === -1) {
            cart.products.push({ productId, cantidad: 1 });
        } else {
            cart.products[productIndex].cantidad += 1;
        }
        await cart.save();
        return "Producto Agregado o Cantidad Incrementada";
    };

    deleteCartById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return "ID no válido";
        }
        await this.cartModel.findByIdAndDelete(id);
        return "Carrito Eliminado";
    };

    getCarts = async () => {
        const carts = await this.cartModel.find().populate("products.productId").lean();
        return carts;
    };
}