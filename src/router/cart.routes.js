import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const cartRouter = Router();
const CART = new CartManager();

// Cart Manager
cartRouter.post('/', async (req, res) => {
    res.status(201).send(await CART.addCart());
});

cartRouter.get('/', async (req, res) => {
    res.status(200).send(await CART.getCarts());
});

cartRouter.get('/:id', async (req, res) => {
    let id = Number(req.params.id);
    res.status(200).send(await CART.getCartById(id));
});

cartRouter.delete('/:id', async (req, res) => {
    let id = Number(req.params.id);
    return res.status(200).send(await CART.deleteCartById(id));
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    let cartId = Number(req.params.cid);
    let productId = Number(req.params.pid);
    res.status(200).send(await CART.addProductToCart(cartId, productId));
});

export default cartRouter;