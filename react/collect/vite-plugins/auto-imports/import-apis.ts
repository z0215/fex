import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import type { ImportsMap } from 'unplugin-auto-import/types'
import fg from 'fast-glob'
import { groupBy } from 'lodash-es'
import AutoImport from 'unplugin-auto-import/vite'
import { $camelize, $capitalize, $isFirstUpper, $slash } from '../../shared'
import { API_PATH, resolveDts } from './path'

const getPkgApis = async () => {
  const data = await fg($slash(`${API_PATH}/**/*.json`), {
    absolute: true,
    cwd: __dirname,
    onlyFiles: true,
    followSymbolicLinks: true,
  })
  const reg = new RegExp(`${resolve(__dirname, API_PATH)}/(.*).json`, 'g')
  const res = data.map(async (path) => {
    const name = path.replace(reg, '$1')
    const content = await readFile(path, 'utf-8')
    const data = JSON.parse(content) as { name: string }[]
    return { name, data: data.map(({ name }) => name) }
  })
  return Promise.all(res)
}

const dtsMap: Record<string, string> = {
  'react': 'react/core',
  'antd': 'antd/components',
  '@ant-design/icons/lib/icons': 'antd/icons',
}

const alias = (name: string, api: string) => {
  const isHooks = api.startsWith('use')
  name = $camelize(name)
  if (isHooks) {
    return `use${$capitalize(name)}${api.replace(/^use/, '')}`
  }

  const isUpper = $isFirstUpper(api)
  if (isUpper) {
    return `${$capitalize(name)}${api}`
  }

  return `${name}${$capitalize(api)}`
}

const apiMap: Record<string, (data: string[]) => ([string, string])[]> = {
  'react': data => data.filter(i => i !== 'version').map(i => [i, i]),
  'antd': data => data.map(i => [i, alias('antd', i)]),
  '@ant-design/icons/lib/icons': data => data.map(i => [i, alias('antd', i)]),
  'lodash-es': data => data.map(i => [i, `_${i}`]),
  'ahooks': data => data.map(i => [i, alias('ahooks', i)]),
}

interface CustomImportItem {
  name: string
  dts: string
  data: (string | [string, string])[]
}
const customImports: CustomImportItem[] = [
  {
    name: 'react-dom/client',
    dts: 'react/client',
    data: ['createRoot'],
  },
  {
    name: 'react-router-dom',
    dts: 'react/router',
    data: [
      'RouterProvider',
      'Outlet',
      'Link',
      'createBrowserRouter',
      'useLocation',
      'useNavigate',
      'matchPath',
    ],
  },
  {
    name: '@tanstack/react-query',
    dts: 'react/query',
    data: [
      'QueryClientProvider',
      'QueryClient',
      'useQuery',
      'useMutation',
    ],
  },
  {
    name: 'zustand',
    dts: 'react/store',
    data: ['create'],
  },
  {
    name: 'zustand/middleware',
    dts: 'react/store',
    data: ['persist'],
  },
  {
    name: 'immer',
    dts: 'react/state',
    data: [['produce', 'immer']],
  },
  {
    name: 'react-dev-inspector',
    dts: 'react/inspector',
    data: ['Inspector'],
  },
  {
    name: 'antd-style',
    dts: 'antd/style',
    data: [['createStyles', 'createAntdStyles']],
  },
]
const formatedImports = Object.entries(groupBy(customImports, 'dts')).reduce<{ dts: string, imports: ImportsMap[] }[]>((arr, [dts, groups]) => {
  const imports = groups.reduce<ImportsMap>((map, { name, data }) => {
    map[name] = data
    return map
  }, {})
  arr.push({
    dts,
    imports: [imports],
  })
  return arr
}, [])

export const ImportApis = async (): Promise<Plugin[]> => {
  const pkgApis = await getPkgApis()

  return pkgApis
    .map(({ name, data }) => AutoImport({
      dts: resolveDts(dtsMap[name] ?? name),
      imports: [{ [name]: apiMap[name]?.(data) ?? data }],
    }))
    .concat(formatedImports.map(({ dts, imports }) => AutoImport({
      dts: resolveDts(dts),
      imports,
    })))
    .concat(AutoImport({
      dts: resolveDts(`custom/shared`),
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
