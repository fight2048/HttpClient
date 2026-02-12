import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true, // 临时开启，调试完成后关闭
    minify: true,
    lib: {
      entry: './lib/index.ts',
      name: 'HttpClient',
      fileName: 'httpClient',
    },
  },
  server: {
    open: true,
    port: 5173,
    hmr: {
      overlay: true,
    },
    host: '0.0.0.0',
    proxy: {
      //目的是避开本地调试OSS上传时的跨域问题
      '/api': {
        target: 'https://www.baidu.com',
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/api/, ''),
      }
    },
    fs: {
      strict: true,
      // cachedChecks: true,
    },
  },
})
