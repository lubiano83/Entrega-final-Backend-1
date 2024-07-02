import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

export default class ProductManager {
    #productModel;

    // Constructor
    constructor() {
        this.#productModel = ProductModel;
    }

    // Funciones públicas
    addProduct = async ({ category, title, description, price, thumbnail = [], code, stock, available }) => {

        if (!category || !title || !description || !price || !code || !stock) {
            console.log("Todos los campos son obligatorios");
        }
        try {
            const product = new this.#productModel ({
                category,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                available: available !== undefined ? available : true,
            });
            await product.save();
            return "Producto agregado correctamente";
        } catch (error) {
            console.log(error.message);
        }
    };

    getProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const product = await this.#productModel.findById(id);
            return product;
        } catch (error) {
            console.log(error.message);
        }
    };

    deleteProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            await this.#productModel.findByIdAndDelete(id);
            return "Producto Eliminado";
        } catch (error) {
            console.log(error,message);
        }
    };

    updateProduct = async ( id, updateData ) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const updatedProduct = await this.#productModel.findByIdAndUpdate(id, updateData, { new: true });
            if (updatedProduct) {
                return "Producto Modificado";
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    toggleAvailability = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        try {
            const product = await this.#productModel.findById(id);
            if (product) {
                product.available = !product.available;
                await product.save();
                return product;
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    getProducts = async () => {
        try {
            const products = await this.#productModel.find().lean();
            return products;
        } catch (error) {
            console.log(error.message);
        }
    };
}