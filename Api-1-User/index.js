// importacion del paquete de express
const express = require("express");
const cors = require("cors");
const {ConnectDB} = require("./data/config");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const PORT = process.env.PORT

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-1-user',userRouter);
ConnectDB();

app.listen(PORT, ()=>{
    console.log("Server running in http://localhost:"+PORT)
});