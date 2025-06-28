// vite.config.ts (en la raíz de tu repositorio, según tu estructura)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Importante para asegurar que VITE_API_BASE_URL sea reconocida
  envPrefix: 'VITE_',
  define: {
    // Esto es crucial para que Vite reemplace process.env.VITE_API_BASE_URL
    // con el valor real en tiempo de build.
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
    'process.env': {} // Necesario para que `process.env` esté disponible
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    // Esto asegura que la salida vaya a dist/public, como ya sabemos por los logs
    outDir: 'dist/public',
  }
});