# Trabajo Práctico 07 - Reservas de salas con MongoDB

## Descripción del proyecto

Este proyecto parte de la aplicación de reservas de salas desarrollada en los trabajos prácticos anteriores con Node.js, Express, EJS y middleware.

En el TP07 se incorpora MongoDB Atlas para guardar reservas de forma persistente. Se utiliza Mongoose para definir el modelo y validar los datos antes de guardarlos.

La aplicación web conserva su funcionamiento anterior. Las reservas que se muestran y administran desde Express siguen almacenándose en memoria. La persistencia en MongoDB se comprueba y administra mediante scripts independientes.

El proyecto utiliza CommonJS.

## Tecnologías utilizadas

- Node.js
- Express
- EJS
- express-ejs-layouts
- Morgan
- MongoDB Atlas
- Mongoose
- Prettier
- ESLint

## Instalación

Instalar las dependencias del proyecto:

```bash
npm install
```

## Configuración del entorno

La configuración del servidor se encuentra en `src/config/entorno.js`.

Las variables utilizadas son:

- `PORT`: puerto del servidor. Valor predeterminado: `3000`.
- `NODE_ENV`: entorno de ejecución. Valor predeterminado: `development`.
- `MONGODB_URI`: dirección de conexión a MongoDB Atlas. Solo es necesaria para ejecutar los scripts de persistencia.

### Preparación de MongoDB Atlas

1. Crear un clúster de MongoDB Atlas.
2. Configurar el acceso de red y crear un usuario de base de datos.
3. Obtener la cadena de conexión del clúster.
4. Crear el archivo local `.env` en la raíz del proyecto.
5. Colocar la URI de conexión en la variable `MONGODB_URI` y especificar la base de datos `reservas_salas_u7`.

Ejemplo del archivo `.env.example`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u7?retryWrites=true&w=majority
```

Los valores anteriores son ejemplos y deben reemplazarse por los correspondientes al clúster al configurar el archivo local `.env`.

El archivo `.env` contiene las credenciales reales y no debe publicarse en el repositorio. El archivo `.gitignore` excluye `.env`, los archivos de entorno adicionales y `node_modules/`, y permite incluir `.env.example`.

## Ejecución de la aplicación web

Iniciar el servidor:

```bash
npm start
```

La dirección predeterminada es:

`http://localhost:3000`

La aplicación web puede iniciarse sin conectar con MongoDB. Las reservas de la página continúan funcionando en memoria.

## Persistencia con MongoDB

Los scripts se ejecutan por separado de la aplicación web.

### 1. Comprobar la conexión

```bash
node --env-file=.env scripts/comprobar-conexion.js
```

Este script intenta conectarse a MongoDB Atlas, informa si la conexión fue exitosa y cierra la conexión al terminar. No crea reservas.

### 2. Crear una reserva

```bash
node --env-file=.env scripts/crear-reserva.js
```

El script crea una reserva de prueba utilizando el modelo `Reserva`. Espera la confirmación del guardado antes de mostrar el identificador generado por MongoDB.

Cada ejecución correcta puede agregar un nuevo documento.

### 3. Listar las reservas

```bash
node --env-file=.env scripts/listar-reservas.js
```

El script consulta los documentos almacenados, muestra el identificador y los campos de cada reserva, y presenta la cantidad total encontrada. No crea ni elimina documentos.

## Modelo de reserva

El modelo se encuentra en `src/modelos/reserva.js`.

La colección utilizada explícitamente es `reservas`.

Cada documento contiene los siguientes campos:

| Campo | Tipo | Validación |
|---|---|---|
| `_id` | ObjectId | Generado por MongoDB |
| `estudiante` | String | Obligatorio, sin espacios al inicio o al final y no vacío |
| `email` | String | Obligatorio, sin espacios al inicio o al final y debe contener `@` |
| `sala` | String | `Sala Norte`, `Sala Sur` o `Sala Multimedia` |
| `fecha` | String | Obligatorio y no vacío |
| `turno` | String | `Mañana`, `Tarde` o `Noche` |
| `personas` | Number | Número entero entre 1 y 6 |

Mongoose valida los documentos antes de guardarlos. Si los datos no cumplen las reglas del esquema, el guardado puede fallar con un error de validación.

El identificador `_id` es generado por MongoDB; no se utiliza un contador secuencial para los documentos persistidos.

## Organización de los archivos

```text
src/
  index.js
  app.js
  config/
    entorno.js
    base-datos.js
  modelos/
    reserva.js
  rutas/
    reservas.js
  controladores/
    reservas.js
  servicios/
    reservas.js
  middleware/
    solicitudes.js
    reservas.js

scripts/
  comprobar-conexion.js
  crear-reserva.js
  listar-reservas.js

.env.example
.gitignore
eslint.config.js
package.json
package-lock.json
README.md
```

### Responsabilidades principales

