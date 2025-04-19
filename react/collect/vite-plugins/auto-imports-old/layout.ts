import type { Options as AutoImportTypeOptions } from './ctx'

export interface LayoutOptions {
  /**
   * @default true
   */
  enabled?: boolean
  /**
   * @default layout
   */
  dts?: string
  /**
   * @default "src/layouts/\*\/index.tsx"
   */
  dir?: string
}

export const getLayoutConfig = (options: LayoutOptions): AutoImportTypeOptions | undefined => {
  const {
    enabled,
    dts = 'layout',
    dir = 'src/layouts/*/index.tsx',
  } = options

  return enabled ? { dts: `${dts}.type.d.ts`, layoutDir: dir } : undefined
}
