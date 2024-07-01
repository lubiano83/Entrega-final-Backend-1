import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ROUTER = Router();
const PRODUCT = new ProductManager();

// Product Manager

ROUTER.post("/", async (req, res) => {
    const { category, title, description, price, thumbnail, code, stock } = req.body;
    return res.status(201).send(await PRODUCT.addProduct(category, title, description, price, thumbnail, code, stock));
});

ROUTER.get("/", async (req, res) => {
    return res.status(200).send(await PRODUCT.getProducts());
});

ROUTER.get("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    return res.status(200).send(await PRODUCT.getProductById(ID));
});

ROUTER.delete("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    return res.status(200).send(await PRODUCT.deleteProductById(ID));
});

ROUTER.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { category, title, description, price, thumbnail, code, stock, available } = req.body;
    return res.status(200).send(await PRODUCT.updateProduct({ id, category, title, description, thumbnail, price, code, stock, available }));
});

ROUTER.put("/available/:id", async (req, res) => {
    const ID = Number(req.params.id);
    const RESULT = await PRODUCT.toggleAvailability(ID);
    if (RESULT.error) {
        return res.status(404).send(RESULT);
    }
    return res.status(200).send(RESULT);
});

export default ROUTER;