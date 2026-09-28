// Límite sencillo por IP para un único proceso. En varios procesos, usar un almacén compartido.
export function authLimiter() {
  const attempts = new Map();
  return (req, res, next) => {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
    const value = attempts.get(req.ip) || { count: 0, until: now + 15 * 60_000 };
    value.count += 1;
    attempts.set(req.ip, value);
    if (value.count > 40) {
      res.set('Retry-After', String(Math.ceil((value.until - now) / 1000)));
      return res
        .status(429)
        .json({ error: 'Demasiados intentos. Espera unos minutos antes de volver a entrar.' });
    }
    next();
  };
}
