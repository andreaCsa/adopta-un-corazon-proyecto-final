# Verificación de la revisión

Fecha: 28 de septiembre de 2026.

## Comprobaciones realizadas

- Seis pruebas de integración contra MongoDB temporal: registro y roles, login y sesión, CRUD, privacidad y duplicados de solicitudes, aprobación simultánea e importación repetida. Todas pasaron.
- El frontend compiló con Vite utilizando una URL de API local de prueba.
- ESLint pasó después de corregir la configuración de Vite.
- Se revisaron imágenes renderizadas de las tres hojas del Excel. Se exportaron los CSV de las celdas del XLSX guardado y se comprobó su importación.
- En Chrome se probaron filtros por nombre y especie, registro de una cuenta ficticia, retorno a la ficha, envío de una solicitud y persistencia de sesión y solicitud tras recargar.
- Se comprobó el login con la cuenta administrativa local y su navegación. La consola de Chrome no mostró errores ni advertencias en la revisión.
- Se revisó la portada en escritorio y a anchos CSS de 390 y 320 píxeles. Se comprobó el menú móvil y la ausencia de desbordamiento de los textos de portada.

## Límites

Las pruebas verifican la copia local. No reparan por sí mismas la web publicada anteriormente ni confirman la causa de su fallo de acceso. No se ha modificado su base de datos.

La publicación y las comprobaciones públicas se completaron el 29 de septiembre de 2026; se detallan a continuación.

La demo utiliza una base temporal y credenciales ficticias. No utiliza el `.env` original. La compilación de prueba apunta a `127.0.0.1` y debe recompilarse con la URL real del backend antes de publicar.

## Verificación pública — 29 de septiembre de 2026

- Web: https://adopta-un-corazon-proyecto-final.vercel.app
- API: https://adopta-un-corazon-final-api.onrender.com/api/health — HTTP 200.
- Semilla en Atlas: 100 animales, 30 usuarios ficticios y 40 solicitudes.
- Navegador: catálogo público con 100 resultados, 12 fichas en la primera página y sin error de conexión.
- API pública: CORS para el dominio nuevo, registro, login, sesión y creación/consulta de una solicitud, todos correctos. La prueba autorizada añade una cuenta ficticia y una solicitud claramente identificadas como verificación técnica.
- Tras actualizar dependencias: seis pruebas de integración pasadas; auditoría npm sin vulnerabilidades reportadas.
- Cuenta administrativa de producción activada: acceso con contraseña comprobado en la web, menú Gestionar y listado de solicitudes con botones Aprobar y Rechazar visibles. Las credenciales no se publican en el repositorio.
