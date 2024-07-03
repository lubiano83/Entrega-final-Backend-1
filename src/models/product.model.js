import { Schema, model } from "mongoose";

const productSchema = new Schema({
    category: { type: String, required: true, uppercase: true, trim: true },
    title: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, lowercase: true, required: true, trim: true },
    price: { type: Number, required: true },
    thumbnail: { type: Array, required: true },
    code: { type: String, required: true, lowercase: true, unique: true, trim: true },
    stock: { type: Number, required: true },
    available: { type: Boolean, default: true },
});

productSchema.set("toJSON", {
    transform: function(doc, ret){
        delete ret.__v;
        return ret;
    }
});

const ProductModel = model("products", productSchema);
export default ProductModel;