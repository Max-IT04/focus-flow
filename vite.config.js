import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('redux')) {
              return 'vendor'
            }
            if (id.includes('styled-components') || id.includes('recharts')) {
              return 'ui'
            }
            if (id.includes('hookform') || id.includes('yup')) {
              return 'forms'
            }
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})