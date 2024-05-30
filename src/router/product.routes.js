import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
// import uploader from "../utils/uploader.js";

const productRouter  = Router();
const PRODUCT = new ProductManager();

// Product Manager
productRouter.post('/', async (req, res) => {
    const {category, title, description, price, thumbnail, code, stock} = req.body;
    return res.status(201).send(await PRODUCT.addProduct(category, title, description, price, thumbnail, code, stock));
});


productRouter.get('/', async (req, res) => {
    return res.status(200).send(await PRODUCT.getProducts());
});

productRouter.get('/:id', async (req, res) => {
    let id = Number(req.params.id);
    return res.status(200).send(await PRODUCT.getProductById(id));
});

productRouter.delete('/:id', async (req, res) => {
    let id = Number(req.params.id);
    return res.status(200).send(await PRODUCT.deleteProductById(id));
});

productRouter.put('/:id', async (req, res) => {
    let id = Number(req.params.id);
    const {category, title, description, price, thumbnail, code, stock, available} = req.body;
    return res.status(200).send(await PRODUCT.updateProduct({id, category, title, description, price, thumbnail, code, stock, available}));
});

productRouter.put('/available/:id', async (req, res) => {
    let id = Number(req.params.id);
    const result = await PRODUCT.toggleAvailability(id);
    if (result.error) {
        return res.status(404).send(result);
    }
    return res.status(200).send(result);
});

export default productRouter;
