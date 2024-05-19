import ProductManager from "./ProductManager.js";

const productoAgregado = new ProductManager();

const demo = async () => {
    await productoAgregado.addProduct("title1", "description1", 1000, "image1", "abc123", 5);
    await productoAgregado.addProduct("title2", "description2", 2000, "image2", "abc234", 10);
    await productoAgregado.addProduct("title3", "description3", 3000, "image3", "abc234", 15);
    await productoAgregado.addProduct("title3", "description3", 3000, "", "bcd234", 15);
    
    // await productoAgregado.getProductById(1);
    await productoAgregado.deleteProductById(2);

    await productoAgregado.updateProduct({
        id: 1,
        title: "Bateria",
        description: "MF55457",
        price: 59990,
        thumbnail: "imagenHankook",
        code: "09180",
        stock: 20
    });
    
    await productoAgregado.getProducts();
}; demo();
