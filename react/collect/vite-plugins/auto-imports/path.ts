import { cwd } from 'node:process'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { $safeJsonParse } from '../../shared'

const getFileTypePath = (nodeModulesPath: string, filename = 'index') => {
  const currentDtsPath = resolve(`${nodeModulesPath}.d.ts`)
  if (existsSync(currentDtsPath))
    return currentDtsPath

  const fileDtsPath = resolve(nodeModulesPath, `${filename}.d.ts`)
  if (existsSync(fileDtsPath))
    return fileDtsPath
}

const getPackageJsonTypePath = async (nodeModulesPath: string) => {
  const packageJsonPath = resolve(nodeModulesPath, 'package.json')
  if (!existsSync(packageJsonPath))
    return

  const jsonContent = await readFile(packageJsonPath, 'utf-8')
  const packageJson = $safeJsonParse<{ types?: string, typings?: string }>(jsonContent, {})
  const typesPath = packageJson.types || packageJson.typings
  if (!typesPath)
    return

  const typesFullPath = resolve(nodeModulesPath, typesPath)
  if (!existsSync(typesFullPath))
    return

  const s = await stat(typesFullPath)
  if (s.isFile())
    return typesFullPath

  return getFileTypePath(typesFullPath)
}

const getAtTypePath = (rootPath: string, packageName: string, filename = 'index') => {
  if (packageName.startsWith('@')) {
    // @foo/bar -> @types/foo__bar
    packageName = packageName.replace('@', '').replace('/', '__')
  }
  const atTypesPath = resolve(rootPath, '@types', packageName, `${filename}.d.ts`)
  if (!existsSync(atTypesPath))
    return

  return atTypesPath
}

const getRelativeTypePath = async (path: string, rootPath: string) => {
  const paths = path.split('/')

  const getPackageName = async (pathList: string[], index = 1) => {
    if (pathList.length < index)
      return

    const startPath = pathList.slice(0, index).join('/')
    const endPath = pathList.slice(index, pathList.length).join('/')
    const packageJsonPath = resolve(rootPath, startPath, 'package.json')
    if (existsSync(packageJsonPath)) {
      return getAtTypePath(rootPath, startPath, endPath)
    }

    return await getPackageName(pathList, index + 1)
  }

  return await getPackageName(paths)
}

export const getPkgDtsPath = async (name: string, root = cwd()) => {
  const rootPath = resolve(root, 'node_modules')
  const nodeModulesPath = resolve(rootPath, name)
  const packageJsonTypePath = await getPackageJsonTypePath(nodeModulesPath)
  if (packageJsonTypePath)
    return packageJsonTypePath

  const fileTypePath = getFileTypePath(nodeModulesPath)
  if (fileTypePath)
    return fileTypePath

  const atTypesPath = getAtTypePath(rootPath, name)
  if (atTypesPath)
    return atTypesPath

  const packageName = await getRelativeTypePath(name, rootPath)

  if (packageName)
    return packageName

  console.warn(`Can't find the type definition file of ${name}`)
}

export const resolveDts = (dts: string, isType = false) => `auto-imports/${dts}.${isType ? 'type' : 'api'}.d.ts`

export const API_PATH = 'pkgApis'
export const TYPE_PATH = 'pkgTypes'
