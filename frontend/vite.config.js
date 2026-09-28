import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (command === 'build' && !env.VITE_API_URL)
    throw new Error(
      'Define VITE_API_URL con la URL del backend antes de compilar. Consulta el README.',
    );
  return {
    plugins: [react()],
    server: { host: '127.0.0.1', proxy: { '/api': 'http://127.0.0.1:3001' } },
  };
});
