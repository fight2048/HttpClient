import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: true,
    lib: {
      entry: './lib/index.ts',
      name: 'HttpClient',
      fileName: 'httpClient',
    },
  },
})
