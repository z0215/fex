import type { Plugin } from 'vite'
import { minimatch } from 'minimatch'
import { $slash } from '../../shared'
import type { Options } from './ctx'
import { createContext } from './ctx'

export default (options: Options): Plugin => {
  let ctx = createContext(options)

  return {
    name: 'auto-import-type',
    enforce: 'post',
    async buildStart() {
      await ctx.scanDirs()
      await ctx.scanLayouts()
    },
    async buildEnd() {
      await ctx.writeConfigFiles()
    },
    async handleHotUpdate({ file }) {
      if (ctx.dirs?.some(glob => minimatch($slash(file), $slash(glob))))
        await ctx.scanDirs()
      await ctx.scanLayouts()
    },
    async configResolved(config) {
      if (ctx.root !== config.root) {
        ctx = createContext(options, config.root)
        await ctx.scanDirs()
        await ctx.scanLayouts()
      }
    },
  }
}
