import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [
        {
            id: { type: Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, required: true },
        }
    ],
});

const CartModel = model("carts", cartSchema);
export default CartModel;