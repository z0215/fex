import { fileURLToPath, URL } from 'node:url'
import unoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import framework from './plugins/framework'
import currentFramework from './vue/plugins'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@rc': fileURLToPath(new URL('./vue/components', import.meta.url)),
    },
  },
  plugins: [
    ...currentFramework,
    framework(),
    unoCSS(),
  ],
})