- `src/index.js`: crea los datos iniciales en memoria, configura el servicio y el controlador e inicia Express.
- `src/app.js`: configura Express, EJS, layouts, archivos estáticos, middleware y rutas.
- `src/config/entorno.js`: lee y valida las variables de entorno del servidor.
- `src/config/base-datos.js`: configura los servidores DNS, valida la URI y administra la conexión con MongoDB.
- `src/modelos/reserva.js`: define la estructura y las validaciones de las reservas persistidas.
- `src/servicios/reservas.js`: administra las reservas de la aplicación web en memoria.
- `src/controladores/reservas.js`: procesa las solicitudes y prepara las respuestas.
- `src/rutas/reservas.js`: declara las rutas relacionadas con las reservas.
- `src/middleware/solicitudes.js`: identifica las solicitudes y mide su duración.
- `src/middleware/reservas.js`: prepara los datos de las vistas y valida los formularios web.
- `scripts/comprobar-conexion.js`: comprueba la conexión con MongoDB.
- `scripts/crear-reserva.js`: crea un documento persistente.
- `scripts/listar-reservas.js`: consulta y muestra los documentos persistidos.

## Diferencia entre las reservas web y MongoDB

En este trabajo, la aplicación web y los scripts de persistencia utilizan mecanismos separados.

Las reservas que se crean desde el formulario web se administran en memoria. Las reservas que se crean mediante `scripts/crear-reserva.js` se guardan en MongoDB Atlas.

Por lo tanto, una reserva creada desde la página web no aparece automáticamente en la colección de MongoDB, y una reserva guardada mediante el script no aparece automáticamente en el listado web.

Los datos de la aplicación web pueden perderse al reiniciar el servidor, excepto por las reservas iniciales que se vuelven a cargar desde `src/index.js`. Los documentos guardados en MongoDB permanecen almacenados hasta que se eliminan.

## Formato y análisis estático

Aplicar el formato al código:

```bash
npm run format
```

Comprobar el formato:

```bash
npm run format:check
```

Ejecutar ESLint:

```bash
npm run lint
```

Ejecutar ambas comprobaciones:

```bash
npm run check
```

## Pruebas realizadas

Los siguientes resultados corresponden a las pruebas ejecutadas durante el desarrollo.

| Prueba | Resultado |
|---|---|
| Instalación de dependencias | Finalizó correctamente |
| `npm.cmd run format` | Ejecutado correctamente |
| `npm.cmd run check` | Prettier y ESLint finalizaron sin errores |
| Inicio del servidor | Correcto en el puerto 3000 |
| `GET /` | La página principal cargó correctamente |
| `GET /estado` | El servicio respondió como activo |
| `GET /reservas` | Se mostraron las reservas almacenadas en memoria |
| `GET /reservas/nueva` | El formulario se mostró correctamente |
| `POST /reservas` válido | La aplicación redirigió al listado |
| Creación desde la web | El listado pasó de 4 a 5 reservas en memoria |
| Campos obligatorios vacíos | El navegador impidió enviar el formulario |
| Conexión con MongoDB Atlas | Conexión exitosa |
| Creación persistente | Se guardaron documentos y se obtuvieron sus identificadores |
| Consulta desde otro proceso Node.js | Se recuperaron los documentos guardados |
| Persistencia entre procesos | Los documentos continuaron disponibles después de finalizar el proceso |
| Validación de estudiante vacío | Rechazado por Mongoose |
| Validación de email sin `@` | Probada mediante el script de creación |
| Validación de sala no permitida | Probada mediante el script de creación |
| Validación de turno no permitido | Probada mediante el script de creación |
| Validación de fecha vacía | Rechazada por Mongoose |
| Validación de personas igual a `0` | Rechazada por Mongoose |
| Validación de personas igual a `7` | Probada mediante el script de creación |
| Validación de personas igual a `2.5` | Probada mediante el script de creación |
| Validación de personas con texto | Probada mediante el script de creación |
| Separación entre web y MongoDB | Las reservas web permanecieron en memoria y no se agregaron a MongoDB |

Las pruebas de persistencia se realizaron mediante scripts independientes. Las reservas creadas desde el formulario web no se guardan automáticamente en MongoDB.

## Pruebas pendientes

Antes de la entrega, queda por completar o documentar:

- Enviar una reserva inválida directamente al servidor y comprobar que responde con HTTP 400.
- Comprobar el comportamiento con una colección vacía, sin eliminar los documentos de prueba existentes.
- Comprobar que la aplicación web inicia y funciona sin `MONGODB_URI`.
- Guardar una captura de MongoDB Atlas que muestre la base `reservas_salas_u7`, la colección `reservas` y los documentos persistidos.
- Revisar que los archivos que se publicarán en GitHub no contengan credenciales.

## Conclusión

El TP07 incorpora una conexión con MongoDB Atlas, un modelo Mongoose con validaciones y scripts independientes para comprobar la conexión, crear reservas y consultar los documentos persistidos.

La aplicación web conserva la organización modular y el funcionamiento de los trabajos anteriores. La persistencia mediante MongoDB se realiza por separado, lo que permite comprobar el almacenamiento de documentos sin modificar el servicio de reservas en memoria.
