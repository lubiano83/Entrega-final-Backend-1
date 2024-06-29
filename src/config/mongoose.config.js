import { connect } from "mongoose";

const connectDB = () => {
    const URI = "mongodb+srv://lubiano83:OdGteJUhwyj5SJ4H@lubiano83.egrhqkm.mongodb.net/?retryWrites=true&w=majority&appName=lubiano83";

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "backend-1",
    };
    connect(URI, options)
        .then(() => { console.log("Conectado a la base de datos") })
        .catch((error) => { console.log("Error al conectar a la base de datos", error) });
};

export default { connectDB };