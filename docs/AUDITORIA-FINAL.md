# Auditoría del proyecto final

Fecha: 29 de septiembre de 2026.

Proyecto: **Adopta un corazón — Andrea Simon**.

## Resultado

La revisión no ha encontrado requisitos obligatorios de la descripción o la rúbrica sin implementar. Se han comprobado el código, los datos, las pruebas y los servicios publicados. La calidad de arquitectura y UX/UI tiene una parte de valoración docente: este informe aporta evidencias y no garantiza una calificación.

Fuente de los criterios: descripción y lista de requisitos de **RTC Proyecto Final**, facilitadas por Andrea en sus capturas de la plataforma thePower. Los extras opcionales se separan de los requisitos obligatorios.

## Descripción y requisitos, punto por punto

| Criterio del máster                                          | Resultado                               | Evidencia concreta                                                                                                                                                                                                                                     |
| ------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Proyecto FullStack con sentido y que resuelva un problema    | Cumple                                  | Catálogo para personas interesadas en adoptar; solicitudes personales y panel de administración para revisarlas. README explica objetivo, público y límites de la demostración.                                                                        |
| Backend Node.js                                              | Cumple                                  | `src/server.js`, Express, rutas y controladores separados. `/api/health` público devuelve HTTP 200 con la base conectada.                                                                                                                              |
| Frontend React                                               | Cumple                                  | `frontend/src/main.jsx`, componentes y páginas React. Compilación de producción completada.                                                                                                                                                            |
| Excel con un mínimo de 100 datos                             | Cumple                                  | `data/adopta-un-corazon.xlsx`: 100 animales, 30 usuarios y 40 solicitudes, sin contar cabeceras ni notas.                                                                                                                                              |
| Al menos dos colecciones relacionadas además de usuarios     | Cumple                                  | `Animal`, `Solicitud` y `User`. Una solicitud referencia a un animal y a un usuario mediante ObjectId. Los códigos del Excel resuelven esas relaciones al importar.                                                                                    |
| Exportar Excel como CSV                                      | Cumple                                  | Los datos de las tres hojas coinciden celda por celda con sus CSV, normalizando booleanos y celdas vacías.                                                                                                                                             |
| Lectura de archivos con Node.js fs                           | Cumple                                  | `src/seed/importData.js` utiliza `fs.createReadStream` y `csv-parser`.                                                                                                                                                                                 |
| Crear los modelos antes de ejecutar las semillas             | Cumple                                  | Se importan los tres modelos Mongoose, se validan los datos y se inicializan sus índices antes de la transacción de importación.                                                                                                                       |
| Generar la base de datos a partir del Excel                  | Cumple                                  | Semilla probada contra MongoDB temporal e importada en Atlas para producción. Repetirla no duplica registros ni sobrescribe cambios del administrador.                                                                                                 |
| Colección de usuarios y acceso condicionado por sesión o rol | Cumple                                  | Registro, login, JWT, contraseña cifrada con bcrypt y middleware `protect`/`adminOnly`. El registro público no permite asignarse rol administrador.                                                                                                    |
| Variables en style.css: colores, espacios, etc.              | Cumple                                  | `:root` contiene variables de color, espacios, radio y ancho de página.                                                                                                                                                                                |
| CSS reutilizable y organizado                                | Cumple técnicamente                     | Clases compartidas para botones, formularios, tarjetas, estados de error y diseño adaptable. Valoración final del profesor.                                                                                                                            |
| Buena arquitectura React                                     | Cumple técnicamente                     | Separación en páginas, componentes, contexto, hooks y cliente HTTP. Rutas protegidas reutilizables. Valoración final del profesor.                                                                                                                     |
| Componentización y reutilización                             | Cumple                                  | `AnimalCard`, `AnimalImage`, `AnimalForm`, `Layout`, `ProtectedRoute` y estados de carga/error reutilizados.                                                                                                                                           |
| Hooks avanzados con finalidad necesaria                      | Cumple                                  | `useReducer`: filtros y paginación; `useMemo`: catálogo filtrado; contexto: sesión común; `useCallback` y hook `useResource`: recarga y peticiones cancelables; `useRef`: foco tras navegar.                                                           |
| Buena UX/UI y lógica de navegación                           | Cumple en las comprobaciones realizadas | Portada pública, filtros, tarjetas con fotos, detalle, registro, solicitudes, administración, mensajes de error, confirmaciones y navegación móvil. Catálogo revisado a 390 píxeles CSS, sin desbordamiento horizontal. Valoración final del profesor. |
| README detallado sobre el sentido del proyecto               | Cumple                                  | Objetivo, público, datos, arquitectura, relaciones, hooks, ejecución, API, pruebas y despliegue documentados.                                                                                                                                          |
| Backend y frontend desplegados                               | Cumple                                  | Frontend Vercel y backend Render accesibles. La API consulta la base persistente de Atlas.                                                                                                                                                             |
| Acceder a los despliegues desde el enlace de GitHub          | Cumple                                  | El inicio de README contiene repositorio, web pública y comprobación del backend.                                                                                                                                                                      |

