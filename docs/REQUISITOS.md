# Relación con la rúbrica

Fuente: descripción y requisitos de «RTC Proyecto Final» facilitados por Andrea y comprobados en la plataforma el 28 de septiembre de 2026.

| Requisito                                       | Evidencia en esta versión                                                             | Estado                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Backend con Node.js                             | `src/server.js`, Express y controladores                                              | Implementado y probado localmente                               |
| Frontend con React                              | `frontend/src/main.jsx` y páginas                                                     | Implementado y compilado                                        |
| Variables en style.css                          | Colores, espacios, ancho y radio en `:root`                                           | Implementado                                                    |
| CSS reutilizable y organizado                   | Clases de botones, formularios, tarjetas y estados comunes                            | Implementado; valoración del profesorado                        |
| Dos colecciones relacionadas además de usuarios | `Animal`, `Solicitud`, `User`; referencias de solicitudes a animal y usuario          | Implementado y probado                                          |
| Excel con al menos 100 datos                    | 100 animales, 30 usuarios y 40 solicitudes en `data/adopta-un-corazon.xlsx`           | Creado y revisado                                               |
| CSV y lectura con fs                            | `data/csv` y `src/seed/importData.js`                                                 | Importación probada                                             |
| Modelos antes de la semilla                     | Modelos Mongoose importados y validados antes de escribir                             | Implementado                                                    |
| Colección de usuarios y acceso condicionado     | JWT, `protect`, `adminOnly`                                                           | Probado con usuario y administrador                             |
| Buena arquitectura React                        | Componentes, páginas, hooks, contexto y cliente HTTP separados                        | Implementado; valoración del profesorado                        |
| Hooks avanzados con finalidad concreta          | `useReducer`, `useMemo`, `useContext`, `useCallback`, `useRef`                        | Documentados en README                                          |
| Componentización y reutilización                | `AnimalCard`, `AnimalForm`, `ResourceState`, `Layout`, `ProtectedRoute`               | Implementado                                                    |
| Público objetivo y sentido lógico               | Catálogo público, solicitud privada y administración de adopciones                    | Explicado en README                                             |
| Buena UX/UI                                     | Diseño responsive, etiquetas, navegación por teclado, carga, errores y confirmaciones | Revisado localmente; valoración del profesorado                 |
| README detallado                                | Propósito, arquitectura, decisiones, API, datos y ejecución                           | Incluido                                                        |
| Backend y frontend desplegados                  | Configuración y guía preparadas                                                       | **Pendiente de publicar y verificar**                           |
| Enlaces accesibles desde GitHub                 | Tabla de enlaces en README                                                            | **Pendiente de subir el repositorio y añadir URLs definitivas** |
| Cloudinary                                      | Extra opcional                                                                        | No incluido                                                     |
| Otras librerías no vistas en clase              | No se conoce la lista completa del curso                                              | Sin atribuir puntuación extra                                   |

No entregar esta versión como final hasta completar los dos puntos de publicación y comprobar el registro desde la URL pública.
