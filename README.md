# Adopta un corazón

Una aplicación para conocer animales, solicitar su adopción y seguir la respuesta desde una cuenta personal. La administración mantiene las fichas y revisa las solicitudes.

La idea parte del proyecto original de Andrea. Conserva la temática, la fotografía de portada, el mensaje de compromiso y las tres entidades principales. La revisión incorpora una portada pública, filtros, validación de formularios, una sesión compartida entre componentes y una única gestión de solicitudes.

> Él nunca te abandonaría. Tú puedes cambiar su vida.

## Estado de la entrega

**Versión local comprobada. Despliegue de esta versión todavía pendiente.**

| Enlace de entrega                      | Estado                 |
| -------------------------------------- | ---------------------- |
| Repositorio de esta revisión en GitHub | Pendiente de publicar  |
| Frontend de esta revisión              | Pendiente de desplegar |
| Backend de esta revisión               | Pendiente de desplegar |

La URL anterior `https://adopta-un-corazon.vercel.app` pertenece al proyecto previo. No se presenta como un despliegue de esta revisión.

## Para quién está pensada

Para personas que quieren adoptar y necesitan conocer a los animales antes de decidir, y para la persona que gestiona sus fichas y solicitudes. El catálogo es público. Se pide una cuenta solo al enviar una solicitud, para que cada persona pueda consultar su seguimiento.

Los datos que acompañan la entrega son ficticios. Una solicitud aprobada es un estado de esta demostración, no un contrato de adopción ni una coordinación con una protectora real.

## Probarla en tu Mac

Necesitas **Node.js 22.12 o posterior**. La instalación de Node 22.11 detectada en el Mac no alcanza el mínimo de la versión de Vite usada. Usa una versión LTS compatible antes de instalar o ejecutar por tu cuenta.

Abre esta carpeta en VS Code y abre dos terminales. No hay que entrar en una carpeta `backend`: el backend está en la raíz.

Primera terminal:

```bash
npm ci
npm run demo
```

Segunda terminal:

```bash
cd frontend
npm ci
npm run dev
```

Abre `http://127.0.0.1:5173`.

`npm run demo` descarga MongoDB la primera vez y arranca una base de datos temporal en tu Mac. La API escucha solo en `127.0.0.1:3001`. **Los datos de la demo desaparecen al cerrar el proceso.** Este comando no utiliza la base remota ni su contraseña.

Cuentas de demostración, exclusivas de este modo local:

| Uso            | Email                  | Contraseña       |
| -------------- | ---------------------- | ---------------- |
| Administración | admin@example.org      | DemoCorazon2026! |
| Usuario        | adoptante1@example.org | DemoCorazon2026! |

También puedes crear una cuenta desde «Crear cuenta». Estos accesos no se crean automáticamente con `npm start`.

## Ejecutar con una base persistente

1. Copia `.env.example` a `.env` en la raíz.
2. Configura `MONGO_URI` con una base MongoDB de este proyecto. Debe admitir transacciones: MongoDB Atlas o un replica set local.
3. Genera un secreto con `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` y guárdalo en `JWT_SECRET`.
4. Define `FRONTEND_URL` con el origen exacto de la web, sin barra final. Se admiten varios orígenes separados por comas.
5. Elige `SEED_PASSWORD` para las cuentas ficticias y ejecuta `npm run seed:check`, después `npm run seed`.
6. Define `ADMIN_EMAIL`, `ADMIN_NAME` y `ADMIN_PASSWORD` y ejecuta `npm run admin:create`.
7. Arranca la API con `npm start` y el frontend con `npm run dev` dentro de `frontend`.

El comando de administración crea una cuenta nueva. No cambia contraseñas ni convierte cuentas existentes en administradoras. No hay recuperación por email implementada. Si se usa una cuenta existente sin recordar su contraseña, será necesaria una recuperación administrativa; no se deben manipular hashes a mano.

Las claves nunca van en GitHub ni en el frontend. `.env` está excluido mediante `.gitignore`.

## Datos: del Excel a MongoDB

El archivo `data/adopta-un-corazon.xlsx` contiene:

- **Animales:** 100 registros. Nombre, especie, raza, edad e historia proceden del CSV original de Andrea. Se añaden un código estable, ciudad y tamaño de ejemplo. Las fotografías se dejan vacías porque los enlaces originales eran imágenes aleatorias.
- **Usuarios:** 30 personas ficticias, sin contraseñas en el Excel.
- **Solicitudes:** 40 registros pendientes que relacionan `usuario_codigo` y `animal_codigo` con los códigos de las otras hojas.

Los CSV de `data/csv/` se han exportado de las celdas del Excel guardado, con separador `;` y codificación UTF-8. El Excel es el origen de esa importación.

Para cambiar la semilla, edita el Excel y exporta cada tabla a su CSV correspondiente. Mantén las cabeceras, los códigos y el separador. En `disponible`, usa `true` o `false`. Si Excel exporta un booleano como `VERDADERO`, conviértelo a `true` en el CSV. La validación avisará si el formato no coincide.

`src/seed/importData.js` usa `fs.createReadStream` y `csv-parser`, comprueba los códigos y referencias, crea los modelos y sus índices, e importa los datos en una transacción. Los códigos del Excel se traducen a los identificadores de MongoDB.

La semilla utiliza `$setOnInsert`: repetirla no duplica datos ni sobrescribe cambios, contraseñas o estados. Si quieres modificar una ficha existente, utiliza la administración. La semilla sirve para cargar registros nuevos, no para actualizar los ya utilizados.

