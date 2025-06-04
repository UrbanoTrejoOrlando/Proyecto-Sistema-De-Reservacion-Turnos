// Extension del mongooe 
const mongoose = require("mongoose");
// Defincion de la coleecion de la base de datos
const citaSchema = new mongoose.Schema(
    {

    }
)
module.exports = mongoose.model("Citas", citaSchema);