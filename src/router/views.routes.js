import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
// import uploader from "../utils/uploader.js";

const ROUTER = Router();
const PRODUCT = new ProductManager();

ROUTER.get("/", async (req, res) => {
    try {
        const allProducts = await PRODUCT.getProducts();
        return res.status(200).render("home", {
            title: "Products",
            products: allProducts,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

ROUTER.get("/realtimeproducts", async (req, res) => {
    return res.status(200).render("realTimeProducts", { title: "realTimeProducts" });
});

// ROUTER.post("/realtimeproducts", uploader.single("file"), async (req, res) => {
//     const { file } = req;

//     if (!file) {
//         res.status(400).send({ state: "error", message: "file is required" });
//         return;
//     }

//     const filename = file.filename;
//     const { category, title, description, price, code, stock } = req.body;

//     try {
//         res.status(200).send(await PRODUCT.addProduct( category, title, description, price, filename, code, stock ));
//     } catch (error) {
//         res.status(500).send({ state: "error", message: error.message });
//     }
// });

export default ROUTER;