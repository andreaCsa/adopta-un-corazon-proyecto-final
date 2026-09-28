import { useCallback, useEffect, useState } from 'react';
import { api } from '../config/api';
export function useResource(path, token) {
  const [version, setVersion] = useState(0);
  const key = `${path}:${token || ''}:${version}`;
  const [result, setResult] = useState({ key: null, data: null, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    api(path, { token, signal: controller.signal })
      .then((data) => setResult({ key, data, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setResult({ key, data: null, error: error.message });
      });
    return () => controller.abort();
  }, [path, token, key]);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return {
    data: result.key === key ? result.data : null,
    error: result.key === key ? result.error : '',
    loading: result.key !== key,
    reload,
  };
}
