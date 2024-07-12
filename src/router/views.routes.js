import { Router } from "express";
import ProductModel from "../models/product.model.js";
// import uploader from "../utils/uploader.js";

const ROUTER = Router();

ROUTER.get("/explain", async (req, res) => {
    try {
        const result = await ProductModel.find({ $and: [{ category: "BATERIA" }, { title: "55457" }] }).explain();
        console.log(result.executionStats);
        res.status(200).json({ status: true, payload: result.executionStats });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/realtimeproducts", async (req, res) => {
    try {
        return res.status(200).render("realTimeProducts", { title: "realTimeProducts" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
});

ROUTER.get("/", async (req, res) => {
    try {
        return res.status(200).render("home", { title: "Home" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el servidor" });
    }
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
//         const newProduct = await PRODUCT.addProduct(category, title, description, price, filename, code, stock);
//         res.status(200).send(newProduct);
//     } catch (error) {
//         res.status(500).send({ state: "error", message: error.message });
//     }
// });

export default ROUTER;