import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
 server: {
    proxy: {
      '/auth': {
        target: 'https://backend.dwayee.qena-univ.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})