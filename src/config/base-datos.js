const dns = require("node:dns");
const mongoose = require("mongoose");
const cargarConfiguracion = require("./entorno");

// Configura los servidores DNS antes de conectar con MongoDB
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Comprueba la URI y conecta con MongoDB
async function conectarBaseDatos() {
  const { MONGODB_URI } = cargarConfiguracion();

  if (!MONGODB_URI || !/^mongodb(\+srv)?:\/\//.test(MONGODB_URI)) {
    throw new Error(
      "Configuracion invalida: falta MONGODB_URI o su prefijo es incorrecto.",
    );
  }

  try {
    await mongoose.connect(MONGODB_URI);
    return mongoose.connection;
  } catch (error) {
    console.error("Error al conectar con MongoDB.");
    console.error("Tipo de error:", error.name);

    if (error.code) {
      console.error("Codigo:", error.code);
    }

    if (error.syscall) {
      console.error("Operacion:", error.syscall);
    }

    throw error;
  }
}

// Cierra la conexión con MongoDB
async function cerrarBaseDatos() {
  await mongoose.disconnect();
}

module.exports = {
  conectarBaseDatos,
  cerrarBaseDatos,
};
