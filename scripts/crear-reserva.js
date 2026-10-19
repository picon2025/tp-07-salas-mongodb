const Reserva = require("../src/modelos/reserva");

const {
  conectarBaseDatos,
  cerrarBaseDatos,
} = require("../src/config/base-datos");

// Crea una reserva de prueba en MongoDB
async function crearReserva() {
  let codigoSalida = 0;

  try {
    await conectarBaseDatos();

    const reserva = new Reserva({
      estudiante: "alum",
      email: "alumno2026@gmail.com",
      sala: "Sala Norte",
      fecha: "2026-11-10",
      turno: "Mañana",
      personas: 5,
    });

    // Espera a que MongoDB confirme el guardado
    await reserva.save();

    console.log("Reserva guardada correctamente");
    console.log("ID de la reserva:", reserva._id.toString());
  } catch (error) {
    console.error("No se pudo guardar la reserva");

    if (error.name === "ValidationError") {
      for (const campo in error.errors) {
        console.error(campo + ":", error.errors[campo].message);
      }
    } else {
      console.error("Tipo de error:", error.name);

      if (error.code) {
        console.error("Codigo:", error.code);
      }
    }

    codigoSalida = 1;
  } finally {
    try {
      await cerrarBaseDatos();
    } catch {
      console.error("No se pudo cerrar la conexion correctamente");
      codigoSalida = 1;
    }
  }

  process.exitCode = codigoSalida;
}

crearReserva();
