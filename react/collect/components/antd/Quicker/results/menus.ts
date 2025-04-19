import type { QuickerResultItem } from '../'
import { useMemo } from 'react'
import { resolvePath, useNavigate } from 'react-router-dom'
import { useRoutes } from '~/main/router/hooks'
import type { MetaRoute } from '~/main/router/routes'
import { isMac } from '~/shared'

const createMenus = (routes: MetaRoute[]) => {
  const result: QuickerResultItem[] = []

  const traverse = (routes: MetaRoute[], keys: string[] = []) => {
    for (const item of routes) {
      const meta = item.loader?.()
      if (!meta || item.fullPath === undefined)
        continue
      if (item.element) {
        result.push({
          key: item.fullPath,
          icon: meta.icon,
          label: meta.label,
          tag: 'Menu',
          keys,
        })
      }
      if (item.children) {
        traverse(item.children, keys.concat(meta.label))
      }
    }
  }

  traverse(routes)

  return result
}

export const useMenus = (): QuickerResultItem[] => {
  const navigate = useNavigate()
  const { routes } = useRoutes()
  return useMemo(() => createMenus(routes).map(item => ({
    ...item,
    action({ key, e }) {
      const activeKey = isMac() ? e.metaKey : e.ctrlKey
      if (activeKey) {
        const { pathname } = resolvePath(key, location.origin)
        window.open(pathname, '_blank', 'noreferrer')
        return
      }
      navigate(key)
    },
  })), [navigate, routes])
}
