import { resolve } from 'node:path'
import fg from 'fast-glob'
import type { Plugin } from 'vite'
import { sortBy } from 'lodash-es'
import { minimatch } from 'minimatch'
import { $slash } from '../../shared'
import { writeDTS } from './writeDTS'
import { resolveDts } from './path'

interface Options {
  /**
   * @default layout
   */
  dts?: string
  /**
   * @default "src/layouts/\*\/index.tsx"
   */
  dir?: string
}

export const ImportLayoutType = (options?: Options): Plugin => {
  const {
    dts = resolveDts('custom/layout', true),
    dir = 'src/layouts/*/index.tsx',
  } = options ?? {}
  let root: string

  const scanLayouts = async (root: string) => {
    if (!dir)
      return

    const result = await fg($slash(dir), {
      absolute: true,
      cwd: root,
      onlyFiles: true,
      followSymbolicLinks: true,
    })

    const layouts = sortBy(result.map(path => path.split('/').map(item => `"${item}"`).at(-2))).join(' | ')
    await writeDTS(resolve(root, dts), `  export type Layout = ${layouts}`)
  }

  return {
    name: 'auto-import-layout-type',
    enforce: 'post',
    buildStart() {
      scanLayouts(root)
    },
    handleHotUpdate({ file }) {
      if (!minimatch($slash(file), $slash(dir)))
        return
      scanLayouts(root)
    },
    configResolved(config) {
      root = config.root
      scanLayouts(root)
    },
  }
}
