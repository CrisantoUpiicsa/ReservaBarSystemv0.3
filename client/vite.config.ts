// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Esto es CRUCIAL para que process.env esté disponible
  define: {
    'process.env': {}
  },
  server: {
    host: true,
    port: 5173, // O el puerto que uses en Replit
  },
});