const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export async function api(path, { token, body, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${base}/api${path}`, {
      ...options,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error(
      'No podemos conectar en este momento. Comprueba tu conexión e inténtalo de nuevo.',
    );
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok || data === null) {
    const error = new Error(
      data?.error || 'El servicio no está disponible en este momento. Inténtalo más tarde.',
    );
    error.status = response.status;
    throw error;
  }
  return data;
}
