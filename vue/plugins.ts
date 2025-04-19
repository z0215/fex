import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'

export default [
  vue(),
  autoImport({
    dts: './vue/auto.d.ts',
    imports: [
      {
        vue: [
          'ref',
          'customRef',
          'reactive',
          'computed',
          'watch',
          'watchEffect',
          'useModel',
          'onMounted',
          'onUnmounted',
        ],
      },
      {
        from: 'vue',
        imports: [],
        type: true,
      },
    ],
  }),
] as Plugin[]
