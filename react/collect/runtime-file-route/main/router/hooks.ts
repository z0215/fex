import type { MetaRoute } from './routes'
import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { rootRoute } from './routes'

export const thirdPartyList = rootRoute.children?.find(({ path }) => path === 'third-party')?.children ?? []

const defaultEnableData = thirdPartyList.filter(({ meta, fullPath }) => (meta?.defaultEnable || meta?.enable) && fullPath).map(({ fullPath }) => fullPath) as string[]
const useThirdPartyStore = create(
  persist<{ data: string[] }>(
    () => ({ data: defaultEnableData }),
    { name: 'third-party' },
  ),
)

const useThirdParty = () => {
  const { data } = useThirdPartyStore()
  return [data, (data: string[]) => useThirdPartyStore.setState({ data })] as const
}

const filterRoutes = (routes: MetaRoute[], callback: (route: MetaRoute) => boolean): MetaRoute[] => {
  return routes
    .map<MetaRoute | null>((route) => {
      const newRoute: MetaRoute = { ...route }
      if (newRoute.children) {
        newRoute.children = filterRoutes(newRoute.children, callback)
      }
      return callback(newRoute) || newRoute.children?.length
        ? newRoute
        : null
    })
    .filter(Boolean) as MetaRoute[]
}

export const useRoutes = () => {
  const [thirdParty, setThirdParty] = useThirdParty()
  const routes = useMemo(() => filterRoutes(rootRoute.children ?? [], (item) => {
    if (!item.fullPath?.startsWith('third-party'))
      return true
    return thirdParty.includes(item.fullPath)
  }), [thirdParty])
  return {
    routes,
    thirdParty,
    setThirdParty,
  }
}
