// Extension del mongooe 
const mongoose = require("mongoose");
// Defincion de la coleecion de la base de datos
const TurnosSchema = new mongoose.Schema(
    {
        servicesId:{
            type: String,
            required: [true, "El servicio es obligatorio"],
        },
        userId:{
            type: String,
            required: [true, "El usuario es obligatorio"],
        },
        fecha:{
            type: Date,
            required: [true, "La fecha es obligatoria"],
        },
        hora:{
            type: String,
            required: [true, "La hora es obligatoris"],
            match: /^([01]\d|2[0-3]):([0-5]\d)$/, 
        },
        estado:{
            type: String,
            required: [true, "El estado es obligatorio"],
            enum: {
                values: ["disponible", "reservado","cancelado"],
                // Mensaje si el rol no es correcto
                message: "{VALUE} no es un rol válido",
              },
              default: "disponible",
        }
    },
    { timestamps: true }
)

// Exportacion del modulo de base de datos
module.exports = mongoose.model("Turnos", TurnosSchema);