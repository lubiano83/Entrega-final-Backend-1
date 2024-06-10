import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
import uploader from "../utils/uploader.js";

const productRouter = Router();
const PRODUCT = new ProductManager();

// Product Manager
productRouter.post("/", uploader.single("file"), async (req, res) => {
    const { file } = req;

    if (!file) {
        res.status(400).send({ state: "error", message: "file is required" });
        return;
    }

    const filename = file.filename;
    const { category, title, description, price, code, stock } = req.body;

    try {
        await PRODUCT.addProduct({ category, title, description, price, thumbnail: filename, code, stock });
        res.redirect("http://localhost:8080/");
    } catch (error) {
        res.status(500).send({ state: "error", message: error.message });
    }
});

productRouter.get("/", async (req, res) => {
    const allProducts = await PRODUCT.getProducts();
    try {
        await PRODUCT.getProducts();
        return res.status(200).render("home", {
            title: "Products",
            products: allProducts,
        });
    } catch (error) {
        console.log(error.message);
    }
});

productRouter.get("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    return res.status(200).send(await PRODUCT.getProductById(ID));
});

productRouter.delete("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    return res.status(200).send(await PRODUCT.deleteProductById(ID));
});

productRouter.put("/:id", async (req, res) => {
    const ID = Number(req.params.id);
    const { category, title, description, price, thumbnail, code, stock, available } = req.body;
    return res.status(200).send(await PRODUCT.updateProduct({ ID, category, title, description, price, thumbnail, code, stock, available }));
});

productRouter.put("/available/:id", async (req, res) => {
    const ID = Number(req.params.id);
    const RESULT = await PRODUCT.toggleAvailability(ID);
    if (RESULT.error) {
        return res.status(404).send(RESULT);
    }
    return res.status(200).send(RESULT);
});

export default productRouter;