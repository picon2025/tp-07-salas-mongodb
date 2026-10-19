const mongoose = require("mongoose");

// Define la estructura y las reglas de cada reserva
const esquemaReserva = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (valor) {
          return valor.length > 0;
        },
        message: "El estudiante es obligatorio.",
      },
    },

    email: {
      type: String,
      required: true,
      trim: true,
      match: /@/,
    },

    sala: {
      type: String,
      required: true,
      enum: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
    },

    fecha: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (valor) {
          return valor.length > 0;
        },
        message: "La fecha es obligatoria.",
      },
    },

    turno: {
      type: String,
      required: true,
      enum: ["Mañana", "Tarde", "Noche"],
    },

    personas: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      validate: {
        validator: Number.isInteger,
        message: "La cantidad de personas debe ser un número ",
      },
    },
  },
  {
    versionKey: false,
  },
);

// Usa explícitamente la colección reservas
const Reserva = mongoose.model("Reserva", esquemaReserva, "reservas");

module.exports = Reserva;
