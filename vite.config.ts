import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Performance optimizations
  build: {
    // Enable minification
    minify: 'esbuild', // Using esbuild for faster builds
    
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['lucide-react'],
        },
      },
    },
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    
    // Source maps for debugging (disable in production for smaller size)
    sourcemap: false,
    
    // Target modern browsers for smaller bundle
    target: 'esnext',
  },
  
  // Dev server optimizations
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  
  // Preview server
  preview: {
    port: 4173,
    strictPort: false,
  },
})