## Pruebas ejecutadas en esta auditoría

- **6 de 6 pruebas de integración correctas**: registro y roles, login y sesión, CRUD protegido, privacidad y duplicados de solicitudes, aprobación concurrente e importación repetible.
- `npm run seed:check`: 100 animales, 30 usuarios y 40 solicitudes válidos. Referencias y códigos comprobados.
- Comparación del XLSX con los tres CSV: coincidencia exacta de los datos y códigos únicos.
- `npm run lint`: correcto. `npm run build` con la URL pública del backend: correcto.
- `npm run format:check`: correcto.
- Auditoría de dependencias: **0 vulnerabilidades reportadas** en backend y frontend tras actualizar las dependencias compatibles del frontend y retirar Axios, que no se utilizaba. Este resultado no equivale a una auditoría exhaustiva de seguridad.
- API publicada: `/api/health` y `/api/animales` devuelven HTTP 200; el catálogo contiene 100 registros. `/api/solicitudes` sin sesión devuelve HTTP 401. CORS permite el dominio de la web publicada.
- Administrador de producción: acceso con contraseña verificado en esta sesión de trabajo; visibles los menús Gestionar y Solicitudes y las acciones Aprobar/Rechazar. Las pruebas automáticas de aprobación se ejecutan sobre una base temporal, no sobre solicitudes de producción.
- Registro y creación/consulta de solicitud de producción: comprobados anteriormente el mismo día con una cuenta ficticia y una solicitud de verificación técnica autorizadas por Andrea.
- Repositorio actual: no contiene `.env`, `node_modules` ni `.DS_Store` entre sus archivos versionados. Las credenciales administrativas se entregan por separado al profesor.

## Fotografías

Se incluyen 19 fotografías de referencia de Wikimedia Commons, una por cada raza del conjunto de ejemplo, con cobertura de las 100 fichas. Están guardadas en la web, con carga diferida y texto alternativo. Las fotografías se reutilizan entre las fichas ficticias de la misma raza.

La página `/creditos-fotos` identifica los autores, los originales y las licencias. La correspondencia de especie y raza está comprobada. Una foto añadida desde administración tiene prioridad. Los animales nuevos sin imagen conservan el aviso de fotografía pendiente. La fotografía de portada de Andrea se mantiene.

La asignación de referencia se hace en el frontend para los códigos `ANI-…` del Excel; no cambia la base de datos, contraseñas ni estados de adopción.

## Extras opcionales y límites

| Punto                                             | Situación                                                                                                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudinary y subida de archivos desde el frontend | No implementado. El enunciado lo considera opcional y puntuable, no obligatorio. El administrador puede indicar una URL HTTPS de imagen.        |
| Librerías no vistas en clase                      | El enunciado las valora positivamente, pero no exige ninguna concreta. Sin el listado completo de librerías del curso no se atribuye ese extra. |
| Recuperación de contraseña por email              | No implementada; no figura como requisito obligatorio. El acceso administrativo actual está comprobado.                                         |
| Plan gratuito del backend                         | Puede tardar en responder después de estar inactivo. No hay un compromiso de disponibilidad permanente.                                         |
| Fotografías e historias                           | Son recursos de una demostración académica; no representan una protectora ni adopciones reales.                                                 |
| Nota final                                        | Depende de la revisión del profesor, especialmente en arquitectura, UX/UI y aplicación de contenidos del curso.                                 |

## Entrega

- Repositorio: https://github.com/andreaCsa/adopta-un-corazon-proyecto-final
- Web: https://adopta-un-corazon-proyecto-final.vercel.app
- Backend: https://adopta-un-corazon-final-api.onrender.com/api/health
- Acceso: https://adopta-un-corazon-proyecto-final.vercel.app/login

El enlace de entrega es el repositorio. El correo y la contraseña de administrador deben comunicarse al profesor por un canal privado. Una dirección `127.0.0.1` solo funciona en el equipo local y no sirve para entregar.
