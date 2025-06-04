// Extension del mongooe 
const mongoose = require("mongoose");
// Defincion de la coleecion de la base de datos
const citaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim : true,
            minlength: [2, "El nombre debe tener al menos dos caracteres"],
            maxlength: [50,"El nombre no debe de rebasar los 50 caracteres"],
            },
            descripcion: {
            type: String,
            required: [true, "La descripcion es obligatoria"],
            trim : true,
            minlength: [2, "La descripcion debe tener al menos dos caracteres"],
            maxlength: [80,"La descripcion no debe de rebasar los 80 caracteres"],
            },
            categoria: {
            type: String,
            enum: [
            'Consulta General',
            'Pediatría',
            'Ginecología',
            'Cardiología',
            'Odontología',
            'Radiología',
            'Laboratorio',
            'Psicología',
            'Fisioterapia',
            'Neurología',
            'Certificados Médicos',
            'Terapia Respiratoria'
            ],
            required: true,
            },
            duracion: {
            type: Number, // en minutos
            required: true,
            }
            }, {
            timestamps: true,
            }
    }
)
module.exports = mongoose.model("Citas", citaSchema);