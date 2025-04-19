import { readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isEqual, isObject, transform } from 'lodash-es'
import readdirp from 'readdirp'

export const getDirname = (url: string) => {
  const __filename = fileURLToPath(url)
  const __dirname = dirname(__filename)
  return __dirname
}

export type ObjectType = Record<string, any>

export const difference = (object: ObjectType, base: ObjectType) => {
  const changes = (object: ObjectType, base: ObjectType) => {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        if (isObject(value) && isObject(base[key]))
          result[key] = changes(value, base[key])

        else
          result[key] = value
      }
    }, {} as ObjectType)
  }

  return changes(object, base)
}

export const getHandles = async () => {
  const rootPath = resolve(process.cwd(), 'scripts/i18n')
  const files = readdirSync(rootPath)
    .filter(name => name.endsWith('.ts') && !name.startsWith('_') && name !== 'index.ts')

  const promiseTask = files.map(async (name) => {
    const m = await import(`${rootPath}/${name}`)
    return {
      name: name.replace('.ts', ''),
      m,
    }
  })

  return await Promise.all(promiseTask)
}

export const getI18nDir = async () => {
  const targetPath = resolve(process.cwd(), 'src')
  const dirList = await readdirp.promise(targetPath, { type: 'directories' })
  const i18nList = dirList.filter(dir => dir.basename === 'i18n')
  return i18nList
}

export const getBaseFile = () => process.argv.at(2) || 'en-US'
