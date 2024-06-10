/* Servidor */
import { Server } from "socket.io";

const MESSAGES = [];

const CONFIG = (serverHTTP) => {
    const serverSocket = new Server(serverHTTP);
    serverSocket.on("connection", (socket) => {
        console.log("Cliente Conectado");
        socket.on("message", (data) => {
            const { user, message } = data;
            MESSAGES.push({ user, message });
            serverSocket.emit("message-logs", { MESSAGES });
        });
        socket.on("authenticated", (data) => {
            socket.broadcast.emit("new-user", data);
        });
    });
}; export default { CONFIG };