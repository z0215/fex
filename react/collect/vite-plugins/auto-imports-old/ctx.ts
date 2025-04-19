import { cwd } from 'node:process'
import { join, resolve } from 'node:path'
import type { Options as AutoImportOptions } from 'unplugin-auto-import/types'
import fg from 'fast-glob'
import { $slash } from '../../shared'
import { getExportedInfo } from './ast'
import { writeTypes } from './generator'

const resolveGlobsExclude = (root: string, glob: string) => {
  const excludeReg = /^!/
  return `${excludeReg.test(glob) ? '!' : ''}${resolve(root, glob.replace(excludeReg, ''))}`
}

const generateParameter = (parameter: TypeImports['parameter'], refer = false) => {
  if (!parameter?.length)
    return ''

  const importParameter = parameter.map(p => p.name)

  const definitionParameter = parameter.map(p => `${p.name}${p.isDefault ? ` = any` : ''}`)

  return refer ? `<${importParameter.join(',')}>` : `<${definitionParameter.join(',')}>`
}

const generateType = (target: string, { name, parameter, alias }: TypeImports) =>
  `  export type ${alias || name}${generateParameter(parameter)} = import('${target}').${name}${generateParameter(parameter, true)}`

export interface TypeImports {
  name: string
  parameter?: { name: string, isDefault: boolean }[]
  alias?: string
}

export interface Options extends Omit<AutoImportOptions, 'dts'> {
  importTypes?: Record<string, TypeImports[]>
  dts?: string
  layoutDir?: string
}

export const createContext = (options?: Options, root = cwd()) => {
  root = $slash(root)
  const { dirs: originDirs, importTypes = {}, dts = '', layoutDir } = options ?? {}
  const targetPath = resolve(root, dts)
  const dirs = originDirs
    ?.concat(originDirs.map(dir => join(dir, '*.{tsx,jsx,ts,js,mjs,cjs,mts,cts}')))
    .map(dir => $slash(resolveGlobsExclude(root, dir)))

  const writeConfigFiles = async () => {
    const types = Object.entries(importTypes).map(([target, options]) => {
      const items = options.map(item => generateType(target, item))
      return items
    })
    await writeTypes(targetPath, types.flat().join('\n'))
  }

  const writeCustomConfigFiles = async (files: string[]) => {
    const types = files.map((file) => {
      const { types } = getExportedInfo(file)
      const items = types.map(item => generateType(file, item))
      return items
    })
    await writeTypes(targetPath, types.flat().join('\n'))
  }

  const scanDirs = async () => {
    if (dirs?.length) {
      const result = await fg(dirs, {
        absolute: true,
        cwd: root,
        onlyFiles: true,
        followSymbolicLinks: true,
      })
      const files = Array.from(new Set(result.flat())).map($slash)
      await writeCustomConfigFiles(files)
      return
    }

    await writeConfigFiles()
  }

  const scanLayouts = async () => {
    if (!layoutDir)
      return

    const result = await fg($slash(layoutDir), {
      absolute: true,
      cwd: root,
      onlyFiles: true,
      followSymbolicLinks: true,
    })
    const layouts = result.map(path => path.split('/').map(item => `"${item}"`).at(-2)).join(' | ')
    await writeTypes(targetPath, `  export type Layout = ${layouts}`)
  }

  return {
    root,
    dirs,
    scanDirs,
    scanLayouts,
    writeConfigFiles,
  }
}
