import { useEffect, useState } from 'react';
import { AuthContext } from './auth';
import { api } from '../config/api';
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('adopta-token'));
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    api('/users/me', { token, signal: controller.signal })
      .then((data) => {
        setUser(data);
        setChecked(token);
        setError('');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (err.status === 401) {
          sessionStorage.removeItem('adopta-token');
          setToken(null);
          setUser(null);
        } else setError(err.message);
        setChecked(token);
      });
    return () => controller.abort();
  }, [token]);
  const login = (session) => {
    sessionStorage.setItem('adopta-token', session.token);
    setUser(session.user);
    setToken(session.token);
    setChecked(session.token);
    setError('');
  };
  const logout = () => {
    sessionStorage.removeItem('adopta-token');
    setUser(null);
    setToken(null);
    setError('');
  };
  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading: !!token && checked !== token, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}
