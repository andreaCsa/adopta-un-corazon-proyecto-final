# Entender y presentar tu proyecto

## Recorrido para enseñarlo

1. Abre la portada y explica por qué elegiste la adopción responsable y la fotografía.
2. Entra al catálogo sin iniciar sesión. Busca un nombre y filtra por especie.
3. Abre una ficha y pulsa el botón para conocer al animal.
4. Registra una cuenta de prueba o inicia sesión. La web vuelve a la ficha.
5. Escribe un mensaje, confirma el compromiso y envía la solicitud.
6. Abre «Mis solicitudes» y comprueba el estado.
7. Cierra sesión y entra como administración. Revisa las solicitudes y resuelve una.
8. Muestra el Excel y explica cómo sus códigos se convierten en relaciones en MongoDB.

Antes de enseñar una cuenta administrativa, prepara sus credenciales fuera de un repositorio público. Las credenciales del README funcionan únicamente en la demo temporal.

## Explicaciones que debes poder dar

**¿Qué ocurre al crear una cuenta?**

React envía los campos al backend. El backend valida el nombre, normaliza el email, cifra la contraseña con bcrypt y crea un usuario con el rol normal. Devuelve un token y los datos públicos de la cuenta. El navegador nunca recibe el hash.

**¿Por qué hay tres colecciones?**

Un animal existe aunque no tenga solicitudes. Un usuario puede solicitar varios animales y un animal puede recibir solicitudes de varias personas. La colección Solicitud guarda esa relación, el mensaje y su estado.

**¿Cómo se importan los datos?**

El Excel se exporta a CSV. Node lee los ficheros con fs y csv-parser. Primero valida todos los registros y referencias. Después crea lo que falta y relaciona los códigos del Excel con los identificadores de MongoDB.

**¿Por qué la semilla no borra la base?**

Porque eso perdería solicitudes o cambios hechos después de la primera importación. Los códigos estables permiten reconocer registros ya importados y conservarlos.

**¿Para qué sirve useReducer?**

Coordina los filtros y la página del catálogo. Cuando cambia un filtro, vuelve a la página 1. La regla se escribe una sola vez y todos los controles se comportan igual.

**¿Para qué sirve el contexto?**

Para que la cabecera, las rutas y las páginas conozcan la misma sesión sin leer cada una una copia distinta del usuario.

**¿Por qué se usan transacciones?**

Al aprobar una solicitud cambian varios documentos. La transacción hace que esos cambios se guarden juntos o no se guarden. Así se evita aprobar dos adopciones para el mismo animal.

**¿Basta con esconder el botón de administración?**

No. Cualquiera puede enviar una petición fuera de la interfaz. El backend verifica el token y consulta el rol real del usuario antes de permitir la operación.

**¿Qué cambiarías después?**

Fotografías de cada animal, subida a Cloudinary, recuperación de contraseña por email y colaboración con una protectora real. Actualmente los registros son de demostración.

## Ajustar el texto a tu voz

Lee la portada y el README. Cambia las frases que no usarías y añade tu motivo personal para escoger el tema, con tus propias palabras. No hace falta inventar experiencias. La explicación será más natural si entiendes cada decisión y puedes mostrarla funcionando.
