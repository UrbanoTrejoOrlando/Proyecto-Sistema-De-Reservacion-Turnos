// Extensión de Mongoose
const mongoose = require("mongoose");

// Definición del esquema para la colección de citas/servicios
const serviceSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos dos caracteres"],
      maxlength: [50, "El nombre no debe rebasar los 50 caracteres"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      minlength: [2, "La descripción debe tener al menos dos caracteres"],
      maxlength: [80, "La descripción no debe rebasar los 80 caracteres"],
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: {
        values: [
          "Consulta General",
          "Pediatría",
          "Medicina preventiva",
          "Laboratorio clínico",
          "Odontología",
          "Nutrición",
        ],
        message: "{VALUE} no es una categoría válida",
      },
    },
    duracion: {
      type: Number, // en minutos
      required: [true, "La duración es obligatoria"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Servicio", serviceSchema);
