import type { Plugin } from 'vite'
import { dependencies } from '../../package.json'

export const AutoChunks = (): Plugin => {
  return {
    name: 'auto-chunks',
    enforce: 'pre',
    async config() {
      return {
        build: {
          rollupOptions: {
            output: {
              manualChunks: Object.keys(dependencies).reduce((chunk, key) => {
                chunk[key] = [key]
                return chunk
              }, {} as Record<string, string[]>),
            },
          },
        },
      }
    },
  }
}
