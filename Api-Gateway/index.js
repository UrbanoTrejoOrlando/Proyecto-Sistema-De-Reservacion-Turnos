require("dotenv").config();
const Server = require("./server/server");

// Extraccion del puerto desde el archivo .env
const PORT = process.env.PORT;

//Variable para la creacuib del servidor
const server = new Server(PORT);
//Iniciar el servidor
server.start();
