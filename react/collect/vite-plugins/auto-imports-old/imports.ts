import type { Options as AutoImportAPIOptions } from 'unplugin-auto-import/types'
import type { Options as AutoImportTypeOptions } from './ctx'

export type { Options as AutoImportAPIOptions } from 'unplugin-auto-import/types'

export const getImportsConfig = (imports: AutoImportAPIOptions[]) => {
  const userImports = imports.map(({ dts = 'imports', ...options }) => {
    const apiConfig: AutoImportAPIOptions = {
      ...options,
      dts: `${dts}.api.d.ts`,
    }

    const typeConfig: AutoImportTypeOptions = {
      ...options,
      dts: `${dts}.type.d.ts`,
    }

    return {
      apiConfig,
      typeConfig,
    }
  })

  return userImports
}