```text
User 1 ───── N Solicitud N ───── 1 Animal
                 │
              estado
              mensaje
```

## Organización del código

```text
src/
  app.js             Configuración de Express y rutas
  server.js          Arranque después de conectar la base de datos
  config/            Conexión a MongoDB
  controllers/       Operaciones de usuarios, animales y solicitudes
  middleware/        Autenticación, rol y límite de intentos
  models/            User, Animal y Solicitud
  routes/            Endpoints de la API
  seed/              Lectura y validación de los CSV
  utils/             Tratamiento común de errores
frontend/src/
  components/        Cabecera, tarjetas, formularios y estados reutilizables
  context/           Estado compartido de la sesión
  hooks/             useAuth y useResource
  pages/             Inicio, catálogo, acceso, detalle y administración
  config/            Cliente HTTP común
  styles/style.css   Variables, componentes y adaptación a móvil
data/                Excel y CSV
scripts/             Demo temporal y creación de administrador
tests/               Pruebas de integración contra MongoDB temporal
```

Se eliminaron la segunda API `/api/adoptions` y su modelo incompatible. Todas las solicitudes se gestionan mediante `/api/solicitudes`.

## React y decisiones de interfaz

- `useReducer` mantiene los filtros y reinicia la página al cambiar un criterio. Así no aparece una página vacía por conservar una paginación anterior.
- `useMemo` evita recalcular la lista filtrada cuando no cambian ni los datos ni los filtros.
- `useContext`, a través de `useAuth`, ofrece una sola sesión a la navegación, las rutas protegidas y los formularios.
- `useResource` reutiliza las peticiones, la recarga y los estados de error. Usa `AbortController` para cancelar peticiones al cambiar de pantalla y `useCallback` para mantener estable la función de recarga.
- `useRef` gestiona el foco del contenido al navegar, para ayudar a quien utiliza teclado.

El catálogo y las fichas son públicos. Después del registro o del login se vuelve a la ficha desde la que se inició el proceso. Los errores de conexión y los de credenciales tienen mensajes diferentes. Los formularios tienen etiquetas, estados de espera y confirmación visible.

La foto ocupa la portada, con un degradado oscuro semitransparente. El rosa identifica acciones y detalles. La ficha muestra «Fotografía pendiente» si no hay imagen o esta falla. Las fichas pueden recibir una URL HTTPS desde el panel de administración.

## API

| Método | Ruta                   | Acceso                                  |
| ------ | ---------------------- | --------------------------------------- |
| GET    | `/api/health`          | Público; comprueba la conexión          |
| POST   | `/api/users/register`  | Público; crea usuario y sesión          |
| POST   | `/api/users/login`     | Público                                 |
| GET    | `/api/users/me`        | Sesión válida                           |
| GET    | `/api/animales`        | Público                                 |
| GET    | `/api/animales/:id`    | Público                                 |
| POST   | `/api/animales`        | Administración                          |
| PUT    | `/api/animales/:id`    | Administración                          |
| DELETE | `/api/animales/:id`    | Administración; solo sin solicitudes    |
| GET    | `/api/solicitudes`     | Usuario: propias; administración: todas |
| POST   | `/api/solicitudes`     | Sesión válida                           |
| PATCH  | `/api/solicitudes/:id` | Administración                          |

Contraseñas con bcrypt, JWT de ocho horas y comprobación del rol actual en la base de datos. El token se guarda en `sessionStorage`; la cuenta se verifica con `/me` al recargar. El frontend no decide quién tiene permiso: lo comprueba el backend.

La combinación usuario/animal tiene un índice único. La aprobación modifica el estado del animal y rechaza otras solicitudes pendientes del mismo animal dentro de una transacción. Las solicitudes se conservan como historial; no se permite borrar una ficha que las tenga.

## Pruebas

```bash
npm test
npm run seed:check
npm run format:check
cd frontend
npm run lint
# Usar la URL real para una compilación de despliegue:
VITE_API_URL=https://tu-backend.onrender.com npm run build
```

Las seis pruebas de integración comprueban el registro, la normalización del email, el hash, los roles, las sesiones caducadas, el CRUD, la privacidad de las solicitudes, los duplicados, la aprobación concurrente y la importación repetible. Usan una base temporal y nunca la base configurada en `.env`.

Consulta `docs/VERIFICACION.md` para conocer el alcance de la revisión realizada y lo que falta.

## Publicación

Consulta `docs/DESPLIEGUE.md`. Es obligatorio publicar **frontend y backend**, y añadir ambos enlaces al principio de este README antes de entregar el repositorio.

## Límites y mejoras opcionales

- La colección de animales utiliza fichas ficticias y aún no tiene fotografías propias. La foto de portada es la proporcionada por Andrea.
- No se ha implementado Cloudinary: es opcional en la rúbrica. Las imágenes se pueden indicar por URL HTTPS.
- No hay envío de correos ni recuperación automática de contraseña.
- El límite de intentos está en memoria por proceso. Un despliegue con varias instancias necesitaría un almacén compartido.
- No se han reutilizado credenciales ni datos privados del `.env` original.
- La valoración de arquitectura y UX/UI corresponde al profesorado; la lista de requisitos documenta evidencias, no garantiza la nota.

## Referencias técnicas

- [React: useReducer](https://react.dev/reference/react/useReducer)
- [Vite: requisitos y desarrollo](https://vite.dev/guide/)
- [Mongoose: transacciones](https://mongoosejs.com/docs/transactions.html)
