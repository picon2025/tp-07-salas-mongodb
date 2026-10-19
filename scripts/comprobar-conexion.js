const {
  conectarBaseDatos,
  cerrarBaseDatos,
} = require("../src/config/base-datos");

// Comprueba la conexión con MongoDB Atlas
async function comprobarConexion() {
  let codigoSalida = 0;

  try {
    await conectarBaseDatos();

    console.log("Conexion con MongoDB Atlas exitosa");
  } catch {
    console.error("No se pudo comprobar la conexion con MongoDB Atlas");
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

comprobarConexion();
