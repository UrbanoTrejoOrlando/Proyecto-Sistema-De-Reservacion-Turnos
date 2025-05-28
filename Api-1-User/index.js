const express = require("express");
const cors = require("cors");
const {ConnectDB} = require("./data/config");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

// Definicion del puerto 
const PORT = process.env.PORT

// Creacion de la instancia del servidor
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-1-user',userRouter);
//Agregar la conexion a la base de datos
ConnectDB();

// Ejecucion del servidor
app.listen(PORT, ()=>{
    console.log("Server running in http://localhost:"+PORT)
});