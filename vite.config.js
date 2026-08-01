import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2018',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'motion'
        }
      }
    }
  }
})
