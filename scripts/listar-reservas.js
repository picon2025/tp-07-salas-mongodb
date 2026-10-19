const Reserva = require("../src/modelos/reserva");

const {
  conectarBaseDatos,
  cerrarBaseDatos,
} = require("../src/config/base-datos");

// Busca y muestra las reservas guardadas
async function listarReservas() {
  let codigoSalida = 0;

  try {
    await conectarBaseDatos();

    const reservas = await Reserva.find();

    console.log("Reservas guardadas:");

    for (const reserva of reservas) {
      console.log("------------------------------");
      console.log("ID:", reserva._id.toString());
      console.log("Estudiante:", reserva.estudiante);
      console.log("Email:", reserva.email);
      console.log("Sala:", reserva.sala);
      console.log("Fecha:", reserva.fecha);
      console.log("Turno:", reserva.turno);
      console.log("Personas:", reserva.personas);
    }

    console.log("------------------------------");
    console.log("Cantidad de reservas:", reservas.length);
  } catch (error) {
    console.error("No se pudieron listar las reservas");
    console.error("Tipo de error:", error.name);
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

listarReservas();
