import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/LUMINUM-ESTILO-TERRA-NIL/',
  build: {
    // Usa esbuild (padrão do Vite) com minificação máxima
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        // Nomes de chunks ofuscados (hashes)
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        // Divide o bundle para dificultar análise
        manualChunks: undefined,
      },
    },
    // Remove source maps do build de produção (nunca expor o fonte real)
    sourcemap: false,
  },
  // Bloqueia DevTools de forma mais eficaz em produção
  esbuild: {
    // Remove console.log e debugger do build final
    drop: ['debugger'],
    // Renomeia variáveis para letras sem sentido
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
})
