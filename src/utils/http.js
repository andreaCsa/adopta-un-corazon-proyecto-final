export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.code === 11000)
    return res
      .status(409)
      .json({ error: 'Este registro ya existe. Comprueba tu email o tus solicitudes.' });
  if (error.name === 'ValidationError' || error.name === 'CastError')
    return res.status(400).json({ error: 'Revisa los campos: hay valores que no son válidos.' });
  const status = error.status || 500;
  if (status >= 500) console.error('Error de API:', error.name);
  res.status(status).json({
    error:
      status >= 500 ? 'No hemos podido completar la operación. Inténtalo de nuevo.' : error.message,
  });
}
