const express = require("express");
const app = express();
require("dotenv").config();
// importacion del paquete de cors
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(cors());
app.use("/api-2-auth", authRoutes);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log("Server running in http://localhost:"+PORT)
});
