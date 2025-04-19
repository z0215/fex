import type { Plugin } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import type { dependencies, devDependencies } from '../../package.json'
import type { PackagesOptions } from './packages'
import { getPackagesConfig } from './packages'
import type { LayoutOptions } from './layout'
import { getLayoutConfig } from './layout'
import type { AutoImportAPIOptions } from './imports'
import { getImportsConfig } from './imports'
import type { Options as AutoImportTypeOptions } from './ctx'
import AutoImportType from './auto-import-type'

type DependenciesKey = keyof {
  [K in keyof typeof dependencies]: string;
}

type DevDependenciesKey = keyof {
  [K in keyof typeof devDependencies]: string;
}

export interface AutoImportsOptions<I, E> {
  /**
   * The basic public path of the type definition file
   * @default 'auto-imports'
   */
  basePath?: string
  /**
   * Extract types
   * @default true
   */
  extractType?: boolean
  /**
   * Extract layouts type
   */
  layout?: LayoutOptions
  /**
   * flow unplugin-auto-import
   */
  extraImports?: AutoImportAPIOptions[]
  /**
   * Package config
   */
  packages?: PackagesOptions<I, E>
}

export const AutoImports = async <
  I extends StringLiteralUnion<DependenciesKey | DevDependenciesKey, string>,
  E extends DependenciesKey | I,
>(options?: AutoImportsOptions<I, E>): Promise<Plugin[]> => {
  const {
    basePath = 'auto-imports',
    extractType = true,
    layout = {},
    extraImports = [],
    packages = {},
  } = options ?? {}

  const packagesConfig = await getPackagesConfig(packages)
  const importsConfig = getImportsConfig(extraImports)
  const layoutConfig = getLayoutConfig({ enabled: extractType, ...layout })

  const config = packagesConfig.concat(importsConfig).reduce((result, { apiConfig, typeConfig }) => {
    result.apiConfig.push(apiConfig)
    extractType && result.typeConfig.push(typeConfig)
    return result
  }, { typeConfig: [], apiConfig: [] } as { typeConfig: AutoImportTypeOptions[], apiConfig: AutoImportAPIOptions[] })

  if (layoutConfig) {
    config.typeConfig.push(layoutConfig)
  }

  // todo: 移除掉对AutoImport插件的依赖，完全独立实现一个异步读写dts文件插件才能解决ast费事的问题
  return [
    ...config.apiConfig.map(config => AutoImport({ ...config, dts: `${basePath}/${config.dts}` })),
    ...config.typeConfig.map(config => AutoImportType({ ...config, dts: `${basePath}/${config.dts}` })),
  ]
}
