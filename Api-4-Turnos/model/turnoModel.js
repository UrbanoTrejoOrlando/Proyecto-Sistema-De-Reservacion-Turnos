const mongoose = require("mongoose");
const moment = require("moment");

const TurnoSchema = new mongoose.Schema(
  {
    servicio: {
      type: String,
      required: true,
    },
    usuario: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return moment(value).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD");
        },
        message: "La fecha debe ser hoy o en el futuro",
      },
    },
    hora: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)"],
      validate: {
        validator: function (value) {
          const [hours, minutes] = value.split(":").map(Number);
          return (hours >= 8 && hours < 20) || (hours === 20 && minutes === 0);
        },
        message: "Horario laboral: 8:00 a 20:00",
      },
    },
    estado: {
      type: String,
      enum: ["disponible", "reservado", "cancelado", "completado"],
      default: "disponible",
    },
    notas: {
      type: String,
      trim: true,
      maxlength: [500, "Las notas no deben exceder 500 caracteres"],
    },
    metadata: {
      creadoPor: {
        type: String,
        required: true,
      },
      canceladoPor: {
        type: String,
      },
      ultimaModificacion: Date,
      tokenUsed: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índice compuesto para evitar duplicados
TurnoSchema.index({ servicio: 1, fecha: 1, hora: 1 }, { unique: true });

// Middleware para actualizar metadata
TurnoSchema.pre("save", function (next) {
  this.metadata.ultimaModificacion = new Date();
  next();
});

module.exports = mongoose.model("Turno", TurnoSchema);