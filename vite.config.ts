import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Organization repos use root path
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,      // Your port
    strictPort: true, // Fail if port is already in use
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
})
