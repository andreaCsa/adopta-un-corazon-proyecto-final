# Publicar el proyecto

Esta guía prepara el frontend en Vercel, el backend en Render y la base de datos en MongoDB Atlas. **Esta revisión todavía no está publicada.**

## GitHub

Sube el proyecto al repositorio que vayas a entregar. Incluye backend, frontend, Excel, CSV y documentación. `.gitignore` excluye `node_modules`, `frontend/dist` y `.env`. Los archivos `.env.example` sí se incluyen porque no contienen claves.

Conserva una copia o rama de respaldo de la versión anterior. El profesorado debe poder acceder al repositorio según las instrucciones del máster.

## Base de datos

Prepara una base de MongoDB Atlas para esta revisión y configura su usuario y acceso de red para el backend. Debe permitir transacciones.

En tu `.env` local define `MONGO_URI` con esa base, elige `SEED_PASSWORD` y ejecuta `npm run seed:check` y `npm run seed`. Después configura las variables `ADMIN_EMAIL`, `ADMIN_NAME` y `ADMIN_PASSWORD` y ejecuta `npm run admin:create`.

No cargues datos en una base antigua sin comprobar su contenido. El comando no recupera ni cambia contraseñas existentes.

## Backend en Render

Crea o configura un servicio web conectado al repositorio:

| Campo             | Valor                |
| ----------------- | -------------------- |
| Directorio raíz   | Raíz del repositorio |
| Runtime           | Node                 |
| Build command     | `npm ci --omit=dev`  |
| Start command     | `npm start`          |
| Health check path | `/api/health`        |

Configura estas variables en el servicio:

- `NODE_VERSION`: versión LTS compatible con el mínimo `22.12.0`.
- `MONGO_URI`: conexión de la base de esta revisión.
- `JWT_SECRET`: secreto aleatorio de al menos 32 caracteres.
- `FRONTEND_URL`: origen exacto del frontend, sin barra final.
- `TRUST_PROXY`: `1` para el proxy del servicio.
- `NODE_ENV`: `production`.

`PORT` lo proporciona el alojamiento y el servidor lo respeta. No utilices `npm run demo` en producción: su base de datos es temporal.

Comprueba que `https://TU-BACKEND/api/health` devuelve `{"ok":true}`. Conserva la URL HTTPS base, sin `/api` al final.

Referencia: [Express en Render](https://render.com/docs/deploy-node-express-app).

## Frontend en Vercel

Configura el proyecto para el mismo repositorio:

| Campo            | Valor                       |
| ---------------- | --------------------------- |
| Root Directory   | `frontend`                  |
| Framework        | Vite                        |
| Build Command    | `npm run build`             |
| Output Directory | `dist`                      |
| Install Command  | `npm ci`                    |
| Node.js          | 22.x compatible o posterior |

Añade `VITE_API_URL` con la URL HTTPS del backend, **sin `/api` final**. Se incorpora durante la compilación: cambiarla requiere un nuevo despliegue. Las claves de MongoDB y JWT no pertenecen al frontend.

`frontend/vercel.json` permite abrir directamente rutas como `/login` o `/animales`. La compilación se detiene si falta `VITE_API_URL` para evitar publicar una web desconectada del backend.

Referencia: [Vite en Vercel y rutas de una SPA](https://vercel.com/docs/frameworks/frontend/vite).

## Verificación pública

1. Abre la portada en una ventana privada y entra al catálogo.
2. Crea una cuenta nueva, cierra sesión y vuelve a entrar.
3. Envía una solicitud y recarga «Mis solicitudes».
4. Comprueba con una segunda cuenta que no ve las solicitudes ajenas.
5. Entra como administración y resuelve una solicitud de prueba.
6. Abre una ruta interior directamente y recárgala.
7. Comprueba la web en móvil.

Si falla la conexión, revisa `/api/health`, después `VITE_API_URL` en Vercel y `FRONTEND_URL` en Render. Un error de conexión no significa que la contraseña esté mal.

## Entrega

Completa la tabla del README con los enlaces definitivos de GitHub, frontend y backend. Facilita al profesorado una forma de probar el panel administrativo por el canal privado indicado por el máster. Completa los puntos pendientes de `REQUISITOS.md` solo después de verificar las URLs públicas.
