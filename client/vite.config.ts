// vite.config.ts (en la raíz de tu repositorio, según tu estructura)
import { defineConfig, loadEnv } from 'vite'; // Importa loadEnv
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno para el modo actual (production en el build)
  const env = loadEnv(mode, process.cwd(), 'VITE_'); // Asegúrate de que process.cwd() sea la raíz de tu proyecto

  return {
    plugins: [react()],
    envPrefix: 'VITE_', // Esto sigue siendo bueno para consistencia

    define: {
      // Intenta esta forma de definir, a veces es más fiable.
      // Aquí estamos pasando el valor directamente desde la carga de env,
      // asegurándonos de que sea una cadena JSON.
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      // Mantenemos el process.env para compatibilidad, aunque el focus está en import.meta.env
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'process.env': {} // Aún necesario para compatibilidad general con process.env
    },

    server: {
      host: true,
      port: 5173,
    },
    build: {
      outDir: 'dist/public', // Confirmed from previous logs
    }
  };
});