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

Todavía es necesario publicar la revisión, configurar la conexión entre servicios y repetir las comprobaciones desde las URLs públicas. El README y la matriz de requisitos mantienen esos puntos pendientes.

La demo utiliza una base temporal y credenciales ficticias. No utiliza el `.env` original. La compilación de prueba apunta a `127.0.0.1` y debe recompilarse con la URL real del backend antes de publicar.
