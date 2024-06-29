import { Schema, model } from "mongoose";

const productSchema = new Schema({
    id: { type: String, required: true },
    category: { type: String, required: true, uppercase: true, trim: true },
    title: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, required: true, uppercase: true },
    price: { type: Number, required: true, min: 50},
    thumbnail: { type: String },
    code: { type: String, required: true, uppercase: true, unique: true },
    stock: { type: Number, required: true, min: 1, max: 100 },
    available: { type: Boolean, required: true, default: true },
});

const ProductModel = model("products", productSchema);
export default ProductModel;