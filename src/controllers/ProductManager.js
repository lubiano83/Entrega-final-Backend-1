import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";

export default class ProductManager {
    #productModel;

    // Constructor
    constructor() {
        this.#productModel = ProductModel;
    }

    // Funciones privadas
    #validateCode = async (code) => {
        const existingProduct = await this.#productModel.findOne({ code });
        if (existingProduct) {
            console.log("El codigo ya existe");
        }
        return !existingProduct;
    };

    // Funciones públicas
    addProduct = async (productData) => {
        const { category, title, description, price, thumbnail = [], code, stock, available } = productData;

        // Validar campos requeridos
        if (!category || !title || !description || !price || !code || !stock) {
            throw new Error("Todos los campos son obligatorios");
        }

        try {
            const product = new this.#productModel({
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
            return "Producto Agregado";
        } catch (error) {
            throw error;
        }
    };
    
    getProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        const product = await this.#productModel.findById(id);
        return product;
    };

    deleteProductById = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        await this.#productModel.findByIdAndDelete(id);
        return "Producto Eliminado";
    };

    updateProduct = async (id, updateData) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        const updatedProduct = await this.#productModel.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedProduct) {
            return "Producto Modificado";
        } else {
            return "Producto no encontrado";
        }
    };

    toggleAvailability = async (id) => {
        if (!mongoDB.isValidId(id)) {
            return null;
        }
        const product = await this.#productModel.findById(id);
        if (product) {
            product.available = !product.available;
            await product.save();
            return product;
        } else {
            return "Producto no encontrado";
        }
    };

    getProducts = async () => {
        const products = await this.#productModel.find().lean();
        return products;
    };
}