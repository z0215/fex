import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { Worker } from 'node:worker_threads'
import type { Plugin } from 'vite'
import fg from 'fast-glob'
import { minimatch } from 'minimatch'
import { groupBy } from 'lodash-es'
import { $slash } from '../../shared'
import { writeDTS } from './writeDTS'
import { TYPE_PATH, resolveDts } from './path'
import { generateType } from './ast'

const astWorker = new Worker(resolve(__dirname, 'astWorker.js'))

export interface TypeImports {
  name: string
  parameter?: { name: string, isDefault: boolean }[]
  alias?: string
}

interface Options {
  /**
   * @default shared
   */
  dts?: string
  /**
   * @default []
   */
  dirs?: string[]
  /**
   * @default []
   */
  imports?: Record<string, TypeImports[]>[]
}

const AutoImportTypes = (options?: Options): Plugin => {
  const {
    dts = 'shared',
    dirs = [],
    imports = [],
  } = options ?? {}
  let root: string

  const scanDirs = async (root: string) => {
    if (!dirs?.length)
      return

    const result = await fg(dirs, {
      absolute: true,
      cwd: root,
      onlyFiles: true,
      followSymbolicLinks: true,
    })
    const files = Array.from(new Set(result.flat())).map($slash)
    astWorker.postMessage(files)
    astWorker.on('message', (types) => {
      writeDTS(resolve(root, dts), types.flat().join('\n'))
    })
  }

  return {
    name: 'auto-import-type',
    enforce: 'post',
    buildStart() {
      scanDirs(root)
    },
    handleHotUpdate({ file }) {
      if (dirs?.some(glob => minimatch($slash(file), $slash(glob))))
        scanDirs(root)
    },
    configResolved(config) {
      root = config.root
      scanDirs(root)

      imports.forEach((i) => {
        const types = Object.entries(i).map(([name, data]) => {
          const items = data.map(item => generateType(name, item as any))
          return items
        })
        writeDTS(resolve(root, dts), types.flat().join('\n'))
      })
    },
  }
}

const getPkgTypes = async () => {
  const data = await fg($slash(`${TYPE_PATH}/*.json`), {
    absolute: true,
    cwd: __dirname,
    onlyFiles: true,
    followSymbolicLinks: true,
  })
  const res = data.map(async (path) => {
    const name = path.split('/').at(-1)?.replace(/\.json$/, '') ?? ''
    const content = await readFile(path, 'utf-8')
    return { name, data: JSON.parse(content) as TypeImports[] }
  })
  return Promise.all(res)
}

const dtsMap: Record<string, string> = {
  react: 'react/core',
  antd: 'antd/components',
}

const alias = (name: string, api: string) => api.startsWith(name) ? api : `${name}${api}`

const apiMap: Record<string, (data: TypeImports[]) => TypeImports[]> = {
  react: data => data.map(i => ({ ...i, alias: alias('React', i.name) })),
  antd: data => data.map(i => ({ ...i, alias: alias('Antd', i.name) })),
}

interface CustomImportItem {
  name: string
  dts: string
  data: TypeImports[]
}
const customImports: CustomImportItem[] = [
  {
    name: 'zustand/middleware',
    dts: 'react/store',
    data: [
      { name: 'StorageValue', parameter: [{ name: 'S', isDefault: false }] },
    ],
  },
]
const formatedImports = Object
  .entries(groupBy(customImports, 'dts'))
  .reduce<{ dts: string, imports: Record<string, TypeImports[]>[] }[]>((arr, [dts, groups]) => {
    const imports = groups.reduce<Record<string, TypeImports[]>>((map, { name, data }) => {
      map[name] = data
      return map
    }, {})
    arr.push({
      dts,
      imports: [imports],
    })
    return arr
  }, [])

export const ImportTypes = async (): Promise<Plugin[]> => {
  const pkgTypes = await getPkgTypes()

  return pkgTypes
    .map(({ name, data }) => AutoImportTypes({
      dts: resolveDts(dtsMap[name] ?? name, true),
      imports: [{ [name]: apiMap[name]?.(data) ?? data }],
    }))
    .concat(formatedImports.map(({ dts, imports }) => AutoImportTypes({
      dts: resolveDts(dts, true),
      imports,
    })))
    .concat(AutoImportTypes({
      dts: resolveDts(`custom/shared`, true),
      dirs: [
        'src/components/*/index.tsx',
        'src/hooks/*/index.*',
        'src/shared/*/index.ts',
        'src/shared/*.ts',
        'shared/*/index.ts',
        'shared/*.ts',
        'src/theme/*',
        'src/routes/*',
        'src/apis/*',
      ],
    }))
}
