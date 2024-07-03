import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const ROUTER = Router();
const CART = new CartManager();

ROUTER.post("/", async (req, res) => {
    try {
        res.status(201).send(await CART.addCart());
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" })
    }
});

ROUTER.get("/", async (req, res) => {
    try {
        res.status(200).send(await CART.getCarts());
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" })
    }
});

ROUTER.get("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        res.status(200).send(await CART.getCartById(ID));
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" })
    }
});

ROUTER.delete("/:id", async (req, res) => {
    try {
        const ID = req.params.id;
        return res.status(200).send(await CART.deleteCartById(ID));
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" })
    }
});

ROUTER.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        res.status(200).send(await CART.addProductToCart(cartId, productId));
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" })
    }
});

export default ROUTER;