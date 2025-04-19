import type { Options as AutoImportAPIOptions } from 'unplugin-auto-import/types'
import { uniqBy } from 'lodash-es'
import { dependencies } from '../../package.json'
import { $camelize, $capitalize, $isFirstUpper } from '../../shared'
import { getDtsPath } from './path'
import { getExportedInfo } from './ast'
import type { Options as AutoImportTypeOptions, TypeImports } from './ctx'
import { getCache, setCache } from './cache'

const modifier = (pkg: string, name: string) => {
  const isHooks = name.startsWith('use')
  pkg = $camelize(pkg)
  if (isHooks) {
    return `use${$capitalize(pkg)}${name.replace(/^use/, '')}`
  }

  const isUpper = $isFirstUpper(name)
  if (isUpper) {
    return `${$capitalize(pkg)}${name}`
  }

  return `${pkg}${$capitalize(name)}`
}

export type IncludeItem<T> = {
  name: T
  dts?: string
  apis?: (api: string) => string | false
  types?: (type: string) => string | false
  extraTypes?: TypeImports[]
  extraApis?: (string | [string, string])[]
  importTypes?: AutoImportTypeOptions['importTypes']
  coverApis?: (string | [string, string])[]
  coverTypes?: TypeImports[]
  isAlias?: boolean
} & AutoImportAPIOptions

export interface PackagesOptions<I, E> {
  /**
   * @default true
   */
  automatic?: boolean
  /**
   * Specify dependencies that need to be included, The default will contain all the dependencies of package.json. If you need to exclude it, please use Exclude
   */
  include?: IncludeItem<I>[]
  /**
   * Specify dependencies that need to be excluded
   */
  exclude?: E[]
}

export const getPackagesConfig = async (options: PackagesOptions<string, string>) => {
  const {
    automatic = true,
    include = [],
    exclude = [],
  } = options
  const originDeps = automatic ? Object.keys(dependencies).map<IncludeItem<string>>(name => ({ name })) : []
  const deps = include.concat(originDeps).filter(dep => !exclude.includes(dep.name as any))

  const plugins = uniqBy(deps, 'name').map(async (dep) => {
    const {
      name,
      dts,
      apis: apiAlias,
      types: typeAlias,
      extraTypes = [],
      extraApis = [],
      coverApis,
      coverTypes,
      isAlias,
      ...restOptions
    } = dep
    const dtsPath = await getDtsPath(name)
    const cacheData = await getCache(name)
    const { values, types } = cacheData ?? getExportedInfo(dtsPath)
    if (!cacheData) {
      setCache(name, { values, types })
    }
    if (
      !values.length
      && !types.length
      && !restOptions.imports
      && !restOptions.importTypes
      && !extraApis.length
      && !extraTypes.length
      && !coverApis?.length
      && !coverTypes?.length
    ) {
      console.warn(`${dtsPath}: No identifiable content for export, please manually correct the path`)
    }
    const mergedApis = values
      .map<false | string | [string, string]>(({ name }) => {
        if (apiAlias === undefined) {
          if (isAlias) {
            return [name, modifier(dep.name, name)]
          }
          return name
        }

        const result = apiAlias(name)
        if (result === false)
          return result

        return [name, result]
      })
      .filter(item => item !== false)
      .concat(extraApis)

    const apiConfig: AutoImportAPIOptions
       = {
         dts: `${dts ?? name}.api.d.ts`,
         imports: { [name]: coverApis ?? mergedApis },
         ...restOptions,
       }

    const mergedTypes = types
      .map<false | TypeImports>((item) => {
        if (typeAlias === undefined) {
          if (isAlias) {
            return { ...item, alias: modifier(dep.name, item.name) }
          }
          return item
        }

        const result = typeAlias(item.name)
        if (result === false)
          return result

        return { ...item, alias: result }
      })
      .filter(item => item !== false)
      .concat(extraTypes)

    const typeConfig: AutoImportTypeOptions
       = {
         dts: `${dts ?? name}.type.d.ts`,
         importTypes: { [name]: coverTypes ?? mergedTypes },
         ...restOptions,
       }

    return { apiConfig, typeConfig }
  })

  return Promise.all(plugins)
}
