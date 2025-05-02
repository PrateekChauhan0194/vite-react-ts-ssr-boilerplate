import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // Use index.html as the entry point
      input: 'index.html',
    },
  },
  ssr: {
    // Avoid issues with CJS/ESM compatibility
    noExternal: ['react-dom']
  }
})
