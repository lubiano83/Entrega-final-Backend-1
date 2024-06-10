import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const cartRouter = Router();
const CART = new CartManager();

// Cart Manager
cartRouter.post("/", async (req, res) => {
    res.status(201).send(await CART.addCart());
});

cartRouter.get("/", async (req, res) => {
    res.status(200).send(await CART.getCarts());
});

cartRouter.get("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    res.status(200).send(await CART.getCartById(ID));
});

cartRouter.delete("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    return res.status(200).send(await CART.deleteCartById(ID));
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    res.status(200).send(await CART.addProductToCart(cartId, productId));
});

export default cartRouter;