// vite.config.ts (en la raíz de tu repositorio)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_', // Asegura que Vite reconozca las variables que empiezan con VITE_
  define: {
    // Esto instruye a Vite a reemplazar todas las ocurrencias de
    // process.env.VITE_API_BASE_URL con su valor string literal durante el build
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
    'process.env': {} // Necesario para que `process.env` esté disponible
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist/public', // Confirmed from previous logs
  }
});